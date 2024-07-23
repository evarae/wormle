import { GameWithDate } from '../types/types';
import defaultGame from './defaultGame.json';

export const demoData:GameWithDate = 
{date:"2000-01-02", 
  game: {
    words:[
    {text:"north",offset:0},
    {text:"south",offset:0},
    {text:"east",offset:0},
    {text:"west",offset:1}
  ],
    pathString:"northhtuoseawestst",
    startCoordinates:{x:0,y:0},
    theme:"A Demonstration of Direction"
  }}

export async function getData():Promise<GameWithDate> {
  try {
    const response = await fetch('data/game.json');
    const data = await response.json();
    return data as GameWithDate;
  } catch (err) {
    return defaultGame;
  }
}