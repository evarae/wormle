import React, { useEffect, useState } from 'react';
import './App.css';
import Grid from './game/Grid';
import { GameState } from '../types/types';
import mockGameData from '../mock/mockGameData.json';
import { getGameStateFromSetup } from './game/GameEngine';
import NavBar from './navBar/NavBar';
import { Box, Button, Modal, Typography } from '@mui/material';
import { demoGameData } from '../demoData/demoData';
import MiniGrid from './game/MiniGrid';

function App() {
  const [isWinModalOpen, setWinModalOpen] = useState(false);
  const [isInfoModalOpen, setInfoModalOpen] = useState(false);
  const [isDemo, setIsDemo] = useState<boolean>(false);
  const [gameState, setGameState] = useState<GameState>();

  //Initialise the game
  useEffect(() => {
    setGameState(getGameStateFromSetup(mockGameData));
  }, []);

  function infoButtonOnClick(){
    setInfoModalOpen(true);
  }

  function tryDemoOnClick(){
    setInfoModalOpen(false);
    setIsDemo(true);
    setGameState(getGameStateFromSetup(demoGameData));
  }

  function resetButtonOnClick(){
    setGameState(getGameStateFromSetup((mockGameData)));
    setIsDemo(false);
  }

  function infoModalOnClose(){
    setInfoModalOpen(false);
  }

  function infoModal(){

    return(
      <Modal
        open={isInfoModalOpen}
        onClose={infoModalOnClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
        className='modal'
      >
        <Box>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            Welcome to Wormle!
          </Typography>
          <Typography id="modal-modal-description" sx={{ mt: 2 }}>
            Use the arrow keys or mouse to move the worm through the grid. Use the letters on your worm to spell a themed word on each row. The first move is always done for you.
          </Typography>
          <MiniGrid gameState={getGameStateFromSetup(demoGameData)}/>
          <div className='center-button'>
            <Button variant = 'outlined' onClick = {tryDemoOnClick}>Try a demo</Button>
          </div>
        </Box>
      </Modal>
    );
  }

  return (
    <div className="App">
      <NavBar infoButtonOnClick = {infoButtonOnClick}/>
      {infoModal()}
      {gameState? <Grid gameState={gameState} setGameState={setGameState}/> : <>Loading</>}
      <div className='center-button'>
        <Button variant='outlined' size = 'small' onClick = {resetButtonOnClick}>{isDemo? 'Go to today\'s game':'Reset tiles'}</Button>
      </div>
    </div>
  );
}

export default App;
