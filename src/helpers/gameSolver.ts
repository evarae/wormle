import { GameSetup, GameState } from "../types/types";
import { Cardinal, getGameStateFromSetup, getTileKey, isGameOver, tryMoveInDirection } from "./GameEngine";

export function getSolvedPuzzle(gameSetup: GameSetup):GameState{

    const initGame = getGameStateFromSetup(gameSetup);

    const pathLength = initGame.pathLetters.length;
    const tileLength = Object.keys(initGame.tiles).length

    if(pathLength !== tileLength){
        return initGame
    }

    const unfinishedQueue : GameState[] = [initGame];

    let foundSolution:boolean = false;
    let solution:GameState = initGame;

    while(unfinishedQueue.length > 0 && !foundSolution){
        const state = unfinishedQueue.pop();

        if(!state){
            continue;
        }

        const directions = [Cardinal.North, Cardinal.East, Cardinal.West, Cardinal.South];

        directions.forEach((c) => {
            const stateCopy = JSON.parse(JSON.stringify(state));
            let mutatedState = JSON.parse(JSON.stringify(state));

            const setStateCopy = (newGameState:GameState) => {
                mutatedState = newGameState;
            }

            tryMoveInDirection(mutatedState, c, setStateCopy);

            if(stateCopy.path.length >= mutatedState.path.length){
                return;
            } else if(isGameOver(mutatedState)){
                console.log("Found solution! Path: ", mutatedState.path)
                foundSolution = true;
                solution = mutatedState;
                return;
            } else {
                const lastCoordinate = mutatedState.path[mutatedState.path.length-1];
                const lastTile = mutatedState.tiles[getTileKey(lastCoordinate)]
                if(lastTile.guess === lastTile.value){
                    unfinishedQueue.push(mutatedState);
                }
                return;
            }
        })
    }

    return solution;
}