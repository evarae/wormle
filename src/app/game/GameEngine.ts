import { Coordinates, GameSetup, GameState, Tile, TileType, Word } from '../../types/types';

function getGameStateFromSetup(gameSetup:GameSetup):GameState{
  const startCoords = getStartCoordinates(gameSetup);
  return({
    gridSize: getGridSize(gameSetup.words),
    tiles: createTileDictionary(gameSetup.words, startCoords),
    pathLetters: gameSetup.pathString.split(''),
    path: [startCoords],
    theme: gameSetup.theme
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

function tryMoveInDirection(currentGameState: GameState, direction:Cardinal, setGameState: (newGameState: GameState) => void) : void {

  const headCoords = (currentGameState.path.length > 0)? currentGameState.path[currentGameState.path.length-1] : undefined;
  if(headCoords == undefined){
    return;
  }

  const newCoords = coordinateInDirection(headCoords, direction);
  const head1Coords = (currentGameState.path.length > 1)? currentGameState.path[currentGameState.path.length-2] : undefined;
  const isMovingBackwards = (head1Coords != undefined && areCoordinatesEqual(newCoords, head1Coords));

  const tileAtCoordinate = currentGameState.tiles[getTileKey(newCoords)];
  
  if(!(isMovingBackwards) && (tileAtCoordinate == undefined || tileAtCoordinate.guess != undefined)){
    return;
  }

  tryMove(currentGameState, setGameState, newCoords);
  return;
}

function tryMove(currentGameState: GameState, setGameState: (newGameState: GameState) => void, move: Coordinates) : void {
  const moveKey = getTileKey(move);
  const tileAtCoordinate = currentGameState.tiles[moveKey];
  const lastTileCoords = (currentGameState.path.length > 0)? currentGameState.path[currentGameState.path.length-1] : undefined;

  //Check we aren't trying to move outside the grid
  if(tileAtCoordinate == undefined || lastTileCoords == undefined){
    return;
  }

  let state = currentGameState;

  if(tileAtCoordinate.guess != undefined){
    if(state.path.length <= 1){
      return;
    }

    while(state.path.length > 1 && !areCoordinatesEqual(state.path[state.path.length-1], move)){
      state = moveBackward(state, state.path[state.path.length-1]);
    }

    setGameState(state);
    return;
  }

  const path = getValidMovesBetweenPoints(currentGameState, lastTileCoords, move);

  path.forEach(c => {
    state = moveForward(state, c);
  });

  setGameState(state);
}

function moveForward(currentGameState: GameState, move: Coordinates) : GameState {
  const guessLetter = currentGameState.pathLetters[currentGameState.path.length];
  const tileAtCoordinate = currentGameState.tiles[getTileKey(move)];

  const partialRecord : Record<string, Tile> = {};
  partialRecord[getTileKey(move)] = { ...tileAtCoordinate, guess: guessLetter};

  currentGameState.tiles = {...currentGameState.tiles, ...partialRecord};
  currentGameState.path = [...currentGameState.path, move];

  return duplicateState(currentGameState);
}

function moveBackward(currentGameState: GameState, move: Coordinates) : GameState {
  const tileAtCoordinate = currentGameState.tiles[getTileKey(move)];

  const partialRecord : Record<string, Tile> = {};
  partialRecord[getTileKey(move)] = { ...tileAtCoordinate, guess: undefined};

  currentGameState.tiles = {...currentGameState.tiles, ...partialRecord};
  currentGameState.path.pop();
  
  return duplicateState(currentGameState);
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
    pathLetters: gameState.pathLetters,
    theme: gameState.theme
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

function getTileTypeForPathIndex(index: number, path:Coordinates[]): TileType{
  if(index >= path.length){
    return TileType.Empty;
  }

  const c = path[index];

  const last = (index -1 >= 0)? getCardinalOfAdjacentCoordinates(c, path[index-1]) : undefined;
  const next = (index +1 <= path.length - 1) ? getCardinalOfAdjacentCoordinates(c, path[index+1]) : undefined;

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

function getValidMovesBetweenPoints(gameState:GameState, from:Coordinates, to:Coordinates):Coordinates[] {

  const array:Coordinates[] = [];

  if(from.y == to.y && from.x != to.x){
    const direction = ((from.x-to.x) > 0) ? (-1) : 1;
    for(let i = from.x + direction ; i != to.x + direction; i+=direction){
      array.push({x: (i), y: from.y});
    }
  }

  if(from.x == to.x && from.y != to.y){
    const direction = ((from.y-to.y) > 0) ? (-1) : 1;
    for(let i = from.y + direction; i != to.y + direction; i+=direction){
      array.push({y: (i), x: from.x});
    }
  }

  //Assumes we're trying to move into an empty space
  for(const c of array){
    const tile = gameState.tiles[getTileKey(c)];
    if(tile == undefined || tile.guess !== undefined){
      return [];
    }
  }

  return array;
}

function coordinateInDirection(startCoordinates: Coordinates, direction:Cardinal):Coordinates{
  switch(direction){
  case(Cardinal.North):
    return {x:startCoordinates.x, y: startCoordinates.y - 1}; 
  case(Cardinal.South):
    return {x:startCoordinates.x, y: startCoordinates.y + 1}; 
  case(Cardinal.East):
    return {x:startCoordinates.x + 1, y: startCoordinates.y}; 
  case(Cardinal.West):
    return {x:startCoordinates.x - 1, y: startCoordinates.y}; 
  }
}

export enum Cardinal{
  North,
  South,
  East,
  West
}

export { getTileKey, getGameStateFromSetup, tryMove, getTileTypeForPathIndex, isGameOver, getValidMovesBetweenPoints, tryMoveInDirection};