import React, { forwardRef, useMemo } from "react";
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

  const getLetter = () => {
    if (props.isHintPreview && props.tile.guess && !props.tile.hint) {
      return "?";
    }

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

  const letterDisplay = <span className="tile-letter">{getLetter()}</span>;

  const previewSnake = useMemo(() => {
    return props.previewString && props.previewTileType ? (
      getSnakeElement(props.previewTileType, true)
    ) : (
      <></>
    );
  }, [props.previewString, props.previewTileType]);

  const guessSnake = useMemo(() => {
    return props.tileType == TileType.Empty ? (
      <></>
    ) : (
      getSnakeElement(props.tileType)
    );
  }, [props.tileType]);

  const hint = useMemo(() => {
    const isHintWrong =
      (props.isHintPreview && props.tile.guess) ||
      (props.tile.guess && props.tile.value !== props.tile.guess) ||
      (props.previewString && props.tile.value !== props.previewString);
    return props.tile.hint || props.isHintPreview ? (
      <div
        className={`snake-head hint snake-preview${
          isHintWrong ? " hint-wrong" : ""
        }`}
      />
    ) : (
      <></>
    );
  }, [props.tile.hint, props.isHintPreview]);

  const tapIndicator = useMemo(() => {
    const showHintTapIndicator =
      props.isHintTapIndicator &&
      !props.tile.hint &&
      !props.previewString &&
      !props.isHintPreview &&
      !props.tile.guess;

    return (
      <div
        className={`hintTapIndicator ${showHintTapIndicator ? "" : "hidden"}`}
      />
    );
  }, [props.isHintPreview, props.tile.hint, props.isHintTapIndicator]);

  const ariaLabel = useMemo(
    () =>
      `coordinate ${props.tile.coordinates.x + 1}, ${
        props.tile.coordinates.y + 1
      }, guess ${props.tile.guess ?? "none"}`,
    [props.tile.guess]
  );

  return props.isReadOnly ? (
    <td aria-label={ariaLabel} className="tile">
      <div className="inner-square coloured-tile">{letterDisplay}</div>
      {previewSnake}
      {guessSnake}
      {hint}
      {tapIndicator}
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
      <div className="inner-square coloured-tile">{letterDisplay}</div>
      {previewSnake}
      {guessSnake}
      {hint}
      {tapIndicator}
    </button>
  );
});

GridTile.displayName = "GridTile";

const getSnakeElement = (tileType: TileType, isPreview = false) => {
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

export type GridTileProps =
  | {
      isReadOnly: true;
      tile: Tile;
      tileType: TileType;
      previewString?: string;
      previewTileType?: TileType;
      isHintPreview?: boolean;
      isHintTapIndicator?: boolean;
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
      isHintTapIndicator?: boolean;
    };

export default GridTile;
