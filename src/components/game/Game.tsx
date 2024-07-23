import React, { useEffect, useMemo, useRef, useState } from "react";
import { GameState, Tile } from "../../types/types";
import {
  Cardinal,
  isGameOver,
  NUMBER_OF_HINTS,
  resetPath,
  tryMove,
  tryMoveInDirection,
  TrySetHint,
} from "../../helpers/GameEngine";
import Grid from "./grid/Grid";
import "./Game.css";
import Path from "./grid/Path";
import { Button } from "@mui/material";

const Game = (props: Props) => {
  const hintButtonId = "hintButton";
  const [gameOver, setGameOver] = useState(false);
  const [isChoosingHint, setIsChoosingHint] = useState(false);
  const isChoosingHintRef = useRef(isChoosingHint);

  useEffect(() => {
    isChoosingHintRef.current = isChoosingHint;
  }, [isChoosingHint]);

  const clickListenerFunction = (event: MouseEvent | TouchEvent) => {
    const target = event.target as HTMLElement;
    const isClickingHintButton = target && target.id === hintButtonId;

    if (!isClickingHintButton && isChoosingHintRef.current.valueOf()) {
      setIsChoosingHint(false);
    }
  };

  useEffect(() => {
    document.addEventListener("touchstart", clickListenerFunction);
    document.addEventListener("click", clickListenerFunction);
    return () => {
      document.removeEventListener("click", clickListenerFunction);
      document.removeEventListener("touchstart", clickListenerFunction);
    };
  }, []);

  function tileOnClickCallback(tile: Tile) {
    if (isChoosingHint) {
      TrySetHint(tile.coordinates, props.gameState, props.setGameState);
      return;
    }

    tryMove(props.gameState, props.setGameState, tile.coordinates);
  }

  function resetButtonOnClick() {
    resetPath(props.gameState, props.setGameState);
  }

  useEffect(() => {
    if (isGameOver(props.gameState)) {
      setGameOver(true);
    } else if (gameOver) {
      setGameOver(false);
    }
  }, [props.gameState]);

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (isChoosingHint) {
      setIsChoosingHint(false);
    }
    let direction = undefined;

    switch (event.code) {
      case "ArrowRight":
        direction = Cardinal.East;
        break;
      case "ArrowLeft":
        direction = Cardinal.West;
        break;
      case "ArrowDown":
        direction = Cardinal.South;
        break;
      case "ArrowUp":
        direction = Cardinal.North;
    }

    if (direction === undefined) {
      return;
    }

    tryMoveInDirection(props.gameState, direction, props.setGameState);
  };

  function useHintOnClick() {
    if (props.gameState.hintsRemaining > 0) {
      setIsChoosingHint(true);
    }
  }

  const hints = useMemo(() => {
    const initialHints = NUMBER_OF_HINTS;
    const hintsRemaining = props.gameState.hintsRemaining;
    const hintsUsed = initialHints - hintsRemaining;

    const hintElements = [];

    for (let i = 1; i <= initialHints; i++) {
      if (i <= hintsUsed) {
        hintElements.push(
          <div className="hint-indicator used">
            <div className="used" />
          </div>
        );
      } else {
        hintElements.push(
          <div className="hint-indicator unused">
            <div className="unused" />
          </div>
        );
      }
    }
    return hintElements;
  }, [props.gameState.hintsRemaining]);

  return (
    <div onKeyDown={handleKeyDown}>
      <Grid
        setGameState={props.setGameState}
        gameState={props.gameState}
        isReadOnly={gameOver}
        tileOnClickCallback={tileOnClickCallback}
        isChoosingHint={isChoosingHint}
      />
      <div className="path-container">
        <Path gameState={props.gameState} />
      </div>
      <div className="hint-container">
        {hints}
        <Button
          variant="outlined"
          size="small"
          id={hintButtonId}
          onClick={useHintOnClick}
          disabled={props.gameState.hintsRemaining < 1}
        >
          Use Hint
        </Button>
        <Button
          variant="outlined"
          size="small"
          onClick={resetButtonOnClick}
          disabled={props.gameState.path.length <= 1}
        >
          Reset Tiles
        </Button>
        {props.realGameOnClick && (
          <Button
            variant="outlined"
            size="small"
            onClick={props.realGameOnClick}
          >
            Try the real game
          </Button>
        )}
      </div>
    </div>
  );
};

interface Props {
  gameState: GameState;
  setGameState: (newGameState: GameState) => void;
  realGameOnClick?: () => void;
}

export default Game;
