import React, { forwardRef } from 'react';
import { Tile } from '../types/types';

const GridTile = forwardRef<HTMLButtonElement, GridTileProps>((props, ref) => {
  
  const classNames = (props.tile.guess !== undefined) ? 'tile tile-grid tile-grid-enabled' : 'tile tile-grid tile-grid-disabled';
    
  function onClick(){
    props.onClickCallback(props.tile);
  }

  return (
    <button ref={ref} className={classNames} onClick={onClick}>
      {props.tile.guess}
    </button>
  );
});

GridTile.displayName = 'GridTile';

function EmptyTile(){
  return (
    <div className='tile'>
    </div>
  );
}

function PathTile(props:PathTileProps){

  return (
    <div className={`tile tile-path ${props.isUsed? 'tile-path-used':'tile-path-unused'} ${props.isHighlighted? 'tile-path-highlighted': ''}`}>
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
  isHighlighted:boolean,
  letter:string
}