import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import {Login} from "../Login";
import {ReactNode} from "react";

type AppBarProps = {
  status?: ReactNode
}

export default function CustomAppBar({status}: AppBarProps) {
  return (
    <AppBar position="static">
      <Toolbar variant={"dense"}>
        <IconButton
          size="large"
          edge="start"
          color="inherit"
          aria-label="menu"
          sx={{mr: 2}}
        >
          <MenuIcon/>
        </IconButton>
        <Typography variant="h6" component="div" sx={{flexGrow: 1}}>
          &nbsp;
          {status}
        </Typography>
        <Login/>
      </Toolbar>
    </AppBar>
  );
}
