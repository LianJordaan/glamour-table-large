import { ChevronDown, ChevronUp, Copy, ImageIcon } from 'lucide-react';
import React, { useEffect, useMemo, useRef, useState } from 'react';

import ColorQuantizer from './Quantizer';

import {
  colorRgbMap,
  colorToSequence,
  sequenceToColorJavaArmor,
} from "./Colors";
import OptimizedColorGrid from './OGrid';

export default function App() {
  const [file, setFile] = useState(null)
  const [image, setImage] = useState(null)
  const [imageData, setImageData] = useState(null)
  const [exactColors, setExactColors] = useState(null)
  const [intColors, setIntColors] = useState(null)
  const [paletteIds, setPaletteIds] = useState(null)
  const [alphas, setAlphas] = useState(null)
  const [highlightIndex, setHighlightIndex] = useState(-1)
  const [palettes, setPalettes] = useState(null)
  const [target, setTarget] = useState('@p')
  const [itemId, setItemId] = useState('poisonous_potato')
  const [largeModel, setLargeModel] = useState(false)
  const [showId, setShowId] = useState(false)
  const [quantizeColors, setQuantizeColors] = useState(false)
  const [colorCount, setColorCount] = useState('8')
  const [isAdvancedOpen, setIsAdvancedOpen] = useState(false)

  const hiddenFileInput = useRef(null)

  const handleClick = () => hiddenFileInput.current.click()

  const handleDrop = (e) => {
    e.preventDefault()
    if (e.dataTransfer.files.length > 0) {
      setFile(e.dataTransfer.files[0])
      setImage(URL.createObjectURL(e.dataTransfer.files[0]))
    }
  }

  const handleChange = (e) => {
    if (e.target?.files[0]) {
      setFile(e.target.files[0])
      setImage(URL.createObjectURL(e.target.files[0]))
    }
  }

  useEffect(() => {
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        const img = new Image()
        img.onload = () => {
          const canvas = document.createElement('canvas')
          const ctx = canvas.getContext('2d')
          canvas.width = 16
          canvas.height = 16
          ctx.drawImage(img, 0, 0, 16, 16)
          setImageData(ctx.getImageData(0, 0, canvas.width, canvas.height).data)
        }
        img.src = e.target.result
      }
      reader.readAsDataURL(file)
    }
  }, [file, colorCount])

  useEffect(() => {
    if (imageData) {
      const baseColors = []
      const alphas = []
      const paletteId = []
      const dyePalette = []

      for (let i = 0; i < 256; i++) {
        const j = 16 * (15 - ((i / 16) | 0)) + (i % 16)
        const [r, g, b, a] = [
          imageData[4 * j],
          imageData[4 * j + 1],
          imageData[4 * j + 2],
          imageData[4 * j + 3],
        ]
        baseColors.push(r, g, b)
        alphas.push(a > 16)
      }

      const quantizedColors = []
      if (quantizeColors) {
        const ColorQuantizerInstance = new ColorQuantizer(parseInt(colorCount))
        const quantResult = ColorQuantizerInstance.quantize(baseColors,3)
        //const quantResult = quanti(baseColors, parseInt(colorCount), 3)
        for (let i = 0; i < parseInt(colorCount); i++) {
          const color = quantResult.palette[i]
          if (color) {
            const result = colorToSequence(colorRgbMap, sequenceToColorJavaArmor, color)
            dyePalette.push({
              index: i,
              display: 0,
              base: color,
              color: result[2],
              sequence: result[0],
              count: 0,
            })
          } else {
            dyePalette.push({
              index: i,
              display: 0,
              base: [0, 0, 0],
              color: [0, 0, 0],
              sequence: [''],
              count: 0,
            })
          }
        }

        for (let i = 0; i < 256; i++) {
          const [r, g, b] = quantResult.map(baseColors, 3 * i)
          quantizedColors.push(r, g, b)
          let index = -1
          for (let j = 0; j < colorCount && index === -1; j++) {
            if (
              r === quantResult.palette[j][0] &&
              g === quantResult.palette[j][1] &&
              b === quantResult.palette[j][2]
            ) {
              index = j
              if (alphas[i]) dyePalette[j].count++
            }
          }
          paletteId.push(index)
        }

        let id = 1
        for (let i = 0; i < parseInt(colorCount); i++) {
          if (dyePalette[i].count > 0) dyePalette[i].display = id++
        }
        setPalettes(dyePalette)
      } else {
        for (let i = 0; i < 256; i++) {
          quantizedColors.push(baseColors[3 * i], baseColors[3 * i + 1], baseColors[3 * i + 2])
          paletteId.push(-1)
        }
      }

      const colorArrays = []
      const colorInts = []
      for (let i = 0; i < 256; i++) {
        const [r, g, b] = [quantizedColors[3 * i], quantizedColors[3 * i + 1], quantizedColors[3 * i + 2]]
        colorArrays.push([r, g, b])
        colorInts.push(256 * 256 * r + 256 * g + b)
      }

      setExactColors(colorArrays)
      setAlphas(alphas)
      setPaletteIds(paletteId)
      setIntColors(colorInts)
    }
  }, [colorCount, imageData, quantizeColors])

  const displayInfo = useMemo(() => {
    return {
      exactColors,
      paletteIds,
      alphas,
      highlightIndex,
      palettes,
      quantizeColors,
      showId,
    }
  }, [exactColors, paletteIds, alphas, highlightIndex, palettes, quantizeColors, showId])

  const giveCommand = useMemo(() => {
    if (alphas && intColors) {
      return `/give ${target} ${itemId}[item_model="${
        largeModel ? 'glam:glam_large' : 'glam:glam_base'
      }",custom_model_data={flags:[${alphas.join(
        ',\u200B'
      )}],colors:[${intColors.join(',\u200B')}]}]`
    }
  }, [alphas, intColors, itemId, largeModel, target])

  const removeZWSP = (str) => str.replace(/\u200B/g, '')

  const handleCopy = () => {
    navigator.clipboard.writeText(removeZWSP(giveCommand))
  }

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 p-8">
      <div className="max-w-4xl mx-auto">
        <header className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-2">Minecraft Texture Editor</h1>
          <p className="text-xl text-gray-400">Create custom textures for Minecraft Java 24w46a</p>
        </header>

        <main className="bg-gray-800 rounded-lg p-8 shadow-xl">
          <div className="flex justify-center mb-8">
            <div
              className="w-64 h-64 border-4 border-dashed border-gray-600 rounded-lg flex items-center justify-center cursor-pointer overflow-hidden"
              onClick={handleClick}
              onDrop={handleDrop}
              onDragOver={(e) => e.preventDefault()}
            >
              {image ? (
                <img
                  src={image}
                  alt="Uploaded texture"
                  className="w-full h-full object-cover"
                  style={{ imageRendering: 'pixelated' }}
                />
              ) : (
                <div className="text-center">
                  <ImageIcon className="w-16 h-16 mx-auto mb-4 text-gray-600" />
                  <p className="text-gray-600">Click or drag to upload</p>
                </div>
              )}
            </div>
            <input
              type="file"
              ref={hiddenFileInput}
              onChange={handleChange}
              accept=".png"
              className="hidden"
            />
          </div>

          <div className="grid grid-cols-2 gap-4 mb-8">
            <div>
              <label className="block text-sm font-medium mb-1">Target</label>
              <input
                type="text"
                value={target}
                onChange={(e) => setTarget(e.target.value)}
                className="w-full px-3 py-2 bg-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Item ID</label>
              <input
                type="text"
                value={itemId}
                onChange={(e) => setItemId(e.target.value)}
                className="w-full px-3 py-2 bg-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div className="flex items-center justify-between mb-8">
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={largeModel}
                onChange={(e) => setLargeModel(e.target.checked)}
                className="form-checkbox text-blue-500"
              />
              <span>Use Large Model</span>
            </label>
            <button
              className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-md transition-colors"
              onClick={() => setIsAdvancedOpen(!isAdvancedOpen)}
            >
              <span>Advanced Options</span>
              {isAdvancedOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>
          </div>

          {isAdvancedOpen && (
            <div className="bg-gray-700 rounded-md p-4 mb-8">
              <div className="grid grid-cols-2 gap-4">
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={quantizeColors}
                    onChange={(e) => setQuantizeColors(e.target.checked)}
                    className="form-checkbox text-blue-500"
                  />
                  <span>Dyeable Colors</span>
                </label>
                <div>
                  <label className="block text-sm font-medium mb-1">Max Color Count</label>
                  <input
                    type="number"
                    value={colorCount}
                    onChange={(e) => setColorCount(e.target.value)}
                    disabled={!quantizeColors}
                    className="w-full px-3 py-2 bg-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
                  />
                </div>
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={showId}
                    onChange={(e) => setShowId(e.target.checked)}
                    className="form-checkbox text-blue-500"
                  />
                  <span>Show Color IDs</span>
                </label>
              </div>
            </div>
          )}

          {giveCommand && (
            <div className="bg-gray-700 rounded-md p-4 mb-8">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-lg font-semibold">Generated Command</h3>
                <button
                  onClick={handleCopy}
                  className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 px-3 py-1 rounded-md transition-colors"
                >
                  <Copy className="w-4 h-4" />
                  <span>Copy</span>
                </button>
              </div>
              <pre className="bg-gray-800 p-4 rounded-md overflow-x-auto text-sm">
                {giveCommand}
              </pre>
            </div>
          )}

          {quantizeColors && palettes && (
            <div className="bg-gray-700 rounded-md p-4">
              <h3 className="text-lg font-semibold mb-4">Color Palette</h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                {palettes.map((entry) => {
                  if (entry.count > 0) {
                    const { r, g, b } = { r: entry.color[0], g: entry.color[1], b: entry.color[2] }
                    const color = `rgb(${r},${g},${b})`
                    const textColor = r > 160 && g > 160 && b > 160 ? 'text-gray-900' : 'text-white'
                    return (
                      <div
                        key={entry.index}
                        className="flex items-center space-x-2 p-2 rounded-md"
                        style={{ backgroundColor: color }}
                      >
                        <input
                          type="checkbox"
                          checked={highlightIndex === entry.index}
                          onChange={(e) => setHighlightIndex(e.target.checked ? entry.index : -1)}
                          className="form-checkbox"
                        />
                        <span className={`font-medium ${textColor}`}>
                          {entry.display}: ({Math.round(r)}, {Math.round(g)}, {Math.round(b)})
                        </span>
                      </div>
                    )
                  }
                  return null
                })}
              </div>
            </div>
          )}

          <div className="mt-8">
            <OptimizedColorGrid displayInfo={displayInfo} />
          </div>
        </main>

        <footer className="mt-12 text-center text-gray-400">
          <p>Datapack by DqwertyC</p>
          <p>Web-App by Arubik</p>
          <a
            href="https://modrinth.com/datapack/glamour-table"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-400 hover:text-blue-300 underline"
          >
            Get the Pack on Modrinth
          </a>
        </footer>
      </div>
    </div>
  )
}