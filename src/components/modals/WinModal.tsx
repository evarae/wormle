import React, { useEffect, useMemo, useState } from "react";
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
import LeaderboardIcon from "@mui/icons-material/Leaderboard";
import { PostStatisticResponseBody } from "../../helpers/postStatistic";

const MIN_PERCENTAGE_TO_DISPLAY = 50;

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
    </>
  );

  const modalBottomContent = () => {
    if (props.isDemo) {
      return (
        <>
          <div className="padding-small">
            <Grid
              gameState={props.gameState}
              isReadOnly={true}
              gridSize="small"
            />
          </div>
          <div className="center-button">
            <Button variant="outlined" onClick={props.tryRealGameOnClick}>
              Try the real game
            </Button>
          </div>
        </>
      );
    }

    if (props.postRequestStatus?.isError) {
      return (
        <>
          <div className="padding-small">
            <Grid
              gameState={props.gameState}
              isReadOnly={true}
              gridSize="small"
            />
          </div>
          <div className="info-text-container">
            Error posting statistics. Please check your internet connection and
            ad-blocker settings.
          </div>
        </>
      );
    }

    if (props.postRequestStatus?.isLoading) {
      return (
        <>
          <div className="padding-small">
            <Grid
              gameState={props.gameState}
              isReadOnly={true}
              gridSize="small"
            />
          </div>
          <Box sx={{ display: "flex" }}>
            <CircularProgress />
          </Box>
        </>
      );
    }

    if (showStatistics) {
      return (
        <>
          {props.postRequestStatus?.responseData &&
            !props.postRequestStatus.isLoading && (
              <Statistics
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

    return (
      <>
        <div className="padding-small">
          <Grid
            gameState={props.gameState}
            isReadOnly={true}
            gridSize="small"
          />
        </div>
        {!props.isDemo && props.postRequestStatus?.responseData && (
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
  let timePercentile;
  let movesPercentile;

  if (props.statisticPostData) {
    timePercentile = Math.floor(
      (1 -
        props.statisticPostData.secondsToCompleteBetterThanCount /
          props.statisticPostData.playerCount) *
        100
    );

    movesPercentile = Math.floor(
      (1 -
        props.statisticPostData.moveCountBetterThanCount /
          props.statisticPostData.playerCount) *
        100
    );
  }

  //props.totalPlayerCount>1 ? (Percentage of other players you've beaten: {timeBeatenPercent}):()
  return (
    <div className="statistics">
      <table>
        <tr>
          <th scope="row">{`Moves (minimum ${props.minMoves})`}</th>
          <td>{props.moves}</td>
          <td>{`top ${movesPercentile}%`}</td>
        </tr>
        <tr>
          <th scope="row">Time (seconds)</th>
          <td>{props.seconds}</td>
          <td>{`top ${timePercentile}%`}</td>
        </tr>
      </table>
      <Typography
        paddingTop={"16px"}
        paddingBottom={"16px"}
        textAlign={"center"}
      >
        {props.statisticPostData.playerCount > 1
          ? `Not bad, but there's always room for improvement.`
          : `You're the first person to win today, so you've set the bar!`}
      </Typography>
    </div>
  );
}

interface StatisticProps {
  seconds: number;
  moves: number;
  minMoves: number;
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
