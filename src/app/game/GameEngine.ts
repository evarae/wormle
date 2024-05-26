import { Coordinates, GameSetup, GameState, Tile, TileType, Word } from '../../types/types';

function getGameStateFromSetup(gameSetup:GameSetup):GameState{
  const startCoords = getStartCoordinates(gameSetup);
  return({
    gridSize: getGridSize(gameSetup.words),
    tiles: createTileDictionary(gameSetup.words, startCoords),
    pathLetters: gameSetup.pathString.split(''),
    path: [startCoords]
  });
}

function getStartCoordinates(gameSetup:GameSetup) : Coordinates {
  return {x: gameSetup.words[gameSetup.startWord].offset + gameSetup.startLetter, y: gameSetup.startWord};
}

function getGridSize(words: Word[]): Coordinates {
  let maxWidth = 0;

  words.forEach((word) => {
    const wordWidth = word.offset + word.text.length;
    maxWidth = wordWidth > maxWidth ? wordWidth : maxWidth;
  });

  return {x: maxWidth, y: words.length};
}

function tryMove(currentGameState: GameState, setGameState: (newGameState: GameState) => void, move: Coordinates) : void {
  const moveKey = getTileKey(move);
  const tileAtCoordinate = currentGameState.tiles[moveKey];

  //Check we aren't trying to move outside the grid
  if(tileAtCoordinate == undefined){
    return;
  }

  const lastTileCoords = (currentGameState.path.length > 0)? currentGameState.path[currentGameState.path.length-1] : undefined;
  if(lastTileCoords == undefined){
    //The path is empty
    return;
  }

  //If we're clicking on the last tile on the path, clear the tile
  if(areCoordinatesEqual(move, lastTileCoords) && currentGameState.path.length > 1){
    const partialRecord : Record<string, Tile> = {};
    partialRecord[moveKey] = { ...tileAtCoordinate, guess: undefined};
    currentGameState.tiles = {...currentGameState.tiles, ...partialRecord};
    currentGameState.path.pop();
    setGameState(duplicateState(currentGameState));
    return;
  }

  const lastTile = currentGameState.tiles[getTileKey(lastTileCoords)];

  //If we're clicking on a tile that is empty and adjacent to the last tile on the path, move there
  if(tileAtCoordinate.guess === undefined && areCoordinatesAdjacent(lastTile.coordinates, move)){
    const partialRecord : Record<string, Tile> = {};
    const guessLetter = currentGameState.pathLetters[currentGameState.path.length];
    partialRecord[moveKey] = { ...tileAtCoordinate, guess: guessLetter};
    currentGameState.tiles = {...currentGameState.tiles, ...partialRecord};
    currentGameState.path = [...currentGameState.path, move];
    setGameState(duplicateState(currentGameState));
    return;
  }
  //Else, we're clicking on a square that's already occupied so do nothing
}

function isGameOver(gameState:GameState) : boolean {
  if(gameState.path.length !== gameState.pathLetters.length){
    return false;
  }

  const values: Tile[] = Object.values(gameState.tiles);
  let isMatch = true;
  values.forEach(t => {
    if(t.guess !== t.value){
      isMatch = false;
    }
  });

  return isMatch;
}

function duplicateState(gameState: GameState): GameState{
  return {
    path: gameState.path,
    gridSize: gameState.gridSize,
    tiles: gameState.tiles,
    pathLetters: gameState.pathLetters
  };
}

function createTileDictionary(words: Word[], startCoordinates:Coordinates): Record<string,Tile>{
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

  dictionary[getTileKey(startCoordinates)].guess = dictionary[getTileKey(startCoordinates)].value;
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

function getTileTypeForPathIndex(index: number, gameState:GameState): TileType{
  if(index >= gameState.path.length){
    return TileType.Empty;
  }

  const c = gameState.path[index];

  const last = (index -1 >= 0)? getCardinalOfAdjacentCoordinates(c, gameState.path[index-1]) : undefined;
  const next = (index +1 <= gameState.path.length - 1) ? getCardinalOfAdjacentCoordinates(c, gameState.path[index+1]) : undefined;

  return getTileTypeFromAdjacentPathTiles(next, last);
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

export { areCoordinatesEqual, getTileKey, getGameStateFromSetup, tryMove, getTileTypeForPathIndex, isGameOver};