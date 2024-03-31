import React from 'react'
import { Button, Menu, MenuItem } from '@mui/material'

export default function CloudinaryMenu() {
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
        Cloudinary
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
            handleClose()
          }}
        >
          Upload Image
        </MenuItem>
        <MenuItem
          onClick={() => {
            handleClose()
          }}
        >
          Insert Image
        </MenuItem>
        <MenuItem
          onClick={() => {
            handleClose()
          }}
        >
          Login
        </MenuItem>
      </Menu>
    </>
  )
}
