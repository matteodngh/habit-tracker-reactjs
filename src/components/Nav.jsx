import { Tab, Box, Tabs } from '@mui/material';
import * as React from 'react';
import { Link } from 'react-router-dom';
import { useLocation } from "react-router-dom"

function LinkTab(props) {
  return (
    <Tab
      component={Link}
      {...props}
    />
  );
}

export default function NavTabs() {
  const location = useLocation();
  const [value, setValue] = React.useState(location.pathname === '/home' ? 0 : 1);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <Tabs value={value} onChange={handleChange} aria-label="nav tabs example">
      <LinkTab label="Home" to="/home" />
      <LinkTab label="Stats / Edit" to="/stats" />
    </Tabs>
  );
}