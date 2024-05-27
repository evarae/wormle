import React from 'react';
import { Box, Button, Modal, Typography } from '@mui/material';
import { GameState } from '../../types/types';
import Grid from '../game/grid/Grid';

export default function WinModal(props:Props) {
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
        <Typography id="modal-modal-description" sx={{ mt: 2 }}>
          {`${props.isDemo? 'The demo' : 'Today\'s' } theme is:`}
        </Typography>
        <Typography variant='h6' component="h3">
          {props.gameState.theme}
        </Typography>
        <div>
          <Grid gameState={props.gameState} isReadOnly={true} gridSize='small'/>
        </div>
        <div className="center-button">
          <Button variant="outlined" onClick={props.tryAgainOnClick}>
            {props.isDemo? 'Try the real game': 'Play again'}
          </Button>
        </div>
      </Box>
    </Modal>
  );
}

interface Props {
    isOpen: boolean,
    onClose: () => void,
    gameState: GameState
    isDemo?: boolean,
    tryAgainOnClick: () => void;
}