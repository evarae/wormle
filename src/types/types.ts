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

export type Snake = {
    initialLetters: string[],
    lettersUsed: number
  }