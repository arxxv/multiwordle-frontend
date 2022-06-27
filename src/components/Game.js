import React, { useEffect } from "react";
import Board from "./Board";
import Keyboard from "./Keyboard";
import "../App.css";
import { useState, createContext } from "react";
import Scores from "./Scores";

export const AppContext = createContext();
const MINWIDTH = "950";

function Game({
  socket,
  initState,
  roomId,
  singlePlayer,
  setSinglePlayer,
  width,
  opp,
}) {
  const [gameState1, setGameState1] = useState({});
  const [game2Evals, setGame2Evals] = useState([]);
  const [letterPos, setLetterPos] = useState(0);
  const [usedKeys, setUsedKeys] = useState(new Array(26).fill(""));
  const [displaySolution, setDisplaySolution] = useState(false);
  const [score1, setScore1] = useState(0);
  const [score2, setScore2] = useState(0);
  const [board1, setBoard1] = useState([
    ["", "", "", "", ""],
    ["", "", "", "", ""],
    ["", "", "", "", ""],
    ["", "", "", "", ""],
    ["", "", "", "", ""],
    ["", "", "", "", ""],
  ]);

  useEffect(() => {
    let tempBoard = board1;
    for (let r = 0; r < 6; r++) {
      if (initState["boardState"][r] === "") break;
      for (let c = 0; c < 5; c++)
        tempBoard[r][c] = initState["boardState"][r][c].toUpperCase();
    }
    setUsedKeys(initState.usedKeys);
    setBoard1(tempBoard);
    setGameState1(initState);
    setScore1(initState.points);

    if (opp.evaluations) {
      setScore2(opp.points);
      setGame2Evals(opp.evaluations);
    }
  }, []);

  useEffect(() => {
    socket.on("playerLeft", () => {
      setSinglePlayer(true);
    });

    socket.on("gameState", (newGameState) => {
      setLetterPos(0);
      setGameState1(newGameState);
      setUsedKeys(newGameState.usedKeys);
      setScore1(score1 + newGameState.addPoints);
      if (newGameState.gameStatus === "LOST") setDisplaySolution(true);
    });

    socket.on("otherPlayerMove", (data) => {
      setGame2Evals(data.evaluations);
      setScore2(score2 + data.addPoints);
    });
  });

  const onSelectLetter = (value) => {
    if (gameState1.gameStatus !== "IN_PROGRESS" || letterPos === 5) return;
    const currBoard = [...board1];
    currBoard[gameState1.rowIndex][letterPos] = value;
    setLetterPos(letterPos + 1);
    setBoard1(currBoard);
  };

  const onDelete = () => {
    if (letterPos === 0) return;
    const currBoard = [...board1];
    currBoard[gameState1.rowIndex][letterPos - 1] = "";
    setBoard1(currBoard);
    setLetterPos(letterPos - 1);
  };

  const onEnter = () => {
    if (letterPos !== 5) return;

    const userid = document.cookie
      .split("; ")
      .find((row) => row.startsWith("userid="))
      ?.split("=")[1];

    socket.emit("newGuess", {
      roomId,
      gameState: gameState1,
      guess: board1[gameState1.rowIndex].join(""),
      userid,
      usedKeys,
    });
  };

  return (
    <div
      className="Game"
      style={{
        overflowY: width < MINWIDTH ? "auto" : "hidden",
        overflowX: "hidden",
      }}
    >
      <AppContext.Provider
        value={{
          onDelete,
          onEnter,
          onSelectLetter,
        }}
      >
        <div
          className="games"
          style={{ flexDirection: width < MINWIDTH ? "column" : "row" }}
        >
          <div
            className="game"
            style={{ width: singlePlayer ? "100vw" : "35vw" }}
          >
            <Board board={board1} evaluations={gameState1.evaluations} />
            {displaySolution && (
              <div className="whiteboard">
                {gameState1.solution.toUpperCase()}
              </div>
            )}
            <Keyboard usedKeys={usedKeys} />
          </div>
          {!singlePlayer && (
            <Scores
              score1={score1}
              score2={score2}
              fdir={width < MINWIDTH ? "column" : "row"}
            />
          )}
          {!singlePlayer && (
            <div className="game">
              <Board evaluations={game2Evals} />
            </div>
          )}
        </div>
      </AppContext.Provider>
    </div>
  );
}

export default Game;
