import { Code, FormatListBulleted, FormatQuote, Image } from '@mui/icons-material'
import { Button, IconButton, Menu, MenuItem, Toolbar } from '@mui/material'
import React from 'react'

interface ToolbalProps {
  editor: any
}

interface HeadingsProps {
  editor: any
}

function Headings({ editor }: HeadingsProps) {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null)
  const open = Boolean(anchorEl)
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget)
  }
  const handleClose = () => {
    setAnchorEl(null)
  }

  const headings = [
    {
      title: 'heading 1',
      md: '#'
    },
    {
      title: 'heading 2',
      md: '##'
    },
    {
      title: 'heading 2',
      md: '###'
    },
    {
      title: 'heading 3',
      md: '####'
    },
    {
      title: 'heading 4',
      md: '#####'
    },
    {
      title: 'heading 5',
      md: '######'
    }
  ]

  return (
    <div>
      <Button
        color="secondary"
        aria-controls={open ? 'basic-menu' : undefined}
        aria-haspopup="true"
        aria-expanded={open ? 'true' : undefined}
        onClick={handleClick}
      >
        Headings
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
        {headings.map((heading, i) => (
          <MenuItem
            key={i}
            onClick={() => {
              handleClose()

              const selection = editor.getSelection()
              const selectedText = editor.getModel().getValueInRange(editor.getSelection())
              const id = { major: 1, minor: 1 }
              const text = `${heading.md} ${selectedText} `
              const op = { identifier: id, range: selection, text: text, forceMoveMarkers: true }
              editor.executeEdits('my-source', [op])
            }}
          >
            {heading.title}
          </MenuItem>
        ))}
      </Menu>
    </div>
  )
}

export default function EditorToobar({ editor }: ToolbalProps) {
  return (
    <div>
      <Toolbar>
        <Headings editor={editor} />
        <IconButton
          color="secondary"
          size="small"
          onClick={() => {
            const selection = editor.getSelection()
            const selectedText = editor.getModel().getValueInRange(editor.getSelection())
            const id = { major: 1, minor: 1 }
            const text = '```\n' + `${selectedText} ` + '\n```'
            const op = { identifier: id, range: selection, text: text, forceMoveMarkers: true }
            editor.executeEdits('my-source', [op])
          }}
        >
          <Code />
        </IconButton>
        <IconButton
          color="secondary"
          size="small"
          onClick={() => {
            const selection = editor.getSelection()
            const selectedText = editor.getModel().getValueInRange(editor.getSelection())
            const id = { major: 1, minor: 1 }
            const text = `> ${selectedText}`
            const op = { identifier: id, range: selection, text: text, forceMoveMarkers: true }
            editor.executeEdits('my-source', [op])
          }}
        >
          <FormatQuote />
        </IconButton>
        <IconButton
          color="secondary"
          size="small"
          onClick={() => {
            const selection = editor.getSelection()
            const selectedText = editor.getModel().getValueInRange(editor.getSelection())
            const id = { major: 1, minor: 1 }
            const text = `![alt text](${selectedText}) `
            const op = { identifier: id, range: selection, text: text, forceMoveMarkers: true }
            editor.executeEdits('my-source', [op])
          }}
        >
          <Image />
        </IconButton>
        <IconButton
          color="secondary"
          size="small"
          onClick={() => {
            const selection = editor.getSelection()
            const selectedText = editor.getModel().getValueInRange(editor.getSelection())
            const id = { major: 1, minor: 1 }
            const text = `* ${selectedText} `
            const op = { identifier: id, range: selection, text: text, forceMoveMarkers: true }
            editor.executeEdits('my-source', [op])
          }}
        >
          <FormatListBulleted />
        </IconButton>
      </Toolbar>
    </div>
  )
}
