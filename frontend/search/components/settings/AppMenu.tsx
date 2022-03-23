import React from 'react'
import MenuList from '@mui/material/MenuList';
import MenuItem from '@mui/material/MenuItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import Check from '@mui/icons-material/Check';
import {Menu} from "@mui/material";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import {useAppConfigStore} from "../config/appConfigStore";
import {useTranslation} from "react-i18next";

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

  const { t } = useTranslation()

  const { groupsDisabled, toggleGroupsDisabled, markerClusterDisabled, toggleMarkerCluster, debugEnabled, toggleDebugEnabled } = useAppConfigStore()

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
        <MenuItem onClick={toggleMarkerCluster}>
          <ListItemIcon>
            {!markerClusterDisabled && <Check/>}
          </ListItemIcon>
          {t('options.clusterMarkers')}
        </MenuItem>
        <MenuItem onClick={toggleGroupsDisabled}>
          <ListItemIcon>
            {!groupsDisabled && <Check/>}
          </ListItemIcon>
          {t('options.showVerboseHeader')}
        </MenuItem>
        <MenuItem onClick={toggleDebugEnabled}>
          <ListItemIcon>
            {debugEnabled && <Check/>}
          </ListItemIcon>
          {t('options.debug')}
        </MenuItem>
      </MenuList>
    </Menu>
  </>
}

export default AppMenu
