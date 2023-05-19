/* eslint-disable */
/*(c) shellderr 2023 BSD-1*/

const fs = /*glsl*/ `#version 300 es
    precision mediump float;
    out vec4 fragColor;
    uniform vec2 resolution;
    uniform float time;
    #define glf gl_FragCoord
	#define PI 3.14159265
	#define _b 1.6
	uniform vec3 col;
	uniform float alpha;

	vec2 b(float t, vec2 v){
	   return abs(fract(t*v)-.5)*2.;
	}

	float ff(float n, float n2, float n3, float amp){
 		return ((sin(n)+1.)*(sin(n2)*(sin(n3))+1.)+log(((sin(PI+n)+1.)*(sin(PI+n2)+1.))+1.))*amp; 
	}

	void main(){
	    vec2 uv = glf.xy/resolution.xy;
	    
	    float a = 10.;
	    float amp = 0.5;
	    float d = .2;
	    
	    float t = 3.+time*0.001;

	    float n = a*(t+distance(uv, _b*b(t,vec2(3.1,1.7))));
	    float n2 = a*(t+distance(uv, _b*b(t,vec2(2.4,3.15))));
	    float n3 = a*(t+distance(uv, _b*b(t,vec2(1.45,2.65))));
	    
	    float f = ff(n, n2, n3, amp);
	    float f2 = ff(n+d, n2+d, n3+d, amp);
	    
	    n = a*(t+distance(uv, b(t,vec2(1.5,3.7))));
	    n2 = a*(t+distance(uv, b(t,vec2(3.4,1.15))));
	    n3 = a*(t+distance(uv, b(t,vec2(2.45,1.65))));
	    
	    f += ff(n, n2, n3, amp);
	    f2 += ff(n+d, n2+d, n3+d, amp);
	    
	    float v = (f2-f)/d;
	    float fade = min(.2, max(alpha, .01))*5.;
	    float alpha = smoothstep(clamp(v*fade, -2., 0.), .6, alpha*.6);
	    fragColor = vec4(col, alpha);
	}

`;

// stackoverflow.com/a/54024653
function hsv2rgb(h, s, v) {
  //[ 0,1]->[0,1]
  let f = (n, k = (n + h * 6) % 6) =>
    v - v * s * Math.max(Math.min(k, 4 - k, 1), 0);
  return [f(5), f(3), f(1)];
}

var hsv = [0.75, 1, 0.6];
var c = hsv2rgb(...hsv);

// vals from main params can be received here
function setup(prog) {
  console.log(Object.keys(prog.ctl.params));
}

const gui = {
  name: 'wave',
  open: false,
  switch: true,
  updateFrame: true,
  fields: [
    {
      h: [hsv[0], 0, 1, 0.1],
      onChange: v => {
        hsv[0] = v;
        prog.uniforms.col = hsv2rgb(...hsv);
      },
    },
    {
      s: [hsv[1], 0, 1, 0.1],
      onChange: v => {
        hsv[1] = v;
        prog.uniforms.col = hsv2rgb(...hsv);
      },
    },
    {
      v: [hsv[2], 0, 1, 0.1],
      onChange: v => {
        hsv[2] = v;
        prog.uniforms.col = hsv2rgb(...hsv);
      },
    },
    {
      alpha: [0.04, 0, 0.5, 0.01],
      onChange: v => {
        prog.uniforms.alpha = v;
      },
    },
  ],
};

const prog = {
  fs: fs,
  gui: gui,
  uniforms: {
    col: c,
    alpha: 0.04,
  },
  // setupcb : setup
};

export default prog;
