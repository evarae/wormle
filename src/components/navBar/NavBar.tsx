import * as React from "react";
import "./NavBar.css";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import HelpIcon from "@mui/icons-material/Help";
import InfoIcon from "@mui/icons-material/Info";

export default function NavBar(props: Props) {
  return (
    <Box sx={{ flexGrow: 1 }} className="nav-header">
      <AppBar position="static">
        <Toolbar>
          <IconButton
            onClick={props.infoButtonOnClick}
            size="large"
            edge="start"
            color="inherit"
            aria-label="menu"
          >
            <InfoIcon />
          </IconButton>
          <Typography
            fontWeight="bold"
            variant="h3"
            component="div"
            sx={{ flexGrow: 1 }}
          >
            WORMLE
          </Typography>
          <IconButton
            onClick={props.helpButtonOnClick}
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
  infoButtonOnClick: () => void;
  helpButtonOnClick: () => void;
}
