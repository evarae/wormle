export type Tile = {
    guess?: string,
    hint?: boolean,
    value: string,
    coordinates: Coordinates
}

export type GameWithDate = {
    date: string,
    game: GameSetup
}

export type GameSetup = {
    words: Word[],
    pathString: string,
    startCoordinates: Coordinates,
    theme: string,
}

export type GameState = {
    gridSize: Coordinates,
    tiles: Record<string, Tile>,
    pathLetters: string[],
    path: Coordinates[],
    moveCount: number,
    hintsRemaining: number
}
  
export type Word = {
    text: string,
    offset: number
}

export type Coordinates = {
    x: number,
    y: number
}

export enum TileType {
    Head,
    HeadNorth,
    HeadEast,
    HeadSouth,
    HeadWest,
    Horizontal,
    Vertical,
    CornerNorthEast,
    CornerNorthWest,
    CornerSouthEast,
    CornerSouthWest,
    Empty
}