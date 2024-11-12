
import './App.css';

const ColorPixel = ({ x, y, table }) => {
  return (
    <div style={{ width: '20px', height: '20px', minWidth: '20px', minHeight: '20px', background: table[16 * x + y] }}>
    </div>
  )
}

export default ColorPixel;