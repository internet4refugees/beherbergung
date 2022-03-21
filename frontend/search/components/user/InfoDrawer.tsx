import React from 'react'
import { styled, useTheme } from '@mui/material/styles';
import Drawer from '@mui/material/Drawer';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import {Property} from "csstype";
import {useAppTempStore} from "../config/appTempStore";
import HostOfferDetail from "../ngo/HostOfferDetail";


type InfoDrawerProps = {
  drawerWidth?: Property.Width<string | number>
}
const DrawerHeader = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
  justifyContent: 'flex-start',
}));

const InfoDrawer = ({drawerWidth = '300px'}: InfoDrawerProps) => {
  const theme = useTheme();

  const { infoDrawerOpen, toggleInfoDrawer } = useAppTempStore()

  return <Drawer
    sx={{
      width: drawerWidth,
      flexShrink: 0,
      '& .MuiDrawer-paper': {
        width: drawerWidth,
      },
    }}
    variant="persistent"
    anchor="right"
    open={infoDrawerOpen}
  >
    <DrawerHeader>
      <IconButton onClick={toggleInfoDrawer}>
        {theme.direction === 'rtl' ? <ChevronLeftIcon/> : <ChevronRightIcon/>}
      </IconButton>
    </DrawerHeader>
    <Divider/>
    <HostOfferDetail />
  </Drawer>;
}

export default InfoDrawer
