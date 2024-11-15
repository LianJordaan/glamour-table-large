// This code has been yoinked from the Minecraft Wiki Calculator project: https://github.com/mc-wiki/mcw-calc

export const imgNames = {
  white: "White",
  lightGray: "Light_Gray",
  gray: "Gray",
  black: "Black",
  brown: "Brown",
  red: "Red",
  orange: "Orange",
  yellow: "Yellow",
  lime: "Lime",
  green: "Green",
  cyan: "Cyan",
  lightBlue: "Light_Blue",
  blue: "Blue",
  purple: "Purple",
  magenta: "Magenta",
  pink: "Pink"
}

export const colorMap = {
  white: 0xF9FFFE,
  lightGray: 0x9D9D97,
  gray: 0x474F52,
  black: 0x1D1D21,
  brown: 0x835432,
  red: 0xB02E26,
  orange: 0xF9801D,
  yellow: 0xFED83D,
  lime: 0x80C71F,
  green: 0x5E7C16,
  cyan: 0x169C9C,
  lightBlue: 0x3AB3DA,
  blue: 0x3C44AA,
  purple: 0x8932B8,
  magenta: 0xC74EBD,
  pink: 0xF38BAA,
}

export const combs = [
  ...combsWithRep(6, [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15]),
  ...combsWithRep(5, [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15]),
  ...combsWithRep(4, [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15]),
  ...combsWithRep(3, [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15]),
  ...combsWithRep(2, [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15]),
  ...combsWithRep(1, [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15])
]

export function colorStringToRgb(color) {
  const hex = color.slice(1)
  const r = Number.parseInt(hex.slice(0, 2), 16)
  const g = Number.parseInt(hex.slice(2, 4), 16)
  const b = Number.parseInt(hex.slice(4, 6), 16)
  return [r, g, b]
}

export function floatRgbToInteger(rgb) {
  return rgb.map(v => Math.floor(v * 255))
}

export function separateRgb(rgb) {
  return [(rgb & 0xff0000) >> 16, (rgb & 0x00ff00) >> 8, (rgb & 0x0000ff) >> 0]
}

export function rgb2lab(rgb) {
  if (rgb)
  {
    let r = rgb[0] / 255
    let g = rgb[1] / 255
    let b = rgb[2] / 255
    let x
    let y
    let z
  
    r = r > 0.04045 ? ((r + 0.055) / 1.055) ** 2.4 : r / 12.92
    g = g > 0.04045 ? ((g + 0.055) / 1.055) ** 2.4 : g / 12.92
    b = b > 0.04045 ? ((b + 0.055) / 1.055) ** 2.4 : b / 12.92
  
    x = (r * 0.4124 + g * 0.3576 + b * 0.1805) / 0.95047
    y = (r * 0.2126 + g * 0.7152 + b * 0.0722) / 1.0
    z = (r * 0.0193 + g * 0.1192 + b * 0.9505) / 1.08883
  
    x = x > 0.008856 ? x ** (1 / 3) : 7.787 * x + 16 / 116
    y = y > 0.008856 ? y ** (1 / 3) : 7.787 * y + 16 / 116
    z = z > 0.008856 ? z ** (1 / 3) : 7.787 * z + 16 / 116
  
    return [116 * y - 16, 500 * (x - y), 200 * (y - z)]
  }

  return [0, 0, 0]
  
}

export function deltaE(labA, labB) {
  const deltaL = labA[0] - labB[0]
  const deltaA = labA[1] - labB[1]
  const deltaB = labA[2] - labB[2]
  const c1 = Math.sqrt(labA[1] * labA[1] + labA[2] * labA[2])
  const c2 = Math.sqrt(labB[1] * labB[1] + labB[2] * labB[2])
  const deltaC = c1 - c2
  let deltaH = deltaA * deltaA + deltaB * deltaB - deltaC * deltaC
  deltaH = deltaH < 0 ? 0 : Math.sqrt(deltaH)
  const sc = 1.0 + 0.045 * c1
  const sh = 1.0 + 0.015 * c1
  const deltaLKlsl = deltaL / 1.0
  const deltaCkcsc = deltaC / sc
  const deltaHkhsh = deltaH / sh
  const i =
    deltaLKlsl * deltaLKlsl + deltaCkcsc * deltaCkcsc + deltaHkhsh * deltaHkhsh
  return i < 0 ? 0 : Math.sqrt(i)
}

function combsWithRep(r, xs = []) {
  const comb = (n, ys) => {
    if (n === 0) return ys
    if (!ys.length) {
      return comb(
        n - 1,
        xs.map(x => [x])
      )
    }

    return comb(
      n - 1,
      ys.flatMap(zs => {
        const h = zs[0]
        return xs.slice(xs.indexOf(h)).map(x => [x, ...zs])
      })
    )
  }
  return comb(r, [])
}

export function colorToSequence(colorRgbMap, sequenceToColor, targetRgb) {
  const targetLab = rgb2lab(targetRgb)

  let minDeltaE = Infinity
  let minSequence = []

  for (const comb of combs) {
    const sequence = []
    for (let k = 0; k < comb.length; k++) {
      sequence.push(Object.keys(colorRgbMap)[comb[k]])
    }

    const color = sequenceToColor(sequence, colorRgbMap)
    const lab = rgb2lab(color)
    const delta = deltaE(lab, targetLab)
    if (delta < minDeltaE) {
      minDeltaE = delta
      minSequence = sequence
    }
  }

  // slice colors from the end if deltaE can be improved or stays the same
  for (let i = minSequence.length - 1; i >= 0; i--) {
    const sequence = minSequence.slice(0, i)
    const color = sequenceToColor(sequence, colorRgbMap)
    const lab = rgb2lab(color)
    const delta = deltaE(lab, targetLab)
    if (delta <= minDeltaE) {
      minDeltaE = delta
      if (i === 1) {
        minSequence = sequence
        break
      }
    } else {
      break
    }
  }

  return [minSequence, minDeltaE, sequenceToColor(minSequence, colorRgbMap)]
}

export function sequenceToColorJavaArmor(c,  colorRgbMap) {
  let numberOfColors = 0
  let totalRed = 0
  let totalGreen = 0
  let totalBlue = 0
  let totalMaximum = 0
  for (const color of c) {
    totalRed = totalRed + colorRgbMap[color][0]
    totalGreen = totalGreen + colorRgbMap[color][1]
    totalBlue = totalBlue + colorRgbMap[color][2]
    totalMaximum = totalMaximum + Math.max(...colorRgbMap[color])
    numberOfColors++
  }
  const averageRed = totalRed / numberOfColors
  const averageGreen = totalGreen / numberOfColors
  const averageBlue = totalBlue / numberOfColors
  const averageMaximum = totalMaximum / numberOfColors
  const maximumOfAverage = Math.max(averageRed, averageGreen, averageBlue)

  const gainFactor = averageMaximum / maximumOfAverage

  const resultRed = averageRed * gainFactor
  const resultGreen = averageGreen * gainFactor
  const resultBlue = averageBlue * gainFactor

  return [resultRed, resultGreen, resultBlue]
}

export const colorRgbMap = Object.fromEntries(
  Object.entries(colorMap).map(([k, v]) => [k, separateRgb(v)])
)

export const colorLabMap = Object.fromEntries(
  Object.entries(colorRgbMap).map(([k, v]) => [k, rgb2lab(v)])
)