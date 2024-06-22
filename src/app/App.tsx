import React, { useEffect, useState } from "react";
import "./App.css";
import Game from "./game/Game";
import { GameState } from "../types/types";
import { getGameStateFromSetup, isGameOver } from "./game/GameEngine";
import NavBar from "./navBar/NavBar";
import { Button } from "@mui/material";
import { demoData, getData } from "../gameData/data";
import HelpModal from "./modals/HelpModal";
import WinModal from "./modals/WinModal";
import InfoModal from "./modals/InfoModal";

function App() {
  const [isWinModalOpen, setWinModalOpen] = useState(false);
  const [isInfoModalOpen, setInfoModalOpen] = useState(false);
  const [isHelpModalOpen, setHelpModalOpen] = useState(false);
  const [isDemo, setIsDemo] = useState<boolean>(false);
  const [gameState, setGameState] = useState<GameState>();

  //Initialise the game
  useEffect(() => {
    setInitialGameData();
  }, []);

  function setInitialGameData() {
    const fetchData = async () => {
      const data = await getData();
      setGameState(getGameStateFromSetup(data));
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
    setInfoModalOpen(false);
    setIsDemo(true);
    setGameState(getGameStateFromSetup(demoData));
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
      console.log("active element: ", document.activeElement);
      if (document.activeElement instanceof HTMLElement) {
        console.log("isHTML");
        document.activeElement.blur();
      }
      setWinModalOpen(true);
    }
  }, [gameState]);

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
      {gameState && (
        <WinModal
          isOpen={isWinModalOpen}
          onClose={winModalOnClose}
          gameState={gameState}
          isDemo={isDemo}
          tryAgainOnClick={resetButtonOnClick}
        />
      )}
      {gameState ? (
        <div>
          <Game gameState={gameState} setGameState={setGameState} />
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
