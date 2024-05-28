import React, { useRef, useState, useEffect, useMemo } from 'react';
import { TileType, Coordinates, GameState, Tile } from '../../../types/types';
import { getTileKey, getTileTypeForPathIndex, getValidMovesBetweenPoints } from '../GameEngine';
import GridTile, { GridTileProps } from '../tiles/GridTile';
import InvisibleTile from '../tiles/InvisibleTile';

export default function Grid(props:GridProps){
  const textInputRefs = useRef<Record<string, HTMLButtonElement>>({});
  const [hoveredCoordinates, setHoveredCoordinates] = useState<Coordinates>();
  
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
  
  function onMouseEnter(tile:Tile){
    setHoveredCoordinates(tile.coordinates);
  }

  function onMouseLeave(){
    setHoveredCoordinates(undefined);
  }

  //Refocuses when the path changes
  useEffect(() => {
    if(!props.isReadOnly){
      refocusPath();
    }
  }, [props.gameState]);
      
  const renderedTiles = useMemo(() => {
    const displayModifiers: Record<string, TileDisplayMod> = {};

    //Set tile types
    if(props.gameState.path !== undefined){
      props.gameState.path.forEach((c, index) => {
        displayModifiers[getTileKey(c)] = {tileType: getTileTypeForPathIndex(index, props.gameState.path)};
      });
    }

    //Set preview tile stuff
    if(hoveredCoordinates !== undefined && props.gameState.path !== undefined){
      const previewPath = getValidMovesBetweenPoints(props.gameState, props.gameState.path[props.gameState.path.length-1], hoveredCoordinates);
      console.log('preview path: ', previewPath);

      previewPath.forEach((c, index) => {
        displayModifiers[getTileKey(c)] = {...displayModifiers[getTileKey(c)], previewTileType: getTileTypeForPathIndex(index, previewPath), previewString: props.gameState.pathLetters[props.gameState.path.length -1 + index]};
      });
    }
    
    const wordElements = [];
  
    for (let j = 0; j < props.gameState.gridSize.y; j++) {
      const tileElements = [];
    
      for (let i = 0; i < props.gameState.gridSize.x; i++) {
        const t = props.gameState.tiles[getTileKey({ x: i, y: j })];
        let mods = displayModifiers[getTileKey({ x: i, y: j })];

        if(mods == undefined){
          mods = {tileType: TileType.Empty};
        }

        if (t !== undefined) {
          const tileProps:GridTileProps = props.isReadOnly? 
            {isReadOnly: true, tile: t, ...mods} :
            {isReadOnly: false, tile: t, onClickCallback: props.tileOnClickCallback, onMouseEnter: onMouseEnter, onMouseLeave:onMouseLeave, ...mods};
  
          tileElements.push(
            <GridTile {...tileProps} ref={(ref) => textInputRefs.current[getTileKey(t.coordinates)] = ref!}/>
          );
        } else {
          tileElements.push(<InvisibleTile key={getTileKey({ x: i, y: j })} />);
        }
      }
    
      wordElements.push(
        <div key={j} className={`word-container tile-color-${(j%3)+1}`}>
          {tileElements}
        </div>
      );
    }
  
    return wordElements;
  }, [props.gameState, hoveredCoordinates]);
  
  return (<div className={`grid-container grid-container-${props.gridSize?? 'large'}`}>{renderedTiles}</div>);
}

  type TileDisplayMod = {
    tileType:TileType,
    previewString?:string,
    previewTileType?:TileType
  }

  type GridProps = {
    gridSize?:GridSize
    gameState: GameState,
    isReadOnly: true
  } | {
    gridSize?:GridSize
    gameState: GameState,
    isReadOnly: false,
    tileOnClickCallback: (tile: Tile) => void
  }

  type GridSize = 'large' | 'small'
  