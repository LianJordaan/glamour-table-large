import React from "react";
import "./App.css";

const ColorPixel = ({ x, y, displayInfo }) => {
  const cellId = React.useMemo(() => {
    return 16 * x + y;
  }, [x, y]);

  const exactColor = React.useMemo(() => {
    return displayInfo.exactColors[cellId];
  }, [cellId, displayInfo.exactColors]);

  const paletteId = React.useMemo(() => {
    return displayInfo.paletteIds[cellId];
  }, [cellId, displayInfo.paletteIds]);

  const alpha = React.useMemo(() => {
    return displayInfo.alphas[cellId];
  }, [cellId, displayInfo.alphas]);

  const palette = React.useMemo(() => {
    if (paletteId != null && displayInfo.palettes)
    {
      return displayInfo.palettes[paletteId];
    }
  }, [paletteId, displayInfo.palettes]);

  const color = React.useMemo(() => {
    if (displayInfo.quantizeColors && palette) {
      return palette.color;
    } else {
      return exactColor;
    }
  }, [displayInfo, exactColor, palette]);

  const visible = React.useMemo(() => {
    if (!alpha) return false;
    if (
      displayInfo.quantizeColors &&
      displayInfo.highlightIndex >= 0 &&
      displayInfo.highlightIndex !== paletteId
    )
      return false;
    return true;
  }, [
    alpha,
    displayInfo.highlightIndex,
    displayInfo.quantizeColors,
    paletteId,
  ]);

  const colorString = React.useMemo(() => {
    if (!visible) return "rgb(128, 128, 128)";
    return `rgb(${color[0]},${color[1]},${color[2]})`;
  }, [color, visible]);

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
        background: colorString,
      }}
    >
      <p style={{ fontSize: "8pt" }}>
        {displayInfo.quantizeColors && displayInfo.showId && palette && visible
          ? palette.display
          : ""}
      </p>
    </div>
  );
};

export default ColorPixel;
