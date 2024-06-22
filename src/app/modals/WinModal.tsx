import React from "react";
import { Box, Button, Modal, Typography } from "@mui/material";
import { GameState } from "../../types/types";
import Grid from "../game/grid/Grid";

export default function WinModal(props: Props) {
  const minMoves = props.gameState.path.length - 1;
  const isMin = minMoves >= props.gameState.moveCount;

  return (
    <Modal
      open={props.isOpen}
      onClose={props.onClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
      className="modal"
    >
      <Box>
        <Typography id="modal-modal-title" variant="h5" component="h2">
          Nice work, you win!
        </Typography>
        <Typography paddingTop={"16px"}>
          {`You finished the game in ${props.gameState.moveCount} moves.`}
        </Typography>
        <Typography paddingBottom={"16px"}>
          {isMin
            ? "Thats the minimum number possible!"
            : `The minimum possible was ${minMoves}.`}
        </Typography>
        <div>
          <Grid
            gameState={props.gameState}
            isReadOnly={true}
            gridSize="small"
          />
        </div>
        <Typography id="modal-modal-description" sx={{ mt: 2 }}>
          {`${props.isDemo ? "The demo" : "Today's"} theme is:`}
        </Typography>
        <Typography variant="h6">{props.gameState.theme}</Typography>
        <>
          {props.isDemo && (
            <div className="center-button">
              <Button variant="outlined" onClick={props.tryAgainOnClick}>
                {props.isDemo ? "Try the real game" : "Play again"}
              </Button>
            </div>
          )}
        </>
      </Box>
    </Modal>
  );
}

interface Props {
  isOpen: boolean;
  onClose: () => void;
  gameState: GameState;
  isDemo?: boolean;
  tryAgainOnClick: () => void;
}
