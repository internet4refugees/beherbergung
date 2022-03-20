import React from 'react'
import Divider from '@mui/material/Divider';
import MenuList from '@mui/material/MenuList';
import MenuItem from '@mui/material/MenuItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Check from '@mui/icons-material/Check';
import {Menu} from "@mui/material";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";

type AppMenuProps = Record<string, never>

const AppMenu = ({}: AppMenuProps) => {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  return <>
    <IconButton
      size="large"
      edge="start"
      color="inherit"
      aria-label="menu"
      sx={{mr: 2}}
      aria-haspopup="true"
      aria-expanded={open ? 'true' : undefined}
      aria-controls={open ? 'app-menu' : undefined}
      onClick={handleClick}
    >
      <MenuIcon/>
    </IconButton>
    <Menu
      id={'app-menu'}
      aria-labelledby="menu-button"
      anchorEl={anchorEl}
      open={open}
      onClose={handleClose}
      anchorOrigin={{
        vertical: 'top',
        horizontal: 'left',
      }}
      transformOrigin={{
        vertical: 'top',
        horizontal: 'left',
      }}
    >
      <MenuList dense>
        <MenuItem>
          <ListItemIcon>
            <Check/>
          </ListItemIcon>
          clustered marker
        </MenuItem>
        <MenuItem>
          <ListItemIcon>
            <Check/>
          </ListItemIcon>
          Show dense header
        </MenuItem>
        <Divider/>
        <MenuItem>
          <ListItemText>Custom spacing...</ListItemText>
        </MenuItem>
      </MenuList>
    </Menu>
  </>
}

export default AppMenu
