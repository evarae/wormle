import React from "react";
import { Typography } from "@mui/material";
import { PostStatisticResponseBody } from "../../helpers";

export function Statistics(props: Props) {
  const countPlayerBeatOnTime =
    props.statisticPostData.secondsToCompleteBetterThanCount;
  const countPlayerBeatOnMoves =
    props.statisticPostData.moveCountBetterThanCount;
  const playerCount = props.statisticPostData.playerCount;
  const usedMinimum = props.moves === props.minMoves && props.hintsUsed == 0;

  const timePercentile = Math.floor(
    (1 - countPlayerBeatOnTime / playerCount) * 100
  );
  const movesPercentile = Math.floor(
    (1 - countPlayerBeatOnMoves / playerCount) * 100
  );

  const movesPercentileText =
    movesPercentile <= 50 || usedMinimum
      ? `top ${movesPercentile}%*`
      : "bottom 50%*";

  const timePercentileText =
    timePercentile <= 50 ? `top ${timePercentile}%` : "bottom 50%";

  const winMessage = getWinMessage(
    countPlayerBeatOnTime,
    countPlayerBeatOnMoves,
    playerCount,
    usedMinimum
  );

  return (
    <div className="statistics">
      <div className="padding-top padding-bottom">
        <table>
          <tbody>
            <tr>
              <th scope="row">{`Hints used`}</th>
              <td>{props.hintsUsed}</td>
              <td></td>
            </tr>
            <tr>
              <th scope="row">{`Moves (minimum ${props.minMoves})`}</th>
              <td>{props.moves}</td>
              <td>{movesPercentileText}</td>
            </tr>
            <tr>
              <th scope="row">Time (seconds)</th>
              <td>{props.seconds}</td>
              <td>{timePercentileText}</td>
            </tr>
          </tbody>
        </table>
      </div>
      <Typography textAlign={"center"}>{winMessage}</Typography>
      <Typography
        textAlign={"center"}
        className="info-text-container padding-top padding-bottom"
      >
        *You are ranked first on number of hints used, then number of moves. You
        outrank anyone who used more hints than you.
      </Typography>
    </div>
  );
}

interface Props {
  seconds: number;
  moves: number;
  minMoves: number;
  hintsUsed: number;
  statisticPostData: PostStatisticResponseBody;
}

function getWinMessage(
  countPlayerBeatOnTime: number,
  countPlayerBeatOnMoves: number,
  playerCount: number,
  usedMinimum: boolean
): string {
  const timePercentile = Math.floor(
    (1 - countPlayerBeatOnTime / playerCount) * 100
  );
  const movesPercentile = Math.floor(
    (1 - countPlayerBeatOnMoves / playerCount) * 100
  );

  const bestOnTime = countPlayerBeatOnTime == playerCount - 1;

  if (playerCount < 2) {
    return "The early birdle gets the wormle. You're the first to finish today!";
  }

  //BEST TIME

  if (bestOnTime && usedMinimum) {
    return "A perfect game, and you're today's fastest wormle player so far!";
  }

  if (bestOnTime && movesPercentile > 50) {
    return "You're today's fastest wormle player so far!";
  }

  if (bestOnTime) {
    return "You're today's fastest wormle player so far, but can you improve your accuracy?";
  }

  //MIN MOVES

  if (usedMinimum && timePercentile <= 10) {
    return "You're a wormle elite!";
  }

  if (usedMinimum && timePercentile <= 25) {
    return "You're getting good at this!";
  }

  if (usedMinimum && timePercentile == 69) {
    return "Nice!";
  }

  if (usedMinimum) {
    return "Slow and steady wins the race!";
  }

  //SPEED
  if (timePercentile <= 10 && movesPercentile <= 50) {
    return "That was fast, but you need to work on your accuracy!";
  }

  if (timePercentile <= 10) {
    ("Slow down, button masher!");
  }

  return "Not bad, but there's always room for improvement.";
}
