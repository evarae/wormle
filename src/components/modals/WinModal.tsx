import React, { useEffect, useState } from "react";
import { Box, Button, Modal, Typography } from "@mui/material";
import { GameState } from "../../types/types";
import Grid from "../game/grid/Grid";
import { formatDate } from "../../helpers/dateFormatter";
import {
  getLastDayPlayed,
  getPlayerStreakStatistics,
} from "../../helpers/statistics";
import "./WinModal.css";
import { PostRequestStatus } from "../App";
import CircularProgress from "@mui/material/CircularProgress";
import DonationLink from "./Donation";
import { NUMBER_OF_HINTS } from "../../helpers/GameEngine";
import LeaderboardIcon from "@mui/icons-material/Leaderboard";
import { PostStatisticResponseBody } from "../../helpers/postStatistic";

export default function WinModal(props: Props) {
  const [showStatistics, setShowStatistics] = useState(false);

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
        <Typography variant="body2">{formatDate(props.date)}</Typography>
      )}
      {!showStatistics && (
        <div className="padding-small">
          <Grid
            gameState={props.gameState}
            isReadOnly={true}
            gridSize="small"
          />
        </div>
      )}
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

    if (showStatistics) {
      return (
        <>
          {props.postRequestStatus?.responseData &&
            !props.postRequestStatus.isLoading && (
              <Statistics
                hintsUsed={NUMBER_OF_HINTS - props.gameState.hintsRemaining}
                minMoves={props.gameState.path.length - 1}
                seconds={props.seconds}
                moves={props.gameState.moveCount}
                statisticPostData={props.postRequestStatus?.responseData}
              />
            )}
          <StreakGroup />
          <DonationLink />
        </>
      );
    }

    const showStatisticsButton =
      !props.isDemo && props.postRequestStatus?.responseData;

    return (
      <>
        {showStatisticsButton && (
          <div className="padding-bottom-small">
            <ShowStatisticsButton />
          </div>
        )}
        <StreakGroup />
        <DonationLink />
      </>
    );
  };

  function ShowStatisticsButton() {
    return (
      <Button
        variant="outlined"
        startIcon={<LeaderboardIcon />}
        onClick={() => setShowStatistics(true)}
      >
        See Statistics
      </Button>
    );
  }

  useEffect(() => {
    setShowStatistics(false);
  }, [props.isOpen]);

  return (
    <Modal
      open={props.isOpen}
      onClose={props.onClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
      className="modal"
    >
      <Box>
        <>
          {modalTopContent}
          {modalBottomContent()}
        </>
      </Box>
    </Modal>
  );
}

function StreakGroup() {
  const stats = getPlayerStreakStatistics();

  return (
    <div className="statistic-block">
      <StreakBlock
        statisticName="Your streak"
        statisticNumber={stats.currentStreak}
      />
      <StreakBlock
        statisticName="Longest streak"
        statisticNumber={stats.longestStreak}
      />
      <StreakBlock
        statisticName="Games played"
        statisticNumber={stats.gamesPlayed}
      />
    </div>
  );
}

function StreakBlock(props: StreakProps) {
  return (
    <div className="statistic-block-item">
      <Typography component="h3">{props.statisticName}</Typography>
      <Typography variant="h4" component="body">
        {props.statisticNumber}
      </Typography>
    </div>
  );
}

function Statistics(props: StatisticProps) {
  const timePercentile = Math.floor(
    (1 -
      props.statisticPostData.secondsToCompleteBetterThanCount /
        props.statisticPostData.playerCount) *
      100
  );

  const movesPercentile = Math.floor(
    (1 -
      props.statisticPostData.moveCountBetterThanCount /
        props.statisticPostData.playerCount) *
      100
  );

  const movesPercentileText =
    movesPercentile <= 50 ? `top ${movesPercentile}%*` : "bottom 50%*";

  const timePercentileText =
    timePercentile <= 50 ? `top ${timePercentile}%` : "bottom 50%";

  return (
    <div className="statistics">
      <table>
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
      </table>
      <Typography paddingTop={"16px"} textAlign={"center"}>
        {props.statisticPostData.playerCount > 1
          ? `Not bad, but there's always room for improvement.`
          : `You're the first person to win today, so you've set the bar!`}
      </Typography>
      <Typography
        paddingBottom={"16px"}
        textAlign={"center"}
        className="info-text-container"
      >
        *You are ranked first on number of hints used, then number of moves. You
        outrank anyone who used more hints than you.
      </Typography>
    </div>
  );
}

interface StatisticProps {
  seconds: number;
  moves: number;
  minMoves: number;
  hintsUsed: number;
  statisticPostData: PostStatisticResponseBody;
}

interface StreakProps {
  statisticName: string;
  statisticNumber: number;
}

interface Props {
  isOpen: boolean;
  onClose: () => void;
  gameState: GameState;
  seconds: number;
  theme: string;
  date: string;
  isDemo?: boolean;
  tryRealGameOnClick: () => void;
  postRequestStatus?: PostRequestStatus;
}
