import React, { useEffect, useRef, useState } from 'react'
import {
  AppBar,
  Toolbar,
  Button,
  Typography,
  IconButton,
  Menu,
  MenuItem,
  ListItem
} from '@mui/material'
import { Circle, Clear } from '@mui/icons-material'

import Editor from '@monaco-editor/react'
import Preview from '@renderer/components/Preview'
import EditorToolbar from '@renderer/components/EditorToolbar'

import Api from '@models/ApiInterface'

import './App.css'
import CloudinaryMenu from '@renderer/components/CloudinaryMenu'

const api = window.api as Api
function useKey(key, cb) {
  const callback = useRef(cb)

  useEffect(() => {
    callback.current = cb
  })

  useEffect(() => {
    function handle(event) {
      if (event.code === key) {
        callback.current(event)
      } else if (key === 'ctrls' && event.key === 's' && event.ctrlKey) {
        callback.current(event)
      }
    }

    document.addEventListener('keydown', handle)
    return () => document.removeEventListener('keydown', handle)
  }, [key])
}

export default function App() {
  const previewRef = useRef<HTMLDivElement>(null)

  const [value, setValue] = useState('')
  const [fileName, setFileName] = useState('')
  const [editor, setEditor] = useState()
  const [editorChanged, setEditorChanged] = useState(false)

  const [filePath, setFilePath] = React.useState('')
  useKey('ctrls', () => (filePath ? writeFile() : saveAs()))

  const readFile = async () => {
    const response = await api.readFile()
    setValue(response.data)
    setFilePath(response.filePath)
    setFileName(response.fileName)
    setEditorChanged(false)
  }

  const writeFile = async () => {
    await api.writeFile({ name: filePath, content: value })
    setEditorChanged(false)
  }

  const saveAs = async () => {
    const res = await api.saveAs({ content: value })
    setFilePath(res.filePath)
    setFileName(res.fileName)
    setEditorChanged(false)
  }

  const clear = () => {
    setFilePath('')
    setFileName('')
    setValue('')
    setEditorChanged(false)
  }

  function FileMenu() {
    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null)
    const open = Boolean(anchorEl)
    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
      setAnchorEl(event.currentTarget)
    }
    const handleClose = () => {
      setAnchorEl(null)
    }

    return (
      <>
        <Button
          color="primary"
          aria-controls={open ? 'basic-menu' : undefined}
          aria-haspopup="true"
          aria-expanded={open ? 'true' : undefined}
          onClick={handleClick}
        >
          File
        </Button>
        <Menu
          id="basic-menu"
          anchorEl={anchorEl}
          open={open}
          onClose={handleClose}
          MenuListProps={{
            'aria-labelledby': 'basic-button'
          }}
        >
          <MenuItem
            onClick={() => {
              readFile()
              handleClose()
            }}
          >
            Open File
          </MenuItem>
          <MenuItem
            disabled={!filePath}
            onClick={() => {
              writeFile()
              handleClose()
            }}
          >
            Save File
          </MenuItem>
          <MenuItem
            title="Save As"
            onClick={() => {
              saveAs()
              handleClose()
            }}
          >
            Save As
          </MenuItem>
        </Menu>
      </>
    )
  }

  return (
    <div>
      <AppBar id="appbar" color="inherit" position="sticky">
        <Toolbar
          sx={{
            justifyContent: 'space-between'
          }}
        >
          <ListItem>
            <Typography color="primary">{fileName || 'untitled'}</Typography>
            {editorChanged ? (
              <Circle
                color="warning"
                style={{ marginLeft: '4px', marginRight: '8px', width: '0.6rem' }}
              />
            ) : (
              ''
            )}
            {(filePath !== '' || undefined) && (
              <IconButton color="error" onClick={clear}>
                <Clear />
              </IconButton>
            )}
          </ListItem>
          <div>
            <ListItem>
              <FileMenu />
              <CloudinaryMenu />
            </ListItem>
          </div>
        </Toolbar>
        <EditorToolbar editor={editor} />
      </AppBar>
      <div className="app">
        <Editor
          className="editor"
          options={{
            autoCompletion: false,
            wordWrap: true,
            scrollBeyondLastLine: false,
            lineNumbers: false,
            folding: false,
            minimap: {
              enabled: false
            }
          }}
          theme="vs-dark"
          value={value}
          language="markdown"
          height="100vh"
          onChange={(e) => {
            setValue(e || '')

            setEditorChanged(true)
          }}
          onMount={(editor) => {
            setEditor(editor)
            editor.onDidScrollChange((e) => {
              const divElement = previewRef.current
              if (!divElement) return
              const maxScrollTop = e.scrollHeight
              const maxScrollTop2 = divElement.scrollHeight
              const percTop = maxScrollTop2 / maxScrollTop
              const newScrollTop = Math.ceil(percTop * e.scrollTop)

              divElement?.scrollTo({ top: newScrollTop })
            })
          }}
        />
        <div id="preview" ref={previewRef}>
          <Preview doc={value || ''} />
        </div>
      </div>
    </div>
  )
}
