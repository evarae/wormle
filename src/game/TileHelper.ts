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

export {createTileDictionary, getTileKey, getGridSize};