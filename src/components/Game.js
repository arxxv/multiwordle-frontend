import React, { useEffect } from "react";
import Board from "./Board";
import Keyboard from "./Keyboard";
import "../App.css";
import { useState, createContext } from "react";
import { boardDefault } from "../words";

export const AppContext = createContext();

function Game({ socket, initState, roomId }) {
  const [gameState1, setGameState1] = useState({});
  const [game2Evals, setGame2Evals] = useState([]);
  const [currAttempt, setCurrAttempt] = useState({ attempt: 0, letterPos: 0 });
  const [usedKeys, setUsedKeys] = useState(new Array(26).fill(""));

  useEffect(() => {
    // socket.on("gameState", (state) => {
    //   console.log(state);
    // });
    setGameState1(initState);
  }, []);

  const [board1, setBoard1] = useState([
    ["", "", "", "", ""],
    ["", "", "", "", ""],
    ["", "", "", "", ""],
    ["", "", "", "", ""],
    ["", "", "", "", ""],
    ["", "", "", "", ""],
  ]);

  useEffect(() => {
    socket.on("gameState", (newGameState) => {
      setGameState1(newGameState);
      let tempKeys = [...usedKeys];
      for (let i = 0; i < 5; i++) {
        let x = newGameState.boardState[newGameState.rowIndex - 1][i];
        if (newGameState.solution.includes(x)) {
          tempKeys[x.charCodeAt(0) - "a".charCodeAt(0)] = "present";
          if (newGameState.solution[i] == x) {
            tempKeys[x.charCodeAt(0) - "a".charCodeAt(0)] = "correct";
          }
        } else {
          tempKeys[x.charCodeAt(0) - "a".charCodeAt(0)] = "absent";
        }
      }
      setUsedKeys(tempKeys);
    });
    socket.on("otherPlayerMove", (evaluations) => {
      setGame2Evals(evaluations);
    });

    // socket.on("error", (error) => {
    //   alert(error.msg);
    // });
  });

  const solution = initState.solution;
  const onSelectLetter = (value) => {
    if (currAttempt.letterPos == 5) return;
    const currBoard = [...board1];
    currBoard[currAttempt.attempt][currAttempt.letterPos] = value;
    setCurrAttempt({ ...currAttempt, letterPos: currAttempt.letterPos + 1 });
    setBoard1(currBoard);
  };

  const onDelete = () => {
    if (currAttempt.letterPos === 0) return;
    const currBoard = [...board1];
    currBoard[currAttempt.attempt][currAttempt.letterPos - 1] = "";
    setBoard1(currBoard);
    setCurrAttempt({ ...currAttempt, letterPos: currAttempt.letterPos - 1 });
  };

  const onEnter = () => {
    if (currAttempt.letterPos !== 5) return;
    socket.emit("newGuess", {
      roomId,
      gameState: gameState1,
      guess: board1[currAttempt.attempt].join(""),
    });
    setCurrAttempt({ attempt: currAttempt.attempt + 1, letterPos: 0 });
  };
  return (
    <div className="Game">
      <AppContext.Provider
        value={{
          board1,
          setBoard1,
          currAttempt,
          setCurrAttempt,
          onDelete,
          onEnter,
          onSelectLetter,
          solution,
          roomId,
        }}
      >
        <div className="games">
          <div className="game">
            <Board board={board1} evaluations={gameState1.evaluations} />
            <Keyboard usedKeys={usedKeys} />
          </div>
          <div className="game">
            <Board evaluations={game2Evals} />
          </div>
        </div>
        {/* <div className="room">
          <div className="createRoomBtn">Create Room</div>
          <div className="joinRoomBtn">Join Room</div>
        </div> */}
      </AppContext.Provider>

      {/* <Router>
        <div>
          <Routes>
            <Route path="/" exact element={<Room />} />
            <Route path="/game" exact element={<Game />} />
          </Routes>
        </div>
      </Router> */}
    </div>
  );
}

export default Game;
