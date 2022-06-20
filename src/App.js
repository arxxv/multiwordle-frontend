import "./App.css";
import { createContext, useState, useEffect } from "react";
import Room from "./components/Room";
import Game from "./components/Game";
import Wait from "./components/Wait";
import io from "socket.io-client";
import logo from "./logo.png";
import useWindowDimensions from "./hooks/useWindowDimensions";

export const AppContext = createContext();

// const socket = io.connect("https://multiwordlebe.herokuapp.com/");
const socket = io.connect("http://localhost:4000");

function App() {
  const width = useWindowDimensions();

  const [roomId, setRoomId] = useState("");
  const [roomPage, setRoomPage] = useState("T");
  const [initState, setInitState] = useState({});
  const [singlePlayer, setSinglePlayer] = useState(false);

  useEffect(() => {
    socket.on("uid", (uid) => {
      const userid = document.cookie
        .split("; ")
        .find((row) => row.startsWith("userid="))
        ?.split("=")[1];

      if (!userid) document.cookie = `userid=${uid}`;
    });

    socket.on("roomId", (roomId) => {
      setRoomId(roomId);
    });
    socket.on("startGame", (gameState) => {
      setRoomPage("F");
      setInitState(gameState);
    });
  });
  const goHome = () => {
    setRoomPage("T");
  };

  return (
    <div className="App">
      <nav>
        <div style={{ display: "flex" }}>
          <img
            src={logo}
            style={{ width: "50px", borderRadius: "10px", marginRight: "25px" }}
            alt="logo"
          />
          <h1 onClick={goHome}>MultiWordle</h1>
        </div>
      </nav>
      {roomPage === "T" ? (
        <Room
          setRoomPage={setRoomPage}
          socket={socket}
          setRoomId={setRoomId}
          roomId={roomId}
          setSinglePlayer={setSinglePlayer}
        />
      ) : roomPage === "W" ? (
        <Wait roomId={roomId} />
      ) : (
        <Game
          socket={socket}
          initState={initState}
          roomId={roomId}
          singlePlayer={singlePlayer}
          setSinglePlayer={setSinglePlayer}
          width={width}
        />
      )}
    </div>
  );
}

export default App;
