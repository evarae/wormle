import React, { useMemo } from "react";
import { Box, Button, Modal, Typography } from "@mui/material";
import { GameState } from "../../types/types";
import Grid from "../game/grid/Grid";
import { formatDate } from "../../helpers/dateFormatter";
import { getPlayerStreakStatistics } from "../../helpers/statistics";
import "./WinModal.css";
import { PostRequestStatus } from "../App";
import CircularProgress from "@mui/material/CircularProgress";
import DonationLink from "./Donation";
import { NUMBER_OF_HINTS } from "../../helpers/GameEngine";

const MIN_PERCENTAGE_TO_DISPLAY = 50;

export default function WinModal(props: Props) {
  const minMoves = props.gameState.path.length - 1;

  const statisticMessage = useMemo(() => {
    const isMin = minMoves >= props.gameState.moveCount;
    const numHints = NUMBER_OF_HINTS - props.gameState.hintsRemaining;

    let moveCommentString =
      isMin && numHints === 0
        ? "Thats the minimum number possible!"
        : isMin
        ? ""
        : `The minimum possible was ${minMoves}.`;

    if (props.postRequestStatus && props.postRequestStatus.responseData) {
      const ratio =
        props.postRequestStatus.responseData.moveCountBetterThanCount /
        props.postRequestStatus.responseData.playerCount;
      const percent = Math.floor(ratio * 100);

      if (percent >= MIN_PERCENTAGE_TO_DISPLAY) {
        moveCommentString = isMin
          ? `That's the minimum number possible, better than ${percent}% of other players!`
          : `That's better than ${percent}% of other players.`;
      }
    }

    return (
      <Typography align="center" paddingTop={"8px"}>
        {`You finished the game in ${
          props.gameState.moveCount
        } moves, using ${numHints} hint${
          numHints === 1 ? "" : "s"
        }. ${moveCommentString}`}
      </Typography>
    );
  }, [
    props.postRequestStatus,
    props.gameState.path,
    props.gameState.moveCount,
  ]);

  const modalTopContent = (
    <>
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
    </>
  );

  const modalBottomContent = () => {
    if (props.isDemo) {
      return (
        <div className="center-button">
          <Button variant="outlined" onClick={props.tryRealGameOnClick}>
            Try the real game
          </Button>
        </div>
      );
    }

    if (props.postRequestStatus?.isError) {
      return (
        <div className="info-text-container">
          Error posting statistics. Please check your internet connection and
          ad-blocker settings.
        </div>
      );
    }

    if (props.postRequestStatus?.isLoading) {
      return (
        <Box sx={{ display: "flex" }}>
          <CircularProgress />
        </Box>
      );
    }

    return (
      <>
        {statisticMessage}
        <StatisticBlock />
      </>
    );
  };

  return (
    <Modal
      open={props.isOpen}
      onClose={props.onClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
      className="modal"
    >
      <Box>
        {modalTopContent}
        {modalBottomContent()}
        <DonationLink />
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
  tryRealGameOnClick: () => void;
  postRequestStatus?: PostRequestStatus;
}
