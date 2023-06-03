/* eslint-disable */
/*(c) shellderr 2023 BSD-2*/

const { sin, cos, floor, abs, sqrt, PI } = Math;

const defaultrule = {
  axiom: 'X',
  theta: 24,
  delta: 5,
  F: 'FF',
  X: 'F-[[X]+X]+F[+FX]-X',
};

const turtle = {
  geom: [],
  stack: [],
  delta: 8,
  theta: PI * 0.5,
  pos: [0, 0, 0, 1],
  dir: [0, -1, 0, 1],
};

const routines = {
  F: t => {
    let a = [t.pos];
    t.pos = addv(t.pos, mults(t.dir, t.delta));
    a.push(t.pos);
    t.geom.push(a);
  },
  f: t => {
    t.pos = addv(t.pos, mults(t.dir, t.delta));
  },
  '-': t => {
    t.dir = vec_mul(t.dir, z_rot(t.theta));
  },
  '+': t => {
    t.dir = vec_mul(t.dir, z_rot(-t.theta));
  },
  '&': t => {
    t.dir = vec_mul(t.dir, x_rot(t.theta));
  },
  '^': t => {
    t.dir = vec_mul(t.dir, x_rot(-t.theta));
  },
  '\\': t => {
    t.dir = vec_mul(t.dir, y_rot(t.theta));
  },
  '/': t => {
    t.dir = vec_mul(t.dir, y_rot(-t.theta));
  },
  '|': t => {
    t.dir = vec_mul(t.dir, z_rot(PI));
  },
  '[': t => {
    t.stack.push({ pos: t.pos, dir: t.dir });
  },
  ']': t => {
    let f = t.stack.pop();
    if (f) {
      t.pos = f.pos;
      t.dir = f.dir;
    }
  },
};

function mulberry32(a) {
  return function () {
    var t = (a += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function sequence(rules, n, _rand) {
  let str = rules.axiom;
  let rand = _rand ? mulberry32(_rand) : Math.random;
  for (let i = 0; i < n; i++) {
    let s = '';
    for (let c of str) {
      let term = null;
      if (rules[c] instanceof Array) {
        term = rules[c][Math.round(rand() * (rules[c].length - 1))];
      } else term = rules[c];
      s += term == undefined ? c : term;
    }
    str = s;
  }
  return str;
}

function build(turtle, rules, n, rand = 0) {
  turtle.pos = [0, 0, 0, 1];
  turtle.dir = [0, -1, 0, 1];
  turtle.geom = [];
  turtle.stack = [];
  if (n == 0) n = rules.n ? rules.n : 3;
  let s = sequence(rules, n, rand);
  if (rules.theta) turtle.theta = rules.theta * (PI / 180);
  if (rules.delta) turtle.delta = rules.delta;
  for (let c of s) if (routines[c]) routines[c](turtle);
}

function normalize(v, w, h) {
  return [(2 * v[0] - w) / h, (2 * v[1] - h) / h, (2 * v[2] - h) / h, 1];
}

function recenter(geom, x, y, shift = true) {
  let cx = 0,
    cy = 0,
    cz = 0;
  for (let i = 0; i < geom.length; i++) {
    geom[i] = normalize(geom[i], x, y);
    cx += geom[i][0];
    cy += geom[i][1];
    cz += geom[i][2];
  }
  cx /= geom.length;
  cy /= geom.length;
  cz /= geom.length;
  if (!shift) {
    cx = cy = cz = -1;
  }
  for (let i = 0; i < geom.length; i++) {
    // geom[i] = [geom[i][0]-cx, geom[i][1]-cy, geom[i][2]-cz]
    geom[i][0] -= cx;
    geom[i][1] -= cy;
    geom[i][2] -= cz;
  }
  return geom;
}

function index(geom) {
  let vertices = [],
    indices = [];
  let i = 0;
  for (let el of geom) {
    vertices.push(...el);
    indices.push([i++, i++]);
  }
  return { v: vertices, i: indices };
}

export default function lsystem(
  rules,
  n = 3,
  shift,
  rand = 0,
  w = 400,
  h = 400
) {
  turtle.geom = [];
  turtle.stack = [];
  build(turtle, rules || defaultrule, n, rand);
  let model = index(turtle.geom);
  recenter(model.v, w, h, shift);
  return model;
}

function x_rot(tx) {
  return [
    [1, 0, 0, 0],
    [0, cos(tx), -sin(tx), 0],
    [0, sin(tx), cos(tx), 0],
    [0, 0, 0, 1],
  ];
}

function y_rot(ty) {
  return [
    [cos(ty), 0, sin(ty), 0],
    [0, 1, 0, 0],
    [-sin(ty), 0, cos(ty), 0],
    [0, 0, 0, 1],
  ];
}

function z_rot(tz) {
  return [
    [cos(tz), -sin(tz), 0, 0],
    [sin(tz), cos(tz), 0, 0],
    [0, 0, 1, 0],
    [0, 0, 0, 1],
  ];
}

function create_rot(tx, ty, tz) {
  let rot = [
    [1, 0, 0, 0],
    [0, 1, 0, 0],
    [0, 0, 1, 0],
    [0, 0, 0, 1],
  ];
  rot = mat_mul_4(rot, z_rot(tz));
  rot = mat_mul_4(rot, y_rot(ty));
  rot = mat_mul_4(rot, x_rot(tx));
  return rot;
}

function mat_mul_4(a, b) {
  let mat = [];
  for (let i = 0; i < a.length; i++) {
    mat.push([
      a[i][0] * b[0][0] +
        a[i][1] * b[1][0] +
        a[i][2] * b[2][0] +
        a[i][3] * b[3][0],
      a[i][0] * b[0][1] +
        a[i][1] * b[1][1] +
        a[i][2] * b[2][1] +
        a[i][3] * b[3][1],
      a[i][0] * b[0][2] +
        a[i][1] * b[1][2] +
        a[i][2] * b[2][2] +
        a[i][3] * b[3][2],
      a[i][0] * b[0][3] +
        a[i][1] * b[1][3] +
        a[i][2] * b[2][3] +
        a[i][3] * b[3][3],
    ]);
  }
  return mat;
}

function vec_mul(v, t) {
  return [
    v[0] * t[0][0] + v[1] * t[1][0] + v[2] * t[2][0] + v[3] * t[3][0],
    v[0] * t[0][1] + v[1] * t[1][1] + v[2] * t[2][1] + v[3] * t[3][1],
    v[0] * t[0][2] + v[1] * t[1][2] + v[2] * t[2][2] + v[3] * t[3][2],
    v[0] * t[0][3] + v[1] * t[1][3] + v[2] * t[2][3] + v[3] * t[3][3],
  ];
}

function addv(a, b) {
  return [a[0] + b[0], a[1] + b[1], a[2] + b[2], 1];
}
function subv(a, b) {
  return [a[0] - b[0], a[1] - b[1], a[2] - b[2], 1];
}
function multv(a, b) {
  return [a[0] * b[0], a[1] * b[1], a[2] * b[2], 1];
}
function mults(v, s) {
  return [v[0] * s, v[1] * s, v[2] * s, 1];
}
function adds(v, s) {
  return [v[0] + s, v[1] + s, v[2] + s, 1];
}
