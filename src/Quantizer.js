class ColorQuantizer {
  constructor(colorCount = 256) {
    this.colorCount = colorCount;
  }

  quantize(pixels, alphas) {
    const clusters = this.kMeansClustering(pixels, alphas, this.colorCount);
    return new Palette(clusters);
  }

  extractColors(pixels) {
    const colors = [];
    for (let i = 0; i < pixels.length; i += 3) {
      colors.push(pixels.slice(i, i + 3));
    }
    return colors;
  }

  kMeansClustering(pixels, alphas, k) {
    const colors = this.extractColors(pixels);
    let centroids = this.sortColors(pixels, alphas, k);


    let oldCentroids = [];
    let iterations = 0;

    while (!this.centroidsEqual(centroids, oldCentroids) && iterations < 50) {
      oldCentroids = [...centroids];
      const clusters = new Array(k).fill().map(() => []);

      for (const color of colors) {
        const closestCentroidIndex = this.findClosestCentroidIndex(color, centroids);
        clusters[closestCentroidIndex].push(color);
      }

      centroids = clusters.map(cluster =>
        cluster.length > 0 ? this.calculateAverage(cluster) : this.getRandomColor()
      );

      iterations++;
    }

    return centroids;
  }

  sortColors(pixels, alphas, count) {
    const colorCounts = {};
    for (let i = 0; i < 256; i++) {

      if (alphas[i]) {
        const [r, g, b] = pixels.slice(3 * i, 3 * i + 3);
        const rgb = `${r & 0xfa},${g& 0xfa},${b& 0xfa}`

        if (!colorCounts[rgb]) {
          colorCounts[rgb] = 0;
        }

        colorCounts[rgb] = colorCounts[rgb] + 1;
      }
    }

    const sortedColors = Object.keys(colorCounts).sort((a, b) => (colorCounts[b] - colorCounts[a] === 0 ? a.localeCompare(b) : colorCounts[b] - colorCounts[a]));

    const len = Math.min(count, sortedColors.length);

    const trimmedColors = sortedColors.slice(0, len);

    return trimmedColors.map((rgb) => {
      let [r,g,b] = rgb.split(",");
      return [parseInt(r),parseInt(g),parseInt(b)]
    })
  }

  initializeCentroids(colors, k) {
    const centroids = [];
    for (let i = 0; i < k; i++) {
      centroids.push(colors[Math.floor(Math.random() * colors.length)]);
    }
    return centroids;
  }

  centroidsEqual(a, b) {
    if (a.length !== b.length) return false;
    for (let i = 0; i < a.length; i++) {
      if (!this.colorEqual(a[i], b[i])) return false;
    }
    return true;
  }

  colorEqual(a, b) {
    return a.every((val, i) => val === b[i]);
  }

  findClosestCentroidIndex(color, centroids) {
    let minDistance = Infinity;
    let closestIndex = 0;

    for (let i = 0; i < centroids.length; i++) {
      const distance = this.colorDistance(color, centroids[i]);
      if (distance < minDistance) {
        minDistance = distance;
        closestIndex = i;
      }
    }

    return closestIndex;
  }

  colorDistance(a, b) {
    return Math.sqrt(a.reduce((sum, val, i) => sum + Math.pow(val - b[i], 2), 0));
  }

  calculateAverage(cluster) {
    const sum = cluster.reduce((acc, color) => color.map((val, i) => acc[i] + val), new Array(cluster[0].length).fill(0));
    return sum.map(val => Math.round(val / cluster.length));
  }

  getRandomColor() {
    return new Array(3).fill().map(() => Math.floor(Math.random() * 256));
  }
}

class Palette {
  constructor(palette) {
    this.palette = palette;
  }

  mapIndex(color, offset = 0) {
    return this.findClosestColorIndex(color.slice(offset, offset + 3));
  }

  map(color, offset = 0) {
    return this.palette[this.mapIndex(color, offset)];
  }

  makeIndexMap(data) {
    const indexMap = new Uint8Array(data.length / 3);
    for (let i = 0; i < data.length; i += 3) {
      indexMap[i / 3] = this.mapIndex(data, i);
    }
    return indexMap;
  }

  process(data) {
    for (let i = 0; i < data.length; i += 3) {
      const mappedColor = this.map(data, i);
      data[i] = mappedColor[0];
      data[i + 1] = mappedColor[1];
      data[i + 2] = mappedColor[2];
    }
  }

  findClosestColorIndex(color) {
    let minDistance = Infinity;
    let closestIndex = 0;

    for (let i = 0; i < this.palette.length; i++) {
      const distance = this.colorDistance(color, this.palette[i]);
      if (distance < minDistance) {
        minDistance = distance;
        closestIndex = i;
      }
    }

    return closestIndex;
  }

  colorDistance(a, b) {
    return Math.sqrt(a.reduce((sum, val, i) => sum + Math.pow(val - b[i], 2), 0));
  }
}

export default ColorQuantizer;