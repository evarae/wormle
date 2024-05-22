import React, { useEffect, useState } from 'react';
import './App.css';
import Grid from './game/Grid';
import { GameState } from '../types/types';
import mockGameData from '../mock/mockGameData.json';
import { setInitialGameState } from './game/GameEngine';
import NavBar from './navBar/NavBar';

function App() {
  const [gameState, setGameState] = useState<GameState>();

  //Initialise the game
  useEffect(() => {
    setInitialGameState(mockGameData, setGameState);
  }, []);

  return (
    <div className="App">
      <NavBar></NavBar>
      {gameState? <Grid gameState={gameState} setGameState={setGameState}/> : <>Loading</>}
    </div>
  );
}

export default App;