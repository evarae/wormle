import { Coordinates, GameSetup, Tile, TileType, Word } from '../types/types';

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

function getCardinalOfAdjacentCoordinates(from:Coordinates, to:Coordinates) : Cardinal {
  const diffX = (from.x - to.x);
  const diffY = (from.y - to.y);

  if(diffX == 1 && diffY == 0){
    return Cardinal.West;
  } 

  if(diffX == -1 && diffY == 0){
    return Cardinal.East;
  } 

  if(diffX == 0 && diffY == 1){
    return Cardinal.North;
  } 

  return Cardinal.South;
}

function getTileTypeFromAdjacentPathTiles(next: Cardinal | undefined, last: Cardinal | undefined) : TileType {
  if(next === undefined && last === undefined){
    return TileType.Head;
  }

  if(next === undefined && last === Cardinal.North || last === undefined && next === Cardinal.North){
    return TileType.HeadNorth;
  }
  
  if(next === undefined && last === Cardinal.South || last === undefined && next === Cardinal.South){
    return TileType.HeadSouth;
  }

  if(next === undefined && last === Cardinal.East || last === undefined && next === Cardinal.East){
    return TileType.HeadEast;
  }

  if(next === undefined && last === Cardinal.West || last === undefined && next === Cardinal.West){
    return TileType.HeadWest;
  }

  if(next === Cardinal.East && last === Cardinal.West || last === Cardinal.East && next === Cardinal.West){
    return TileType.Horizontal;
  }

  if(next === Cardinal.North && last === Cardinal.South || last === Cardinal.North && next === Cardinal.South){
    return TileType.Vertical;
  }

  if(next === Cardinal.North && last === Cardinal.East || last === Cardinal.North && next === Cardinal.East){
    return TileType.CornerNorthEast;
  }

  if(next === Cardinal.North && last === Cardinal.West || last === Cardinal.North && next === Cardinal.West){
    return TileType.CornerNorthWest;
  }

  if(next === Cardinal.South && last === Cardinal.East || last === Cardinal.South && next === Cardinal.East){
    return TileType.CornerSouthEast;
  }

  if(next === Cardinal.South && last === Cardinal.West || last === Cardinal.South && next === Cardinal.West){
    return TileType.CornerSouthWest;
  }

  return TileType.Empty;
}

export enum Cardinal{
  North,
  South,
  East,
  West
}

export {createTileDictionary, getTileKey, getGridSize, areCoordinatesAdjacent, areCoordinatesEqual, getCardinalOfAdjacentCoordinates, getTileTypeFromAdjacentPathTiles};