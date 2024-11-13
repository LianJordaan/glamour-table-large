import React from "react";
import "./App.css";

const ColorPixel = ({ x, y, colors, alphas, indices, showIndex }) => {
  const visible = React.useMemo(() => {
    return alphas[16 * x + y];
  }, [alphas, x, y]);

  const color = React.useMemo(() => {
    return visible ? colors[16 * x + y] : "rgb(128,128,128)";
  }, [colors, visible, x, y]);

  const index = React.useMemo(() => {
    if (indices) {
      return indices[16 * x + y];
    }
  }, [indices, x, y]);

  return (
    <div
      style={{
        width: "20px",
        height: "20px",
        minWidth: "20px",
        minHeight: "20px",

        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        background: color,
      }}
    >
      <p style={{ fontSize: "8pt" }}>{showIndex ? visible ? index : '' : ''}</p>
    </div>
  );
};

export default ColorPixel;
