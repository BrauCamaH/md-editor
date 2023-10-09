import React, { useRef, useState } from 'react'
import { AppBar, Toolbar, Button, Typography, IconButton, Menu, MenuItem } from '@mui/material'
import { Clear } from '@mui/icons-material'

import Editor from '@monaco-editor/react'
import Preview from '@renderer/components/Preview'
import EditorToolbar from '@renderer/components/EditorToolbar'

import Api from '@models/ApiInterface'

import './App.css'

const api = window.api as Api

export default function App() {
  const previewRef = useRef<HTMLDivElement>(null)

  const [value, setValue] = useState('')
  const [fileName, setFileName] = useState('')
  const [editor, setEditor] = useState()
  const [editorChanged, setEditorChanged] = useState(false)

  const [filePath, setFilePath] = React.useState('')

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
            flexDirection: 'row',
            justifyContent: 'space-between'
          }}
        >
          <Typography color="primary">{fileName || 'untitled'}</Typography>
          {editorChanged ? <Typography color="yellow">*</Typography> : ''}
          {(filePath !== '' || undefined) && (
            <IconButton color="error" onClick={clear}>
              <Clear />
            </IconButton>
          )}

          <div>
            <FileMenu />
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
            minimap: {
              enabled: false
            }
          }}
          theme="vs-dark"
          value={value}
          language="markdown"
          height="100vh"
          onChange={(e, editor) => {
            setValue(e || '')

            console.log(editor)
          }}
          onMount={(editor) => {
            console.log(editor)
            editor.onDidChangeModelContent(() => {
              setEditorChanged(true)
            })
            setEditor(editor)
            editor.onDidScrollChange((e) => {
              previewRef.current?.scrollTo({ top: e.scrollTop })
              editor.onKeyDown((e) => {
                if (e.keyCode === 49 /** KeyCode.KeyS */ && e.ctrlKey) {
                  writeFile()
                }
              })
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
