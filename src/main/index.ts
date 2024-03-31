import { app, shell, BrowserWindow, ipcMain, dialog } from 'electron'
import path, { join } from 'path'
import { electronApp, optimizer, is } from '@electron-toolkit/utils'
import icon from '../../resources/icon.png?asset'
import { promises as fs } from 'fs'

function createWindow(): void {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 900,
    height: 670,
    show: false,
    autoHideMenuBar: true,
    ...(process.platform === 'linux' ? { icon } : { icon }),
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      sandbox: false
    }
  })

  mainWindow.on('ready-to-show', () => {
    mainWindow.show()
  })

  mainWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url)
    return { action: 'deny' }
  })

  // HMR for renderer base on electron-vite cli.
  // Load the remote URL for development or the local html file for production.
  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL'])
  } else {
    mainWindow.loadFile(join(__dirname, '../renderer/index.html'))
  }
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  // Set app user model id for windows
  electronApp.setAppUserModelId('com.braucamah.md-editor')

  // Default open or close DevTools by F12 in development
  // and ignore CommandOrControl + R in production.
  // see https://github.com/alex8088/electron-toolkit/tree/master/packages/utils
  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window)
  })

  createWindow()

  app.on('activate', function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

// In this file you can include the rest of your app"s specific main process
// code. You can also put them in separate files and require them here.
ipcMain.handle('readFile', async () => {
  const filePath = await dialog.showOpenDialog({
    properties: ['openFile'],
    filters: [{ name: 'Files', extensions: ['md'] }]
  })
  console.log(filePath)
  const data = await fs.readFile(filePath.filePaths[0], 'utf8')
  const fileName = path.basename(filePath.filePaths[0])
  return { data, fileName, filePath: filePath.filePaths[0] }
})

ipcMain.handle('writeFile', async (_, args) => {
  console.log(args)

  const { name, content } = args

  try {
    await fs.writeFile(name, content)
  } catch (error) {
    console.log(error)
  }
})

ipcMain.handle('saveAs', async (_, args) => {
  const file = await dialog.showSaveDialog({
    filters: [{ name: 'File', extensions: ['md'] }],
    buttonLabel: 'Save'
  })

  const { content } = args

  try {
    await fs.writeFile(file.filePath || '', content)
    const fileName = path.basename(file.filePath || '')

    return { fileName, filePath: file.filePath }
  } catch (error) {
    return new Error('Cannot Save File')
  }
})
