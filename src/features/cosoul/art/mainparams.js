/* eslint-disable */
/*(c) shellderr 2023 BSD-2*/
const LEVEL_MAX = 20000;
const OVERFLOW = false;
const fetch_params = false;
const log_params = false;
const fetch_url = 'http://localhost:5000/random';
const fallback_lev = 1;
/*
    params: 
    'id', 'pgive'or'level', 's' 
    's' is a cipher string for url paramaters and is decoded if present
    fetch_params sets the input method: true = json fetch, false = url parse.

    exports: 
    urlParams() - get simple params obj from url parameters
    jsonParams() - get simple params obj from json endpoint
    genParamsObj() - return full params obj from simple params to set in glview
*/
const glob_params = {
  // id derived values
  id: '',
  seed: 0,
  randf: 0,
  // pgive derived level values
  abs_level: 0,
  level: 0,
  norm_level: 0,
  ease_level: 0,
  level_max: LEVEL_MAX,
  use_overflow: OVERFLOW,
  overflow_num: 0,
  // mapping callbacks
  map_callbacks: {
    lsys_rot: params => lsys_rot(params),
    lsys_rule: params => lsys_rule(params),
    geom_poly: params => geom_poly(params),
  },
  guiLevelUpdate: guiLevelUpdate,
  guiIdUpdate: guiIdUpdate,
  // global line colors, set css string manually to init
  line_l: {
    h: 0.2,
    s: 0.77,
    l: 0.72,
    a: 1,
    stroke: 'rgb(223.4, 241.5, 151.2, 1)',
  },
  line_g: { h: 0.7, s: 0.8, l: 0.56, a: 1, stroke: 'rgb(89, 53, 232.56, 1)' },
};

// lsys rule selection weights [index, weight] P_i = w_i/sum(weights)
const lsysweights = accumulateWeights([
  [0, 1],
  [1, 0.8],
  [2, 0.6],
  [3, 0.4],
  [4, 0],
  [5, 0.5],
  [6, 0.4],
  [7, 0.8],
  [8, 0.2],
  [9, 0.5],
  [10, 0],
  [11, 0.2],
  [12, 0.4],
  [13, 0],
]);

// polyhedron selection weights
const polyweights = accumulateWeights([
  [0, 1.2],
  [1, 1],
  [2, 2],
  [3, 0.3],
  [4, 0.7],
  [5, 0.7],
]);

// returns a populated unique params obj from input params
// object is templated by glob_params to use in glvew.setParams
// input is a simple object with pgive, id params
function genParamsObj(obj = {}) {
  let o = Object.assign({ ...glob_params }, obj);
  if (Number(o.pgive)) o.level = o.pgive;
  if (!Number(o.level)) o.level = fallback_lev;
  setParams(o, +o.level, o.id || randID());
  return o;
}

// lsys-rotation callback
function lsys_rot(p) {
  return (p.randf < 0.5 ? 3 : 4) + Math.round(p.norm_level * 2);
}

// lsys-rule callback
function lsys_rule(p) {
  let rule = weightedChoice(lsysweights.arr, lsysweights.sum, p.randf);
  // console.log('rule', rule);
  return rule;
}

// polyhedron callback
function geom_poly(p) {
  let poly = weightedChoice(polyweights.arr, polyweights.sum, p.randf);
  return poly;
}

// gui pgive update
function guiLevelUpdate(l, glv) {
  setParams(glob_params, l, null);
  glv.params = glob_params;
  glv.frame();
}

// gui id update
function guiIdUpdate(v, glv) {
  v = v || randID();
  setParams(glob_params, null, v);
  glv.params = glob_params;
  glv.frame();
  console.log('id', glob_params.id);
}

// test IDs
function randID() {
  let s = Array.from('111', v => String.fromCharCode(Math.random() * 93 + 33));
  return encodeURIComponent(s.join('')).replace(/%/g, '');
}

// get params from url: id, pgive or level, s for cipher
function urlParams() {
  const params = new URLSearchParams(window.location.href);
  let p = {
    id: params.get('id'),
    pgive: params.get('pgive'),
    level: params.get('level'),
    cipher: params.get('s'),
  };
  if (p.pgive) p.level = p.pgive;
  return checkCipher(p);
}

// fetch params from server
async function jsonParams(url) {
  let response = await fetch(url, {
    mode: 'cors',
    accept: 'application/json',
  }).catch(err => console.log(err));
  if (response && response.ok) {
    let data = await response.json();
    if (data.pgive) data.level = data.pgive;
    return data;
  } else console.log(response);
}

// set global params object
function setParams(params, level = null, id = null) {
  if (level != null) {
    let lev = +level;
    params.abs_level = lev;
    params.level = OVERFLOW ? lev % LEVEL_MAX : Math.min(lev, LEVEL_MAX);
    params.norm_level = params.level / LEVEL_MAX;
    params.ease_level = ease(params.norm_level);
    params.overflow_num = OVERFLOW ? Math.floor(lev / LEVEL_MAX) : 0;
  }
  if (id != null) {
    params.id = id;
    params.seed = strHashVal(id);
    params.randf = params.seed ? mulberry32(params.seed)() : Math.random();
  }
}

function ease(x) {
  return (9 ** x - 1) / 8;
}

function logScale(x, b, ofs) {
  return Math.log(1 + ofs * b + x * b - x - ofs * b * x) / Math.log(b);
}

// decode params from cipher string if present: &s=
function checkCipher(p) {
  if (p.cipher) {
    try {
      let s = decodeURLCipher(p.cipher);
      const params = new URLSearchParams(s);
      p.id = params.get('id');
      p.level = params.get('pgive') || params.get('level');
    } catch (err) {
      console.log(err);
    }
  }
  return p;
}

//Copyright (c) 2016, Wei He rot47.net
function rot47(x) {
  let s = [];
  for (let i = 0; i < x.length; i++) {
    let j = x.charCodeAt(i);
    if (j >= 33 && j <= 126) {
      s[i] = String.fromCharCode(33 + ((j + 14) % 94));
    } else {
      s[i] = String.fromCharCode(j);
    }
  }
  return s.join('');
}

// encode url params into rot47 cipher (for server)
// crypto.en(de)crypt with AES settings could also be used.
function encodeURLCipher(str) {
  return encodeURIComponent(rot47(str));
}
// decode cipher (for client)
function decodeURLCipher(str) {
  return rot47(decodeURIComponent(str));
}

// weights array -> cdf
function accumulateWeights(arr) {
  arr.sort((a, b) => a[1] - b[1]);
  let sum = 0;
  for (let i = 0; i < arr.length; i++) {
    sum += arr[i][1];
    if (i > 0) arr[i][1] += arr[i - 1][1];
  }
  return { arr: arr, sum: sum };
}

// get weighted choice
function weightedChoice(arr, sum = 1, rand) {
  let r = rand * sum;
  for (let el of arr) {
    if (r <= el[1]) return el[0];
  }
  return arr.length - 1;
}

// id -> integer seed
function strHashVal(_str) {
  let str = String(_str);
  let hash = 0;
  for (let i = 0, len = str.length; i < len; i++) {
    let chr = str.charCodeAt(i);
    hash = (hash << 5) - hash + chr;
    hash |= 0;
  }
  return hash;
}

// seed -> random float generator
function mulberry32(a) {
  return function () {
    var t = (a += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export { urlParams, jsonParams, genParamsObj };
