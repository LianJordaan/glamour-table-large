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

  const [colors, setColors] = React.useState(null);
  const [alphas, setAlphas] = React.useState(null);
  const [indices, setIndices] = React.useState(null);
  const [decColors, setDecColors] = React.useState(null);

  const [target, setTarget] = React.useState("@p");
  const [itemId, setItemId] = React.useState("stick");
  const [largeModel, setLargeModel] = React.useState(false);
  const [showId, setShowId] = React.useState(false);

  const [quantizeColors, setQuantizeColors] = React.useState(false);
  const [colorCount, setColorCount] = React.useState("8");
  const [palette, setPalette] = React.useState(null);

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
      const colorStrings = [];
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
      const counts = []
      if (quantizeColors) {
        const quantResult = quanti(baseColors, parseInt(colorCount), 3);

        for (let i = 0; i < parseInt(colorCount); i++) {
          const color = quantResult.palette[i];
          const result = colorToSequence(
            colorRgbMap,
            sequenceToColorFloatAverage,
            color
          );
          quantResult.palette[i] = result[2];
          dyePalette.push(result);
          counts.push(0);
        }



        for (let i = 0; i < 256; i++) {
          const [r, g, b] = quantResult.map(baseColors, 3 * i);
          quantizedColors.push(r);
          quantizedColors.push(g);
          quantizedColors.push(b);

          let index = -1;
          for (let j = 0; j < colorCount && index === -1; j++) {
            if (r === quantResult.palette[j][0] && g === quantResult.palette[j][1] && b === quantResult.palette[j][2]) {
              index = j;
              if (alphas[i]) {
                counts[j]++;
              }
            }
          }

          paletteId.push(index);
        }

        const tmpPalette = [];
        let count = 0;
        let removed = 0;

        for (let i = 0; i < parseInt(colorCount); i++) {
          if (counts[i] > 0)
          {
            tmpPalette.push(dyePalette[i])
            tmpPalette[count].push(count)
            tmpPalette[count].push(counts[i]);
            count++;
          }
          else{
            for (let j = 0; j < 256; j++)
            {
              if (paletteId[j] + removed >= i)
              {
                paletteId[j]--;
              }
            }
            removed++;
          }
        }

        console.log(tmpPalette);

        setPalette(tmpPalette);
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
        colorStrings.push(`rgb(${r},${g},${b})`);
        colorInts.push(256 * 256 * r + 256 * g + b);
      }

      setColors(colorStrings);
      setDecColors(colorInts);
      setAlphas(alphas);
      setIndices(paletteId);
    }
  }, [colorCount, imageData, quantizeColors]);

  const paletteDisplay = React.useMemo(() => {
    if (palette) {
      return (<>
        {palette.map((entry) => {
          if (entry[4] > 0) {
            let r = (parseInt(entry[2][0]));
            let g = (parseInt(entry[2][1]));
            let b = (parseInt(entry[2][2]));

            let color = `rgb(${r},${g},${b})`;
            let textColor = 'rgb(255,255,255)'
            if (r > 160 && g > 160 && b > 160)
            {
             textColor = 'rgb(0,0,0)'
            }

            return (
              <div className="Color-row">
                <p className="Color-entry-a">{entry[3]}</p>
                <p className="Color-entry-b" style={{ backgroundColor: color, color: textColor }}>{`(${r}, ${g}, ${b})`}</p>
                <p className="Color-entry-c">{entry[0].join(' > ')}</p>
              </div >)
          }
        })}
      </>);
    }
  }, [palette])


  const giveCommand = React.useMemo(() => {
    if (alphas && decColors) {
      return `/give ${target} ${itemId}[item_model="${largeModel ? "glam:glam_large" : "glam:glam_base"
        }",custom_model_data={flags:[${alphas.join(
          ",\u200B"
        )}],colors:[${decColors.join(",\u200B")}]}]`;
    }
  }, [alphas, decColors, itemId, largeModel, target]);

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
            In-Game Texture Editor for Minecraft Java 24w45a
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
            style={{
              backgroundImage: `url(${image})`,
              backgroundRepeat: "no-repeat",
              backgroundSize: "cover",
              backgroundPosition: "center",
              imageRendering: "pixelated",
            }}
            onDrop={handleDrop}
            onDragOver={(event) => event.preventDefault()}
          ></div>

          <div style={{ width: "40px" }}>
            <p>{"=>"}</p>
          </div>
          {colors == null ? (
            <div className="Image" />
          ) : (
            <ColorGrid colors={colors} alphas={alphas} indices={indices} showIndex={showId && quantizeColors} />
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
    </div>
  );
}

export default App;
