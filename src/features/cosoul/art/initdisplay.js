/*(c) shellderr 2023 BSD-2*/

/*initDisplay: intialize glview and lineview classes*/

import Glview from './lib/glview.js';
import Lineview from "./lib/lineview.js";

import * as dat from "./lib/dat.gui.module.min.js";

import waves from './programs/waves.js';
import waves2 from './programs/waves2.js';
import gmod from './programs/g_module.js';
import lmod from "./programs/l_module.js";

var levmax = 20000;
var linewidth = .75; 
var animate = true;
var lineview = null, glview = null, levelUpdate = null, idUpdate = null, params = null;

const maingui = {
    fields: [
            /*
            {
                animate: animate,
                onChange: (v)=>{
                    if(v) maingui.ctl.start(); else maingui.ctl.stop();
                }
            },
            */
            {
                pgive: [0, 0, 20000, 10],
                onChange: (v)=>{
                    if(levelUpdate) levelUpdate(v, glview);
                }
            },
            {
                scaled: [0,0,1, .01],
                onChange: (v)=>{
                    let i = (26**v-1)/25;
                    maingui.fields[0].ref.setValue(i*levmax);
                }
            },
            {
                id: (v)=>{
                    if(idUpdate) idUpdate(null, glview);
                }

            },
            {
            name: 'line',
            open: false,
            updateFrame: true,
            fields:[
                {
                    name: 'l_color',
                    open: false,
                    updateFrame: true,
                    fields: [
                        {
                            h: [.2, 0, 1, .01],
                            onChange: (v)=>{
                                params.line_l.h = v;
                                setStroke(params.line_l);
                            }
                        },
                        {
                            s: [.77, 0, 1, .01],
                            onChange: (v)=>{
                                params.line_l.s = v;
                                setStroke(params.line_l);
                            }
                        },
                        {
                            l: [.72, 0, 1, .01],
                            onChange: (v)=>{
                                params.line_l.l = v;
                                setStroke(params.line_l);
                            }
                        },
                        {
                            a: [1, 0, 1, .01],
                            onChange: (v)=>{
                                params.line_l.a = v;
                                setStroke(params.line_l);
                            }
                        }                                       
                    ]
                },
                {
                    name: 'g_color',
                    open: false,
                    updateFrame: true,
                    fields: [
                        {
                            h: [.7, 0, 1, .01],
                            onChange: (v)=>{
                                params.line_g.h = v;
                                setStroke(params.line_g);
                            }
                        },
                        {
                            s: [.8, 0, 1, .01],
                            onChange: (v)=>{
                                params.line_g.s = v;
                                setStroke(params.line_g);
                            }
                        },
                        {
                            l: [.56, 0, 1, .01],
                            onChange: (v)=>{
                                params.line_g.l = v;
                                setStroke(params.line_g);
                            }
                        },
                        {
                            a: [1, 0, 1, .01],
                            onChange: (v)=>{
                                params.line_g.a = v;
                                setStroke(params.line_g);
                            }
                        }                                       
                    ]
                },
                {
                    width: [linewidth, .01, 2, .01],
                    onChange: v => lineview.lineWidth(v)
                },
            ]
        },
    ]
};

function hsl(h,s,l,a=1) { // (0,1) stackoverflow.com/a/64090995
   let v = s*Math.min(l,1-l);
   let f = (n,k=(n+h*12)%12) => l-v*Math.max(Math.min(k-3,9-k,1),-1);
   f = [f(0)*255, f(8)*255, f(4)*255, a].map(v=>v.toFixed(2));
   return `rgb(${f[0]}, ${f[1]}, ${f[2]}, ${f[3]})`;
}

function setStroke(s){
    s.stroke = hsl(s.h,s.s,s.l,s.a);
}


export default function initDisplay(
        fgCanvas, 
        bgCanvas, 
        resolution=[600,600], 
        userparams={}, 
        useGui=true, 
        _linewidth=linewidth)
{
    levelUpdate = userparams.guiLevelUpdate;
    idUpdate = userparams.guiIdUpdate;
    params = userparams;
    lineview = new Lineview(fgCanvas, [gmod, lmod], resolution);
    lineview.lineWidth(_linewidth);
    levmax = userparams.level_max;
    const cb = {
        init: lineview.init.bind(lineview),
        frame: lineview.frame.bind(lineview),
        start: lineview.start.bind(lineview),
        stop: lineview.stop.bind(lineview),
        pgms: lineview.pgms
    };
    const pgm = {chain:[waves2]};
    
    if(useGui){
        if(!window.initcount){
            glview = new Glview(bgCanvas, pgm, resolution, 0, new dat.GUI(), maingui, cb, userparams);
            window.initcount = 1;
        }else{
            glview = new Glview(bgCanvas, pgm, resolution, 0, null, null, cb, userparams);
            window.initcount++;
        }        
    }else{
        glview = new Glview(bgCanvas, pgm, resolution, 0, null, null, cb, userparams);
    }

    return glview;
}