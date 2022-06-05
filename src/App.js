import "./App.css";
import { createContext, useState, useEffect } from "react";
import Room from "./components/Room";
import Game from "./components/Game";
import Wait from "./components/Wait";
import io from "socket.io-client";

export const AppContext = createContext();

const socket = io.connect("https://multiwordlebe.herokuapp.com/");

function App() {
  const [roomId, setRoomId] = useState("");
  const [roomPage, setRoomPage] = useState("T");
  const [initState, setInitState] = useState({});

  useEffect(() => {
    socket.on("roomId", (roomId) => {
      setRoomId(roomId);
    });
    socket.on("startGame", (gameState) => {
      setRoomPage("F");
      setInitState(gameState);
    });
  });

  return (
    <div className="App">
      <nav>
        <h1>Wordle</h1>
      </nav>
      {roomPage === "T" ? (
        <Room
          setRoomPage={setRoomPage}
          socket={socket}
          setRoomId={setRoomId}
          roomId={roomId}
        />
      ) : roomPage === "W" ? (
        <Wait roomId={roomId} />
      ) : (
        <Game socket={socket} initState={initState} roomId={roomId} />
      )}
    </div>
  );
}

export default App;
