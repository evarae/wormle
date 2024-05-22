import React, { useEffect, useMemo, useRef, useState } from 'react';
import './Grid.css';
import GridTile from './tiles/GridTile';
import InvisibleTile from './tiles/InvisibleTile';
import PathTile from './tiles/PathTile';
import { Coordinates, GameState, Tile, TileType } from '../../types/types';
import { areCoordinatesEqual, getTileKey, tryMove, getTileTypeForPathIndex, isGameOver } from './GameEngine';

const Grid = (props:Props) => {
  const [pathTileTypes, setPathTileTypes] = useState<Record<string, TileType>>({});
  const textInputRefs = useRef<Record<string, HTMLButtonElement>>({});

  function tileOnClickCallback(tile:Tile){
    tryMove(props.gameState, props.setGameState, tile.coordinates);
  }

  function refocusPath(){
    if(props.gameState.path.length>0){
      const ref = textInputRefs.current[getTileKey(props.gameState.path[props.gameState.path.length-1])];
      if(ref!== undefined){
        ref.focus();
      }
    }
  }

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if(props.gameState.path.length < 1){
      //TODO: add some default here, maybe go to end of the snake?
      return;
    }

    const currentCoords = props.gameState.path[props.gameState.path.length - 1];
    let newTile = undefined;

    switch(event.code){
    case ('ArrowRight'): {
      newTile = props.gameState.tiles[getTileKey({x: currentCoords.x + 1, y: currentCoords.y})];
      break;
    }
    case ('ArrowLeft'): {
      newTile = props.gameState.tiles[getTileKey({x: currentCoords.x -1 , y: currentCoords.y})];
      break;
    }
    case ('ArrowDown'): {
      newTile = props.gameState.tiles[getTileKey({x: currentCoords.x, y: currentCoords.y + 1})];
      break;
    }
    case ('ArrowUp'): {
      newTile = props.gameState.tiles[getTileKey({x: currentCoords.x, y: currentCoords.y - 1})];
      break;
    }
    }

    if(newTile == undefined){
      return;
    }

    //Check if we're moving back to the last entry in the path
    if(props.gameState.path.length >= 2 && areCoordinatesEqual(currentCoords, props.gameState.path[props.gameState.path.length-1]) && areCoordinatesEqual(newTile.coordinates, props.gameState.path[props.gameState.path.length-2])){
      tryMove(props.gameState, props.setGameState, currentCoords);
    } else if(newTile.guess == undefined){
      tryMove(props.gameState, props.setGameState, newTile.coordinates);
    }
  };

  function getTileTypeFromCoordinates(coordinates:Coordinates):TileType {
    const type = pathTileTypes[getTileKey(coordinates)];
    if(type === undefined){
      return TileType.Empty;
    }
    return type;
  }

  //Maintains the snake tile types when the path changes
  useEffect(()=> {
    const newRecord:Record<string, TileType> = {};
    const path = props.gameState.path;

    path.forEach((c, index) => {
      newRecord[getTileKey(c)] = getTileTypeForPathIndex(index, props.gameState);
    });

    setPathTileTypes(newRecord);
  },[props.gameState]);

  const gridElements = useMemo(() => {
    const wordElements = [];

    for(let j = 0; j < props.gameState.gridSize.y; j++){
      const tileElements =[];

      for(let i = 0; i < props.gameState.gridSize.x; i++){
        const t = props.gameState.tiles[getTileKey({x:i, y:j})];
        if(t !== undefined){
          tileElements.push(<GridTile key = {getTileKey({x:i, y:j})} tileType={getTileTypeFromCoordinates(t.coordinates)} tile={t} onClickCallback={tileOnClickCallback} ref={(ref) => textInputRefs.current[getTileKey(t.coordinates)] = ref!}/>);
        } else {
          tileElements.push(<InvisibleTile key = {getTileKey({x:i, y:j})}/>);
        }
      }

      wordElements.push(
        <div key = {j} className='word-container'>
          {tileElements}
        </div>);
    }

    refocusPath();
    return(wordElements);

  }, [props.gameState, pathTileTypes]);

  const pathElements = useMemo(() => {
    return props.gameState.pathLetters.map((char, index) => {
      return (
        <PathTile 
          key={index} 
          isUsed={(props.gameState.path.length > index)} 
          letter={char} 
          isHighlighted={(props.gameState.path.length -1 === index)}
        />
      );
    });
  }, [props.gameState]);

  return (
    <div onKeyDown={handleKeyDown}>
      {isGameOver(props.gameState) && <h2>You Win!</h2>}
      <div className='gameGridContainer'>
        {gridElements}
      </div>
      <div className='path-container'>
        {pathElements}
      </div>
    </div>
  );
};

interface Props{
  gameState: GameState;
  setGameState: (newGameState: GameState) => void;
}

export default Grid;
