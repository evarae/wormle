import React, { useMemo } from 'react';
import PathTile from './tiles/PathTile';
import { GameState, Tile } from '../../types/types';
import {
  Cardinal,
  tryMove,
  tryMoveInDirection,
} from './GameEngine';
import Grid from './grid/Grid';

const Game = (props: Props) => {

  function tileOnClickCallback(tile: Tile) {
    tryMove(props.gameState, props.setGameState, tile.coordinates);
  }

  const handleKeyDown = (event: React.KeyboardEvent) => {

    let direction = undefined;

    switch (event.code) {
    case 'ArrowRight': 
      direction = Cardinal.East;
      break;
    case 'ArrowLeft': 
      direction = Cardinal.West;
      break;
    case 'ArrowDown': 
      direction = Cardinal.South;
      break;
    case 'ArrowUp': 
      direction = Cardinal.North;
    }

    if (direction == undefined) {
      return;
    }

    tryMoveInDirection(props.gameState, direction, props.setGameState);
  };
  
  const pathElements = useMemo(() => {
    return props.gameState.pathLetters.map((char, index) => {
      return (
        <PathTile
          key={index}
          isUsed={props.gameState.path.length > index}
          letter={char}
          isHighlighted={props.gameState.path.length - 1 === index}
        />
      );
    });
  }, [props.gameState]);

  return (
    <div onKeyDown={handleKeyDown}>
      <Grid gameState={props.gameState} isReadOnly={false} tileOnClickCallback={tileOnClickCallback}/>
      <div className="path-container">{pathElements}</div>
    </div>
  );
};

interface Props {
  gameState: GameState;
  setGameState: (newGameState: GameState) => void;
}

export default Game;
