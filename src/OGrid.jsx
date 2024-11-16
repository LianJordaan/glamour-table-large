import React, { useMemo } from 'react';

const OptimizedColorGrid = ({ displayInfo }) => {
  const gridData = useMemo(() => {
    if (!displayInfo || !displayInfo.exactColors) {
      return [];
    }

    const data = [];
    for (let x = 0; x < 16; x++) {
      for (let y = 0; y < 16; y++) {
        const cellId = 16 * (15-x) + (y);
        const exactColor = displayInfo.exactColors[cellId] || [0, 0, 0];
        const paletteId = displayInfo.paletteIds ? displayInfo.paletteIds[cellId] : null;
        const alpha = displayInfo.alphas ? displayInfo.alphas[cellId] : 1;
        const palette = paletteId != null && displayInfo.palettes ? displayInfo.palettes[paletteId] : null;
        
        const color = displayInfo.quantizeColors && palette ? palette.color : exactColor;
        
        const visible = alpha && !(displayInfo.quantizeColors && displayInfo.highlightIndex >= 0 && displayInfo.highlightIndex !== paletteId);
        
        const colorString = visible ? `rgb(${color[0]},${color[1]},${color[2]})` : 'rgb(128, 128, 128)';
        
        const brightCount = color.filter(c => c > 160).length;
        const textColorString = brightCount >= 2 ? 'rgb(0,0,0)' : 'rgb(255,255,255)';
        
        data.push({ x, y, colorString, textColorString, palette, visible });
      }
    }
    return data;
  }, [displayInfo]);

  if (!displayInfo || !displayInfo.exactColors) {
    return <div>Loading...</div>;
  }

  return (
    <div className="items-center justify-center Grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(16, 20px)' }}>
      {gridData.map(({ x, y, colorString, textColorString, palette, visible }) => (
        <div
          key={`${x}-${y}`}
          style={{
            width: '20px',
            height: '20px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: colorString,
          }}
        >
          {displayInfo.quantizeColors && displayInfo.showId && palette && visible && (
            <p style={{ fontSize: '8pt', color: textColorString, margin: 0 }}>
              {palette.display}
            </p>
          )}
        </div>
      ))}
    </div>
  );
};

export default OptimizedColorGrid;