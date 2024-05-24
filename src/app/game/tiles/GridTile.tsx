import React, { forwardRef} from 'react';
import { TileType, Tile } from '../../../types/types';
import '../grid/Grid.css';
import { getClassFromTileType } from '../grid/GridDisplayHelpers';

const GridTile = forwardRef<HTMLButtonElement, GridTileProps>((props, ref) => {
  
  function onClick(){
    if(!props.isReadOnly){
      props.onClickCallback(props.tile);
    }
  }

  const snakeElement = () => {
    switch(props.tileType){
    case(TileType.Empty):
      return <></>;
    case(TileType.CornerNorthEast):
    case(TileType.CornerNorthWest):
    case(TileType.CornerSouthEast):
    case(TileType.CornerSouthWest):
      return (
        <div className={`snake-head ${getClassFromTileType(props.tileType)}`}>
          <div className='corner'>
            <div className='inner-corner'/>
          </div>
        </div>
      );
    default:
      return <div className={`snake-head ${getClassFromTileType(props.tileType)}`}/>;
    }
  };

  return (
    <div className='tile snake-container'>
      {
        (props.isReadOnly?(
          <div className='inner-square coloured-tile'>
            <span className='tile-letter' >{props.tile.guess}</span>
          </div>
        ):(
          <button className='inner-square coloured-tile' onClick={onClick} ref = {ref}>
            <span className='tile-letter' >{props.tile.guess}</span>
          </button>
        ))
      }
      {props.tileType == TileType.Empty? <></> : snakeElement()}
    </div>
  );
});

GridTile.displayName = 'GridTile';

export type GridTileProps = 
  | { 
      isReadOnly: true; 
      tile: Tile; 
      tileType: TileType; 
    }
  | { 
      isReadOnly: false; 
      tile: Tile; 
      tileType: TileType; 
      onClickCallback: (tile: Tile) => void; 
    };

export default GridTile;
