import React, { useEffect, useState, useContext } from "react";
import "./Room.css";
import { AppContext } from "./Game";

function Room({ setRoomPage, roomId, setRoomId, socket }) {
  const joinGame = () => {
    socket.emit("joinRoom", roomId);
  };

  const createRoom = () => {
    socket.emit("createRoom");
    setRoomPage("W");
  };

  return (
    <div className="Room">
      <div>
        <button className="btn create" onClick={createRoom}>
          Create Room
        </button>
      </div>
      <div>OR</div>
      <div>
        <input
          placeholder="Room Id"
          className="btn"
          onChange={(event) => {
            setRoomId(event.target.value);
          }}
        />
        <button className="btn join" onClick={joinGame}>
          Join Room
        </button>
      </div>
    </div>
  );
}

export default Room;
