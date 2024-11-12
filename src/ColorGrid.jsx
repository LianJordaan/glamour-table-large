import './App.css';
import ColorRow from './ColorRow';

const ColorGrid = ({ table }) => {
  return (
    <div className='Grid'>
      <ColorRow y={0} table={table} />
      <ColorRow y={1} table={table} />
      <ColorRow y={2} table={table} />
      <ColorRow y={3} table={table} />
      <ColorRow y={4} table={table} />
      <ColorRow y={5} table={table} />
      <ColorRow y={6} table={table} />
      <ColorRow y={7} table={table} />
      <ColorRow y={8} table={table} />
      <ColorRow y={9} table={table} />
      <ColorRow y={10} table={table} />
      <ColorRow y={11} table={table} />
      <ColorRow y={12} table={table} />
      <ColorRow y={13} table={table} />
      <ColorRow y={14} table={table} />
      <ColorRow y={15} table={table} />
    </div>
  )
}

export default ColorGrid;