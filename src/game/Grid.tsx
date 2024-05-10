import React, { useEffect, useState } from 'react';
import mockGameData from '../mock/mockGameData.json';
import {GridTile, EmptyTile} from './GridTile';
import { Coordinates, Snake, Tile } from '../types/types';
import { createTileDictionary, getGridSize, getTileKey } from './TileHelper';

function Grid() {
  const [gridSize, setGridSize] = useState<Coordinates>({x:0, y:0});
  const [tiles, setTiles] = useState<Record<string, Tile>>({});
  const [snake, setSnake] = useState<Snake>();

  useEffect(() => {

    const dict = createTileDictionary(mockGameData.words);
    const size = getGridSize(mockGameData.words);

    setTiles(dict);
    setGridSize(size);

    //Initialise snake
    const chars = mockGameData.pathString.split('');
    const initialSnake:Snake = {
      initialLetters: chars,
      lettersRemaining: [...chars]
    };

    setSnake(initialSnake);
    
  }, []);

  const listItems = () => {
    console.log(gridSize);
    const wordElements = [];

    for(let j = 0; j < gridSize.y; j++){
      const tileElements =[];

      for(let i = 0; i < gridSize.x; i++){
        if(tiles[getTileKey({x:i, y:j})] !== undefined){
          tileElements.push(<GridTile tile={tiles[getTileKey({x:i, y:j})]}/>);
        } else {
          tileElements.push(<EmptyTile/>);
        }
      }

      wordElements.push(<div className='wordRow'>
        {tileElements}
      </div>);
    }

    return(wordElements);
  };
    
  return (
    <div>
      <div>
        {snake?.lettersRemaining}
      </div>
      <div className='game'>
        {listItems()}
      </div>
    </div>
  );
}

export default Grid;
