import React, { useEffect, useState } from "react";
import "./App.css";
import Game from "./game/Game";
import { GameState, GameWithDate } from "../types/types";
import {
  getGameStateFromSetup,
  isGameOver,
  NUMBER_OF_HINTS,
} from "../helpers/GameEngine";
import NavBar from "./navBar/NavBar";
import { Typography } from "@mui/material";
import { demoData, getData } from "../gameData/data";
import HelpModal from "./modals/HelpModal";
import WinModal from "./modals/WinModal";
import InfoModal from "./modals/InfoModal";
import {
  postStatistic,
  PostStatisticResponseBody,
} from "../helpers/postStatistic";
import {
  getLastDayPlayed,
  getPlayerStreakStatistics,
  updateGameFinishedOnDate,
} from "../helpers/statistics";
import { getSolvedPuzzle } from "../helpers/gameSolver";
import InstagramIcon from "@mui/icons-material/Instagram";

const INSTAGRAM_LINK = "https://www.instagram.com/wormle.game/";

function App() {
  const [isWinModalOpen, setWinModalOpen] = useState(false);
  const [isInfoModalOpen, setInfoModalOpen] = useState(false);
  const [isHelpModalOpen, setHelpModalOpen] = useState(false);
  const [isDemo, setIsDemo] = useState<boolean>(false);
  const [gameState, setGameState] = useState<GameState>();
  const [gameSetupData, setGameSetupData] = useState<GameWithDate>();
  const [startTime, setStartTime] = useState<number>(0);
  const [postRequest, setPostRequest] = useState<PostRequestStatus>({
    isError: false,
    isLoading: false,
  });
  const [secondsToComplete, setSecondsToComplete] = useState(0);
  const [shouldPostStatistics, setShouldPostStatistics] = useState(true);

  //Attach automatic solver
  useEffect(() => {
    const solvePuzzle = () => {
      if (gameSetupData?.game) {
        const solution = getSolvedPuzzle(gameSetupData?.game);
        setShouldPostStatistics(false);
        setGameState(solution);
      }
    };

    window.Wormle = window.Wormle || {};
    window.Wormle.solvePuzzle = solvePuzzle;
  }, [gameSetupData]);

  //Initialise the game
  useEffect(() => {
    if (!getLastDayPlayed()) {
      setHelpModalOpen(true);
    }

    setStartTime(Date.now);
    setInitialGameData();
  }, []);

  async function setInitialGameData() {
    const data = await getData();
    setGameSetupData(data);
    setGameState(getGameStateFromSetup(data.game));
    console.log("Here you go, cheater!\n", data.game.words);
  }

  function infoButtonOnClick() {
    setInfoModalOpen(true);
  }

  function helpButtonOnClick() {
    setHelpModalOpen(true);
  }

  function tryDemoOnClick() {
    setHelpModalOpen(false);
    setIsDemo(true);
    setGameState(getGameStateFromSetup(demoData.game));
  }

  function tryRealGameOnClick() {
    setStartTime(Date.now);
    resetButtonOnClick();
  }

  function resetButtonOnClick() {
    setInitialGameData();
    setIsDemo(false);
    setInfoModalOpen(false);
    setWinModalOpen(false);
    setPostRequest({
      isError: false,
      isLoading: false,
    });
  }

  function infoModalOnClose() {
    setInfoModalOpen(false);
  }

  function helpModalOnClose() {
    setHelpModalOpen(false);
  }

  function winModalOnClose() {
    setWinModalOpen(false);
  }

  useEffect(() => {
    if (gameState && isGameOver(gameState)) {
      onWinGame();
    }
  }, [gameState]);

  async function onWinGame() {
    if (!gameSetupData || !gameState) {
      return;
    }

    if (document.activeElement instanceof HTMLElement) {
      document.activeElement.blur();
    }

    if (
      getLastDayPlayed() !== gameSetupData.date &&
      !isDemo &&
      shouldPostStatistics
    ) {
      updateGameFinishedOnDate(gameSetupData.date);
      SendStatistic();
    }

    setWinModalOpen(true);
  }

  async function SendStatistic() {
    if (!gameSetupData || !gameState) {
      return;
    }

    const stats = getPlayerStreakStatistics();
    const seconds = Math.floor((Date.now() - startTime) / 1000);
    setSecondsToComplete(seconds);

    setPostRequest({ ...postRequest, isLoading: true, isError: false });

    postStatistic({
      date: gameSetupData.date,
      moveCount: gameState.moveCount,
      streak: stats.currentStreak,
      secondsToComplete: seconds,
      hintsUsed: NUMBER_OF_HINTS - gameState.hintsRemaining,
    }).then((response) => {
      if (response.successful) {
        setPostRequest({
          isError: false,
          isLoading: false,
          responseData: response.body,
        });
      } else {
        setPostRequest({
          isError: true,
          isLoading: false,
          responseData: undefined,
        });
      }
    });
  }

  return (
    <div className="App">
      <NavBar
        infoButtonOnClick={infoButtonOnClick}
        helpButtonOnClick={helpButtonOnClick}
      />
      <div className="page-body">
        <HelpModal
          isOpen={isHelpModalOpen}
          onClose={helpModalOnClose}
          tryDemoOnClick={tryDemoOnClick}
        />
        <InfoModal
          isOpen={isInfoModalOpen}
          onClose={infoModalOnClose}
          tryDemoOnClick={tryDemoOnClick}
        />
        {gameState && gameSetupData && (
          <WinModal
            seconds={secondsToComplete}
            isOpen={isWinModalOpen}
            onClose={winModalOnClose}
            gameState={gameState}
            theme={isDemo ? demoData.game.theme : gameSetupData.game.theme}
            date={gameSetupData.date}
            isDemo={isDemo}
            tryRealGameOnClick={tryRealGameOnClick}
            postRequestStatus={postRequest}
          />
        )}
        {gameState && (
          <div>
            {isDemo && (
              <div className="demo-text">
                <Typography>
                  Use the arrow keys or mouse to guide the worm and spell a
                  related word on each row. Letters appear in the order shown at
                  the bottom of the screen. If you make a mistake, tap the worm
                  to move backwards, or hit &quot;reset tiles&quot;.
                </Typography>
              </div>
            )}
            <Game
              gameState={gameState}
              setGameState={setGameState}
              realGameOnClick={isDemo ? tryRealGameOnClick : undefined}
            />
            {isDemo && (
              <div className="demo-text">
                <Typography>
                  Can you figure out the theme? If you need some{" "}
                  <b>direction</b>, use a hint to reveal a letter. If your
                  motivation is going <b>South</b>, the &quot;
                  <b>?</b>&quot; icon could be your <b>North</b> star.
                </Typography>
              </div>
            )}
          </div>
        )}
      </div>
      <PageFooter />
    </div>
  );
}

function PageFooter() {
  return (
    <footer className="page-footer padding">
      <a href={INSTAGRAM_LINK} target="_blank" rel="noopener noreferrer">
        Follow wormle.game on Instagram <InstagramIcon />
      </a>
    </footer>
  );
}

export type PostRequestStatus = {
  isLoading: boolean;
  isError: boolean;
  responseData?: PostStatisticResponseBody;
};

export default App;
