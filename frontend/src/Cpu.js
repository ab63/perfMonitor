import React from "react";

import drawCircle from "./utilities/canvasLoadAnimation";

export default function Cpu(props) {
  const canvas = document.querySelector(".canvas");
  drawCircle(canvas, props.cpuData.cpuLoad);
  return (
    <div className="col-sm-2 cpu">
      <h3>CPU Load</h3>
      <div className="canvas-wrapper">
        <canvas className="canvas" width="200px" height="200px"></canvas>
        <div className="cpu-text">{props.cpuData.cpuLoad}%</div>
      </div>
    </div>
  );
}
