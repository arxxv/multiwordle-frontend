import React from "react";

const style = {
  height: "100vh",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  flexDirection: "column",
  fontSize: "2rem",
  fontFamily: "Arial, sans-serif",
};

function Wait({ roomId }) {
  return (
    <>
      <div style={style}>
        <div>Room id:</div>
        <div style={{ fontWeight: "bold", textDecoration: "underline" }}>
          {roomId}
        </div>
        <div style={{ fontSize: "1rem", marginTop: "40px" }}>
          Share this with your friend to start the game!
        </div>
      </div>
      ;
    </>
  );
}

export default Wait;
