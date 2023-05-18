/* eslint-disable */
/*(c) shellderr 2023 BSD-1*/

const fs = /*glsl*/ `#version 300 es
    precision mediump float;
    out vec4 fragColor;
    uniform vec2 resolution;
    uniform vec2 vmouse;
    uniform float alpha;
    uniform float time;
    uniform float tscale;
    uniform float amp;
    uniform vec3 c1; // specular color
    uniform vec3 c2; // diffuse color

    vec2 ball(float t){
        return vec2(sin(t*1.2)*cos(5.+t*.82), cos(6.+t*.9));
    }

    vec2 pw(float i, vec2 uv, vec2 d, float t, float a){
        t *= .4;
        a*=1.5;
        i = (1.+i)*5000.;
        d += ball(i*9.+t*.0)*.6;
        float m =  mix(.1, 1., sin(i)*.5+.5);
        t *= 5.+a*.4;
        a = mix(a*.1, a*1.5, sin(i)*.5+.5);
        float dx = m*d.x*cos(length(d)*a+t+a);
        float dy = m*d.y*cos(length(d)*a+t+a);
        return vec2(dx, dy);
    }

    vec3 wave(vec2 uv, vec2 d, float t, float a){
        vec2 p = pw(0., uv, d, t, a) +
        pw(1., uv, d, t, a) +
        pw(2., uv, d, t, a) +
        pw(3., uv, d, t, a);
        return normalize(cross(vec3(1, 0, p.x), vec3(0, 1, p.y)));
    }

    vec3 light(vec2 uv, float t, float a){
        vec3 l1 = normalize(vec3(vmouse*2.-1., 1));
        vec3 l2 = normalize(vec3(-1., -1.5, 2.5));
        vec3 w = wave(uv, uv, t, a);
        float ld = clamp(dot(l1, w),0.,1.);
        float lf = clamp(pow(.5-dot(l2, w),5.),0.,1.);
        float ls = clamp(pow(dot(l1, w),90.),0.,1.);
        float ls2 = clamp(pow(dot(l2, w),55.),0.,1.);
        vec3 l = .2*c2+c1*.6*ld + c1*.7*ls +.4*ls2*c2 +lf*c1*.2;
        return l;
    }

    void main(){
        vec2 uv = (2.*gl_FragCoord.xy-resolution)/resolution;
        vec3 l = light(uv, time*-.1*tscale, amp);
        fragColor = vec4(l, smoothstep( dot(l.xyz,vec3(.4)), 0., alpha) );
    }
`;

// stackoverflow.com/a/54024653
function hsv2rgb(h, s, v) {
  //[ 0,1]->[0,1]
  let f = (n, k = (n + h * 6) % 6) =>
    v - v * s * Math.max(Math.min(k, 4 - k, 1), 0);
  return [f(5), f(3), f(1)];
}

var c1 = hsv2rgb(0.77, 0.8, 1);
var c2 = hsv2rgb(0.66, 0.9, 1);

const gui = {
  name: 'waveb',
  open: false,
  switch: true,
  updateFrame: true,
  fields: [
    {
      lightx: [0.2, 0, 1, 0.1],
      onChange: v => {
        prog.uniforms.vmouse[0] = v;
      },
    },
    {
      lighty: [0.5, 0, 1, 0.1],
      onChange: v => {
        prog.uniforms.vmouse[1] = v;
      },
    },
    {
      spec_hue: [0.77, 0, 1, 0.01],
      onChange: v => {
        prog.uniforms.c1 = hsv2rgb(v, 0.8, 1);
      },
    },
    {
      dif_hue: [0.66, 0, 1, 0.01],
      onChange: v => {
        prog.uniforms.c2 = hsv2rgb(v, 0.9, 1);
      },
    },
    {
      scale: [3.7, 1, 10, 0.01],
      onChange: v => {
        prog.uniforms.amp = v;
      },
    },
    {
      time: [0.18, 0.1, 1, 0.01],
      onChange: v => {
        prog.uniforms.tscale = v;
      },
    },
    {
      alpha: [0.64, 0, 1, 0.01],
      onChange: v => {
        prog.uniforms.alpha = 1 - v;
      },
    },
  ],
};

const prog = {
  fs: fs,
  uniforms: {
    vmouse: [0.2, 0.5],
    amp: 3.7,
    tscale: 0.18,
    alpha: 0.36,
    c1: c1,
    c2: c2,
  },
  gui: gui,
};

export default prog;
