import React, { useEffect, useState } from "react";
import "./App.css";
import Game from "./game/Game";
import { GameState, GameWithDate } from "../types/types";
import { getGameStateFromSetup, isGameOver } from "../helpers/GameEngine";
import NavBar from "./navBar/NavBar";
import { Button } from "@mui/material";
import { demoData, getData } from "../gameData/data";
import HelpModal from "./modals/HelpModal";
import WinModal from "./modals/WinModal";
import InfoModal from "./modals/InfoModal";
import { postStatistic, PostStatisticResponse } from "../helpers/postStatistic";
import {
  getPlayerStreakStatistics,
  updateGameFinishedOnDate,
} from "../helpers/statistics";

function App() {
  const [isWinModalOpen, setWinModalOpen] = useState(false);
  const [isInfoModalOpen, setInfoModalOpen] = useState(false);
  const [isHelpModalOpen, setHelpModalOpen] = useState(false);
  const [isDemo, setIsDemo] = useState<boolean>(false);
  const [gameState, setGameState] = useState<GameState>();
  const [gameSetupData, setGameSetupData] = useState<GameWithDate>();
  const [startTime, setStartTime] = useState<number>(0);
  const [statisticResponse, setStatisticResponse] =
    useState<PostStatisticResponse>();

  //Initialise the game
  useEffect(() => {
    setStartTime(Date.now);
    setInitialGameData();
  }, []);

  function setInitialGameData() {
    const fetchData = async () => {
      const data = await getData();
      setGameSetupData(data);
      setGameState(getGameStateFromSetup(data.game));
    };
    fetchData();
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

  function resetButtonOnClick() {
    setInitialGameData();
    setIsDemo(false);
    setInfoModalOpen(false);
    setWinModalOpen(false);
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

    updateGameFinishedOnDate(gameSetupData.date);
    if (statisticResponse === undefined && !isDemo) {
      const response = await SendStatistic();
      setStatisticResponse(response);
    }

    setWinModalOpen(true);
  }

  async function SendStatistic(): Promise<PostStatisticResponse> {
    if (!gameSetupData || !gameState) {
      return {
        successful: false,
        status: 400,
      };
    }

    const stats = getPlayerStreakStatistics();

    const result = await postStatistic({
      date: gameSetupData.date,
      moveCount: gameState.moveCount,
      streak: stats.currentStreak,
      secondsToComplete: Math.floor((Date.now() - startTime) / 1000),
    });

    return result;
  }

  return (
    <div className="App">
      <NavBar
        infoButtonOnClick={infoButtonOnClick}
        helpButtonOnClick={helpButtonOnClick}
      />
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
          isOpen={isWinModalOpen}
          onClose={winModalOnClose}
          gameState={gameState}
          theme={isDemo ? demoData.game.theme : gameSetupData.game.theme}
          date={gameSetupData.date}
          isDemo={isDemo}
          tryAgainOnClick={resetButtonOnClick}
          statisticResponse={statisticResponse}
        />
      )}
      {gameState ? (
        <div>
          <div className="game-container">
            <Game gameState={gameState} setGameState={setGameState} />
          </div>
          <div className="center-button">
            <Button
              variant="outlined"
              size="small"
              onClick={resetButtonOnClick}
            >
              {isDemo ? "Go to today's game" : "Reset tiles"}
            </Button>
          </div>
        </div>
      ) : (
        <></>
      )}
    </div>
  );
}

export default App;
