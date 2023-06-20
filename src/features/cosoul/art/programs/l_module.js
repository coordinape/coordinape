/*(c) shellderr 2023 BSD-2*/

const {cos, sin, pow, sqrt, log, abs, sign, min, max, floor, round, random, PI} = Math;

import lsystem from './l-system.js';
import rules from './seedrules.js';
import Quaternion from '../lib/quaternion.js';

var ctx, ww, wh, params;
var model;

var lev = .5;
var rule =  0;
var n_i = 0; 
var rot_n = 6;
var theta = 0;
var seed = 0;
var hold = 20;
var _time = 0;
var amp = .7;

var mainamp = 1.4;
var low_amp_shift = 0;
var logbase = 15;
var logoffs = 0.005;

var qr, qi, qs;

var stroke =  'rgba(223.4, 241.5, 151.2, 1';
var update = {id: null, level: null};

function setup(ctl){
    ctx = ctl.ctx; 
    ww = ctl.w; 
    wh = ctl.h;
    params = ctl.params;
    seed = params.seed;
    lev = params.ease_level;
    seed = params.seed;
    
    if(!updateParams(ctl)) 
        model = buildModel();

    qr = new Quaternion.fromEuler(-.03, -.04, .05);
    qi = new Quaternion();
    qs = new Quaternion();
}

function updateParams(ctl){
    if(!ctl.params) return false;

    update.level = ctl.params.level;
    if(update.id != ctl.params.id){
        update.id = ctl.params.id;
        seed = ctl.params.seed;
        if(ctl.params.map_callbacks.lsys_rule){
            rule = ctl.params.map_callbacks.lsys_rule(ctl.params);
            model = buildModel();
        }
    }
    if(ctl.params.map_callbacks.lsys_rot)
        rot_n = ctl.params.map_callbacks.lsys_rot(ctl.params);

    stroke = ctl.params.line_l.stroke;
    lev = logScale(ctl.params.norm_level, logbase, logoffs);

    let b = getBounds(model,lev);
    // let s = low_amp_shift*(lev < .4 ? 1-lev:0);

    // amp = radius as a function of pgive level
    // two smoothstep functions are x-fading between the log-scaled level
    // and the level clamped by getBounds. amp = 1/b would be constant radius
    
    amp = .7*(.33*smstep(lev, 1, 0, .4) + .7*smstep(lev, .2, .8, .4)/b);
    // amp = .7*(.33*smstep(lev, 1, 0, .4) + .7*smstep(lev+s, .2, .8, .4+s*.5)/b);
    return true;
}

function smstep(x, start=0, end=1, _floor=0){
    let a = max(min((x-start)/(end-start),1),0);
    return (1-_floor)*(3*a**2-2*a**3)+_floor;
}

function logScale(x, b, ofs){
    return log(1+ofs*b+x*b-x-ofs*b*x)/log(b);
}

function getBounds(model, f){
    let v = .1; // start threshold
    let n = max(floor(model.i.length*f),1);
    for(let i = n-1; i > 0; i--){       
        let p = model.v[model.i[i][1]];
        v = max(v, p[0]**2+p[1]**2);
    }
    return sqrt(v);
}

function draw(ctl){
    updateParams(ctl);
    ctx.strokeStyle = stroke;
    display(ctx, model, lev, repeat_rot);
}

var vz = [0,0,1];
var az = 0, azlast = 1;
var lerp = 0;

function loop(){
    _time += .005;
    ctx.strokeStyle = stroke;
    if(_time > .35){
        az = vz[2];
        if((az-azlast > 0 && az >= .7) || az-azlast == 0){ lerp += .04;}
        if(lerp > hold) lerp = 0;
        vz = qs.rotateVector(vz);
        qs = qr.slerp(qi)(min(lerp,1));
        qrot(model, qs);
        azlast = az;        
    }
    display(ctx, model, min(log(1+lev*5)*_time,lev), repeat_rot);   
}

function unloop(){
    _time = 0;
    vz = [0,0,1];
    az = 0, azlast = 1;
    lerp = 0;
    model = buildModel();
}

function buildModel(){
    return lsystem(rules[rule], n_i, false, seed);
}

function qrot(model, q){
    for(let i = 0; i < model.i.length; i++){
        model.v[model.i[i][0]] = q.rotateVector(model.v[model.i[i][0]]);
        model.v[model.i[i][1]] = q.rotateVector(model.v[model.i[i][1]]);
    }
}

function line_m(a, b){
    line(ctx, ww, wh, a[0], a[1], b[0], b[1]);
    line(ctx, ww, wh, -a[0], a[1], -b[0], b[1]);    
}

function display(ctx, model, f, cb){
    const n = max(floor(model.i.length*f),1);
    for(let i = 0; i < n; i++){     
        let a = model.v[model.i[i][0]]; 
        let b = model.v[model.i[i][1]];
        if(cb){cb(a, b)}
        else line_m(a, b);      
    }
}

function repeat_rot(a, b){
    let d = 2*PI/rot_n;
    for(let t = 0; t < 2*PI; t+= d){
    let rot = create_rot(t+theta);
        let aa = vec_mul(a, rot);
        let bb = vec_mul(b, rot);
        line_m(aa, bb);     
    }
}

function line(ctx, w, h, ax, ay, bx, by){
    let v = amp*mainamp;
    ctx.beginPath();
    ctx.moveTo(v*ax*w*.5 +w*.5, v*ay*h*.5+h*.5);
    ctx.lineTo(v*bx*w*.5 +w*.5, v*by*h*.5+h*.5);
    ctx.closePath();
    ctx.stroke();
}

function vec_mul(v, t){
    return [
        v[0]*t[0][0] + v[1]*t[1][0] + v[2]*t[2][0],
        v[0]*t[0][1] + v[1]*t[1][1] + v[2]*t[2][1],
        v[0]*t[0][2] + v[1]*t[1][2] + v[2]*t[2][2]
    ];
}

function create_rot(t){
    return [[cos(t), -sin(t), 0], [sin(t), cos(t), 0], [0, 0, 1]];
}

const gui = {
    name: 'l-system',
    open: true,
    switch: true,
    updateFrame: true,
    fields:[
        {
            rule: [rule, 0, rules.length-1, 1],
            onChange: (v)=>{
                rule = v;
                model = buildModel();
            }
        },
        {
            randomize: ()=>{
                seed = Math.random()*99+1;
                model = buildModel();
                prog.ctl.frame();
            }
        },
        {
            log_base:[logbase, 2, 50, 1],
            onChange: (v)=>{logbase = v;}
        },
        {
            log_offset:[logoffs, 0, .04, .001],
            onChange: (v)=>{logoffs = v;}
        },
        // {
        //     low_shift:[low_amp_shift, 0, .5, .01],
        //     onChange: (v)=>{low_amp_shift = v;}
        // },
        {
            amp: [mainamp, .5, 1.8, .1],
            onChange: v => {mainamp = v;}   
        },
        {
            animation_hold: [hold, 1, 20, .1],
            onChange: v => {hold = v;}
        }
    ]
};

const prog = {
    setup: setup,
    draw: draw,
    loop: loop,
    unloop: unloop,
    gui: gui
};

export default prog;