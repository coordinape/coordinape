/*(c) shellderr 2023 BSD-2*/

const {sin, cos, floor, abs, sqrt, PI} = Math;
const idmat = [[1,0,0,0],[0,1,0,0],[0,0,1,0],[0,0,0,1]];

// row-order matrix v*T(4x4)
function mat_mul_4(a, b){
    let mat = [];
    for(let i = 0; i < a.length; i++){
        mat.push([
        a[i][0]*b[0][0] + a[i][1]*b[1][0] + a[i][2]*b[2][0] + a[i][3]*b[3][0],
        a[i][0]*b[0][1] + a[i][1]*b[1][1] + a[i][2]*b[2][1] + a[i][3]*b[3][1],
        a[i][0]*b[0][2] + a[i][1]*b[1][2] + a[i][2]*b[2][2] + a[i][3]*b[3][2],
        a[i][0]*b[0][3] + a[i][1]*b[1][3] + a[i][2]*b[2][3] + a[i][3]*b[3][3]
        ]);
    }
    return mat;
}

function mat_mul_4w(a, b){
    let mat = [];
    for(let i = 0; i < a.length; i++){
        let x = a[i][0]*b[0][0] + a[i][1]*b[1][0] + a[i][2]*b[2][0] + a[i][3]*b[3][0];
        let y = a[i][0]*b[0][1] + a[i][1]*b[1][1] + a[i][2]*b[2][1] + a[i][3]*b[3][1];
        let z = a[i][0]*b[0][2] + a[i][1]*b[1][2] + a[i][2]*b[2][2] + a[i][3]*b[3][2];
        let w = a[i][0]*b[0][3] + a[i][1]*b[1][3] + a[i][2]*b[2][3] + a[i][3]*b[3][3];
        mat.push([x/w, y/w, z/w, w]);
    }
    return mat;
}

function mult_rows(mat, arr){
    for(let i = 0; i < mat.length; i++){
        for(let j = 0; j < arr.length; j++){
            mat[i][j] *= arr[j];
        }
    }
    return mat;
}

function add_rows(mat, arr){
    for(let i = 0; i < mat.length; i++){
        for(let j = 0; j < arr.length; j++){
            mat[i][j] += arr[j];
        }
    }
    return mat;
}

function proc_rows(mat, f){
    for(let r of mat) f(r);
}

function addv(a, b){
    return [a[0]+b[0], a[1]+b[1], a[2]+b[2], 1];
}
function subv(a, b){
    return [a[0]-b[0], a[1]-b[1], a[2]-b[2], 1];
}
function multv(a, b){
    return [a[0]*b[0], a[1]*b[1], a[2]*b[2], 1];
}
function mults(v, s){
    return [v[0]*s, v[1]*s, v[2]*s, 1];
}

function transpose(mat){
    let m = mat.length, n = mat[0].length;
    let t = [];
    for(let i = 0; i < n; i++)
         t.push(Array(m).fill(0)); 
    
    for(let i = 0; i < n; i++){
        for(let j = 0; j < m; j++){
            t[i][j] = mat[j][i];
        }
    }
    return t;
}

function cross(a, b){
    return [a[1]*b[2] - a[2]*b[1],
            a[2]*b[0] - a[0]*b[2],
            a[0]*b[1] - a[1]*b[0], 1];
}

function dot(a,b){
    return a[0]*b[0]+a[1]*b[1]+a[2]*b[2];
}

function normalize(v){
    let n = sqrt(v[0]*v[0]+v[1]*v[1]+v[2]*v[2]);
    return [v[0]/n, v[1]/n, v[2]/n, v[3] || 1];
}

//check point with determinant
function inline(px,py,ax,ay,bx,by,e){
    return ((px >= ax && px <= bx) || (px >= bx && px <= ax)) && 
    ((py >= ay && py <= by) || (py >= by && py <= ay)) && 
    (Math.abs(((bx - ax) * (py - ay) - (px - ax) * (by - ay))) < e);
}

function lookAt(from, to, zamt){
    let z = normalize(subv(from, to));
    let x = normalize(cross(z, [0,1,0]));
    let y = cross(x, z);

    return [[x[0], x[1], x[2], 0],
            [y[0], y[1], y[2], 0],
            [z[0], z[1], z[2], 0],
            [-dot(x, from), -dot(y, from), -(1-zamt)-dot(z, from)*zamt, 1]];
}

function create_rot(tx, ty, tz){
    let rot = [[1,0,0,0],[0,1,0,0],[0,0,1,0],[0,0,0,1]];
    let zrot = [[cos(tz), -sin(tz), 0, 0],
                [sin(tz), cos(tz), 0, 0],
                [0, 0, 1, 0],
                [0, 0, 0, 1]];
    let xrot = [[1, 0, 0, 0],
                [0, cos(tx), -sin(tx), 0],
                [0, sin(tx), cos(tx), 0],
                [0, 0, 0, 1]];
    let yrot = [[cos(ty), 0, sin(ty), 0],
                [0, 1, 0, 0],
                [-sin(ty), 0, cos(ty), 0],
                [0, 0, 0, 1]];

    rot = mat_mul_4(rot, zrot);
    rot = mat_mul_4(rot, yrot);
    rot = mat_mul_4(rot, xrot);
    return rot;
}

function create_scale(x, y, z){
    return [[x,0,0,0],[0,y||x,0,0],[0,0,z||x,0],[0,0,0,1]];
}

function create_translate(x, y, z){
    return [[1,0,0,0],[0,1,0,0],[0,0,1,0],[x, y||x, z||x, 1]];
}

function create_proj(scale, perspective, plane){
    return [[scale,0,0,0],[0,scale,0,0],[0,0,scale,-perspective],[0,0,0,plane]];
}

function create_canvas_scene(ctx, x, y, models, v_mat, p_mat){
    let m = models instanceof Array ? models : [models];
    return {
        ctx: ctx, x: x, y: y, models: m, v_mat: v_mat, p_mat: p_mat, z_clip: 5 //-.3
    };
}

function create_model(colors, vertices, elements, r_mat, t_mat, v_mat){
    return{
        colors: colors, vertices: vertices, elements: elements, r_mat: r_mat, t_mat: t_mat, v_mat: v_mat
    }
}

function create_ascii_scene(pre, x, y, vertices, elements, r_mat, t_mat, v_mat, p_mat){
    return {
        pre: pre, x: x, y: y, vertices: vertices, elements: elements, r_mat : r_mat, t_mat: t_mat, v_mat: v_mat, p_mat: p_mat
    };
}

function line(ctx, w, h, ax, ay, bx, by){
    ctx.beginPath();
    ctx.moveTo(ax*w*.5 +w*.5, ay*h*.5+h*.5);
    ctx.lineTo(bx*w*.5 +w*.5, by*h*.5+h*.5);
    ctx.closePath();
    ctx.stroke();
}

function intersectPlane(l0, l1, p0, n){
    let l = subv(l0, l1);
    let t = dot(subv(p0, l0), n) / dot(l, n);
    return addv(l0, mults(l, t));
}

function canvasrender(s, t){
    // s.ctx.fillRect(0,0,s.x, s.y);

    for(let m of s.models){
        // s.ctx.fillStyle = m.colors.bkgd;
        // s.ctx.strokeStyle = m.colors.stroke;

        let mat = m.r_mat ? mat_mul_4(m.vertices, m.r_mat) : m.vertices; 
        mat = m.t_mat ? mat_mul_4(mat, m.t_mat) : mat;  

        // m.vertices = m.r_mat ? mat_mul_4(m.vertices, m.r_mat) : m.vertices; 
        // let mat = m.t_mat ? mat_mul_4(m.vertices, m.t_mat) : m.vertices;  
        if(m.v_mat) mat = mat_mul_4(mat, m.v_mat);
        if(s.p_mat) mat = mat_mul_4w(mat, s.p_mat);

        for(let el of m.elements){
            let n = el.length;
            if(n == 2){
                let a = el[0], b = el[1];  
                if(Math.max(mat[a][2], mat[b][2]) < s.z_clip)  
                line(s.ctx, s.x, s.y, mat[a][0], mat[a][1], mat[b][0], mat[b][1]);

            }else if(n > 2){
                for(let i = 0; i < n; i++){
                    let a = el[i], b = el[(i+1)%n];
                    line(s.ctx, s.x, s.y, mat[a][0], mat[a][1], mat[b][0], mat[b][1]);
                }
            }
        }
    }
}

function asciirender(s, t){
    let e = 0.005;
    let str = '';
    let x = s.x, y = s.y;

    s.vertices = s.r_mat ? mat_mul_4(s.vertices, s.r_mat) : s.vertices; 
    let mat = mat_mul_4(s.vertices, s.t_mat || idmat);  
    if(s.v_mat) mat = mat_mul_4(mat, s.v_mat);
    if(s.p_mat) mat = mat_mul_4w(mat, s.p_mat);

/*
    // let mat = mat_mul_4(mat_mul_4(s.vertices, s.p_mat), s.t_mat);
    let mat = mat_mul_4(mat_mul_4(s.vertices, s.t_mat), s.p_mat);
*/
    // if(s.proj)
    // proc_rows(mat, (r)=>{
    //  r[0] /= 1.2-r[2]*s.proj;
    //  r[1] /= 1.2-r[2]*s.proj;
    // });

    for(let iy = 0; iy < y; iy++){
        for(let ix = 0; ix < x; ix++){
            let draw = 0;   
            let _y = (2*iy-y)/x;
            let _x = (2*ix-x)/x;

            for(let el of s.elements){
                let n = el.length;
                if(n == 2){
                    let a = el[0], b = el[1];``     
                    draw = draw | inline(_x, _y, mat[a][0], mat[a][1]*.5, mat[b][0], mat[b][1]*.5, e);
                }else if(n > 2){
                    for(let i = 0; i < n; i++){
                        let a = el[i], b = el[(i+1)%n];
                        draw = draw | inline(_x, _y, mat[a][0], mat[a][1]*.5, mat[b][0], mat[b][1]*.5, e);
                    }
                }
            }
            if(draw){ str += 'g'; }else{ str += '.' };
        }   str += '\n';    
    }   
    s.pre.innerHTML = str;
}

export{mat_mul_4, mult_rows, proc_rows, create_rot, create_canvas_scene, create_model, create_ascii_scene, create_scale, create_translate, create_proj, lookAt, asciirender, canvasrender};