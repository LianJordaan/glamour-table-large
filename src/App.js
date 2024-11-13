import React from "react";
import "./App.css";
import ColorGrid from "./ColorGrid";
import quanti from "quanti";

import {
  colorRgbMap,
  sequenceToColorFloatAverage,
  colorToSequence,
} from "./Colors";

function App() {
  const [file, setFile] = React.useState(null);
  const [image, setImage] = React.useState(null);
  const [imageData, setImageData] = React.useState(null);

  const [exactColors, setExactColors] = React.useState(null);
  const [intColors, setIntColors] = React.useState(null);
  const [paletteIds, setPaletteIds] = React.useState(null);
  const [alphas, setAlphas] = React.useState(null);

  const [highlightIndex, setHighlightIndex] = React.useState(-1);
  const [palettes, setPalettes] = React.useState(null);

  // User Settings
  const [target, setTarget] = React.useState("@p");
  const [itemId, setItemId] = React.useState("poisonous_potato");
  const [largeModel, setLargeModel] = React.useState(false);
  const [showId, setShowId] = React.useState(false);
  const [quantizeColors, setQuantizeColors] = React.useState(false);
  const [colorCount, setColorCount] = React.useState("8");

  const displayInfo = React.useMemo(() => {
    return {
      exactColors,
      paletteIds,
      alphas,
      highlightIndex,
      palettes,
      quantizeColors,
      showId,
    };
  }, [
    alphas,
    exactColors,
    highlightIndex,
    paletteIds,
    palettes,
    quantizeColors,
    showId,
  ]);

  const hiddenFileInput = React.useRef(null);

  const handleClick = (e) => {
    hiddenFileInput.current.click();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    if (e.dataTransfer.files.length > 0) {
      setFile(e.dataTransfer.files[0]);
      setImage(URL.createObjectURL(e.dataTransfer.files[0]));
    }
  };

  const handleChange = (e) => {
    setFile(e.target.files[0]);
    setImage(URL.createObjectURL(e.target.files[0]));
    //handleFile(fileUploaded);
  };

  React.useEffect(() => {
    if (file) {
      const reader = new FileReader();

      reader.onload = (e) => {
        const img = new Image();

        img.onload = () => {
          const canvas = document.createElement("canvas");
          const ctx = canvas.getContext("2d");

          canvas.width = 16;
          canvas.height = 16;
          ctx.drawImage(img, 0, 0, 16, 16);

          const imageData = ctx.getImageData(
            0,
            0,
            canvas.width,
            canvas.height
          ).data;

          setImageData(imageData);
        };

        img.src = e.target.result;
      };

      reader.readAsDataURL(file);
    }
  }, [colorCount, file]);

  React.useEffect(() => {
    if (imageData) {
      const baseColors = [];
      const colorArrays = [];
      const colorInts = [];
      const alphas = [];
      const paletteId = [];
      const dyePalette = [];

      for (let i = 0; i < 256; i++) {
        let x = i % 16;
        let y = 15 - ((i / 16) | 0);

        let j = 16 * y + x;

        const [r, g, b, a] = [
          imageData[4 * j + 0],
          imageData[4 * j + 1],
          imageData[4 * j + 2],
          imageData[4 * j + 3],
        ];

        baseColors.push(r);
        baseColors.push(g);
        baseColors.push(b);

        alphas.push(a > 16);
      }

      const quantizedColors = [];
      if (quantizeColors) {
        const quantResult = quanti(baseColors, parseInt(colorCount), 3);

        for (let i = 0; i < parseInt(colorCount); i++) {
          const color = quantResult.palette[i];
          const result = colorToSequence(
            colorRgbMap,
            sequenceToColorFloatAverage,
            color
          );

          dyePalette.push({
            index: i,
            display: 0,
            color: result[2],
            sequence: result[0],
            count: 0,
          });
        }

        for (let i = 0; i < 256; i++) {
          const [r, g, b] = quantResult.map(baseColors, 3 * i);
          quantizedColors.push(r);
          quantizedColors.push(g);
          quantizedColors.push(b);

          let index = -1;
          for (let j = 0; j < colorCount && index === -1; j++) {
            if (
              r === quantResult.palette[j][0] &&
              g === quantResult.palette[j][1] &&
              b === quantResult.palette[j][2]
            ) {
              index = j;
              if (alphas[i]) {
                dyePalette[j].count++;
              }
            }
          }

          paletteId.push(index);
        }

        let id = 1;

        for (let i = 0; i < parseInt(colorCount); i++) {
          if (dyePalette[i].count > 0) {
            dyePalette[i].display = id++;
          }
        }

        setPalettes(dyePalette);
      } else {
        for (let i = 0; i < 256; i++) {
          quantizedColors.push(baseColors[3 * i + 0]);
          quantizedColors.push(baseColors[3 * i + 1]);
          quantizedColors.push(baseColors[3 * i + 2]);
          paletteId.push(-1);
        }
      }

      for (let i = 0; i < 256; i++) {
        const [r, g, b] = [
          quantizedColors[3 * i + 0],
          quantizedColors[3 * i + 1],
          quantizedColors[3 * i + 2],
        ];
        colorArrays.push([r, g, b]);
        colorInts.push(256 * 256 * r + 256 * g + b);
      }

      setExactColors(colorArrays);
      setAlphas(alphas);
      setPaletteIds(paletteId);
      setIntColors(colorInts);
    }
  }, [colorCount, imageData, quantizeColors]);

  const paletteDisplay = React.useMemo(() => {
    if (quantizeColors && palettes) {
      return (
        <div className="Scrollable">
          {palettes.map((entry) => {
            const handleChange = (e) => {
              if (e.target.checked) {
                setHighlightIndex(entry.index);
              } else {
                setHighlightIndex(-1);
              }
            };

            const counts = {};
            entry.sequence.forEach(function (x) {
              counts[x] = (counts[x] || 0) + 1;
            });

            const dyeCounts = [];
            Object.keys(counts).forEach((key) => {
              dyeCounts.push(
                `${counts[key]}×${key
                  .replace(/([A-Z])/g, " $1")
                  .replace(/^./, function (str) {
                    return str.toUpperCase();
                  })}`
              );
            });

            if (entry.count > 0) {
              let r = parseInt(entry.color[0]);
              let g = parseInt(entry.color[1]);
              let b = parseInt(entry.color[2]);

              let color = `rgb(${r},${g},${b})`;
              let textColor = "rgb(255,255,255)";

              if (r > 160 && g > 160 && b > 160) {
                textColor = "rgb(0,0,0)";
              }

              return (
                <div className="Color-row">
                  <div className="Color-entry-a">
                    <input
                      type="checkbox"
                      onChange={handleChange}
                      checked={highlightIndex === entry.index}
                    ></input>
                  </div>
                  <p className="Color-entry-a">{entry.display}</p>
                  <p
                    className="Color-entry-b"
                    style={{ backgroundColor: color, color: textColor }}
                  >{`(${r}, ${g}, ${b})`}</p>
                  <p className="Color-entry-c">{dyeCounts.join(", ")}</p>
                </div>
              );
            }
            return null;
          })}
        </div>
      );
    }
  }, [highlightIndex, palettes, quantizeColors]);

  const giveCommand = React.useMemo(() => {
    if (alphas && intColors) {
      return `/give ${target} ${itemId}[item_model="${
        largeModel ? "glam:glam_large" : "glam:glam_base"
      }",custom_model_data={flags:[${alphas.join(
        ",\u200B"
      )}],colors:[${intColors.join(",\u200B")}]}]`;
    }
  }, [alphas, intColors, itemId, largeModel, target]);

  const removeZWSP = (str) => {
    return str.replace(/\u200B/g, "");
  };

  function handleCopy(e) {
    navigator.clipboard.writeText(removeZWSP(e.target.value));
  }

  return (
    <div className="App">
      <div className="App-header">
        <div style={{ width: "20%" }}>
          <h2 style={{ lineHeight: 0.25 }}>Glamour Table</h2>
        </div>
        <div style={{ width: "60%" }}>
          <h4 style={{ lineHeight: 0.05 }}>
            In-Game Texture Editor for Minecraft Java 24w46a
          </h4>
        </div>
        <div style={{ width: "20%" }}>
          <a href="https://dqwertyc.dev">dqwertyc.dev</a>
        </div>
      </div>
      <div className="App-body">
        <a href="https://modrinth.com/datapack/glamour-table">
          Get the Pack on Modrinth
        </a>
        <div className="Image-holder">
          <div
            className="Image"
            onDrop={handleDrop}
            onDragOver={(event) => event.preventDefault()}
          >
            <img
              alt="Uploaded File"
              className="Image"
              src={image}
              style={{
                imageRendering: "pixelated",
              }}
            />
          </div>

          <div style={{ width: "40px" }}>
            <p>{"  "}</p>
          </div>
          {exactColors == null ? (
            <div className="Image" />
          ) : (
            <ColorGrid displayInfo={displayInfo} />
          )}
        </div>
        <div className="Command-row">
          <button className="button-upload" onClick={handleClick}>
            Upload a file
          </button>
          <input
            type="file"
            onChange={handleChange}
            ref={hiddenFileInput}
            accept=".png"
            style={{ display: "none" }}
          />
        </div>
        <div className="Command-row">
          <label>
            Target:{" "}
            <input value={target} onChange={(e) => setTarget(e.target.value)} />
          </label>
          <label>
            Item Id:{" "}
            <input value={itemId} onChange={(e) => setItemId(e.target.value)} />
          </label>
          <label>
            Use Large Model:{" "}
            <input
              type="checkbox"
              checked={largeModel}
              onChange={(e) => setLargeModel(e.target.checked)}
            />
          </label>
        </div>
        <div className="Command-row">
          <label>
            Dyeable Colors:{" "}
            <input
              type="checkbox"
              checked={quantizeColors}
              onChange={(e) => setQuantizeColors(e.target.checked)}
            />
          </label>

          <label>
            Max Color Count:{" "}
            <input
              value={colorCount}
              disabled={!quantizeColors}
              onChange={(e) => setColorCount(e.target.value)}
            />
          </label>

          <label>
            Show Color Ids:{" "}
            <input
              type="checkbox"
              checked={showId}
              onChange={(e) => setShowId(e.target.checked)}
            />
          </label>
        </div>
        {giveCommand ? (
          <>
            <button
              className="Command-button"
              onClick={() => {
                navigator.clipboard.writeText(removeZWSP(giveCommand));
              }}
            >
              Copy Command
            </button>
            <code className="Command-holder" onCopy={handleCopy}>
              {giveCommand}
            </code>
          </>
        ) : (
          <></>
        )}
        {paletteDisplay}
      </div>
      <div className="App-footer"/>
    </div>
  );
}

export default App;
