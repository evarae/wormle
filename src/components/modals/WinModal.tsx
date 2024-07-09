import React, { useMemo } from "react";
import { Box, Button, Modal, Typography } from "@mui/material";
import { GameState } from "../../types/types";
import Grid from "../game/grid/Grid";
import { formatDate } from "../../helpers/dateFormatter";
import { PostStatisticResponse } from "../../helpers/postStatistic";
import { getPlayerStreakStatistics } from "../../helpers/statistics";
import "./WinModal.css";

const MIN_PERCENTAGE_TO_DISPLAY = 50;

export default function WinModal(props: Props) {
  const minMoves = props.gameState.path.length - 1;

  const statisticMessage = useMemo(() => {
    const isMin = minMoves >= props.gameState.moveCount;

    let moveCommentString = isMin
      ? "Thats the minimum number possible!"
      : `The minimum possible was ${minMoves}.`;

    if (props.statisticResponse && props.statisticResponse.body) {
      const ratio =
        props.statisticResponse.body.moveCountBetterThanCount /
        props.statisticResponse.body.playerCount;
      const percent = Math.floor(ratio * 100);

      if (percent >= MIN_PERCENTAGE_TO_DISPLAY) {
        moveCommentString = isMin
          ? `That's the minimum number possible, better than ${percent}% of other players!`
          : `That's better than ${percent}% of other players.`;
      }
    }

    return (
      <Typography align="center" paddingTop={"8px"}>
        {`You finished the game in ${props.gameState.moveCount} moves. ${moveCommentString}`}
      </Typography>
    );
  }, [
    props.statisticResponse,
    props.gameState.path,
    props.gameState.moveCount,
  ]);

  return (
    <Modal
      open={props.isOpen}
      onClose={props.onClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
      className="modal"
    >
      <Box>
        <Typography id="modal-modal-title" variant="h5" component="h2">
          Nice work, you win!
        </Typography>
        <Typography id="modal-modal-description" sx={{ mt: 2 }}>
          {`${props.isDemo ? "The demo" : "Today's"} theme is:`}
        </Typography>
        <Typography variant="h6">{props.theme}</Typography>
        {!props.isDemo && (
          <Typography variant="body2" paddingBottom={"16px"}>
            {formatDate(props.date)}
          </Typography>
        )}
        <Grid gameState={props.gameState} isReadOnly={true} gridSize="small" />
        {statisticMessage}
        {!props.isDemo && <StatisticBlock />}
        {props.isDemo && (
          <div className="center-button">
            <Button variant="outlined" onClick={props.tryAgainOnClick}>
              Try the real game
            </Button>
          </div>
        )}
      </Box>
    </Modal>
  );
}

function StatisticBlock() {
  const stats = getPlayerStreakStatistics();

  return (
    <div className="statistic-block">
      <Statistic
        statisticName="Your streak"
        statisticNumber={stats.currentStreak}
      />
      <Statistic
        statisticName="Longest streak"
        statisticNumber={stats.longestStreak}
      />
      <Statistic
        statisticName="Games played"
        statisticNumber={stats.gamesPlayed}
      />
    </div>
  );
}

function Statistic(props: StatisticProps) {
  return (
    <div className="statistic-block-item">
      <Typography component="h3">{props.statisticName}</Typography>
      <Typography variant="h4" component="body">
        {props.statisticNumber}
      </Typography>
    </div>
  );
}

interface StatisticProps {
  statisticName: string;
  statisticNumber: number;
}

interface Props {
  isOpen: boolean;
  onClose: () => void;
  gameState: GameState;
  theme: string;
  date: string;
  isDemo?: boolean;
  tryAgainOnClick: () => void;
  statisticResponse?: PostStatisticResponse;
}
