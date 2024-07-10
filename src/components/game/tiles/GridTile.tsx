import React, { forwardRef } from "react";
import { TileType, Tile } from "../../../types/types";
import "../grid/Grid.css";
import { getClassFromTileType } from "../../../helpers/tileTypeHelper";

const GridTile = forwardRef<HTMLButtonElement, GridTileProps>((props, ref) => {
  function onClick() {
    if (!props.isReadOnly) {
      props.onClickCallback(props.tile);
    }
  }
  function onMouseEnter() {
    if (!props.isReadOnly) {
      props.onMouseEnter(props.tile);
    }
  }

  function onMouseLeave() {
    if (!props.isReadOnly) {
      props.onMouseLeave();
    }
  }

  const snakeElement = (tileType: TileType, isPreview = false) => {
    switch (tileType) {
      case TileType.Empty:
        return <></>;
      case TileType.CornerNorthEast:
      case TileType.CornerNorthWest:
      case TileType.CornerSouthEast:
      case TileType.CornerSouthWest:
        return (
          <div
            className={`snake-head ${
              isPreview ? "snake-preview" : ""
            } ${getClassFromTileType(tileType)}`}
          >
            <div className="corner">
              <div className="inner-corner" />
            </div>
          </div>
        );
      default:
        return (
          <div
            className={`snake-head ${
              isPreview ? "snake-preview" : ""
            } ${getClassFromTileType(tileType)}`}
          />
        );
    }
  };

  const letterDisplay = () => {
    const letter = props.tile.guess ? props.tile.guess : props.previewString;
    return <span className="tile-letter">{letter}</span>;
  };

  const gridContent = (
    <>
      <div className="inner-square coloured-tile">{letterDisplay()}</div>
      {props.previewString && props.previewTileType ? (
        snakeElement(props.previewTileType, true)
      ) : (
        <></>
      )}
      {props.tileType == TileType.Empty ? <></> : snakeElement(props.tileType)}
    </>
  );

  return props.isReadOnly ? (
    <div className="tile">{gridContent}</div>
  ) : (
    <button
      className="tile"
      onClick={onClick}
      ref={ref}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      {gridContent}
    </button>
  );
});

GridTile.displayName = "GridTile";

export type GridTileProps =
  | {
      isReadOnly: true;
      tile: Tile;
      tileType: TileType;
      previewString?: string;
      previewTileType?: TileType;
    }
  | {
      isReadOnly: false;
      tile: Tile;
      tileType: TileType;
      onClickCallback: (tile: Tile) => void;
      onMouseEnter: (tile: Tile) => void;
      onMouseLeave: () => void;
      previewString?: string;
      previewTileType?: TileType;
    };

export default GridTile;
