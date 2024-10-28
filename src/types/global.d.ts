export {};

declare global {
  interface Wormle {
    solvePuzzle: () => void;
  }

  interface Window {
    Wormle: Wormle;
  }
}