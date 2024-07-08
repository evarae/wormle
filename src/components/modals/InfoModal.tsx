import React from "react";
import { Box, Link, Modal, Typography } from "@mui/material";

export default function InfoModal(props: Props) {
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
          {
            "Wormle is a daily word game created by me, Rae McLean. It's still in the development phase, but your feedback is welcome! If you want, you can find me on LinkedIn"
          }
        </Typography>
        <div className="center-button">
          <Link href="https://www.linkedin.com/in/evaraemclean/">
            Talk to me here
          </Link>
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
