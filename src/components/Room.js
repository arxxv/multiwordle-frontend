import "../App.css";

function Room({ setRoomPage, roomId, setRoomId, socket, setSinglePlayer }) {
  const userid = document.cookie
    .split("; ")
    .find((row) => row.startsWith("userid="))
    ?.split("=")[1];

  const joinGame = () => {
    socket.emit("joinRoom", roomId, userid);
    setSinglePlayer(false);
  };

  const createRoom = () => {
    socket.emit("createRoom", { singlePlayer: false, userid });
    setRoomPage("W");
    setSinglePlayer(false);
  };

  const singlePlayer = () => {
    socket.emit("createRoom", { singlePlayer: true, userid });
    setSinglePlayer(true);
  };

  return (
    <div className="Room">
      <div>
        <button className="btn single" onClick={singlePlayer}>
          Single Player
        </button>
      </div>
      <div>OR</div>
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
      <a
        href="https://www.nytimes.com/games/wordle/index.html"
        target="_blank"
        style={{
          color: "white",
          textDecoration: "none",
          position: "absolute",
          top: "-6px",
          right: "15px",
          margin: 0,
        }}
      >
        <h2>
          <img src="https://www.nytimes.com/games/wordle/images/NYT-Wordle-Icon-32.png"></img>
        </h2>
      </a>
    </div>
  );
}

export default Room;
