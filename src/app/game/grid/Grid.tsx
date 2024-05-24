import React, { useRef, useState, useEffect, useMemo } from 'react';
import { TileType, Coordinates, GameState, Tile } from '../../../types/types';
import { getTileKey, getTileTypeForPathIndex } from '../GameEngine';
import GridTile, { GridTileProps } from '../tiles/GridTile';
import InvisibleTile from '../tiles/InvisibleTile';

export default function Grid(props:GridProps){
  const textInputRefs = useRef<Record<string, HTMLButtonElement>>({});
  const [pathTileTypes, setPathTileTypes] = useState<Record<string, TileType>>({});
  
  function refocusPath() {
    if (props.gameState.path.length > 0) {
      const ref =
          textInputRefs.current[
            getTileKey(props.gameState.path[props.gameState.path.length - 1])
          ];
      if (ref !== undefined) {
        ref.focus();
      }
    }
  }
  
  useEffect(() => {
    if(!props.isReadOnly){
      refocusPath();
    }
  }, [props.gameState]);
  
  function getTileTypeFromCoordinates(coordinates: Coordinates): TileType {
    const type = pathTileTypes[getTileKey(coordinates)];
    if (type === undefined) {
      return TileType.Empty;
    }
    return type;
  }
  
  //Maintains the snake tile types when the path changes
  useEffect(() => {
    const newRecord: Record<string, TileType> = {};
    const path = props.gameState.path;
  
    path.forEach((c, index) => {
      newRecord[getTileKey(c)] = getTileTypeForPathIndex(
        index,
        props.gameState
      );
    });
  
    setPathTileTypes(newRecord);
  }, [props.gameState]);
  
  const renderedTiles = useMemo(() => {
    const wordElements = [];
      
  
    for (let j = 0; j < props.gameState.gridSize.y; j++) {
      const tileElements = [];
    
      for (let i = 0; i < props.gameState.gridSize.x; i++) {
        const t = props.gameState.tiles[getTileKey({ x: i, y: j })];
        if (t !== undefined) {
          const tileProps:GridTileProps = props.isReadOnly? 
            {isReadOnly: true, tile: t, tileType: getTileTypeFromCoordinates(t.coordinates)} :
            {isReadOnly: false, tile: t, tileType: getTileTypeFromCoordinates(t.coordinates), onClickCallback: props.tileOnClickCallback};
  
          tileElements.push(
            <GridTile {...tileProps} ref={(ref) => textInputRefs.current[getTileKey(t.coordinates)] = ref!}/>
          );
        } else {
          tileElements.push(<InvisibleTile key={getTileKey({ x: i, y: j })} />);
        }
      }
    
      const mod = j % 3;
      wordElements.push(
        <div
          key={j}
          className={`word-container ${
            mod == 0? 'tile-color-1'
              : mod == 1
                ? 'tile-color-2'
                : 'tile-color-3'
          }`}
        >
          {tileElements}
        </div>
      );
    }
  
    return wordElements;
  }, [props.gameState, pathTileTypes]);
  
  return (<div className="gameGridContainer">{renderedTiles}</div>);
}
  
  
  type GridProps = {
    gameState: GameState,
    isReadOnly: true
  } | {
    gameState: GameState,
    isReadOnly: false,
    tileOnClickCallback: (tile: Tile) => void
  }
  