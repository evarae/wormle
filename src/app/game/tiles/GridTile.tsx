import React, { forwardRef} from 'react';
import { TileType, Tile } from '../../../types/types';
import '../Grid.css';

const GridTile = forwardRef<HTMLButtonElement, GridTileProps>((props, ref) => {
  
  function onClick(){
    props.onClickCallback(props.tile);
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
      <button className='inner-square' onClick={onClick} ref = {ref}>
        <span className='tile-letter' >{props.tile.guess}</span>
      </button>
      {props.tileType == TileType.Empty? <></> : snakeElement()}
    </div>
  );
});

GridTile.displayName = 'GridTile';

interface GridTileProps {
  onClickCallback: (tile:Tile) => void,
  tile:Tile,
  tileType: TileType
}

function getClassFromTileType(tileType: TileType){
  switch(tileType){
  case(TileType.Head):
    return 'end';
  case(TileType.HeadNorth):
    return 'north-end';
  case(TileType.HeadSouth):
    return 'south-end';
  case(TileType.HeadEast):
    return 'east-end';
  case(TileType.HeadWest):
    return 'west-end';
  case(TileType.Vertical):
    return 'vertical-through';
  case(TileType.Horizontal):
    return 'horizontal-through';
  case(TileType.CornerNorthEast):
    return 'bend north-east';
  case(TileType.CornerNorthWest):
    return 'bend north-west';
  case(TileType.CornerSouthEast):
    return 'bend south-east';
  case(TileType.CornerSouthWest):
    return 'bend south-west';
  default:
    return '';
  }
}

export default GridTile;
