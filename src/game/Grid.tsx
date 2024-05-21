import React, { useEffect, useMemo, useRef, useState } from 'react';
import mockGameData from '../mock/mockGameData.json';
import {GridTile, InvisibleTile, PathTile} from './GridTile';
import { Coordinates, Tile, TileType } from '../types/types';
import { areCoordinatesAdjacent, areCoordinatesEqual, createTileDictionary, getCardinalOfAdjacentCoordinates, getGridSize, getTileKey, getTileTypeFromAdjacentPathTiles } from './GameHelperFunctions';
import './Grid.css';

function Grid() {
  //Game state stuff
  const [gridSize, setGridSize] = useState<Coordinates>({x:0, y:0});
  const [tiles, setTiles] = useState<Record<string, Tile>>({});
  const [pathLetters, setPathLetters] = useState<string[]>([]);

  //Front end stuff
  const [path, setPath] = useState<Coordinates[]>([]);
  const [pathTileTypes, setPathTileTypes] = useState<Record<string, TileType>>({});
  const textInputRefs = useRef<Record<string, HTMLButtonElement>>({});

  //Initialise the game
  useEffect(() => {
    const dict = createTileDictionary(mockGameData.words, getStartCoordinates());
    const size = getGridSize(mockGameData.words);

    setTiles(dict);
    setGridSize(size);

    const chars = mockGameData.pathString.split('');
    setPathLetters(chars);
    setPath([getStartCoordinates()]);
  }, []);

  function getStartCoordinates() : Coordinates{
    return {x: mockGameData.words[mockGameData.startWord].offset + mockGameData.startLetter, y: mockGameData.startWord};
  }

  function resetTiles(){
    const dict = createTileDictionary(mockGameData.words, getStartCoordinates());
    setPath([getStartCoordinates()]);
    setTiles(dict);
  }

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

  //Check for win condition
  const isGameOver = useMemo(() => {

    if(path.length !== pathLetters.length){
      return false;
    }

    //Iterate through each word and check the right letter is there
    const values: Tile[] = Object.values(tiles);
    let isMatch = true;
    values.forEach(t => {
      if(t.guess !== t.value){
        isMatch = false;
      }
    });
    return isMatch;
  }, [path, tiles]);

  function isMoveBackwardValid(coordinates: Coordinates): boolean {
    return ((path.length < 2) ? false : areCoordinatesEqual(path[path.length-1], coordinates));
  }

  function isMoveForwardValid(coordinates: Coordinates): boolean {
    if(tiles[getTileKey(coordinates)].guess !== undefined){
      return false;
    }

    if(areCoordinatesAdjacent(path[path.length-1], coordinates)){
      return true;
    }

    return false;
  }

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if(path.length < 1){
      //TODO: add some default here, maybe go to end of the snake?
      return;
    }

    const currentCoords = path[path.length - 1];
    const currentTile = tiles[getTileKey(currentCoords)];

    let newTile = undefined;

    switch(event.code){
    case ('ArrowRight'): {
      newTile = tiles[getTileKey({x: currentCoords.x + 1, y: currentCoords.y})];
      break;
    }
    case ('ArrowLeft'): {
      newTile = tiles[getTileKey({x: currentCoords.x -1 , y: currentCoords.y})];
      break;
    }
    case ('ArrowDown'): {
      newTile = tiles[getTileKey({x: currentCoords.x, y: currentCoords.y + 1})];
      break;
    }
    case ('ArrowUp'): {
      newTile = tiles[getTileKey({x: currentCoords.x, y: currentCoords.y - 1})];
      break;
    }
    }

    if(newTile == undefined){
      return;
    }

    //Check if we're moving back to the last entry in the path
    if(path.length >= 2 && areCoordinatesEqual(currentCoords, path[path.length-1]) && areCoordinatesEqual(newTile.coordinates, path[path.length-2])){
      tileOnClickCallback(currentTile);
    } else if(newTile.guess == undefined){
      tileOnClickCallback(newTile);
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

    path.forEach((c, index) => {
      const last = (index -1 >= 0)? getCardinalOfAdjacentCoordinates(c, path[index-1]) : undefined;
      const next = (index +1 <= path.length - 1) ? getCardinalOfAdjacentCoordinates(c, path[index+1]) : undefined;

      newRecord[getTileKey(c)] = getTileTypeFromAdjacentPathTiles(next, last);
    });

    setPathTileTypes(newRecord);
  },[path]);

  const gridElements = () => {
    const wordElements = [];

    for(let j = 0; j < gridSize.y; j++){
      const tileElements =[];

      for(let i = 0; i < gridSize.x; i++){
        const t = tiles[getTileKey({x:i, y:j})];
        if(t !== undefined){
          tileElements.push(<GridTile key = {getTileKey({x:i, y:j})} tileType={getTileTypeFromCoordinates(t.coordinates)} tile={t} onClickCallback={tileOnClickCallback} ref={(ref) => textInputRefs.current[getTileKey(t.coordinates)] = ref!}/>);
        } else {
          tileElements.push(<InvisibleTile key = {getTileKey({x:i, y:j})}/>);
        }
      }

      wordElements.push(<div key = {j} className='word-container'>
        {tileElements}
      </div>);
    }

    if(path.length>0){
      const ref = textInputRefs.current[getTileKey(path[path.length-1])];
      if(ref!== undefined){
        ref.focus();
      }
    }

    return(wordElements);
  };

  const pathElements = pathLetters.map((char, index) =>
    <PathTile key = {index} isUsed = {(path.length > index)} letter={char} isHighlighted= {(path.length == index)}/>
  );
    
  return (
    <div onKeyDown={handleKeyDown}>
      {isGameOver && <h2>You Win!</h2>}
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
