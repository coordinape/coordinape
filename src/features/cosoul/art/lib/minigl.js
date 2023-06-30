/* eslint-disable */
/*(c) shellderr 2023 BSD-2*/
function createShaderProgram(gl, obj) {
  let vs = gl.createShader(gl.VERTEX_SHADER);
  let fs = gl.createShader(gl.FRAGMENT_SHADER);
  gl.shaderSource(vs, obj.vs);
  gl.shaderSource(fs, obj.fs);
  gl.compileShader(fs);
  gl.compileShader(vs);
  let compiled = [vs, fs].every((shader, i) => {
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
      console.log('error compiling', i ? 'fragment' : 'vertex', 'shader:');
      console.log(gl.getShaderInfoLog(shader));
      gl.deleteShader(shader);
      return false;
    }
    return true;
  });
  if (!compiled) {
    return null;
  }
  let pgm = gl.createProgram();
  gl.attachShader(pgm, vs);
  gl.attachShader(pgm, fs);
  gl.linkProgram(pgm);
  obj.shaderProgram = pgm;
  obj.uniformSetters = uniformSetters(gl, pgm);
  attribSetup(gl, obj);
  return 1;
}

function attribSetup(gl, obj) {
  for (let key in obj.arrays)
    obj.arrays[key].location = gl.getAttribLocation(obj.shaderProgram, key);
  if (typeof obj.drawMode === 'string') obj.drawMode = gl[obj.drawMode];
  else if (typeof obj.drawMode !== 'number') obj.drawMode = gl.TRIANGLES;
}

function setBuffers(gl, obj, arrays) {
  let attribs = arrays || obj.arrays;
  for (let key in attribs) {
    let attr = attribs[key];
    if (attr.location < 0) continue;
    let dataStr = typeof attr.data === 'string';
    if (dataStr) attr.buffer = attribs[attr.data].buffer;
    else attr.buffer = gl.createBuffer();
    if (key == 'position') {
      obj.vao = gl.createVertexArray();
      gl.bindVertexArray(obj.vao);
    }
    if (key == 'indices') {
      gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, attr.buffer);
      gl.bufferData(
        gl.ELEMENT_ARRAY_BUFFER,
        new Uint16Array(attr.data),
        gl.STATIC_DRAW
      );
    } else {
      gl.bindBuffer(gl.ARRAY_BUFFER, attr.buffer);
      if (!dataStr)
        gl.bufferData(
          gl.ARRAY_BUFFER,
          new Float32Array(attr.data),
          gl.STATIC_DRAW
        );
      let stride = attr.stride || 0,
        offset = attr.offset || 0;
      gl.vertexAttribPointer(
        attr.location,
        attr.components,
        gl.FLOAT,
        0,
        stride * 4,
        offset * 4
      );
      gl.enableVertexAttribArray(attr.location);
    }
  }
  gl.bindVertexArray(null);
  setCount(obj);
}

function enableAttributes(gl, obj) {
  if (obj.vao) gl.bindVertexArray(obj.vao);
  else
    for (let key in obj.arrays) {
      let attr = obj.arrays[key];
      if (key === 'indices') {
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, attr.buffer);
      } else {
        gl.bindBuffer(gl.ARRAY_BUFFER, attr.buffer);
        let stride = attr.stride || 0,
          offset = attr.offset || 0;
        gl.vertexAttribPointer(
          attr.location,
          attr.components,
          gl.FLOAT,
          0,
          stride * 4,
          offset * 4
        );
        gl.enableVertexAttribArray(attr.location);
      }
    }
  gl.useProgram(obj.shaderProgram);
}

function setUniforms(gl, obj) {
  for (let u in obj.uniforms)
    if (obj.uniformSetters[u]) obj.uniformSetters[u](gl, obj.uniforms[u]);
}

function drawObj(gl, obj) {
  if (obj.arrays.indices)
    gl.drawElements(obj.drawMode, obj.count, gl.UNSIGNED_SHORT, 0);
  else gl.drawArrays(obj.drawMode, 0, obj.count);
}

function setCount(obj) {
  if (obj.arrays.position) {
    let count = obj.arrays.indices
      ? obj.arrays.indices.data.length
      : obj.arrays.position.data.length /
        (obj.arrays.position.stride || obj.arrays.position.components);
    obj.count = count;
  }
}

function uniformSetters(gl, program) {
  let setters = {};
  let count = gl.getProgramParameter(program, gl.ACTIVE_UNIFORMS);
  for (let i = 0; i < count; i++) {
    let info = gl.getActiveUniform(program, i);
    let loc = gl.getUniformLocation(program, info.name);
    let name = info.name.replace('[0]', '');
    setters[name] = utypes(gl, info.type, info.size, loc);
  }
  return setters;
}

function utypes(gl, type, size, loc) {
  let v = size > 1;
  switch (type) {
    case gl.FLOAT:
      return v
        ? (gl, v) => {
            gl.uniform1fv(loc, v);
          }
        : (gl, v) => {
            gl.uniform1f(loc, v);
          };
    case gl.FLOAT_VEC2:
      return v
        ? (gl, v) => {
            gl.uniform2fv(loc, v);
          }
        : (gl, v) => {
            gl.uniform2f(loc, ...v);
          };
    case gl.FLOAT_VEC3:
      return v
        ? (gl, v) => {
            gl.uniform3fv(loc, v);
          }
        : (gl, v) => {
            gl.uniform3f(loc, ...v);
          };
    case gl.FLOAT_VEC4:
      return v
        ? (gl, v) => {
            gl.uniform4fv(loc, v);
          }
        : (gl, v) => {
            gl.uniform4f(loc, ...v);
          };
    case gl.FLOAT_MAT2:
      return (gl, v) => {
        gl.uniformMatrix2fv(loc, false, v);
      };
    case gl.FLOAT_MAT3:
      return (gl, v) => {
        gl.uniformMatrix3fv(loc, false, v);
      };
    case gl.FLOAT_MAT4:
      return (gl, v) => {
        gl.uniformMatrix4fv(loc, false, v);
      };
    case gl.SAMPLER_2D:
      (gl, v) => {
        gl.uniform1i(loc, v);
      };
    case gl.SAMPLER_3D:
      (gl, v) => {
        gl.uniform1i(loc, v);
      };
    case gl.SAMPLER_2D_ARRAY:
      (gl, v) => {
        gl.uniform1iv(loc, v);
      };
    case gl.SAMPLER_CUBE:
      (gl, v) => {
        gl.uniform1i(loc, v);
      };
    case gl.BOOL:
      return v
        ? (gl, v) => {
            gl.uniform1iv(loc, v);
          }
        : (gl, v) => {
            gl.uniform1i(loc, v);
          };
    case gl.INT:
      return v
        ? (gl, v) => {
            gl.uniform1iv(loc, v);
          }
        : (gl, v) => {
            gl.uniform1i(loc, v);
          };
    case gl.INT_VEC2:
      return v
        ? (gl, v) => {
            gl.uniform2iv(loc, v);
          }
        : (gl, v) => {
            gl.uniform2i(loc, ...v);
          };
    case gl.INT_VEC3:
      return v
        ? (gl, v) => {
            gl.uniform3iv(loc, v);
          }
        : (gl, v) => {
            gl.uniform3i(loc, ...v);
          };
    case gl.INT_VEC4:
      return v
        ? (gl, v) => {
            gl.uniform4iv(loc, v);
          }
        : (gl, v) => {
            gl.uniform4i(loc, ...v);
          };
  }
}

export {
  createShaderProgram,
  setBuffers,
  enableAttributes,
  setUniforms,
  drawObj,
};
