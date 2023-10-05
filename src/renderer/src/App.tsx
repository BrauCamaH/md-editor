import React, { useState } from 'react'
import { AppBar, Toolbar, Button } from '@mui/material'
import Preview from './components/Preview'
import Editor from '@monaco-editor/react'

import './App.css'

export default function App() {
  const [value, setValue] = useState('')

  const [filePath, setFilePath] = React.useState()

  const readFile = async () => {
    const response = await window.api.readFile()
    setValue(response.data)
    setFilePath(response.filePath)
  }

  const writeFile = async () => {
    await window.api.writeFile({ name: filePath, content: value })
  }
  return (
    <div>
      <AppBar color="transparent" position="relative">
        <Toolbar>
          <Button
            variant="outlined"
            onClick={() => {
              readFile()
            }}
          >
            Open File
          </Button>
          <Button
            variant="outlined"
            onClick={() => {
              writeFile()
            }}
          >
            Save File
          </Button>
        </Toolbar>
      </AppBar>
      <div className="app">
        <Editor
          className='editor'
          options={{
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
          onChange={setValue}
        />
          <Preview doc={value || ''} />
      </div>
    </div>
  )
}
