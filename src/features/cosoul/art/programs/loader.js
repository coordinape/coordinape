/* eslint-disable */
/*(c) shellderr 2023 BSD-2*/

function loadObj(str, scale) {
  let obj = {
    vertices: { v: [], vt: [], vn: [] },
    elements: {
      p: { v: [], vt: [], vn: [] },
      l: { v: [], vt: [], vn: [] },
      f: { v: [], vt: [], vn: [] },
    },
    indices: { v: [], vt: [], vn: [] },
  };
  if (!scale) scale = 1;
  let a = str.split('\n');
  for (let s of a) {
    let arr = s.split(' ').filter(el => el != '');
    let c = arr.shift();

    switch (c) {
      case 'v':
        arr = arr.map(f => +f * scale);
        if (arr.length == 3) arr.push(1);
        obj.vertices.v.push(arr);
        break;

      case 'vt':
        obj.vertices.vt.push(arr.map(f => +f));
        break;

      case 'vn':
        obj.vertices.vn.push(arr.map(f => +f));
        break;

      case 'f':
      case 'l':
      case 'p':
        let f = obj.elements[c];
        let v = [],
          vt = [],
          vn = [];
        for (let e of arr) {
          let el = e.split('/').filter(el => el != '');
          switch (el.length) {
            case 1:
              v.push(+el[0] - 1);
              break;
            case 2:
              v.push(+el[0] - 1);
              vn.push(+el[1] - 1);
              break;
            case 3:
              v.push(+el[0] - 1);
              vt.push(+el[1] - 1);
              vn.push(+el[2] - 1);
              break;
          }
        }
        if (v.length) f.v.push(v);
        if (vt.length) f.vt.push(vt);
        if (vn.length) f.vn.push(vn);
    }

    for (let e in obj.elements) {
      for (let i in obj.elements[e]) {
        obj.indices[i].push(...obj.elements[e][i]);
      }
    }
  }
  return obj;
}

function edgeList(elements) {
  let edges = {};
  function add(a, b) {
    let key = a <= b ? a + ' ' + b : b + ' ' + a;
    edges[key] = a < b ? [a, b] : [b, a];
  }
  for (let f of elements) {
    let n = f.length;
    if (n == 2) {
      add(f[0], f[1]);
    } else if (n > 2) {
      for (let i = 0; i < n; i++) {
        let a = f[i],
          b = f[(i + 1) % n];
        add(a, b);
      }
    }
  }
  return Object.values(edges);
}

export default { loadObj, edgeList };
