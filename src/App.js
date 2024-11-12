import React from 'react';
import './App.css';
import ColorGrid from './ColorGrid';


function App() {
  const [file, setFile] = React.useState(null);
  const [image, setImage] = React.useState(null);
  const [imageData, setImageData] = React.useState(null);
  const [dimensions, setDimensions] = React.useState(null);

  const [flatColors, setFlatColors] = React.useState(null);
  const [flatAlphas, setFlatAlphas] = React.useState(null);
  const [decColors, setDecColors] = React.useState(null);

  const hiddenFileInput = React.useRef(null);

  const handleClick = e => {
    hiddenFileInput.current.click();
  };

  const handleChange = e => {
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
          const canvas = document.createElement('canvas');
          const ctx = canvas.getContext('2d');

          canvas.width = img.width;
          canvas.height = img.height;
          ctx.drawImage(img, 0, 0);

          setDimensions({ w: img.width, h: img.height });
          setImageData(ctx.getImageData(0, 0, canvas.width, canvas.height).data);
        };

        img.src = e.target.result;
      };

      reader.readAsDataURL(file);
    }
  }, [file])

  const imageArray = React.useMemo(() => {
    if (imageData && dimensions) {

      const imagePixels = [];

      for (let x = 0; x < dimensions.w; x++) {
        const col = [];
        for (let y = 0; y < dimensions.h; y++) {
          const i = (4 * y * dimensions.w) + 4 * x;
          col.push({ r: imageData[i + 0], g: imageData[i + 1], b: imageData[i + 2], a: imageData[i + 3] });
        }
        imagePixels.push(col);
      }

      return imagePixels;
    }
  }, [imageData, dimensions])

  const outputArray = React.useMemo(() => {
    if (imageArray && dimensions) {

      const outputPixels = [];

      const rect_w = Math.floor(dimensions.w / 16);
      const rect_h = Math.floor(dimensions.h / 16);

      console.log(rect_h);

      for (let x = 0; x < 16; x++) {
        const col = [];
        for (let y = 0; y < 16; y++) {
          let r = 0;
          let g = 0;
          let b = 0;
          let a = 0;
          let c = 0;

          let start_x = x * rect_w;
          let start_y = y * rect_h;

          for (let rect_x = 0; rect_x < rect_w; rect_x++) {
            for (let rect_y = 0; rect_y < rect_h; rect_y++) {

              const pixel = imageArray[start_x + rect_x][start_y + rect_y];
              if (pixel) {
                r += pixel.r;
                g += pixel.g;
                b += pixel.b;
                a += pixel.a;
                c++;
              }
            }
          }

          r /= c;
          g /= c;
          b /= c;
          a /= c;

          col.push({ r: Math.floor(r), g: Math.floor(g), b: Math.floor(b), a: Math.floor(a) })
        }
        outputPixels.push(col);
      }
      return outputPixels;
    }
  }, [imageArray, dimensions])

  React.useEffect(() => {
    if (outputArray) {

      const colorTable = [];
      const alphaTable = [];
      const decTable = [];

      for (let i = 0; i < 256; i++) {
        let x = i % 16;
        let y = 15 - ((i / 16) | 0);
        const pixel = outputArray[x][y];
        colorTable.push(`rgb(${pixel.r},${pixel.g},${pixel.b})`);
        decTable.push(pixel.r * 256 * 256 + pixel.g * 256 + pixel.b)
        alphaTable.push(pixel.a > 0);
      }

      setFlatColors(colorTable);
      setFlatAlphas(alphaTable);
      setDecColors(decTable);
    }
  }, [outputArray])

  const giveCommand = React.useMemo(() => {

    if (flatAlphas && decColors) {
      return `/give @p diamond_sword[item_model="glam:glam_base",custom_model_data={flags:[${flatAlphas}],colors:[${decColors}]}]`
    }
  }, [flatAlphas, decColors])

  return (
    <div className="App">
      <div className="App-header">
        <div style={{ width: '20%' }}>
          <h2 style={{ lineHeight: 0.25 }}>Glamour Table</h2></div>
        <div style={{ width: '60%' }}>
          <h4 style={{ lineHeight: 0.05 }}>In-Game Texture Editor for Minecraft Java 24w45a</h4></div>
        <div style={{ width: '20%' }}><a href='https://dqwertyc.dev'>dqwertyc.dev</a></div>
      </div>
      <div className="App-body">
        <h4 style={{ lineHeight: 0.05 }}>Image Converter</h4>
        <div className='Image-holder'>
          <div className='Image'>
            {file == null ?
              <>
                <button className="button-upload" onClick={handleClick}>
                  Upload a file
                </button>
                <input type="file"
                  onChange={handleChange}
                  ref={hiddenFileInput}
                  accept=".png"
                  style={{ display: 'none' }} />
              </>
              :
              <img src={image} width={320} height={320} />
            }

          </div>
          <div style={{ width: '40px' }}><p>{'=>'}</p></div>
          {flatColors == null ? <div className='Image' /> : <ColorGrid table={flatColors} />}

        </div>
        {giveCommand ?
          <>
            <button className="Command-button" onClick={() => { navigator.clipboard.writeText(giveCommand) }}>Copy Command</button>
            <code className="Command-holder">
              {giveCommand}
            </code>
          </> : <></>}

      </div>
    </div >
  );
}

export default App;
