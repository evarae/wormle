import React, { useEffect, useState } from 'react';
import mockGameData from '../mock/mockGameData.json';
import GridTile, { Tile } from './GridTile';

function Grid() {

  const [longestWord, setLongestWord] = useState<number>(0);
  const [tiles, setTiles] = useState<Tile[]>([]);

  useEffect(() => {
    const initialTiles : Tile[] = [];
    let lw = 0;

    for(let i = 0; i < mockGameData.words.length; i++){
      const word = mockGameData.words[i];
      if(word.word.length > lw){
        lw = word.word.length;
      }
      for(let j = 0; j < word.word.length; j++){
        const char = word.word.charAt(j);
        const tile :Tile = {
          value: char,
          x: word.offset + j,
          y: i
        };
        initialTiles.push(tile);
      }
    }
    console.log('initial tiles:', initialTiles);
    setTiles(initialTiles);
    setLongestWord(lw);
  }, []);


  const listItems = () => tiles.map((tile) => {
    return <GridTile longestWord = {longestWord} tile = {tile} key = {tile.x.toString()+ '.' + tile.y.toString()}></GridTile>;
  });
    
  return (
    <div className='game'>
      {listItems()}
    </div>
    
  );
}

export default Grid;
