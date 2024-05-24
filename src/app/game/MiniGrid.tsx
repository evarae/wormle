import React, {useMemo} from 'react';
import './grid/Grid.css';
import InvisibleTile from './tiles/InvisibleTile';
import { GameState } from '../../types/types';
import { getTileKey} from './GameEngine';
import MiniTile from './tiles/MiniTile';

const MiniGrid = (props:Props) => {

  const gridElements = useMemo(() => {
    const wordElements = [];
    
    for(let j = 0; j < props.gameState.gridSize.y; j++){
      const tileElements =[];
    
      for(let i = 0; i < props.gameState.gridSize.x; i++){
        const t = props.gameState.tiles[getTileKey({x:i, y:j})];
        if(t !== undefined){
          tileElements.push(<MiniTile key = {getTileKey({x:i, y:j})} tile={t}/>);
        } else {
          tileElements.push(<InvisibleTile key = {getTileKey({x:i, y:j})}/>);
        }
      }
    
      const mod = j%3;
      wordElements.push(
        <div key = {j} className={`word-container ${mod == 0 ? 'tile-color-1': (mod == 1 ? 'tile-color-2': 'tile-color-3')}`}>
          {tileElements}
        </div>);
    }
    
    return(wordElements);
    
  }, [props.gameState]);

  return (
    <div className='gameGridContainer'>
      {gridElements}
    </div>);
};

interface Props{
  gameState: GameState;
}

export default MiniGrid;
