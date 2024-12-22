import * as React from "react";
import "./NavBar.css";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import HelpIcon from "@mui/icons-material/Help";
import InfoIcon from "@mui/icons-material/Info";

export default function NavBar(props: Props) {
  return (
    <div className="nav-header">
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
            component="h1"
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
    </div>
  );
}

interface Props {
  infoButtonOnClick: () => void;
  helpButtonOnClick: () => void;
}
