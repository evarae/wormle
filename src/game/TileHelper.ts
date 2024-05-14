import { Coordinates, GameSetup, Tile, Word } from '../types/types';

function getGridSize(words: Word[]): Coordinates {
  let maxWidth = 0;

  words.forEach((word) => {
    const wordWidth = word.offset + word.text.length;
    maxWidth = wordWidth > maxWidth ? wordWidth : maxWidth;
  });

  return {x: maxWidth, y: words.length};
}

function createTileDictionary(words: Word[]): Record<string,Tile>{
  const dictionary:Record<string,Tile> = {};

  words.forEach((word, wordIndex) => {
    const letters = word.text.split('');
    letters.forEach((letter, letterIndex) => {
      const tile:Tile = 
        {
          guess: undefined,
          value: letter,
          coordinates: {
            x: letterIndex + word.offset,
            y: wordIndex
          }
        };
      dictionary[getTileKey(tile.coordinates)] = tile;
    });
  });

  return dictionary;
}

function getTileKey(coordinates:Coordinates):string {
  return(`${coordinates.x},${coordinates.y}`);
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

export {createTileDictionary, getTileKey, getGridSize, areCoordinatesAdjacent, areCoordinatesEqual};