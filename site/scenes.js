/* global document, window, ResizeObserver, URLSearchParams */
// Geometry loads on request. One active context, one draw call per input or
// resize, capped resolution, no idle loop and no third-party runtime.
const debug = new URLSearchParams(window.location.search).has('debugScene');
let active = null;

function normalize(vector) {
  const length = Math.hypot(...vector) || 1;
  return vector.map((value) => value / length);
}

function cross(a, b) {
  return [
    a[1] * b[2] - a[2] * b[1],
    a[2] * b[0] - a[0] * b[2],
    a[0] * b[1] - a[1] * b[0],
  ];
}

function matrix(camera, target, aspect) {
  const z = normalize(camera.map((value, i) => value - target[i]));
  const x = normalize(cross([0, 0, 1], z));
  const y = cross(z, x);
  const dot = (a, b) => a.reduce((sum, value, i) => sum + value * b[i], 0);
  const view = [
    x[0],
    y[0],
    z[0],
    0,
    x[1],
    y[1],
    z[1],
    0,
    x[2],
    y[2],
    z[2],
    0,
    -dot(x, camera),
    -dot(y, camera),
    -dot(z, camera),
    1,
  ];
  const f = 1 / Math.tan(Math.PI / 7),
    near = 0.1,
    far = 400;
  const projection = [
    f / aspect,
    0,
    0,
    0,
    0,
    f,
    0,
    0,
    0,
    0,
    (far + near) / (near - far),
    -1,
    0,
    0,
    (2 * far * near) / (near - far),
    0,
  ];
  const result = new Float32Array(16);
  for (let col = 0; col < 4; col++) {
    for (let row = 0; row < 4; row++) {
      for (let k = 0; k < 4; k++) {
        result[col * 4 + row] += projection[k * 4 + row] * view[col * 4 + k];
      }
    }
  }
  return result;
}

function shader(gl, type, source) {
  const result = gl.createShader(type);
  gl.shaderSource(result, source);
  gl.compileShader(result);
  if (!gl.getShaderParameter(result, gl.COMPILE_STATUS)) {
    const message = gl.getShaderInfoLog(result);
    gl.deleteShader(result);
    throw new Error(message);
  }
  return result;
}

function validate(data) {
  const vector = (value) =>
    Array.isArray(value) && value.length === 3 && value.every(Number.isFinite);
  if (
    data.version !== 1 ||
    !Array.isArray(data.positions) ||
    !Array.isArray(data.colors) ||
    !data.positions.length ||
    data.positions.length !== data.colors.length ||
    data.positions.length > 540000 ||
    data.positions.length % 9 ||
    !data.positions.every(Number.isFinite) ||
    !data.colors.every(
      (value) => Number.isFinite(value) && value >= 0 && value <= 1
    ) ||
    ![data.camera, data.target, data.background].every(vector)
  ) {
    throw new Error('Invalid scene data');
  }
}

function renderer(gl, canvas, data, resources) {
  const program = gl.createProgram();
  resources.program = program;
  resources.shaders.push(
    shader(
      gl,
      gl.VERTEX_SHADER,
      'attribute vec3 position; attribute vec3 color; uniform mat4 camera; varying vec3 shade; void main(){shade=color;gl_Position=camera*vec4(position,1.0);}'
    )
  );
  resources.shaders.push(
    shader(
      gl,
      gl.FRAGMENT_SHADER,
      'precision mediump float; varying vec3 shade; void main(){gl_FragColor=vec4(pow(shade,vec3(0.7)),1.0);}'
    )
  );
  resources.shaders.forEach((value) => gl.attachShader(program, value));
  gl.linkProgram(program);
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    throw new Error('Shader link failed');
  }
  gl.useProgram(program);
  for (const [name, values] of [
    ['position', data.positions],
    ['color', data.colors],
  ]) {
    const buffer = gl.createBuffer();
    resources.buffers.push(buffer);
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(values), gl.STATIC_DRAW);
    const location = gl.getAttribLocation(program, name);
    gl.enableVertexAttribArray(location);
    gl.vertexAttribPointer(location, 3, gl.FLOAT, false, 0, 0);
  }
  gl.enable(gl.DEPTH_TEST);
  gl.clearColor(...data.background, 1);
  const initial = data.camera.map((value, i) => value - data.target[i]);
  const radius = Math.hypot(initial[0], initial[1]);
  let angle = Math.atan2(initial[1], initial[0]);
  let frames = 0;
  return (turn = 0) => {
    angle += turn;
    const size = canvas.getBoundingClientRect();
    if (!size.width || size.bottom < 0 || size.top > window.innerHeight) {
      return;
    }
    const scale = Math.min(window.devicePixelRatio || 1, 1.25);
    canvas.width = Math.min(1600, Math.round(size.width * scale));
    canvas.height = Math.round((canvas.width * 9) / 16);
    gl.viewport(0, 0, canvas.width, canvas.height);
    const camera = [
      data.target[0] + Math.cos(angle) * radius,
      data.target[1] + Math.sin(angle) * radius,
      data.camera[2],
    ];
    gl.uniformMatrix4fv(
      gl.getUniformLocation(program, 'camera'),
      false,
      matrix(camera, data.target, canvas.width / canvas.height)
    );
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    gl.drawArrays(gl.TRIANGLES, 0, data.positions.length / 3);
    frames++;
    if (debug) {
      canvas.dataset.frames = String(frames);
      console.debug('scene draw', data.id, frames);
    }
  };
}

async function openScene(viewer) {
  active?.();
  const button = viewer.querySelector('[data-open-scene]');
  const status = viewer.querySelector('[role="status"]');
  const canvas = viewer.querySelector('canvas');
  const controls = viewer.querySelector('.scene-controls');
  const close = viewer.querySelector('[data-close-scene]');
  const abort = new AbortController();
  const resources = { buffers: [], shaders: [], program: null };
  let gl = null;
  let observer = null;
  let draw = null;
  let alive = true;
  const timer = setTimeout(() => abort.abort(), 15000);
  const rotate = (event) =>
    draw?.(Number(event.target.closest('[data-turn]')?.dataset.turn) || 0);
  const key = (event) => {
    if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
      event.preventDefault();
      draw?.(event.key === 'ArrowLeft' ? -0.15 : 0.15);
    }
  };
  const cleanup = () => {
    if (!alive) {
      return;
    }
    const returnFocus =
      canvas === document.activeElement ||
      controls.contains(document.activeElement);
    alive = false;
    clearTimeout(timer);
    abort.abort();
    observer?.disconnect();
    controls.removeEventListener('click', rotate);
    canvas.removeEventListener('keydown', key);
    canvas.removeEventListener('webglcontextlost', lost);
    close.removeEventListener('click', cleanup);
    if (gl) {
      resources.buffers.forEach((buffer) => gl.deleteBuffer(buffer));
      resources.shaders.forEach((value) => gl.deleteShader(value));
      if (resources.program) {
        gl.deleteProgram(resources.program);
      }
      gl.getExtension('WEBGL_lose_context')?.loseContext();
    }
    const replacement = canvas.cloneNode(false);
    replacement.hidden = true;
    replacement.removeAttribute('data-frames');
    canvas.replaceWith(replacement);
    controls.hidden = true;
    button.hidden = false;
    button.disabled = false;
    if (returnFocus) {
      button.focus();
    }
    status.textContent = 'Rendered view. Open the scene to look around.';
    if (active === cleanup) {
      active = null;
    }
  };
  const lost = (event) => {
    event.preventDefault();
    cleanup();
    status.textContent =
      'The 3D view is unavailable. The rendered view remains available.';
  };
  active = cleanup;
  button.disabled = true;
  status.textContent = 'Opening the scene…';
  try {
    const response = await fetch(viewer.dataset.scene, {
      signal: abort.signal,
    });
    if (!response.ok) {
      throw new Error(`Scene request: ${response.status}`);
    }
    const data = await response.json();
    if (!alive) {
      return;
    }
    clearTimeout(timer);
    validate(data);
    gl = canvas.getContext('webgl', {
      alpha: false,
      antialias: false,
      powerPreference: 'low-power',
    });
    if (!gl) {
      throw new Error('WebGL unavailable');
    }
    draw = renderer(gl, canvas, data, resources);
    observer = new ResizeObserver(() => draw());
    canvas.addEventListener('webglcontextlost', lost);
    canvas.addEventListener('keydown', key);
    controls.addEventListener('click', rotate);
    close.addEventListener('click', cleanup);
    canvas.hidden = false;
    controls.hidden = false;
    button.hidden = true;
    observer.observe(canvas);
    draw();
    canvas.focus();
    status.textContent =
      'Use the arrow buttons or left and right keys to look around.';
  } catch (error) {
    if (!alive) {
      return;
    }
    cleanup();
    status.textContent =
      'The 3D view is unavailable. The rendered view remains available.';
    if (debug) {
      console.debug('Scene fallback', error);
    }
  }
}

document.querySelectorAll('[data-scene]').forEach((viewer) => {
  const button = viewer.querySelector('[data-open-scene]');
  button.hidden = false;
  viewer.querySelector('.scene-status').textContent =
    'Rendered view. Open the scene to look around.';
  button.addEventListener('click', () => openScene(viewer));
});
window.addEventListener('pagehide', () => active?.());
