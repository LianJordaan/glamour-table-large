import "./App.css";
import ColorPixel from "./ColorPixel";

const ColorRow = ({ y, colors, alphas, indices, showIndex }) => {
  return (
    <div className="Grid-row">
      <ColorPixel x={0} y={y} colors={colors} alphas={alphas} indices={indices} showIndex={showIndex}/>
      <ColorPixel x={1} y={y} colors={colors} alphas={alphas} indices={indices} showIndex={showIndex}/>
      <ColorPixel x={2} y={y} colors={colors} alphas={alphas} indices={indices} showIndex={showIndex}/>
      <ColorPixel x={3} y={y} colors={colors} alphas={alphas} indices={indices} showIndex={showIndex}/>
      <ColorPixel x={4} y={y} colors={colors} alphas={alphas} indices={indices} showIndex={showIndex}/>
      <ColorPixel x={5} y={y} colors={colors} alphas={alphas} indices={indices} showIndex={showIndex}/>
      <ColorPixel x={6} y={y} colors={colors} alphas={alphas} indices={indices} showIndex={showIndex}/>
      <ColorPixel x={7} y={y} colors={colors} alphas={alphas} indices={indices} showIndex={showIndex}/>
      <ColorPixel x={8} y={y} colors={colors} alphas={alphas} indices={indices} showIndex={showIndex}/>
      <ColorPixel x={9} y={y} colors={colors} alphas={alphas} indices={indices} showIndex={showIndex}/>
      <ColorPixel x={10} y={y} colors={colors} alphas={alphas} indices={indices} showIndex={showIndex}/>
      <ColorPixel x={11} y={y} colors={colors} alphas={alphas} indices={indices} showIndex={showIndex}/>
      <ColorPixel x={12} y={y} colors={colors} alphas={alphas} indices={indices} showIndex={showIndex}/>
      <ColorPixel x={13} y={y} colors={colors} alphas={alphas} indices={indices} showIndex={showIndex}/>
      <ColorPixel x={14} y={y} colors={colors} alphas={alphas} indices={indices} showIndex={showIndex}/>
      <ColorPixel x={15} y={y} colors={colors} alphas={alphas} indices={indices} showIndex={showIndex}/>
    </div>
  );
};

export default ColorRow;
