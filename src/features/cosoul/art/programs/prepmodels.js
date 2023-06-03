/* eslint-disable */
/*(c) shellderr 2023 BSD-2*/

import fs from 'fs';
import polyhedra from './selectmodels.js';
import loader from './loader.js';
const { loadObj, edgeList } = loader;
import { dirname } from 'path';
import { fileURLToPath } from 'url';
const __dirname = dirname(fileURLToPath(import.meta.url));

// polyhedra scale adjustments
const atable = [2.5, 1, 2, 1.5, 2, 1.1];

function objArray(set, atable = []) {
  let models = [];
  let p = Object.values(set);
  for (let i = 0; i < p.length; i++) {
    let o = loadObj(p[i], 1 / (atable[i] || 1));
    o = { v: o.vertices.v, i: edgeList(o.indices.v) };
    models.push(o);
  }
  return models;
}

let m = JSON.stringify(objArray(polyhedra, atable));
let s = 'var models = \n' + m + ';\nexport default models;';
fs.writeFileSync(__dirname + '/models.js', s);
