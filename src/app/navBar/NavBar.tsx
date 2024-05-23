import * as React from 'react';
import './NavBar.css';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import HelpIcon from '@mui/icons-material/Help';

export default function NavBar(props: Props) {
  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static" className = 'nav-header'>
        <Toolbar>
          <Typography fontWeight = "bold" variant="h2" component="div" sx={{ flexGrow: 1 }}>
            WORMLE
          </Typography>
          <IconButton
            onClick={props.infoButtonOnClick}
            size="large"
            edge="end"
            color="inherit"
            aria-label="menu"
          >
            <HelpIcon />
          </IconButton>
        </Toolbar>
      </AppBar>
    </Box>
  );
}

interface Props {
    infoButtonOnClick: () => void
}