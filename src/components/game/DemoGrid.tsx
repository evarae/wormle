import React, { useEffect, useState } from "react";
import "./grid/Grid.css";
import { Coordinates, GameState } from "../../types/types";
import Grid from "./grid/Grid";
import { getGameStateFromSetup, tryMove } from "../../helpers/GameEngine";
import { demoData } from "../../gameData/data";

const DemoGrid = () => {
  const [gameState, setGameState] = useState<GameState>();
  const [count, setCount] = useState(-1);
  const moves: Coordinates[] = [
    { x: 1, y: 1 },
    { x: 0, y: 1 },
    { x: 0, y: 0 },
    { x: 1, y: 0 },
    { x: 2, y: 0 },
  ];

  useEffect(() => {
    setGameState(getGameStateFromSetup(demoData.game));
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setCount((prevCount) => (prevCount + 1) % (moves.length + 1));
    }, 1000);

    // Cleanup interval on component unmount
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (gameState == undefined) {
      return;
    }

    if (count == moves.length) {
      setGameState(getGameStateFromSetup(demoData.game));
      return;
    }

    tryMove(gameState, setGameState, moves[count]);
  }, [count]);

  return (
    <div>
      {gameState ? (
        <Grid gameState={gameState} isReadOnly={true} gridSize="medium" />
      ) : (
        <></>
      )}
    </div>
  );
};

export default DemoGrid;
