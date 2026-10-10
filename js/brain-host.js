// Mounts the particle brain: in a Web Worker via OffscreenCanvas when supported, otherwise on the main thread.
// Shared state S: { scroll, intro, lite, scatter, center, mx, my, mActive }.
export function mountBrain(canvas, S, onReady, onFail) {
  const env = () => ({ w: innerWidth, h: innerHeight, dpr: Math.min(devicePixelRatio || 1, S.lite ? 1.5 : 2) });
  const plain = () => ({ scroll: S.scroll || 0, intro: !!S.intro, lite: !!S.lite, scatter: !!S.scatter, center: !!S.center, mx: S.mx || 0, my: S.my || 0, mActive: S.mActive || 0 });
  let post = () => {}, done = false;
  const ready = () => { if (done) return; done = true; canvas.classList.add('on'); onReady && onReady(); };
  const fail = err => { console.warn('brain', err); onFail && onFail(err); };

  const mainThread = () => import('./brain.js').then(m => {
    const api = m.initBrain(canvas, S, env());
    post = msg => { if (msg.type === 'resize') api.resize(msg.w, msg.h); else if (msg.type === 'run') msg.on ? api.start() : api.stop(); };
    ready();
  }).catch(fail);

  if (window.__initBrainInline) { // self-contained preview build
    const api = window.__initBrainInline(canvas, S, env());
    post = msg => { if (msg.type === 'resize') api.resize(msg.w, msg.h); else if (msg.type === 'run') msg.on ? api.start() : api.stop(); };
    ready();
  } else if ('transferControlToOffscreen' in canvas && typeof Worker === 'function') {
    try {
      const worker = new Worker(new URL('./brain-worker.js', import.meta.url), { type: 'module' });
      const off = canvas.transferControlToOffscreen();
      const e = env();
      worker.postMessage({ type: 'init', canvas: off, S: plain(), ...e }, [off]);
      worker.onmessage = ev => { if (ev.data.type === 'ready') ready(); else if (ev.data.type === 'error') fail(ev.data.message); };
      worker.onerror = ev => fail(ev.message || 'worker error');
      post = msg => worker.postMessage(msg);
    } catch (err) { mainThread(); }
  } else mainThread();

  let queued = false;
  const sync = () => { if (queued) return; queued = true; requestAnimationFrame(() => { queued = false; post({ type: 'state', S: plain() }); }); };
  addEventListener('pointermove', e => { S.mx = e.clientX / innerWidth * 2 - 1; S.my = -(e.clientY / innerHeight) * 2 + 1; S.mActive = e.pointerType === 'mouse' ? 1 : 0; sync(); }, { passive: true });
  document.addEventListener('pointerleave', () => { S.mActive = 0; sync(); });
  addEventListener('resize', () => post({ type: 'resize', ...env() }));
  let wanted = true;
  const run = on => { wanted = on; post({ type: 'run', on: on && !document.hidden }); };
  document.addEventListener('visibilitychange', () => post({ type: 'run', on: wanted && !document.hidden }));
  return { sync, run };
}
