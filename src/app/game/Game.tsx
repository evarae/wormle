import React from "react";
import { GameState, Tile } from "../../types/types";
import { Cardinal, tryMove, tryMoveInDirection } from "./GameEngine";
import Grid from "./grid/Grid";
import "./Game.css";
import Path from "./grid/Path";

const Game = (props: Props) => {
  function tileOnClickCallback(tile: Tile) {
    tryMove(props.gameState, props.setGameState, tile.coordinates);
  }

  const handleKeyDown = (event: React.KeyboardEvent) => {
    let direction = undefined;

    switch (event.code) {
      case "ArrowRight":
        direction = Cardinal.East;
        break;
      case "ArrowLeft":
        direction = Cardinal.West;
        break;
      case "ArrowDown":
        direction = Cardinal.South;
        break;
      case "ArrowUp":
        direction = Cardinal.North;
    }

    if (direction == undefined) {
      return;
    }

    tryMoveInDirection(props.gameState, direction, props.setGameState);
  };

  return (
    <div onKeyDown={handleKeyDown}>
      <Grid
        gameState={props.gameState}
        isReadOnly={false}
        tileOnClickCallback={tileOnClickCallback}
      />
      <div className="path-container">
        <Path gameState={props.gameState} />
      </div>
    </div>
  );
};

interface Props {
  gameState: GameState;
  setGameState: (newGameState: GameState) => void;
}

export default Game;
