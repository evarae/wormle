import { GameSetup } from '../types/types';
import defaultGame from './defaultGame.json';

export const demoData:GameSetup = {
  words: [{offset: 0, text: 'cat'}, {offset: 0, text: 'dog'}],
  pathString: 'godcat',
  startWord: 1,
  startLetter: 2,
  theme: 'Furry friends'
};

export async function getData():Promise<GameSetup> {
  const response = await fetch('data/game.json');
  try {
    const data = await response.json();
    console.log(data);
    return data as GameSetup;
  } catch (err) {
    console.log(err);
    return defaultGame;
  }
}