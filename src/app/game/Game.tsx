import React, { useMemo } from 'react';
import PathTile from './tiles/PathTile';
import { GameState, Tile } from '../../types/types';
import {
  areCoordinatesEqual,
  getTileKey,
  tryMove,
} from './GameEngine';
import Grid from './grid/Grid';

const Game = (props: Props) => {

  function tileOnClickCallback(tile: Tile) {
    tryMove(props.gameState, props.setGameState, tile.coordinates);
  }

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (props.gameState.path.length < 1) {
      //TODO: add some default here, maybe go to end of the snake?
      return;
    }

    const currentCoords = props.gameState.path[props.gameState.path.length - 1];
    let newTile = undefined;

    switch (event.code) {
    case 'ArrowRight': {
      newTile =
          props.gameState.tiles[
            getTileKey({ x: currentCoords.x + 1, y: currentCoords.y })
          ];
      break;
    }
    case 'ArrowLeft': {
      newTile =
          props.gameState.tiles[
            getTileKey({ x: currentCoords.x - 1, y: currentCoords.y })
          ];
      break;
    }
    case 'ArrowDown': {
      newTile =
          props.gameState.tiles[
            getTileKey({ x: currentCoords.x, y: currentCoords.y + 1 })
          ];
      break;
    }
    case 'ArrowUp': {
      newTile =
          props.gameState.tiles[
            getTileKey({ x: currentCoords.x, y: currentCoords.y - 1 })
          ];
      break;
    }
    }

    if (newTile == undefined) {
      return;
    }

    //Check if we're moving back to the last entry in the path
    if (
      props.gameState.path.length >= 2 &&
      areCoordinatesEqual(
        currentCoords,
        props.gameState.path[props.gameState.path.length - 1]
      ) &&
      areCoordinatesEqual(
        newTile.coordinates,
        props.gameState.path[props.gameState.path.length - 2]
      )
    ) {
      tryMove(props.gameState, props.setGameState, currentCoords);
    } else if (newTile.guess == undefined) {
      tryMove(props.gameState, props.setGameState, newTile.coordinates);
    }
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
