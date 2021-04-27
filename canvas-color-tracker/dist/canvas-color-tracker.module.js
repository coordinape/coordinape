function _classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}

function _defineProperties(target, props) {
  for (var i = 0; i < props.length; i++) {
    var descriptor = props[i];
    descriptor.enumerable = descriptor.enumerable || false;
    descriptor.configurable = true;
    if ("value" in descriptor) descriptor.writable = true;
    Object.defineProperty(target, descriptor.key, descriptor);
  }
}

function _createClass(Constructor, protoProps, staticProps) {
  if (protoProps) _defineProperties(Constructor.prototype, protoProps);
  if (staticProps) _defineProperties(Constructor, staticProps);
  return Constructor;
}

function _slicedToArray(arr, i) {
  return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest();
}

function _arrayWithHoles(arr) {
  if (Array.isArray(arr)) return arr;
}

function _iterableToArrayLimit(arr, i) {
  if (typeof Symbol === "undefined" || !(Symbol.iterator in Object(arr))) return;
  var _arr = [];
  var _n = true;
  var _d = false;
  var _e = undefined;

  try {
    for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) {
      _arr.push(_s.value);

      if (i && _arr.length === i) break;
    }
  } catch (err) {
    _d = true;
    _e = err;
  } finally {
    try {
      if (!_n && _i["return"] != null) _i["return"]();
    } finally {
      if (_d) throw _e;
    }
  }

  return _arr;
}

function _unsupportedIterableToArray(o, minLen) {
  if (!o) return;
  if (typeof o === "string") return _arrayLikeToArray(o, minLen);
  var n = Object.prototype.toString.call(o).slice(8, -1);
  if (n === "Object" && o.constructor) n = o.constructor.name;
  if (n === "Map" || n === "Set") return Array.from(o);
  if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen);
}

function _arrayLikeToArray(arr, len) {
  if (len == null || len > arr.length) len = arr.length;

  for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i];

  return arr2;
}

function _nonIterableRest() {
  throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
}

var MAX_COLORS = 0xffffff;
var MAX_COLORS_BRAVE = 0x1fffff; // Z-Order curve and Morton codes are used to map from 1d to 3d while preserving
// locality. Then by reversing the order of bits in each channel, the color
// space is traversed in a way that tends to keep colors spaced evenly away
// from eachother. It's clear that if all the colors are adjacent, then collisions
// due to anti-aliasing blending are more likely, what would be optimum is an
// interesting question: 
// https://dsp.stackexchange.com/questions/74600/error-correcting-code-using-rgb-space-with-a-lookup-table
// Morton code and decode:
// http://johnsietsma.com/2019/12/05/morton-order-introduction/
// https://fgiesen.wordpress.com/2009/12/13/decoding-morton-codes/

var part1By2 = function part1By2(x) {
  x = x & 0x000003ff; // x = ---- ---- ---- ---- ---- --98 7654 3210

  x = (x ^ x << 16) & 0xff0000ff; // x = ---- --98 ---- ---- ---- ---- 7654 3210

  x = (x ^ x << 8) & 0x0300f00f; // x = ---- --98 ---- ---- 7654 ---- ---- 3210

  x = (x ^ x << 4) & 0x030c30c3; // x = ---- --98 ---- 76-- --54 ---- 32-- --10

  x = (x ^ x << 2) & 0x09249249; // x = ---- 9--8 --7- -6-- 5--4 --3- -2-- 1--0

  return x;
};

var compact1By2 = function compact1By2(x) {
  x = x & 0x09249249; // x = ---- 9--8 --7- -6-- 5--4 --3- -2-- 1--0

  x = (x ^ x >> 2) & 0x030c30c3; // x = ---- --98 ---- 76-- --54 ---- 32-- --10

  x = (x ^ x >> 4) & 0x0300f00f; // x = ---- --98 ---- ---- 7654 ---- ---- 3210

  x = (x ^ x >> 8) & 0xff0000ff; // x = ---- --98 ---- ---- ---- ---- 7654 3210

  x = (x ^ x >> 16) & 0x000003ff; // x = ---- ---- ---- ---- ---- --98 7654 3210

  return x;
};

var encodeMorton3 = function encodeMorton3(r, g, b) {
  return (part1By2(r) << 2) + (part1By2(g) << 1) + part1By2(b);
};

var decodeMorton3 = function decodeMorton3(code) {
  return {
    r: compact1By2(code >> 2),
    g: compact1By2(code >> 1),
    b: compact1By2(code)
  };
};

var reverseEightBits = function reverseEightBits(x) {
  x = (x & 0xf0) >> 4 | (x & 0x0f) << 4;
  x = (x & 0xcc) >> 2 | (x & 0x33) << 2;
  x = (x & 0xaa) >> 1 | (x & 0x55) << 1;
  return x >>> 0;
};

var hexColorToRgb = function hexColorToRgb(hex) {
  var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? [parseInt(result[1], 16), parseInt(result[2], 16), parseInt(result[3], 16)] : null;
};

var intToHexPair = function intToHexPair(n) {
  return n.toString(16).padStart(2, "0");
};

var reverseAndHex = function reverseAndHex(n) {
  return intToHexPair(reverseEightBits(n));
};

var intToColor = function intToColor(n) {
  var _decodeMorton = decodeMorton3(n),
      r = _decodeMorton.r,
      g = _decodeMorton.g,
      b = _decodeMorton.b;

  return "#".concat(reverseAndHex(r)).concat(reverseAndHex(g)).concat(reverseAndHex(b));
};

var rgbToInt = function rgbToInt(r, g, b) {
  return encodeMorton3(reverseEightBits(r), reverseEightBits(g), reverseEightBits(b));
};

var _default = /*#__PURE__*/function () {
  function _default() {
    var _this = this;

    _classCallCheck(this, _default);

    // indexed objects for rgb lookup, position 0 reserved for background.
    this.registry = [null];
    this.maxColors = MAX_COLORS;
    this.isBrave = false; // Brave randomly will change the lowest bit of R, G, or B for context
    // getImageData return values. This is a privacy protecting feature.

    navigator.brave && navigator.brave.isBrave().then(function (res) {
      if (res) {
        _this.isBrave = true; // The last bit of r, g, b is indexed last.

        _this.maxColors = MAX_COLORS_BRAVE;
      }
    });
  }

  _createClass(_default, [{
    key: "register",
    value: function register(obj) {
      if (this.registry.length >= this.maxColors) {
        return null; // Registry is full
      }

      var color = intToColor(this.registry.length);
      this.registry.push(obj);
      return color;
    }
  }, {
    key: "lookup",
    value: function lookup(color) {
      var _this$registry$rgbToI;

      var _ref = typeof color === "string" ? hexColorToRgb(color) : color,
          _ref2 = _slicedToArray(_ref, 3),
          r = _ref2[0],
          g = _ref2[1],
          b = _ref2[2];

      if (this.isBrave) {
        // First bit could be fiddled, so zero it.
        r = r & 0xfe;
        g = g & 0xfe;
        b = b & 0xfe;
      }

      return (_this$registry$rgbToI = this.registry[rgbToInt(r, g, b)]) !== null && _this$registry$rgbToI !== void 0 ? _this$registry$rgbToI : null;
    }
  }]);

  return _default;
}();

export default _default;
