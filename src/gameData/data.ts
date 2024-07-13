import { GameWithDate } from '../types/types';
import defaultGame from './defaultGame.json';

export const demoData:GameWithDate = 
{
  date: "",
  game: {

  words: [{offset: 0, text: 'cat'}, {offset: 0, text: 'dog'}],
  pathString: 'godcat',
  startCoordinates: {x:2, y:1},
  theme: 'Furry friends',
}};

export async function getData():Promise<GameWithDate> {
  try {
    const response = await fetch('data/game.json');
    const data = await response.json();
    return data as GameWithDate;
  } catch (err) {
    return defaultGame;
  }
}