
import blank from './icons/blank.png'
import brush from './icons/brush.png'
import black_dye from './icons/black_dye.png'
import blue_dye from './icons/blue_dye.png'
import brown_dye from './icons/brown_dye.png'
import cyen_dye from './icons/cyen_dye.png'
import gray_dye from './icons/gray_dye.png'
import green_dye from './icons/green_dye.png'
import light_blue_dye from './icons/light_blue_dye.png'
import light_gray_dye from './icons/light_gray_dye.png'
import lime_dye from './icons/lime_dye.png'
import magenta_dye from './icons/magenta_dye.png'
import orange_dye from './icons/orange_dye.png'
import pink_dye from './icons/pink_dye.png'
import purple_dye from './icons/purple_dye.png'
import red_dye from './icons/red_dye.png'
import white_dye from './icons/white_dye.png'
import yellow_dye from './icons/yellow_dye.png'

import './index.css'


const GetImage = (value) => {
  switch (value) {
    case 'black': return black_dye;
    case 'blue': return blue_dye;
    case 'brown': return brown_dye;
    case 'cyan': return cyen_dye;
    case 'gray': return gray_dye;
    case 'green': return green_dye;
    case 'lightBlue': return light_blue_dye;
    case 'lightGray': return light_gray_dye;
    case 'lime': return lime_dye;
    case 'magenta': return magenta_dye;
    case 'orange': return orange_dye;
    case 'pink': return pink_dye;
    case 'purple': return purple_dye;
    case 'red': return red_dye;
    case 'white': return white_dye;
    case 'yellow': return yellow_dye;
    default: return blank
  }
}

const titleCase = (s) =>
  s.replace (/^[-_]*(.)/, (_, c) => c.toUpperCase())       // Initial char (after -/_)
   .replace (/[-_]+(.)/g, (_, c) => ' ' + c.toUpperCase()) // First char after each -/_
   .replace(/([a-z])([A-Z])/g, '$1 $2')                    // Split CamelCase to Title Case
const CraftingGrid = ({sequence}) => {

  console.log(sequence)
  return (
    <div className="flex-grid fill-width">
      <div className="flex-grid-row fill-width">
        <img className="flex-grid-cell" src={brush} title={'Brush'} />
        <img className="flex-grid-cell" src={ GetImage((sequence[0] ?? 'blank'))} title={titleCase(sequence[0] ? sequence[0] + "_dye" : 'empty')} />
        <img className="flex-grid-cell" src={ GetImage((sequence[1] ?? 'blank'))} title={titleCase(sequence[1] ? sequence[1] + "_dye" : 'empty')} />
      </div>
      <div className="flex-grid-row">
        <img className="flex-grid-cell" src={ GetImage((sequence[2] ?? 'blank'))} title={titleCase(sequence[2] ? sequence[2] + "_dye" : 'empty')} />
        <img className="flex-grid-cell" src={ GetImage((sequence[3] ?? 'blank'))} title={titleCase(sequence[3] ? sequence[3] + "_dye" : 'empty')} />
        <img className="flex-grid-cell" src={ GetImage((sequence[4] ?? 'blank'))} title={titleCase(sequence[4] ? sequence[4] + "_dye" : 'empty')} />
      </div>
      <div className="flex-grid-row">
        <img className="flex-grid-cell" src={ GetImage((sequence[5] ?? 'blank'))} title={titleCase(sequence[5] ? sequence[5] + "_dye" : 'empty')} />
        <img className="flex-grid-cell" src={ GetImage((sequence[6] ?? 'blank'))} title={titleCase(sequence[6] ? sequence[6] + "_dye" : 'empty')} />
        <img className="flex-grid-cell" src={ GetImage((sequence[7] ?? 'blank'))} title={titleCase(sequence[7] ? sequence[7] + "_dye" : 'empty')} />
      </div>



    </div>)
}

export default CraftingGrid;