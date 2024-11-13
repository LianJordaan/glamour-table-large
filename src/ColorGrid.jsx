import "./App.css";
import ColorRow from "./ColorRow";

const ColorGrid = ({ colors, alphas, indices, showIndex }) => {
  return (
    <div className="Grid">
      <ColorRow y={0} colors={colors} alphas={alphas} indices={indices} showIndex={showIndex}/>
      <ColorRow y={1} colors={colors} alphas={alphas} indices={indices} showIndex={showIndex}/>
      <ColorRow y={2} colors={colors} alphas={alphas} indices={indices} showIndex={showIndex}/>
      <ColorRow y={3} colors={colors} alphas={alphas} indices={indices} showIndex={showIndex}/>
      <ColorRow y={4} colors={colors} alphas={alphas} indices={indices} showIndex={showIndex}/>
      <ColorRow y={5} colors={colors} alphas={alphas} indices={indices} showIndex={showIndex}/>
      <ColorRow y={6} colors={colors} alphas={alphas} indices={indices} showIndex={showIndex}/>
      <ColorRow y={7} colors={colors} alphas={alphas} indices={indices} showIndex={showIndex}/>
      <ColorRow y={8} colors={colors} alphas={alphas} indices={indices} showIndex={showIndex}/>
      <ColorRow y={9} colors={colors} alphas={alphas} indices={indices} showIndex={showIndex}/>
      <ColorRow y={10} colors={colors} alphas={alphas} indices={indices} showIndex={showIndex} />
      <ColorRow y={11} colors={colors} alphas={alphas} indices={indices} showIndex={showIndex} />
      <ColorRow y={12} colors={colors} alphas={alphas} indices={indices} showIndex={showIndex} />
      <ColorRow y={13} colors={colors} alphas={alphas} indices={indices} showIndex={showIndex} />
      <ColorRow y={14} colors={colors} alphas={alphas} indices={indices} showIndex={showIndex} />
      <ColorRow y={15} colors={colors} alphas={alphas} indices={indices} showIndex={showIndex} />
    </div>
  );
};

export default ColorGrid;
