import React, { useEffect, useState } from 'react';

function GridTile(props:GridTileProps) {

  const leftPos = `calc(5em * ${props.tile.x - props.longestWord/2} + 50%)`;
  const topPos = `calc(5em * ${props.tile.y})`;

  function onClick(){
    console.log(props.tile.value, ', ', props.tile.x, ', ', props.tile.y);
  }
    
  return (
    <button className='tile' onClick={onClick} style={{position: 'absolute', left: leftPos, top: topPos}}>
      {props.tile.value}
    </button>
  );
}

export default GridTile;

export type Tile = {
  value: string | undefined,
  x: number,
  y: number
}

interface GridTileProps {
  tile:Tile,
  longestWord: number
}