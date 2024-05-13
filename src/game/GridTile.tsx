import React from 'react';
import { Tile } from '../types/types';

function GridTile(props:GridTileProps) {
  
  const classNames = (props.tile.guess !== undefined) ? 'tile tile-grid tile-grid-enabled' : 'tile tile-grid tile-grid-disabled';
    
  function onClick(){
    props.onClickCallback(props.tile);
  }

  return (
    <button className={classNames} onClick={onClick}>
      {props.tile.guess}
    </button>
  );
}

function EmptyTile(){
  return (
    <div className='tile'>
    </div>
  );
}

function PathTile(props:PathTileProps){

  return (
    <div className={props.isUsed? 'tile tile-path tile-path-used':'tile tile-path tile-path-unused'}>
      {props.letter}
    </div>
  );
}

export {GridTile, EmptyTile, PathTile};

interface GridTileProps {
  onClickCallback: (tile:Tile) => void,
  tile:Tile
}

interface PathTileProps {
  isUsed:boolean,
  letter:string
}