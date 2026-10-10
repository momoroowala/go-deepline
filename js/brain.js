// The Brain — Three.js particle sculpture. Fragments (SOP "documents") assemble into a brain,
// then compress into a 24×7 dot grid on scroll. State object is shared with main.js.
import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.186.1/+esm';

export function initBrain(canvas, S, env) {
  env = env || { w: 1440, h: 900, dpr: 1 };
  const lite = S.lite;
  const N = lite ? 2600 : 6500;
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: false, alpha: true, powerPreference: 'high-performance' });
  renderer.setPixelRatio(Math.min(env.dpr || 1, lite ? 1.5 : 2));
  renderer.setClearColor(0x000000, 0);
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(34, 1, 0.1, 100);
  camera.position.set(0, 0, 10);

  const rnd = mulberry(7);
  const brain = new Float32Array(N * 3), start = new Float32Array(N * 3), grid = new Float32Array(N * 3);
  const color = new Float32Array(N * 3), delay = new Float32Array(N), size = new Float32Array(N);

  // ---- brain target
  const tmp = new THREE.Vector3();
  function folds(x, y, z) {
    return Math.sin(x * 11 + y * 7) * Math.sin(y * 13 - z * 9) * Math.sin(z * 10 + x * 5)
      + 0.5 * Math.sin(x * 23 - z * 17 + y * 3) * Math.sin(y * 19 + z * 7);
  }
  for (let i = 0; i < N; i++) {
    const r = rnd();
    let x, y, z, inner = false;
    if (r < 0.9) {
      const s = rnd() < 0.5 ? -1 : 1;
      // random direction
      const u = rnd() * 2 - 1, th = rnd() * Math.PI * 2, q = Math.sqrt(1 - u * u);
      let dx = q * Math.cos(th), dy = u, dz = q * Math.sin(th);
      // keep inner medial wall flatter
      if (dx * s < 0) dx *= 0.35;
      inner = rnd() < 0.12;
      const fv = folds(dx, dy, dz);
      if (!inner && Math.abs(fv) > 0.28 && rnd() < 0.82) { i--; continue; }
      let rad = 1 + 0.06 * fv;
      if (inner) rad *= Math.pow(rnd(), 0.6) * 0.92;
      x = s * 0.56 + dx * 0.66 * rad;
      y = dy * 0.8 * rad;
      z = dz * 1.22 * rad;
      if (y < -0.25) y = -0.25 + (y + 0.25) * 0.7; // flatter base
      // temporal lobe bulge
      if (y < 0 && z > -0.2 && z < 0.7) { x += s * 0.08 * (-y); }
    } else if (r < 0.982) {
      // cerebellum
      const u = rnd() * 2 - 1, th = rnd() * Math.PI * 2, q = Math.sqrt(1 - u * u);
      const rad = 1 + 0.05 * Math.sin(u * 40);
      x = q * Math.cos(th) * 0.62 * rad; y = -0.58 + u * 0.28 * rad; z = -0.82 + q * Math.sin(th) * 0.36 * rad;
    } else {
      // brain stem
      const t = rnd(), a = rnd() * Math.PI * 2;
      x = Math.cos(a) * 0.1 * (1 - t * 0.3); z = -0.42 + Math.sin(a) * 0.1 - t * 0.1; y = -0.5 - t * 0.48;
    }
    brain.set([x * 1.55, y * 1.55 + 0.1, z * 1.55], i * 3);

    // color: brand only. Neutral white + logo indigo #4353C1
    const c = rnd();
    let cr = 0.93, cg = 0.93, cb = 0.95;
    if (c < 0.11) { cr = 0.263; cg = 0.325; cb = 0.757; }
    const dim = inner ? 0.45 : 1;
    color.set([cr * dim, cg * dim, cb * dim], i * 3);
    size[i] = (inner ? 0.7 : 1) * (0.6 + rnd() * 0.9) * (c < 0.11 ? 1.25 : 1);
  }

  // ---- start: scattered "documents" (rows of text-dots on little cards)
  const DOCS = lite ? 28 : 56;
  const per = Math.ceil(N / DOCS);
  for (let d = 0; d < DOCS; d++) {
    // place docs on a wide shell around the scene
    const ang = rnd() * Math.PI * 2, el = (rnd() - 0.5) * 1.6;
    const R = 6 + rnd() * 6;
    const cx = Math.cos(ang) * R * 1.3, cy = el * 4, cz = Math.sin(ang) * R * 0.6 - 2;
    const rot = new THREE.Euler((rnd() - 0.5) * 1.2, (rnd() - 0.5) * 1.6, (rnd() - 0.5) * 0.8);
    const W = 0.9 + rnd() * 0.5, H = W * 1.3;
    const rows = 9;
    const lens = Array.from({ length: rows }, (_, k) => (k === 0 ? 0.55 : 0.5 + rnd() * 0.5));
    for (let k = 0; k < per; k++) {
      const i = d * per + k; if (i >= N) break;
      let px, py;
      if (k % 9 === 0) { // card outline
        const t = rnd() * 4;
        if (t < 1) { px = t * W; py = 0; } else if (t < 2) { px = W; py = (t - 1) * H; }
        else if (t < 3) { px = (3 - t) * W; py = H; } else { px = 0; py = (4 - t) * H; }
      } else {
        const row = Math.floor(rnd() * rows);
        px = 0.1 * W + rnd() * lens[row] * W * 0.8; py = H - 0.12 * H - row * (H * 0.8 / rows);
      }
      tmp.set(px - W / 2, py - H / 2, 0).applyEuler(rot);
      start.set([cx + tmp.x, cy + tmp.y, cz + tmp.z], i * 3);
      delay[i] = d / DOCS * 0.55 + rnd() * 0.45;
    }
  }

  // ---- grid target: 24 hours × 7 days
  function buildGrid(portrait) {
    const cols = portrait ? 7 : 24, rows = portrait ? 24 : 7;
    const gw = portrait ? 4.2 : 7.85, gh = portrait ? 7.2 : 1.6;
    for (let i = 0; i < N; i++) {
      const cell = i % (cols * rows);
      const cx = cell % cols, cy = Math.floor(cell / cols);
      const a = rnd() * Math.PI * 2, rr = Math.sqrt(rnd()) * 0.07;
      grid.set([(cx / (cols - 1) - 0.5) * gw + Math.cos(a) * rr, (0.5 - cy / (rows - 1)) * gh + Math.sin(a) * rr, (rnd() - 0.5) * 0.06], i * 3);
    }
  }
  buildGrid(env.w < env.h);

  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.BufferAttribute(brain, 3));
  geo.setAttribute('aStart', new THREE.BufferAttribute(start, 3));
  const gridAttr = new THREE.BufferAttribute(grid, 3);
  geo.setAttribute('aGrid', gridAttr);
  geo.setAttribute('aColor', new THREE.BufferAttribute(color, 3));
  geo.setAttribute('aDelay', new THREE.BufferAttribute(delay, 1));
  geo.setAttribute('aSize', new THREE.BufferAttribute(size, 1));

  const uniforms = {
    uTime: { value: 0 }, uLoad: { value: 0 }, uMorph: { value: 0 },
    uPixel: { value: renderer.getPixelRatio() }, uSize: { value: lite ? 62 : 52 },
    uMouse: { value: new THREE.Vector3(99, 99, 0) }, uMouseStr: { value: 0 }, uFade: { value: 1 }
  };
  const mat = new THREE.ShaderMaterial({
    uniforms, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending,
    vertexShader: /* glsl */`
      attribute vec3 aStart; attribute vec3 aGrid; attribute vec3 aColor; attribute float aDelay; attribute float aSize;
      uniform float uTime, uLoad, uMorph, uPixel, uSize, uMouseStr; uniform vec3 uMouse;
      varying vec3 vColor; varying float vAlpha;
      float eio(float t){ return t<.5 ? 4.*t*t*t : 1.-pow(-2.*t+2.,3.)/2.; }
      void main(){
        float l = eio(clamp(uLoad*1.7 - aDelay*0.7, 0., 1.));
        vec3 drift = vec3(sin(uTime*.25+aDelay*9.), cos(uTime*.2+aDelay*13.), 0.)*.25*(1.-l);
        vec3 p = mix(aStart + drift, position, l);
        p += .022*vec3(sin(uTime*.9+aDelay*40.), cos(uTime*.7+aDelay*31.), sin(uTime*.8+aDelay*17.))*l;
        float m = eio(clamp(uMorph*1.5 - aDelay*0.5, 0., 1.));
        vec3 g = aGrid + vec3(0., .03*sin(uTime*1.3 + aGrid.x*1.7), 0.);
        p = mix(p, g, m);
        vec4 wp = modelMatrix * vec4(p, 1.);
        vec2 d = wp.xy - uMouse.xy; float dist = length(d);
        float f = smoothstep(1.5, 0., dist) * uMouseStr * (1.-m*.6);
        wp.xy += normalize(d + 1e-4) * f * .16;
        vec4 mv = viewMatrix * wp;
        gl_Position = projectionMatrix * mv;
        float s = uSize * aSize * uPixel * (1. + f*.5) * mix(1., .8, m);
        gl_PointSize = s / -mv.z;
        vColor = mix(aColor, vec3(.557, .596, .855), clamp(f*.8 + m*.15, 0., 1.));
        vAlpha = mix(.22, .85, l) * (.8 + .2*f);
      }`,
    fragmentShader: /* glsl */`
      uniform float uFade; varying vec3 vColor; varying float vAlpha;
      void main(){
        vec2 c = gl_PointCoord - .5; float d = length(c);
        float a = smoothstep(.5, 0., d); a = a*a;
        float core = smoothstep(.16, 0., d);
        gl_FragColor = vec4(vColor * (a*.75 + core*.9), (a + core) * vAlpha * uFade);
      }`
  });
  const points = new THREE.Points(geo, mat);
  const group = new THREE.Group(); group.add(points); scene.add(group);

  // ---- sizing / layout
  let W = 0, H = 0, portrait = env.w < env.h;
  function resize(w, h) {
    W = w; H = h;
    renderer.setSize(W, H, false);
    camera.aspect = W / H; camera.updateProjectionMatrix();
    const p = W < H; if (p !== portrait) { portrait = p; buildGrid(p); gridAttr.needsUpdate = true; }
    camera.position.z = portrait ? 13 : 10;
  }
  resize(env.w, env.h);

  // ---- mouse
  const mouse = new THREE.Vector2(0, 0), target = new THREE.Vector2(0, 0); let mstr = 0, mTarget = 0;
  const ray = new THREE.Raycaster(), plane = new THREE.Plane(new THREE.Vector3(0, 0, 1), 0), hit = new THREE.Vector3();

  // ---- loop with offscreen pause
  const RAF = typeof requestAnimationFrame === 'function' ? requestAnimationFrame : (f => setTimeout(() => f(performance.now()), 16));
  const CAF = typeof cancelAnimationFrame === 'function' ? cancelAnimationFrame : clearTimeout;
  let raf = 0, running = false, t0 = performance.now(), last = t0;
  const clock = { t: 0 };
  function frame(now) {
    raf = RAF(frame);
    const dt = Math.min((now - last) / 1000, 0.05); last = now; clock.t += dt;
    uniforms.uTime.value = clock.t;
    // intro load
    if (S.scatter) uniforms.uLoad.value = clock.t < 1.2 ? 1 : Math.max(0.38 + 0.06 * Math.sin(clock.t * 0.8), 1 - (clock.t - 1.2) / 2.6);
    else if (S.intro) uniforms.uLoad.value = Math.min(1, uniforms.uLoad.value + dt / 1.3);
    const sc = S.scroll || 0;
    const morph = smooth(0.18, 0.55, sc);
    uniforms.uMorph.value += (morph - uniforms.uMorph.value) * 0.12;
    target.set(S.mx || 0, S.my || 0); mTarget = S.mActive || 0;
    mouse.lerp(target, 0.07); mstr += (mTarget - mstr) * 0.05; uniforms.uMouseStr.value = mstr;
    ray.setFromCamera(mouse, camera); ray.ray.intersectPlane(plane, hit); uniforms.uMouse.value.copy(hit);
    const um = uniforms.uMorph.value;
    // layout: right side on desktop, top-centre on portrait; drift to centre as it morphs
    const baseX = (portrait || S.center) ? 0 : 1.95, baseY = portrait ? (S.center ? 0.6 : 1.55) : 0.35;
    group.position.x = baseX * (1 - um) + (portrait ? 0 : 0) * um;
    group.position.y = baseY * (1 - um) + (portrait ? -0.2 : -0.3) * um;
    const spin = -Math.PI / 2 + Math.sin(clock.t * 0.1) * 0.18 + sc * Math.PI * 0.5;
    group.rotation.y = (spin + mouse.x * 0.06) * (1 - um);
    group.rotation.x = (0.12 + mouse.y * -0.05) * (1 - um);
    group.rotation.z = 0.06 * (1 - um);
    const sscale = (portrait ? (S.center ? 0.95 : 0.62) : 0.98) * (1 + sc * 0.12 * (1 - um));
    group.scale.setScalar(sscale);
    uniforms.uFade.value = 1 - smooth(0.88, 1.0, sc);
    renderer.render(scene, camera);
  }
  function start_() { if (!running) { running = true; last = performance.now(); raf = RAF(frame); } }
  function stop_() { running = false; CAF(raf); }
  start_();
  return { start: start_, stop: stop_, resize };
}

function smooth(a, b, x) { const t = Math.min(1, Math.max(0, (x - a) / (b - a))); return t * t * (3 - 2 * t); }
function mulberry(a) { return function () { let t = a += 0x6D2B79F5; t = Math.imul(t ^ t >>> 15, t | 1); t ^= t + Math.imul(t ^ t >>> 7, t | 61); return ((t ^ t >>> 14) >>> 0) / 4294967296; }; }
