/* eslint-disable */
/*(c) shellderr 2023 BSD-1*/

// createShaderProgram, setBuffers, enableAttributes, setUniforms, drawObj
import * as mgl from './minigl.js';

const def_vs = /*glsl*/ `#version 300 es
	in vec3 position;
	in vec3 color;
	out vec3 vcolor;
    
    void main() {
    	vcolor = color;
        gl_Position = vec4(position, 1.);
    }
`;

const def_fs = /*glsl*/ `#version 300 es
    precision mediump float;
    in vec3 vcolor;
    out vec4 fragColor;
    uniform vec2 resolution;
    uniform vec2 mouse;
    uniform float time;
    #define res resolution

    void main(){
    	// fragColor = vec4(((2.*gl_FragCoord.xy-res)/res).xyx*cos(time+vec3(0,1,3))*.5+.5, 1);
        fragColor = vec4(0,0,0,1);
    }
`;

const def_prog = {
  arrays: {
    position: {
      components: 3,
      data: [-1, -1, 0, 1, -1, 0, -1, 1, 0, 1, 1, 0],
    },
    color: {
      components: 3,
      data: [0, 1, 0, 0, 0, 1, 0, 0, 1, 1, 0, 0],
    },
  },
  clearcolor: [0, 0, 0, 0],
  uniforms: {
    resolution: [500, 500],
    mouse: [0, 0],
    time: 0,
  },
  vs: def_vs,
  fs: def_fs,
  drawMode: 'TRIANGLE_STRIP',
  textures: null,
  rendercb: () => {},
  setupcb: () => {},
  chain: [],
  shaderProgram: null,
  on: true,
};

class Glview {
  constructor(canvas, pgms, res, fps, gui, guiobj, cbobj, params) {
    this.pgms = pgms instanceof Array ? pgms : [pgms];
    this.prog = this.pgms[0];
    this.gl = canvas.getContext('webgl2', {
      premultipliedAlpha: true,
      antialias: true,
    });
    if (!this.gl) {
      console.log('no gl context');
      return;
    }
    this.res = res || [500, 500];
    initCanvas(canvas, this.res);
    this.render = this.render.bind(this);
    this.fpsloop = this.fpsloop.bind(this);
    this.req = null;
    this.loop = false;
    this.mgl = mgl;
    this.ms = fps ? 1000 / fps : 0;
    this.mouse = [0, 0];
    this.time = 0;
    canvas.onmousemove = e => {
      this.mouse[0] = e.offsetX / this.res[0];
      this.mouse[1] = 1 - e.offsetY / this.res[1];
    };
    this.gl.disable(this.gl.DEPTH_TEST);
    this.gl.enable(this.gl.BLEND);
    this.gl.blendFunc(this.gl.SRC_ALPHA, this.gl.ONE_MINUS_SRC_ALPHA);
    this.gl.viewport(0, 0, this.res[0], this.res[1]);

    this.params = params;
    let nf = () => {};
    this.cbobj = cbobj || {
      init: nf,
      start: nf,
      stop: nf,
      frame: nf,
      pgms: [],
      params: [],
    };
    cbobj.init(this);

    if (!this.init(this.gl, this.pgms)) {
      this.start = this.frame = () => {};
      return;
    }
    if (gui) initGui(gui, this, guiobj);
    this.gl.clearColor(...this.prog.clearcolor);
  }

  start() {
    if (this.loop) return;
    this.loop = true;
    const f = time => {
      this.render(time);
      this.req = requestAnimationFrame(f);
    };
    if (this.ms) this.fpsloop(this.ms);
    else f(0);
    this.cbobj.start();
  }

  stop() {
    this.loop = false;
    cancelAnimationFrame(this.req);
    this.cbobj.stop();
  }

  switchProgram(idx) {
    if (this.pgms[idx]) {
      if (this.prog._gui) this.prog._gui.hide();
      this.prog = this.pgms[idx];
      this.gl.clearColor(...this.prog.clearcolor);
      this.frame();
      if (this.prog._gui) this.prog._gui.show();
    }
  }

  frame(time = 0) {
    if (!this.loop) {
      this.render(time);
    }
    this.cbobj.frame(time);
  }

  render(time) {
    this.gl.clear(this.gl.COLOR_BUFFER_BIT);
    this.prog.uniforms.time = time * 0.001;
    this.prog.uniforms.mouse = this.mouse;
    mgl.enableAttributes(this.gl, this.prog);
    this.prog.rendercb(this.prog);
    mgl.setUniforms(this.gl, this.prog);
    this.prog.draw(this.prog);
    for (let p of this.prog.chain)
      if (p.on) {
        p.uniforms.time = time * 0.01;
        p.uniforms.mouse = this.mouse;
        mgl.enableAttributes(this.gl, p);
        p.rendercb(p);
        mgl.setUniforms(this.gl, p);
        mgl.drawObj(this.gl, p);
      }
  }

  fpsloop(ms) {
    let last = performance.now();
    const _loop = time => {
      this.req = requestAnimationFrame(_loop);
      let delta = time - last;
      if (delta > ms) {
        last = time - (delta % ms);
        this.render(time);
      }
    };
    _loop(0);
  }

  init(gl, pgms) {
    for (let pgm of pgms) {
      merge(pgm, def_prog, this);
      pgm.uniforms.resolution = this.res;
      pgm.uniforms.time = 0;
      if (!mgl.createShaderProgram(gl, pgm)) return null;
      pgm.setupcb(pgm);
      if (!pgm.draw)
        pgm.draw = () => {
          mgl.drawObj(this.gl, pgm);
        };
      mgl.setBuffers(gl, pgm);
      for (let p of pgm.chain || []) {
        merge(p, { ...def_prog, count: pgm.count });
        p.uniforms.resolution = this.res;
        p.uniforms.time = 0;
        if (!mgl.createShaderProgram(gl, p)) return null;
        p.setupcb(p);
        mgl.setBuffers(gl, p);
      }
    }
    return 1;
  }
}

function initCanvas(canvas, res) {
  canvas.width = res[0];
  canvas.height = res[1];
  canvas.style.width = res[0] + 'px';
  canvas.style.height = res[1] + 'px';
}

function merge(dest, template, ctl) {
  if (ctl) template.ctl = ctl;
  for (let prop in template)
    if (dest[prop] == null) dest[prop] = template[prop];
}

function initGui(gui, ctl, mainobj) {
  gui.__closeButton.style.visibility = 'hidden';
  if (ctl.pgms.length > 1)
    gui.add({ pgm: 0 }, 'pgm', 0, ctl.pgms.length - 1, 1).onChange(val => {
      ctl.switchProgram(val);
    });
  if (mainobj) {
    if (mainobj.name) guiSubFolder(gui, mainobj, ctl);
    else addGuiObj(gui, mainobj, ctl);
  }
  for (let p of ctl.pgms) {
    if (p.gui) initSubGui(gui, p, ctl, p !== ctl.prog);
    for (let _p of p.chain || []) if (_p.gui) initSubGui(gui, _p, ctl);
  }
  // remove
  for (let p of ctl.cbobj.pgms) {
    if (p.gui) initSubGui(gui, p, ctl);
  }
}

function initSubGui(gui, p, ctl, hide) {
  p._gui = gui.addFolder(p.gui.name || '');
  if (hide) p._gui.hide();
  if (p.gui.open && p.on) p._gui.open();
  p.ctl = ctl;
  addGuiObj(p._gui, p.gui, ctl);
  p._gui.title = p._gui.__ul.firstChild;
  p._gui.title.style.color = p.on ? 'springgreen' : 'white';
  if (p.gui.switch) {
    let _p = p._gui.add({ '': p.on }, '', p.on);
    _p.onChange(val => {
      p.on = val;
      p._gui.title.style.color = p.on ? 'springgreen' : 'white';
      ctl.frame();
    });
  }
}

function guiSubFolder(gui, obj, ctl) {
  let g = gui.addFolder(obj.name || '');
  if (obj.open) g.open();
  addGuiObj(g, obj, ctl);
  g.title = g.__ul.firstChild;
  g.title.style.color = 'springgreen';
}

function addGuiObj(gui, obj, ctl) {
  let i = 0;
  for (let o of obj.fields || []) {
    if (o.fields) {
      guiSubFolder(gui, o, ctl);
      continue;
    }
    let f;
    if ((f = o.onChange)) delete o.onChange;
    o = getArrayParams(o);
    let params = [o, Object.keys(o)[0], ...Object.values(o).slice(1)];
    let g = gui.add(...params);
    if (f) {
      if (obj.updateFrame)
        g.onChange(v => {
          f(v);
          ctl.frame();
        });
      else g.onChange(f);
    }
    obj.fields[i++].ref = g;
  }
  obj.ctl = ctl;
}

function getArrayParams(o) {
  let e = Object.entries(o)[0];
  if (e[1] instanceof Array) {
    o[e[0]] = e[1][0];
    o.min = e[1][1];
    o.max = e[1][2];
    o.step = e[1][3];
  }
  return o;
}

export default Glview;
