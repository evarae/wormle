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
    return <span className="tile-letter">{getLetter()}</span>;
  };

  const getLetter = () => {
    if (props.tile.guess) {
      return props.tile.guess;
    }

    if (props.previewString) {
      return props.previewString;
    }

    if (props.tile.hint) {
      return props.tile.value;
    }

    if (props.isHintPreview) {
      return "?";
    }

    return "";
  };

  const previewSnake =
    props.previewString && props.previewTileType ? (
      snakeElement(props.previewTileType, true)
    ) : (
      <></>
    );

  const isHintWrong =
    (props.tile.guess && props.tile.value !== props.tile.guess) ||
    (props.previewString && props.tile.value !== props.previewString);
  const hint =
    props.tile.hint || props.isHintPreview ? (
      <div
        className={`snake-head hint snake-preview${
          isHintWrong ? " hint-wrong" : ""
        }`}
      ></div>
    ) : (
      <></>
    );

  const gridContent = (
    <>
      <div className="inner-square coloured-tile">{letterDisplay()}</div>
      {previewSnake}
      {props.tileType == TileType.Empty ? <></> : snakeElement(props.tileType)}
      {hint}
    </>
  );

  const ariaLabel = `coordinate ${props.tile.coordinates.x + 1}, ${
    props.tile.coordinates.y + 1
  }, guess ${props.tile.guess ?? "none"}`;

  return props.isReadOnly ? (
    <td aria-label={ariaLabel} className="tile">
      {gridContent}
    </td>
  ) : (
    <button
      aria-label={ariaLabel}
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
      isHintPreview?: boolean;
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
      isHintPreview?: boolean;
    };

export default GridTile;
