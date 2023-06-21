/*(c) shellderr 2023 BSD-2*/

const {cos, sin, sqrt, min, max, floor, round, random, PI} = Math;

import models from './models.js';
import * as g from '../lib/render.js';

var ctx, ww, wh, params;
var obj, obj2, rot, rot2, proj, translate, view, colors, model, gmodels, scene;
var p_i = 0;
var viewx = 0, viewy = 0;
var translatez = -.55;
var rotx = -.2;
var roty = -.15;
var rotz = -.12;
var rr = PI;
var scale = 1.4;
var idx = 0;

// model scale adjustments
const atable = [2.5, 1, 2, 1.5, 2, 1.1];
// "scene" values
const scenevals = [
{scale: 1.4, z: -.69, clip: -.12},
{scale: 1.3, z: -.57, clip:    5},
{scale: 1.4, z: -.45, clip: -.97},
{scale: 1.4, z: -.68, clip:    1},
{scale:  .9, z: -.85, clip:  .73},
{scale: 1.1, z: -.72, clip: -.12}];

var stroke =  'rgb(255,0,0,1)';
var update = {id: null, level: null};

function setup(ctl){
    ctx = ctl.ctx; 
    ww = ctl.w; 
    wh = ctl.h;
    params = ctl.params;
    setModel(params);
    stroke = params.line_g.stroke || stroke;
    ctx.strokeStyle = stroke;
}

function setModel(params){ 
    // if(update.id != params.id){
    //     update.id = params.id;
        if(params && params.map_callbacks.geom_poly)
            idx = params.map_callbacks.geom_poly(params);
        obj = models[idx];
        let s = scenevals[idx];
        rot = g.create_rot(rotx*rr, roty*rr, rotz*rr);
        translate = [[1,0,0,0],[0,1,0,0],[0,0,1,0],[0,0,0,1]];
        translate[3][2] = s.z;
        proj = g.create_proj(s.scale,.5,.3);
        view = g.lookAt([viewx*1, viewy*1, -1.], [0,0, .1], .0);
        model = g.create_model(0, obj.v, obj.i, rot, translate, view);
        scene = g.create_canvas_scene(ctx, ww, wh, model, null, proj);
        scene.z_clip = s.clip;
    // }
}

function setScene(idx){
    let s = scenevals[idx];
    if(!s) return;
    scene.p_mat = g.create_proj(s.scale,.5,.3);
    translate[3][2] = s.z;
    scene.z_clip = s.clip;
}

function draw(ctl){
    params = ctl.params;
    setModel(params);
    stroke = params.line_g.stroke;
    ctx.strokeStyle = stroke;
    g.canvasrender(scene);
}

function loop(time){
    let m = scene.models[0];
    let rot = g.create_rot(rotx*.04, roty*.04, rotz*.04);
    m.vertices = g.mat_mul_4(m.vertices, rot);
    ctx.strokeStyle = stroke;
    g.canvasrender(scene);
}

function unloop(){

}

const gui = {
    name: 'geom',
    open: false,
    switch: true,
    updateFrame: true,
    fields:[
        {
            idx: idx,
            min: 0,
            max: models.length-1,
            step: 1,
            onChange: (v)=>{
                obj = models[v];
                model = g.create_model(idx, obj.v, obj.i, rot, translate, view);
                scene.models[0] = model;
                setScene(v);
            }
        },
        {
            scale: scale,
            min: .1,
            max: 1.9,
            step: .1,
            onChange: (v)=>{
                scene.p_mat = g.create_proj(v,.5,.3);
            }
        },
        {
            rot_x: rotx,
            min: -1,
            max: 1,
            step: .01,
            onChange: (v)=>{
                rotx = v;
                scene.models[0].r_mat = g.create_rot(rotx*rr, roty*rr, rotz*rr);
            }
        },
        {
            rot_y: roty,
            min: -1,
            max: 1,
            step: .01,
            onChange: (v)=>{
                roty = v;
                scene.models[0].r_mat = g.create_rot(rotx*rr, roty*rr, rotz*rr);
            }
        },
        {
            rot_z: rotz,
            min: -1,
            max: 1,
            step: .01,
            onChange: (v)=>{
                rotz = v;
                scene.models[0].r_mat = g.create_rot(rotx*rr, roty*rr, rotz*rr);
            }
        },
        {
            translate_z: translatez,
            min:-1,
            max:.1,
            step:.01,
            onChange: (v)=>{
                translatez = v;
                translate[3][2] = v;
            }
        },
        {
            zclip: [5, -2, 5, .01],
            onChange: (v)=>{
                scene.z_clip = v;
            }
        },
        {
            reset: ()=>{
                prog.gui.fields[1].ref.setValue(1);
                prog.gui.fields[2].ref.setValue(0);
                prog.gui.fields[3].ref.setValue(0);
                prog.gui.fields[4].ref.setValue(0);
                prog.gui.fields[5].ref.setValue(0);

            }
        }
    ]
}

const prog = {
    setup: setup,
    draw: draw,
    loop: loop,
    unloop: unloop,
    gui: gui
};

export default prog;