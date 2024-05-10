import React, { useEffect, useState } from 'react';
import mockGameData from '../mock/mockGameData.json';
import {GridTile, EmptyTile, PathTile} from './GridTile';
import { Coordinates, Snake, Tile } from '../types/types';
import { createTileDictionary, getGridSize, getTileKey } from './TileHelper';

function Grid() {
  const [gridSize, setGridSize] = useState<Coordinates>({x:0, y:0});
  const [tiles, setTiles] = useState<Record<string, Tile>>({});
  const [path, setPath] = useState<string[]>([]);
  const [lettersUsed, setLettersUsed] = useState<number>(0);

  useEffect(() => {

    const dict = createTileDictionary(mockGameData.words);
    const size = getGridSize(mockGameData.words);

    setTiles(dict);
    setGridSize(size);

    const chars = mockGameData.pathString.split('');
    setPath(chars);
    setLettersUsed(0);
    
  }, []);

  const pathElements = path.map((char, index) =>
    // eslint-disable-next-line react/jsx-key
    <PathTile isUsed = {(lettersUsed > index)} letter={char}/>
  );

  function tileOnClickCallback(tile:Tile){

    if(tile.guess == undefined){
      const partialRecord : Record<string, Tile> = {};
      partialRecord[getTileKey(tile.coordinates)] = {value: tile.value, guess: path[lettersUsed], coordinates: tile.coordinates};
      setTiles({...tiles, ...partialRecord});
      setLettersUsed(lettersUsed+1);
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
    
  return (
    <div>
      <div className='path-container'>
        {pathElements}
      </div>
      <div >
        {gridElements()}
      </div>
    </div>
  );
}

export default Grid;
