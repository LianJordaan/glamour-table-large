import "./App.css";
import ColorPixel from "./ColorPixel";

const ColorRow = ({ y, displayInfo }) => {
  return (
    <div className="Grid-row">
      <ColorPixel x={0} y={y} displayInfo={displayInfo} />
      <ColorPixel x={1} y={y} displayInfo={displayInfo} />
      <ColorPixel x={2} y={y} displayInfo={displayInfo} />
      <ColorPixel x={3} y={y} displayInfo={displayInfo} />
      <ColorPixel x={4} y={y} displayInfo={displayInfo} />
      <ColorPixel x={5} y={y} displayInfo={displayInfo} />
      <ColorPixel x={6} y={y} displayInfo={displayInfo} />
      <ColorPixel x={7} y={y} displayInfo={displayInfo} />
      <ColorPixel x={8} y={y} displayInfo={displayInfo} />
      <ColorPixel x={9} y={y} displayInfo={displayInfo} />
      <ColorPixel x={10} y={y} displayInfo={displayInfo} />
      <ColorPixel x={11} y={y} displayInfo={displayInfo} />
      <ColorPixel x={12} y={y} displayInfo={displayInfo} />
      <ColorPixel x={13} y={y} displayInfo={displayInfo} />
      <ColorPixel x={14} y={y} displayInfo={displayInfo} />
      <ColorPixel x={15} y={y} displayInfo={displayInfo} />
    </div>
  );
};

export default ColorRow;
