import {
  Assignment,
  Code,
  FormatBold,
  FormatItalic,
  FormatListBulleted,
  FormatQuote,
  HorizontalRule,
  Image,
  InsertLink,
  Task
} from '@mui/icons-material'
import { Button, IconButton, Menu, MenuItem, Toolbar } from '@mui/material'
import React from 'react'

interface ToolbalProps {
  editor: any
}

export default function EditorToobar({ editor }: ToolbalProps) {
  function getSelectedText() {
    if (!editor) return ''
    const selectedText = editor.getModel().getValueInRange(editor.getSelection())
    return selectedText
  }

  function insertTextAtSelection(beforeSelected: string, afterSelection: string) {
    const selection = editor.getSelection()
    const selectedText = getSelectedText()

    const text = `${beforeSelected}${selectedText}${afterSelection}`
    const op = { range: selection, text: text, forceMoveMarkers: true }
    editor.executeEdits('my-source', [op])
  }

  function Headings() {
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
                insertTextAtSelection(`${heading.md} `, '')
                handleClose()
              }}
            >
              {heading.title}
            </MenuItem>
          ))}
        </Menu>
      </div>
    )
  }

  const itemsToolbar = [
    { icon: <Code />, beforeSelection: '```\n', afterSelection: '\n```' },
    { icon: <InsertLink />, beforeSelection: '[link](', afterSelection: ')' },
    { icon: <FormatQuote />, beforeSelection: `> `, afterSelection: '' },
    { icon: <Image />, beforeSelection: `![alt text](`, afterSelection: `)` },
    { icon: <FormatListBulleted />, beforeSelection: `* `, afterSelection: '' },
    { icon: <FormatBold />, beforeSelection: `**`, afterSelection: '**' },
    { icon: <FormatItalic />, beforeSelection: `*`, afterSelection: '*' },
    { icon: <HorizontalRule />, beforeSelection: `---`, afterSelection: '' },
    { icon: <Task />, beforeSelection: `- [x] `, afterSelection: '' },
    { icon: <Assignment />, beforeSelection: `- [ ] `, afterSelection: '' }
  ]

  return (
    <div>
      <Toolbar>
        <Headings />
        {itemsToolbar.map((item, i) => (
          <IconButton
            key={i}
            style={{ marginLeft: '5px' }}
            color="secondary"
            size="small"
            onClick={() => {
              insertTextAtSelection(item.beforeSelection, item.afterSelection)
            }}
          >
            {item.icon}
          </IconButton>
        ))}
      </Toolbar>
    </div>
  )
}
