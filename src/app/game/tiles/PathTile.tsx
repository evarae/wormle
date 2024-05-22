import React from 'react';
import '../Grid.css';

export default function PathTile(props:PathTileProps){

  return (
    <div className={`tile tile-path ${props.isUsed? 'tile-path-used':'tile-path-unused'} ${props.isHighlighted? 'tile-path-highlighted': ''}`}>
      {props.letter}
    </div>
  );
}
  
interface PathTileProps {
    isUsed:boolean,
    isHighlighted:boolean,
    letter:string
}