import React from "react";
import { GameState, Tile, TileType } from "../../../types/types";
import GridTile from "../tiles/GridTile";
import "./Path.css";

export default function Path(props: Props) {
  const mappedTiles = props.gameState.pathLetters.map((t, index) => {
    const tile: Tile = {
      guess: t,
      value: t,
      coordinates: {
        x: 0,
        y: 0,
      },
    };
    const pathLength = props.gameState.path.length;
    const letterLength = props.gameState.pathLetters.length;

    let tileType = TileType.Empty;
    let className = "";

    if (index === letterLength - 1 && pathLength === letterLength - 1) {
      tileType = TileType.Head;
    } else if (index === letterLength - 1 && pathLength < letterLength) {
      tileType = TileType.HeadWest;
    } else if (index === pathLength) {
      tileType = TileType.HeadEast;
    } else if (index < letterLength - 1 && index > pathLength) {
      tileType = TileType.Horizontal;
    } else {
      className = "tile-path-empty";
    }

    return (
      <div className={className} key={t}>
        <GridTile isReadOnly={true} tile={tile} tileType={tileType} />
      </div>
    );
  });

  return (
    <div className="grid-container grid-container-small">
      <div className="word-container word-container-path">{mappedTiles}</div>
    </div>
  );
}

interface Props {
  gameState: GameState;
}
