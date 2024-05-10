import React from 'react';
import { Tile } from '../types/types';

function GridTile(props:GridTileProps) {

  function onClick(){
    console.log(props.tile.value, ', ', props.tile.coordinates.x, ', ', props.tile.coordinates.y);
  }
    
  return (
    <button className='tile tile-enabled' onClick={onClick}>
      {props.tile.value}
    </button>
  );
}

function EmptyTile(){
  return (
    <div className='tile'>
    </div>
  );
}

export {GridTile, EmptyTile};

interface GridTileProps {
  tile:Tile
}