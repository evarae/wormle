import React, { useEffect, useMemo, useRef, useState } from 'react';
import mockGameData from '../mock/mockGameData.json';
import {GridTile, InvisibleTile, PathTile} from './GridTile';
import { Coordinates, Tile, TileType } from '../types/types';
import { Cardinal, areCoordinatesAdjacent, areCoordinatesEqual, createTileDictionary, getCardinalOfAdjacentCoordinates, getGridSize, getTileKey } from './TileHelper';
import './Grid.css';

function Grid() {
  //Game state stuff
  const [gridSize, setGridSize] = useState<Coordinates>({x:0, y:0});
  const [tiles, setTiles] = useState<Record<string, Tile>>({});
  const [pathLetters, setPathLetters] = useState<string[]>([]);

  //Front end stuff
  const [path, setPath] = useState<Coordinates[]>([]);
  const [focusedKey, setFocusedKey] = useState<string>();
  const textInputRefs = useRef<Record<string, HTMLButtonElement>>({});
  const [pathTileTypes, setPathTileTypes] = useState<Record<string, TileType>>({});

  //Initialise the game
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

  function tileOnClickCallback(tile:Tile){

    if(isMoveBackwardValid(tile.coordinates)){
      const partialRecord : Record<string, Tile> = {};
      partialRecord[getTileKey(tile.coordinates)] = {value: tile.value, guess: undefined, coordinates: tile.coordinates};
      setTiles({...tiles, ...partialRecord});
      path.pop();
      setPath([...path]);
      setFocusedKey(getTileKey(tile.coordinates));
    } else if(isMoveForwardValid(tile.coordinates)){
      const partialRecord : Record<string, Tile> = {};
      partialRecord[getTileKey(tile.coordinates)] = {value: tile.value, guess: pathLetters[path.length], coordinates: tile.coordinates};
      setTiles({...tiles, ...partialRecord});
      setPath([...path, tile.coordinates]);
      setFocusedKey(getTileKey(tile.coordinates));
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
    return ((path.length < 1) ? false : areCoordinatesEqual(path[path.length-1], coordinates));
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

  const handleKeyDown = (event: React.KeyboardEvent): any => {

    console.log('keydown');
    if(focusedKey===undefined){
      //TODO: add some default here, maybe go to end of the snake?
      return;
    }

    const focusedTile = tiles[focusedKey];
    if(!focusedTile){
      return;
    }

    let newTile = undefined;

    switch(event.code){
    case ('ArrowRight'): {
      newTile = tiles[getTileKey({x: focusedTile.coordinates.x + 1, y: focusedTile.coordinates.y})];
      break;
    }
    case ('ArrowLeft'): {
      newTile = tiles[getTileKey({x: focusedTile.coordinates.x -1 , y: focusedTile.coordinates.y})];
      break;
    }
    case ('ArrowDown'): {
      newTile = tiles[getTileKey({x: focusedTile.coordinates.x, y: focusedTile.coordinates.y + 1})];
      break;
    }
    case ('ArrowUp'): {
      newTile = tiles[getTileKey({x: focusedTile.coordinates.x, y: focusedTile.coordinates.y - 1})];
      break;
    }
    }

    if(newTile !== undefined){

      //Check if we're moving back to the last entry in the path
      if(path.length >= 2 && areCoordinatesEqual(focusedTile.coordinates, path[path.length-1]) && areCoordinatesEqual(newTile.coordinates, path[path.length-2])){
        tileOnClickCallback(focusedTile);
      } else if(newTile.guess == undefined){
        tileOnClickCallback(newTile);
      }

      const newKey = getTileKey(newTile.coordinates);
      textInputRefs.current[newKey].focus();
      setFocusedKey(newKey);
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

      let type = TileType.Vertical;
      if(next === undefined && last === undefined){
        type = TileType.Head;
      }

      if(next === undefined && last === Cardinal.North || last === undefined && next === Cardinal.North){
        type = TileType.HeadNorth;
      }
      
      if(next === undefined && last === Cardinal.South || last === undefined && next === Cardinal.South){
        type = TileType.HeadSouth;
      }

      if(next === undefined && last === Cardinal.East || last === undefined && next === Cardinal.East){
        type = TileType.HeadEast;
      }

      if(next === undefined && last === Cardinal.West || last === undefined && next === Cardinal.West){
        type = TileType.HeadWest;
      }

      if(next === Cardinal.East && last === Cardinal.West || last === Cardinal.East && next === Cardinal.West){
        type = TileType.Horizontal;
      }

      if(next === Cardinal.North && last === Cardinal.South || last === Cardinal.North && next === Cardinal.South){
        type = TileType.Vertical;
      }

      if(next === Cardinal.North && last === Cardinal.East || last === Cardinal.North && next === Cardinal.East){
        type = TileType.CornerNorthEast;
      }

      if(next === Cardinal.North && last === Cardinal.West || last === Cardinal.North && next === Cardinal.West){
        type = TileType.CornerNorthWest;
      }

      if(next === Cardinal.South && last === Cardinal.East || last === Cardinal.South && next === Cardinal.East){
        type = TileType.CornerSouthEast;
      }

      if(next === Cardinal.South && last === Cardinal.West || last === Cardinal.South && next === Cardinal.West){
        type = TileType.CornerSouthWest;
      }


      newRecord[getTileKey(c)] = type;
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
          tileElements.push(<GridTile tileType={getTileTypeFromCoordinates(t.coordinates)} tile={t} onClickCallback={tileOnClickCallback} ref={(ref) => textInputRefs.current[getTileKey(t.coordinates)] = ref!}/>);
        } else {
          tileElements.push(<InvisibleTile/>);
        }
      }

      wordElements.push(<div className='word-container'>
        {tileElements}
      </div>);
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
