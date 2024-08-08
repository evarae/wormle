import React from "react";
import { Box, Link, Modal, Typography } from "@mui/material";
import { KOFI_LINK } from "./Donation";

const HANG_FIVE_LINK = "https://playhangfive.com";

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
        <Typography id="modal-modal-description" sx={{ mt: 2 }} align="center">
          Wormle is a daily word game created by me, Rae McLean. It&apos;s still
          in the development phase, but your feedback is welcome.
          <br />
          <br />I was inspired to make a daily word game after my co-worker
          shared his awesome hangman-like game,{" "}
          <Link href={HANG_FIVE_LINK}>Hang Five</Link>. Check it out!
          <br />
          <br />
          If you want to help me pay for the costs of hosting wormle, you can{" "}
          <Link href={KOFI_LINK}>buy me a coffee through ko-fi</Link>
        </Typography>
      </Box>
    </Modal>
  );
}

interface Props {
  isOpen: boolean;
  onClose: () => void;
  tryDemoOnClick: () => void;
}
