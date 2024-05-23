import React from 'react';
import { Tile } from '../../../types/types';
import '../Grid.css';

export default function MiniTile(props:Props){

  return (
    <div className='mini-tile snake-container coloured-tile'>
      <span className='tile-letter' >{props.tile.value}</span>
    </div>
  );
}

interface Props {
  tile:Tile
}
