// Runs the particle brain off the main thread (OffscreenCanvas), so WebGL setup never blocks input.
import { initBrain } from './brain.js';
let api = null, S = {};
self.onmessage = e => {
  const d = e.data;
  if (d.type === 'init') {
    S = d.S;
    try { api = initBrain(d.canvas, S, { w: d.w, h: d.h, dpr: d.dpr }); self.postMessage({ type: 'ready' }); }
    catch (err) { self.postMessage({ type: 'error', message: String(err) }); }
  } else if (d.type === 'state') Object.assign(S, d.S);
  else if (d.type === 'resize') api && api.resize(d.w, d.h);
  else if (d.type === 'run') api && (d.on ? api.start() : api.stop());
};
