/* eslint-disable */
/*(c) shellderr 2023 BSD-2*/

class Lineview {
  constructor(canvas, pgms, res = [500, 500], gui) {
    if (!canvas) {
      console.log('null canvas');
      return;
    }
    canvas.width = res[0];
    canvas.height = res[1];
    this.w = res[0];
    this.h = res[1];
    this.canvas = canvas;
    this.mouse = [0, 0];
    this.canvas.onmousemove = e => {
      this.mouse[0] = e.offsetX / this.w;
      this.mouse[1] = 1 - e.offsetY / this.h;
    };
    this.ctx = canvas.getContext('2d');
    this.pgms = pgms instanceof Array ? pgms : [pgms];
    this.loop = this.loop.bind(this);
    this.running = false;
    this.fill = this.canvas.style.backgroundColor;
    this.stroke = '#000000';
  }

  init(ctl) {
    this.params = ctl.params;
    this.ctl = ctl;
    for (let p of this.pgms) {
      p.setup(this);
      p.on = p.on == undefined ? true : p.on;
    }
  }

  start() {
    this.running = true;
    this.loopid = requestAnimationFrame(this.loop);
  }

  stop() {
    this.running = false;
    cancelAnimationFrame(this.loopid);
    for (let p of this.pgms) if (p.on && p.unloop) p.unloop();
    this.frame();
  }

  loop(time) {
    this.ctx.clearRect(0, 0, this.w, this.h);
    this.params = this.ctl.params;
    for (let p of this.pgms) if (p.on && p.loop) p.loop(time, this);
    if (this.running) this.loopid = requestAnimationFrame(this.loop);
  }

  draw() {
    this.params = this.ctl.params;
    this.ctx.clearRect(0, 0, this.w, this.h);
    for (let p of this.pgms) if (p.on) p.draw(this);
  }

  frame() {
    /*if(!this.running)*/ this.draw(this);
  }

  lineWidth(w) {
    this.ctx.lineWidth = w;
  }

  setStroke(h = 0, s = 0, l = 0, a = 1) {
    if (typeof h == 'string') this.ctx.strokeStyle = h;
    else this.ctx.strokeStyle = hlsaStr(h, s, l, a);
  }

  setBkgd(h = 0, s = 0, l = 0, a = 1) {
    if (typeof h == 'string') this.canvas.style.backgroundColor = h;
    else this.canvas.style.backgroundColor = hlsaStr(h, s, l, a);
  }

  canvasStyle(css) {
    for (let key in css || {}) this.canvas.style[key] = css[key];
  }
}

function hlsaStr(h, s, l, a) {
  let v = hsl2rgb(h * 360, s, l);
  return `rgba(${v[0] * 255}, ${v[1] * 255}, ${v[2] * 255}, ${a})`;
}

function hsl2rgb(h, s, l) {
  // https://stackoverflow.com/a/64090995
  let a = s * Math.min(l, 1 - l);
  let f = (n, k = (n + h / 30) % 12) =>
    l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
  return [f(0), f(8), f(4)];
}

export default Lineview;
