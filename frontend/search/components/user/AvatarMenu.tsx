import React from 'react'
import IconButton from '@mui/material/IconButton';
import AccountCircle from '@mui/icons-material/AccountCircle';
import MenuItem from '@mui/material/MenuItem';
import Menu from '@mui/material/Menu';
import {useTranslation} from "react-i18next";
import { ListItemIcon } from '@mui/material';
import {Logout} from "@mui/icons-material";

type AvatarMenuProps = {
  onLogout?: () => void
}

const AvatarMenu = ({onLogout}: AvatarMenuProps) => {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

  const { t } = useTranslation()

  const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return <div>
    <IconButton
      size="large"
      aria-label="account of current user"
      aria-controls="menu-appbar"
      aria-haspopup="true"
      onClick={handleMenu}
      color="inherit"
    >
      <AccountCircle/>
    </IconButton>
    <Menu
      id="menu-appbar"
      anchorEl={anchorEl}
      anchorOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
      keepMounted
      transformOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
      open={Boolean(anchorEl)}
      onClose={handleClose}
    >
      {onLogout && <MenuItem onClick={() => { onLogout();handleClose(); }}>
        <ListItemIcon>
          <Logout fontSize="small" />
        </ListItemIcon>
        {t('logout')}
      </MenuItem>}
    </Menu>
  </div>;
}

export default AvatarMenu
