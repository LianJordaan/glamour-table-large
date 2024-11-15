import "./App.css";
import ColorRow from "./ColorRow";

const ColorGrid = ({ displayInfo }) => {
  return (
    <div className="Grid">
      <ColorRow y={0} displayInfo={displayInfo} />
      <ColorRow y={1} displayInfo={displayInfo} />
      <ColorRow y={2} displayInfo={displayInfo} />
      <ColorRow y={3} displayInfo={displayInfo} />
      <ColorRow y={4} displayInfo={displayInfo} />
      <ColorRow y={5} displayInfo={displayInfo} />
      <ColorRow y={6} displayInfo={displayInfo} />
      <ColorRow y={7} displayInfo={displayInfo} />
      <ColorRow y={8} displayInfo={displayInfo} />
      <ColorRow y={9} displayInfo={displayInfo} />
      <ColorRow y={10} displayInfo={displayInfo} />
      <ColorRow y={11} displayInfo={displayInfo} />
      <ColorRow y={12} displayInfo={displayInfo} />
      <ColorRow y={13} displayInfo={displayInfo} />
      <ColorRow y={14} displayInfo={displayInfo} />
      <ColorRow y={15} displayInfo={displayInfo} />
    </div>
  );
};

export default ColorGrid;
