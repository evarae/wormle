import React, { useEffect, useState } from 'react';
import mockGameData from '../mock/mockGameData.json';
import {GridTile, EmptyTile, PathTile} from './GridTile';
import { Coordinates, Tile } from '../types/types';
import { createTileDictionary, getGridSize, getTileKey } from './TileHelper';

function Grid() {
  const [gridSize, setGridSize] = useState<Coordinates>({x:0, y:0});
  const [tiles, setTiles] = useState<Record<string, Tile>>({});
  const [pathLetters, setPathLetters] = useState<string[]>([]);
  const [path, setPath] = useState<Coordinates[]>([]);

  useEffect(() => {
    const dict = createTileDictionary(mockGameData.words);
    const size = getGridSize(mockGameData.words);

    setTiles(dict);
    setGridSize(size);

    const chars = mockGameData.pathString.split('');
    setPathLetters(chars);
  }, []);

  function resetTiles(){
    const dict = createTileDictionary(mockGameData.words);
    setPath([]);
    setTiles(dict);
  }

  const pathElements = pathLetters.map((char, index) =>
    // eslint-disable-next-line react/jsx-key
    <PathTile isUsed = {(path.length > index)} letter={char} isHighlighted= {(path.length == index)}/>
  );

  function tileOnClickCallback(tile:Tile){

    if(isMoveBackwardValid(tile.coordinates)){
      const partialRecord : Record<string, Tile> = {};
      partialRecord[getTileKey(tile.coordinates)] = {value: tile.value, guess: undefined, coordinates: tile.coordinates};
      setTiles({...tiles, ...partialRecord});
      path.pop();
      setPath([...path]);
    } else if(isMoveForwardValid(tile.coordinates)){
      const partialRecord : Record<string, Tile> = {};
      partialRecord[getTileKey(tile.coordinates)] = {value: tile.value, guess: pathLetters[path.length], coordinates: tile.coordinates};
      setTiles({...tiles, ...partialRecord});
      setPath([...path, tile.coordinates]);
    }
    return;
  }

  const gridElements = () => {
    console.log(gridSize);
    const wordElements = [];

    for(let j = 0; j < gridSize.y; j++){
      const tileElements =[];

      for(let i = 0; i < gridSize.x; i++){
        if(tiles[getTileKey({x:i, y:j})] !== undefined){
          tileElements.push(<GridTile tile={tiles[getTileKey({x:i, y:j})]} onClickCallback={tileOnClickCallback}/>);
        } else {
          tileElements.push(<EmptyTile/>);
        }
      }

      wordElements.push(<div className='word-container'>
        {tileElements}
      </div>);
    }

    return(wordElements);
  };

  function isMoveBackwardValid(coordinates: Coordinates): boolean {
    if(path.length < 1){
      return false;
    }

    return areCoordinatesEqual(path[path.length-1], coordinates);
  }

  function isMoveForwardValid(coordinates: Coordinates): boolean {
    
    //If it's the first move, probably need some validation for the length of path letters
    if(path.length == 0){
      return true;
    }

    if(tiles[getTileKey(coordinates)].guess !== undefined){
      return false;
    }

    if(areCoordinatesAdjacent(path[path.length-1], coordinates)){
      return true;
    }

    return false;
  }

  function areCoordinatesEqual(a:Coordinates, b:Coordinates) : boolean {
    return (a.x==b.x && a.y==b.y);
  }

  function areCoordinatesAdjacent(a:Coordinates, b:Coordinates) : boolean {
    const diffX = Math.abs(a.x - b.x);
    const diffY = Math.abs(a.y - b.y);

    if(diffX == 1 && diffY == 0){
      return true;
    } 

    if(diffX == 0 && diffY == 1){
      return true;
    } 

    return false;
  }
    
  return (
    <div>
      <div className='path-container'>
        {pathElements}
      </div>
      <div >
        {gridElements()}
      </div>
      <button onClick={resetTiles}>Reset Tiles</button>
    </div>
  );
}

export default Grid;
