import React, { useContext } from "react";
// import { AppContext } from "../App";

function Letter({ value, color }) {
  return (
    <div className="letter" id={color}>
      {value}
    </div>
  );
}

export default Letter;
