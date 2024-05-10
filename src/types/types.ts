export type Tile = {
    value: string | undefined,
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

export type Snake = {
    initialLetters: string[],
    lettersRemaining: string[],
  }