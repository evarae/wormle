export type Tile = {
    guess: string | undefined,
    value: string,
    coordinates: Coordinates
}

export type GameSetup = {
    words: Word[]
    startWord: number
    startLetter: number
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