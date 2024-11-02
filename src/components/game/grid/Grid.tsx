import React, { useRef, useState, useEffect, useMemo } from "react";
import { TileType, Coordinates, GameState, Tile } from "../../../types/types";
import {
  areCoordinatesEqual,
  getTileKey,
  getValidMovesBetweenPoints,
} from "../../../helpers/GameEngine";
import GridTile, { GridTileProps } from "../tiles/GridTile";
import InvisibleTile from "../tiles/InvisibleTile";
import { getTileTypeForPathIndex } from "../../../helpers/tileTypeHelper";

export default function Grid(props: GridProps) {
  const textInputRefs = useRef<Record<string, HTMLButtonElement>>({});
  const [hoveredCoordinates, setHoveredCoordinates] =
    useState<Coordinates | null>(null);

  function refocusPath() {
    if (props.gameState.path.length > 0) {
      const ref =
        textInputRefs.current[
          getTileKey(props.gameState.path[props.gameState.path.length - 1])
        ];
      if (ref) {
        ref.focus();
      }
    }
  }

  function onClickCallback(tile: Tile) {
    setHoveredCoordinates(null);
    if (!props.isReadOnly) {
      props.tileOnClickCallback(tile);
    }
  }

  function onMouseEnter(tile: Tile) {
    setHoveredCoordinates(tile.coordinates);
  }

  function onMouseLeave() {
    setHoveredCoordinates(null);
  }

  //Refocuses when the path changes
  useEffect(() => {
    if (!props.isReadOnly) {
      refocusPath();
    }
  }, [props.gameState, props.isReadOnly]);

  const renderedTiles = useMemo(() => {
    const displayModifiers: Record<string, TileDisplayMod> = {};

    //Set tile types
    if (props.gameState.path) {
      props.gameState.path.forEach((c, index) => {
        displayModifiers[getTileKey(c)] = {
          tileType: getTileTypeForPathIndex(index, props.gameState.path),
        };
      });
    }

    //Set hint preview
    if (!props.isReadOnly && props.isChoosingHint && hoveredCoordinates) {
      const hoveredKey = getTileKey(hoveredCoordinates);
      if (!areCoordinatesEqual(props.gameState.path[0], hoveredCoordinates)) {
        displayModifiers[hoveredKey] = {
          ...displayModifiers[hoveredKey],
          isHintPreview: true,
        };
      }
    }

    //Set preview tile stuff
    if (
      hoveredCoordinates &&
      props.gameState.path &&
      !props.isReadOnly &&
      !props.isChoosingHint
    ) {
      const lastPathCoordinate =
        props.gameState.path[props.gameState.path.length - 1];
      const previewPath = getValidMovesBetweenPoints(
        props.gameState,
        lastPathCoordinate,
        hoveredCoordinates
      );

      if (previewPath.length > 0) {
        previewPath.unshift(lastPathCoordinate);
      }
      previewPath.forEach((c, index) => {
        displayModifiers[getTileKey(c)] = {
          ...displayModifiers[getTileKey(c)],
          previewTileType: getTileTypeForPathIndex(index, previewPath),
          previewString:
            props.gameState.pathLetters[
              props.gameState.path.length - 1 + index
            ],
        };
      });
    }

    const wordElements = [];

    for (let j = 0; j < props.gameState.gridSize.y; j++) {
      const tileElements = [];

      for (let i = 0; i < props.gameState.gridSize.x; i++) {
        const t = props.gameState.tiles[getTileKey({ x: i, y: j })];
        let mods = displayModifiers[getTileKey({ x: i, y: j })];

        if (!mods) {
          mods = { tileType: TileType.Empty };
        }

        if (t) {
          const tileProps: GridTileProps = props.isReadOnly
            ? { isReadOnly: true, tile: t, ...mods }
            : {
                isReadOnly: false,
                tile: t,
                onClickCallback,
                onMouseEnter,
                onMouseLeave,
                isHintTapIndicator: props.isChoosingHint,
                ...mods,
              };

          tileElements.push(
            <td key={`grid-tile-${getTileKey(t.coordinates)}`}>
              <GridTile
                {...tileProps}
                ref={(ref) =>
                  (textInputRefs.current[getTileKey(t.coordinates)] = ref!)
                }
              />
            </td>
          );
        } else {
          tileElements.push(
            <td key={getTileKey({ x: i, y: j })}>
              <InvisibleTile />
            </td>
          );
        }
      }

      wordElements.push(
        <tr
          key={`grid-word-${j}`}
          className={`word-container tile-color-${(j % 3) + 1}`}
        >
          {tileElements}
        </tr>
      );
    }

    return wordElements;
  }, [
    props.gameState,
    hoveredCoordinates,
    props.isReadOnly,
    props.isChoosingHint,
  ]);

  return (
    <div
      className={`grid-container grid-container-${
        props.gridSize ?? "large"
      } puppeteer-target`}
    >
      <table cellSpacing="0" cellPadding="0" role="grid">
        <tbody>{renderedTiles}</tbody>
      </table>
    </div>
  );
}

type TileDisplayMod = {
  tileType: TileType;
  previewString?: string;
  previewTileType?: TileType;
  isHintPreview?: boolean;
};

type GridProps =
  | {
      gridSize?: GridSize;
      gameState: GameState;
      isReadOnly: true;
      isChoosingHint?: boolean;
    }
  | {
      gridSize?: GridSize;
      gameState: GameState;
      isReadOnly: false;
      isChoosingHint: boolean;
      setGameState: (newGameState: GameState) => void;
      tileOnClickCallback: (tile: Tile) => void;
    };

type GridSize = "large" | "medium" | "small" | "xsmall";
