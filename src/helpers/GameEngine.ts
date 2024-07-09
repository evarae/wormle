import { Coordinates, GameSetup, GameState, Tile, Word } from '../types/types';

function getGameStateFromSetup(gameSetup:GameSetup):GameState{
  return({
    gridSize: getGridSize(gameSetup.words),
    tiles: createTileDictionary(gameSetup.words, gameSetup.startCoordinates),
    pathLetters: gameSetup.pathString.split(''),
    path: [gameSetup.startCoordinates],
    moveCount: 0
  });
}

function getGridSize(words: Word[]): Coordinates {
  let maxWidth = 0;

  words.forEach((word) => {
    const wordWidth = word.offset + word.text.length;
    maxWidth = wordWidth > maxWidth ? wordWidth : maxWidth;
  });

  return {x: maxWidth, y: words.length};
}

function tryMoveInDirection(state: GameState, direction:Cardinal, setGameState: (newGameState: GameState) => void) : void {
const headCoords = (state.path.length > 0)? state.path[state.path.length-1] : undefined;
  if(headCoords == undefined){
    return;
  }

  const newCoords = coordinateInDirection(headCoords, direction);
  const head1Coords = (state.path.length > 1)? state.path[state.path.length-2] : undefined;
  const isMovingBackwards = (head1Coords != undefined && areCoordinatesEqual(newCoords, head1Coords));

  const tileAtCoordinate = state.tiles[getTileKey(newCoords)];
  
  if(!(isMovingBackwards) && (tileAtCoordinate == undefined || tileAtCoordinate.guess != undefined)){
    return;
  }

  tryMove(state, setGameState, newCoords);
  return;
}

function tryMove(state: GameState, setGameState: (newGameState: GameState) => void, move: Coordinates) : void {
  const moveKey = getTileKey(move);
  const tileAtCoordinate = state.tiles[moveKey];
  const lastTileCoords = (state.path.length > 0)? state.path[state.path.length-1] : undefined;

  //Check we aren't trying to move outside the grid
  if(tileAtCoordinate == undefined || lastTileCoords == undefined){
    return;
  }

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

  const path = getValidMovesBetweenPoints(state, lastTileCoords, move);

  path.forEach(c => {
    state = moveForward(state, c);
  });

  setGameState(state);
}

function moveForward(currentGameState: GameState, move: Coordinates) : GameState {
  const state = JSON.parse(JSON.stringify(currentGameState));
  const guessLetter = state.pathLetters[state.path.length];
  const tileAtCoordinate = state.tiles[getTileKey(move)];

  const partialRecord : Record<string, Tile> = {};
  partialRecord[getTileKey(move)] = { ...tileAtCoordinate, guess: guessLetter};

  state.tiles = {...state.tiles, ...partialRecord};
  state.path = [...state.path, move];
  state.moveCount ++;

  return state;
}

function moveBackward(currentGameState: GameState, move: Coordinates) : GameState {
  const state = JSON.parse(JSON.stringify(currentGameState));
  const tileAtCoordinate = state.tiles[getTileKey(move)];

  const partialRecord : Record<string, Tile> = {};
  partialRecord[getTileKey(move)] = { ...tileAtCoordinate, guess: undefined};

  state.tiles = {...state.tiles, ...partialRecord};
  state.path.pop();
  
  return state;
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

export { getTileKey, getGameStateFromSetup, tryMove, isGameOver, getValidMovesBetweenPoints, tryMoveInDirection};