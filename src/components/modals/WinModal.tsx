import React, { useEffect, useState } from "react";
import { GameState } from "../../types/types";
import Grid from "../game/grid/Grid";
import "./WinModal.css";
import { PostRequestStatus } from "../App";
import DonationLink from "./Donation";
import {
  NUMBER_OF_HINTS,
  PostStatisticResponseBody,
  formatLongDisplayDate,
  getPlayerStreakStatistics,
  getShareText,
} from "../../helpers";
import {
  Box,
  Button,
  Modal,
  Popover,
  Typography,
  CircularProgress,
} from "@mui/material";
import { Leaderboard, Share, ArrowBackIosNew } from "@mui/icons-material/";
import PopupState, { bindPopover, bindTrigger } from "material-ui-popup-state";

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
      <Typography variant="h6" component={"body"} textAlign={"center"}>
        {props.theme}
      </Typography>
      {!props.isDemo && (
        <Typography variant="body2">
          {formatLongDisplayDate(props.date)}
        </Typography>
      )}
      {!showStatistics && (
        <div className="padding">
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
        <Button variant="outlined" onClick={props.tryRealGameOnClick}>
          Try the real game
        </Button>
      );
    }

    if (props.postRequestStatus?.isError) {
      return (
        <>
          <div className="info-text-container">
            Sorry! There was an error posting statistics. Please check your
            internet connection or come back tomorrow.
          </div>
          <div className="button-container padding-top padding-bottom">
            <ShareButton />
          </div>
        </>
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
          <div className="button-container padding-top padding-bottom">
            <BackButton />
            <ShareButton />
          </div>
          <DonationLink />
        </>
      );
    }

    const showStatisticsButton =
      !props.isDemo && props.postRequestStatus?.responseData;

    return (
      <>
        <StreakGroup />
        {showStatisticsButton && (
          <div className="button-container padding-top padding-bottom">
            <ShowStatisticsButton />
            <ShareButton />
          </div>
        )}
        <DonationLink />
      </>
    );
  };

  function BackButton() {
    return (
      <Button
        variant="outlined"
        startIcon={<ArrowBackIosNew />}
        onClick={() => {
          setShowStatistics(false);
        }}
      >
        Back
      </Button>
    );
  }

  function ShowStatisticsButton() {
    return (
      <Button
        variant="outlined"
        startIcon={<Leaderboard />}
        onClick={() => setShowStatistics(true)}
      >
        Statistics
      </Button>
    );
  }

  const shareButtonOnClick = () => {
    const text = getShareText(
      props.gameState.moveCount,
      props.seconds,
      NUMBER_OF_HINTS - props.gameState.hintsRemaining,
      props.date
    );
    navigator.clipboard.writeText(text);
  };

  function ShareButton() {
    return (
      <PopupState variant="popover" popupId="demo-popup-popover">
        {(popupState) => {
          const { onClick, onTouchStart } = bindTrigger(popupState);
          const combinedOnClick = (event: React.MouseEvent) => {
            onClick(event);
            shareButtonOnClick();
            setTimeout(() => popupState.setOpen(false), 1000);
          };

          return (
            <div>
              <Button
                variant="outlined"
                startIcon={<Share />}
                onClick={combinedOnClick}
                onTouchStart={onTouchStart}
              >
                Share Results
              </Button>
              <Popover
                {...bindPopover(popupState)}
                anchorOrigin={{
                  vertical: "center",
                  horizontal: "right",
                }}
                transformOrigin={{
                  vertical: "center",
                  horizontal: -4,
                }}
              >
                <Typography sx={{ p: 1 }}>
                  Results copied to clipboard
                </Typography>
              </Popover>
            </div>
          );
        }}
      </PopupState>
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
        {modalTopContent}
        {modalBottomContent()}
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
    movesPercentile <= 50 || props.moves === props.minMoves
      ? `top ${movesPercentile}%*`
      : "bottom 50%*";

  const timePercentileText =
    timePercentile <= 50 ? `top ${timePercentile}%` : "bottom 50%";

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
      <Typography textAlign={"center"}>
        {props.statisticPostData.playerCount > 1
          ? `Not bad, but there's always room for improvement.`
          : `You're the first person to win today, so you've set the bar!`}
      </Typography>
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
