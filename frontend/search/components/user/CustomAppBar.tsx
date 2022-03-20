import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import {Login} from "../Login";
import {ReactNode} from "react";
import AppMenu from "../settings/AppMenu";
import LanguageSelection from "./LanguageSelection";

type AppBarProps = {
  status?: ReactNode
}

export default function CustomAppBar({status}: AppBarProps) {
  return (
    <AppBar position="static">
      <Toolbar variant={"dense"}>
        <AppMenu />
        <Typography variant="h6" component="div" sx={{flexGrow: 1}}>
          &nbsp;
          {status}
        </Typography>
        <Login/>
        <LanguageSelection />
      </Toolbar>
    </AppBar>
  );
}
