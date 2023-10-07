import React, { useEffect, useRef, useState } from 'react'
import { AppBar, Toolbar, Button, Typography, IconButton } from '@mui/material'
import { Clear } from '@mui/icons-material'

import Editor from '@monaco-editor/react'
import Preview from '@renderer/components/Preview'
import Api from '@models/ApiInterface'

import './App.css'

const api = window.api as Api

export default function App() {
  const previewRef = useRef<HTMLDivElement>(null)

  const [value, setValue] = useState('')
  const [editorChanged, setEditorChanged] = useState(false)

  const [filePath, setFilePath] = React.useState('')

  const readFile = async () => {
    const response = await api.readFile()
    setValue(response.data)
    setFilePath(response.filePath)
    setEditorChanged(false)
  }

  const writeFile = async () => {
    await api.writeFile({ name: filePath, content: value })
    setEditorChanged(false)
  }

  const saveAs = async () => {
    const res = await api.saveAs({ name: 'example.md', content: value })
    setFilePath(res.filePath)
    setEditorChanged(false)
  }

  const clear = () => {
    setFilePath('')
    setValue('')
    setEditorChanged(false)
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
          <Typography color="primary">{filePath || 'untitled'}</Typography>
          {editorChanged ? <Typography color="yellow">*</Typography> : ''}
          {(filePath !== '' || undefined) && (
            <IconButton color="error" onClick={clear}>
              <Clear />
            </IconButton>
          )}

          <div>
            <Button
              style={{ margin: '5px' }}
              variant="outlined"
              onClick={() => {
                readFile()
              }}
            >
              Open File
            </Button>
            <Button
              disabled={!filePath}
              style={{ margin: '5px' }}
              variant="outlined"
              onClick={() => {
                writeFile()
              }}
            >
              Save File
            </Button>
            <Button
              variant="outlined"
              onClick={() => {
                saveAs()
              }}
            >
              Save As
            </Button>
          </div>
        </Toolbar>
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
          onChange={(e) => {
            setValue(e || '')
          }}
          onMount={(editor) => {
            editor.onKeyUp(() => {
              setEditorChanged(true)
            })
            editor.onDidScrollChange((e) => {
              console.log(e)
              console.log(previewRef)
              previewRef.current?.scrollTo({top: e.scrollTop})
            })
            console.log(editor)
          }}
        />
        <div id='preview' ref={previewRef}>
          <Preview doc={value || ''} />
        </div>
      </div>
    </div>
  )
}
