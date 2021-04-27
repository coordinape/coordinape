const MAX_COLORS = 0xffffff;
const MAX_COLORS_BRAVE = 0x1fffff;

// Z-Order curve and Morton codes are used to map from 1d to 3d while preserving
// locality. Then by reversing the order of bits in each channel, the color
// space is traversed in a way that tends to keep colors spaced evenly away
// from eachother. It's clear that if all the colors are adjacent, then collisions
// due to anti-aliasing blending are more likely, what would be optimum is an
// interesting question: 
// https://dsp.stackexchange.com/questions/74600/error-correcting-code-using-rgb-space-with-a-lookup-table

// Morton code and decode:
// http://johnsietsma.com/2019/12/05/morton-order-introduction/
// https://fgiesen.wordpress.com/2009/12/13/decoding-morton-codes/

const part1By2 = (x) => {
  x = x & 0x000003ff;               // x = ---- ---- ---- ---- ---- --98 7654 3210
  x = (x ^ (x << 16)) & 0xff0000ff; // x = ---- --98 ---- ---- ---- ---- 7654 3210
  x = (x ^ (x << 8)) & 0x0300f00f;  // x = ---- --98 ---- ---- 7654 ---- ---- 3210
  x = (x ^ (x << 4)) & 0x030c30c3;  // x = ---- --98 ---- 76-- --54 ---- 32-- --10
  x = (x ^ (x << 2)) & 0x09249249;  // x = ---- 9--8 --7- -6-- 5--4 --3- -2-- 1--0
  return x;
};

const compact1By2 = (x) => {
  x = x & 0x09249249;               // x = ---- 9--8 --7- -6-- 5--4 --3- -2-- 1--0
  x = (x ^ (x >> 2)) & 0x030c30c3;  // x = ---- --98 ---- 76-- --54 ---- 32-- --10
  x = (x ^ (x >> 4)) & 0x0300f00f;  // x = ---- --98 ---- ---- 7654 ---- ---- 3210
  x = (x ^ (x >> 8)) & 0xff0000ff;  // x = ---- --98 ---- ---- ---- ---- 7654 3210
  x = (x ^ (x >> 16)) & 0x000003ff; // x = ---- ---- ---- ---- ---- --98 7654 3210
  return x;
};

const encodeMorton3 = (r, g, b) =>
  (part1By2(r) << 2) + (part1By2(g) << 1) + part1By2(b);

const decodeMorton3 = (code) => ({
  r: compact1By2(code >> 2),
  g: compact1By2(code >> 1),
  b: compact1By2(code),
});

const reverseEightBits = (x) => {
  x = ((x & 0xf0) >> 4) | ((x & 0x0f) << 4);
  x = ((x & 0xcc) >> 2) | ((x & 0x33) << 2);
  x = ((x & 0xaa) >> 1) | ((x & 0x55) << 1);
  return x >>> 0;
};

const hexColorToRgb = (hex) => {
  var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? [
        parseInt(result[1], 16),
        parseInt(result[2], 16),
        parseInt(result[3], 16),
      ]
    : null;
};

const intToHexPair = (n) => n.toString(16).padStart(2, "0");
const reverseAndHex = (n) => intToHexPair(reverseEightBits(n));

const intToColor = (n) => {
  const { r, g, b } = decodeMorton3(n);
  return `#${reverseAndHex(r)}${reverseAndHex(g)}${reverseAndHex(b)}`;
};

const rgbToInt = (r, g, b) => {
  return encodeMorton3(
    reverseEightBits(r),
    reverseEightBits(g),
    reverseEightBits(b)
  );
};

export default class {
  constructor() {
    // indexed objects for rgb lookup, position 0 reserved for background.
    this.registry = [null];

    this.maxColors = MAX_COLORS;
    this.isBrave = false;

    // Brave randomly will change the lowest bit of R, G, or B for context
    // getImageData return values. This is a privacy protecting feature.
    navigator.brave &&
      navigator.brave.isBrave().then((res) => {
        if (res) {
          this.isBrave = true;
          // The last bit of r, g, b is indexed last.
          this.maxColors = MAX_COLORS_BRAVE;
        }
      });
  }

  register(obj) {
    if (this.registry.length >= this.maxColors) {
      return null; // Registry is full
    }

    const color = intToColor(this.registry.length);
    this.registry.push(obj);
    return color;
  }

  lookup(color) {
    var [r, g, b] = typeof color === "string" ? hexColorToRgb(color) : color;
    if (this.isBrave) {
      // First bit could be fiddled, so zero it.
      r = r & 0xfe;
      g = g & 0xfe;
      b = b & 0xfe;
    }
    return this.registry[rgbToInt(r, g, b)] ?? null;
  }
};
