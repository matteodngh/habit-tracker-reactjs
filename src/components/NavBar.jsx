import { AppBar, Toolbar, Button, Typography } from '@mui/material';
import React from 'react';
import { makeStyles } from '@mui/styles';
import LogoutIcon from '@mui/icons-material/Logout';
import HomeIcon from '@mui/icons-material/Home';
import InsightsIcon from '@mui/icons-material/Insights';
import LogoutDialog from './LogoutDialog';

const useStyles = makeStyles((theme) => ({
  logoLg: {
    display: 'none',
    [theme.breakpoints.up('sm')]: {
      display: 'block',
    },
  },
  logoSm: {
    display: 'block',
    [theme.breakpoints.up('sm')]: {
      display: 'none',
    },
  },
}));

const NavBar = () => {
  const classes = useStyles();

  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }} className={classes.logoLg}>
          Habit Tracker
        </Typography>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }} className={classes.logoSm}>
          HT
        </Typography>
        <LogoutDialog />
      </Toolbar>
    </AppBar >
  );
}

export default NavBar; 