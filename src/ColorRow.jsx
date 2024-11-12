
import './App.css';
import ColorPixel from "./ColorPixel";

const ColorRow = ({ y, table }) => {
  return (
    <div className='Grid-row'>
      <ColorPixel x={0} y={y} table={table} />
      <ColorPixel x={1} y={y} table={table} />
      <ColorPixel x={2} y={y} table={table} />
      <ColorPixel x={3} y={y} table={table} />
      <ColorPixel x={4} y={y} table={table} />
      <ColorPixel x={5} y={y} table={table} />
      <ColorPixel x={6} y={y} table={table} />
      <ColorPixel x={7} y={y} table={table} />
      <ColorPixel x={8} y={y} table={table} />
      <ColorPixel x={9} y={y} table={table} />
      <ColorPixel x={10} y={y} table={table} />
      <ColorPixel x={11} y={y} table={table} />
      <ColorPixel x={12} y={y} table={table} />
      <ColorPixel x={13} y={y} table={table} />
      <ColorPixel x={14} y={y} table={table} />
      <ColorPixel x={15} y={y} table={table} />
    </div >
  )
}

export default ColorRow;