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
    { x: 1, y: 0 },
    { x: 2, y: 0 },
    { x: 3, y: 0 },
    { x: 4, y: 0 },
    { x: 4, y: 1 },
    { x: 3, y: 1 },
    { x: 2, y: 1 },
    { x: 1, y: 1 },
    { x: 0, y: 1 },
    { x: 0, y: 2 },
    { x: 1, y: 2 },
    { x: 1, y: 3 },
    { x: 2, y: 3 },
    { x: 2, y: 2 },
    { x: 3, y: 2 },
    { x: 3, y: 3 },
    { x: 4, y: 3 },
  ];

  useEffect(() => {
    setGameState(getGameStateFromSetup(demoData.game));
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setCount((prevCount) => (prevCount + 1) % (moves.length + 1));
    }, 300);

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
    <div className="padding">
      {gameState ? (
        <Grid gameState={gameState} isReadOnly={true} gridSize="medium" />
      ) : (
        <></>
      )}
    </div>
  );
};

export default DemoGrid;
