import React from "react";
import { Box, Button, Modal, Typography } from "@mui/material";
import DemoGrid from "../game/DemoGrid";

export default function HelpModal(props: Props) {
  return (
    <Modal
      open={props.isOpen}
      onClose={props.onClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
      className="modal"
    >
      <Box>
        <Typography id="modal-modal-title" variant="h6" component="h2">
          Welcome to Wormle!
        </Typography>
        <Typography id=" modal-modal-description" sx={{ mt: 2 }}>
          Use the arrow keys or mouse to move the worm through the grid. Use the
          letters on your worm to spell a themed word on each row. The first
          move is always done for you.
        </Typography>
        <DemoGrid />
        <div className="center-button">
          <Button variant="outlined" onClick={props.tryDemoOnClick}>
            Try a demo
          </Button>
        </div>
      </Box>
    </Modal>
  );
}

interface Props {
  isOpen: boolean;
  onClose: () => void;
  tryDemoOnClick: () => void;
}
