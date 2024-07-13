import React, { useEffect, useState } from "react";
import { GameState, Tile, TileType } from "../../../types/types";
import GridTile from "../tiles/GridTile";
import "./Path.css";
import InvisibleTile from "../tiles/InvisibleTile";
import { isGameOver } from "../../../helpers/GameEngine";

export default function Path(props: Props) {
  const [animate, setAnimate] = useState(false);

  useEffect(() => {
    let delay = 0;
    const delayIncremenet = 0.02;

    for (let i = 0; i < props.gameState.pathLetters.length; i++) {
      const elms: NodeListOf<HTMLElement> = document.querySelectorAll(
        `[id='path-letter-${i}']`
      );
      elms.forEach((element) => {
        if (!animate) {
          element.style.animation = "";
          element.style.animationDelay = "";
        } else {
          element.style.animation = "0.7s 1 normal ease bounceUp";
          element.style.animationDelay = `${delay}s`;
          delay += delayIncremenet;
        }
      });
    }
  }, [animate]);

  useEffect(() => {
    if (isGameOver(props.gameState)) {
      setAnimate(true);
    } else {
      if (animate) {
        setAnimate(false);
      }
    }
  }, [props.gameState]);

  const mappedOverflowTiles = (rowLength: number) => {
    const words: JSX.Element[][] = [];
    const pathLength = props.gameState.path.length;
    const letterLength = props.gameState.pathLetters.length;

    let currentWord: JSX.Element[] = [];

    props.gameState.pathLetters.map((t, index) => {
      const mod = index % rowLength;
      const isReversed = words.length % 2 === 1;
      const isEndOfLine = mod === rowLength - 1;
      const isStartOfLine = mod === 0;

      const tile: Tile = {
        guess: t,
        value: t,
        coordinates: {
          x: 0,
          y: 0,
        },
      };

      let tileType = TileType.Empty;
      let className = "";

      if (index === letterLength - 1 && pathLength === letterLength - 1) {
        tileType = TileType.Head;
      } else if (index === letterLength - 1 && pathLength < letterLength) {
        if (isStartOfLine) {
          tileType = TileType.HeadNorth;
        } else {
          tileType = isReversed ? TileType.HeadEast : TileType.HeadWest;
        }
      } else if (index === pathLength) {
        if (isEndOfLine) {
          tileType = TileType.HeadSouth;
        } else {
          tileType = isReversed ? TileType.HeadWest : TileType.HeadEast;
        }
      } else if (index < letterLength - 1 && index > pathLength) {
        if (isEndOfLine) {
          tileType = isReversed
            ? TileType.CornerSouthEast
            : TileType.CornerSouthWest;
        } else if (isStartOfLine) {
          tileType = isReversed
            ? TileType.CornerNorthWest
            : TileType.CornerNorthEast;
        } else {
          tileType = TileType.Horizontal;
        }
      } else {
        className = "tile-path-empty";
      }

      const id = `path-letter-${index}`;
      currentWord.push(
        <div id={id} className={className} key={id}>
          <GridTile isReadOnly={true} tile={tile} tileType={tileType} />
        </div>
      );

      if ((index + 1) % rowLength == 0) {
        words.push(currentWord);
        currentWord = [];
      }
    });

    const numInvisibleTiles =
      letterLength <= rowLength ? 0 : rowLength - currentWord.length;

    for (let i = 0; i < numInvisibleTiles; i++) {
      currentWord.push(<InvisibleTile key={`path-letter-invisible-${i}`} />);
    }
    words.push(currentWord);

    return words.map((arr, index) => {
      if (index % 2 === 1) {
        arr.reverse();
      }
      return (
        <div
          key={`word-path-${index}`}
          className="word-container word-container-path"
        >
          {arr}
        </div>
      );
    });
  };

  return (
    <div className="grid-container grid-container-small">
      <div className="path-large">{mappedOverflowTiles(40)}</div>
      <div className="path-medium">{mappedOverflowTiles(15)}</div>
      <div className="path-small">{mappedOverflowTiles(10)}</div>
    </div>
  );
}

interface Props {
  gameState: GameState;
}
