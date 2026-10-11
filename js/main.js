/* Deepline Operations v3: restrained interactions. One motion moment per section. Classic deferred script. */
(() => {
  const html = document.documentElement;
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
  if (!window.gsap) html.classList.add('rm');
  const RM = html.classList.contains('rm');
  const FINE = matchMedia('(hover:hover) and (pointer:fine)').matches;
  const MOBILE = innerWidth < 821 || !FINE;
  const S = window.__deep = { scroll: 0, intro: false, lite: MOBILE };

  /* ---------- WebGL support ---------- */
  let gl = false;
  try { const c = document.createElement('canvas'); gl = !!(c.getContext('webgl2') || c.getContext('webgl')); } catch (e) {}
  if (/[?&]static\b/.test(location.search)) gl = false;
  if (!gl) html.classList.add('no-webgl');

  /* ---------- night shift feed ---------- */
  const TASKS = [
    { sys: 'Gmail → QuickBooks', n: ['gmail', 'qbo'], t: 'Bean2Bean · parsed 3 wholesale orders from Gmail → QuickBooks' },
    { sys: 'Gmail · CRM', n: ['gmail', 'crm'], t: 'Ivy · 214 outreach emails drafted & queued' },
    { sys: 'QuickBooks', n: ['qbo', 'drive'], t: 'Price drift caught: 2 SKUs fixed' },
    { sys: 'Gmail', n: ['gmail'], t: 'CEO inbox triaged · 12 drafts ready' },
    { sys: 'Slack', n: ['slack', 'drive'], t: 'Weekly KPI report sent to Slack' },
    { sys: 'Shopify · CRM', n: ['shopify', 'crm'], t: 'Win-back campaign: 38 lapsed customers segmented' },
    { sys: 'Xero', n: ['qbo', 'gmail'], t: 'Ivy · purchase orders reviewed → Xero invoices drafted' },
    { sys: 'Drive', n: ['drive'], t: 'Meeting notes → 5 tasks + proposal draft' },
    { sys: 'Shopify → QuickBooks', n: ['shopify', 'qbo'], t: 'Portal reorder "fill my usual order" synced to QuickBooks' },
    { sys: 'Drive · Slack', n: ['drive', 'slack'], t: 'SEO article drafted · brand check passed · queued to publish' },
    { sys: 'CRM', n: ['crm', 'gmail'], t: 'Follow-ups scheduled for 9 open leads · drafts ready' },
    { sys: 'QuickBooks · Drive', n: ['qbo', 'drive'], t: 'Contractor quote: price book → margin-checked quote ready' },
  ];
  const feed = $('#feed');
  let simT = 23 * 3600 + 52 * 60;
  const two = n => String(n).padStart(2, '0');
  const hhmm = s => { s = ((s % 86400) + 86400) % 86400; return two(Math.floor(s / 3600)) + ':' + two(Math.floor(s / 60) % 60); };
  const hhmmss = s => { s = ((s % 86400) + 86400) % 86400; return hhmm(s) + ':' + two(Math.floor(s) % 60); };
  const LBL = { queued: 'Queued', working: 'Working', done: 'Done' };
  let done = 0, ti = 0;
  const counts = () => {
    $('#cDone').textContent = done;
    $('#cWork').textContent = feed.querySelectorAll('.st.working').length;
    $('#cQueue').textContent = feed.querySelectorAll('.st.queued').length;
  };
  function row(task, status) {
    const li = document.createElement('li');
    li.innerHTML = `<span class="t">${hhmm(simT)}</span><span class="msg"><span class="txt"></span><span class="sys">${task.sys}</span></span><span class="st ${status}"><i></i>${LBL[status]}</span>`;
    li.querySelector('.txt').textContent = task.t;
    return li;
  }
  function setStatus(li, s) { const st = li.querySelector('.st'); st.className = 'st ' + s; st.innerHTML = `<i></i>${LBL[s]}`; counts(); }
  // Rows sit at top:0 (absolute) and are placed with translateY only, so new tasks never cause layout shift (CLS).
  function placeFeed(instant) {
    let y = 0;
    [...feed.children].forEach(el => {
      if (instant || !window.gsap) { if (window.gsap) gsap.set(el, { y }); else el.style.transform = `translateY(${y}px)`; }
      else gsap.to(el, { y, duration: .2, ease: 'power2.out', overwrite: true });
      y += el.offsetHeight;
    });
  }
  addEventListener('resize', () => placeFeed(true));
  function seed(n) { for (let i = 0; i < n; i++) { const t = TASKS[ti++ % TASKS.length]; simT += 220; feed.prepend(row(t, 'done')); done++; } placeFeed(true); counts(); $('#conClock').textContent = hhmmss(simT); }
  let feedTimer = 0, clockTimer = 0, feedOn = false;
  function pushTask() {
    const task = TASKS[ti++ % TASKS.length];
    simT += 60 + Math.floor(Math.random() * 300);
    const li = row(task, 'queued');
    // FLIP: rows slide with transforms only, so the feed never causes layout shift (CLS)
    feed.prepend(li);
    const rows = feed.querySelectorAll('li');
    if (rows.length > 8) rows[rows.length - 1].remove();
    placeFeed(false);
    if (window.gsap) gsap.fromTo(li, { opacity: 0 }, { opacity: 1, duration: .2, ease: 'power2.out' });
    counts();
    setTimeout(() => setStatus(li, 'working'), 350);
    setTimeout(() => { setStatus(li, 'done'); done++; counts(); light(task.n); }, 1000 + Math.random() * 700);
  }
  function startFeed() {
    if (feedOn) return; feedOn = true;
    if (!feed.children.length) seed(6);
    pushTask(); feedTimer = setInterval(pushTask, 1500);
    clockTimer = setInterval(() => { simT += 6; $('#conClock').textContent = hhmmss(simT); }, 250);
  }
  function stopFeed() { feedOn = false; clearInterval(feedTimer); clearInterval(clockTimer); }

  /* ---------- node graph (static; a node + wire light up in the accent when its task completes) ---------- */
  const NODES = [
    { id: 'gmail', label: 'Gmail', x: 96, y: 96 },
    { id: 'qbo', label: 'QuickBooks / Xero', x: 424, y: 96 },
    { id: 'crm', label: 'CRM', x: 76, y: 280 },
    { id: 'slack', label: 'Slack', x: 444, y: 280 },
    { id: 'shopify', label: 'Shopify', x: 96, y: 464 },
    { id: 'drive', label: 'Drive', x: 424, y: 464 },
  ];
  const NS = 'http://www.w3.org/2000/svg';
  const svgEl = (t, a) => { const e = document.createElementNS(NS, t); for (const k in a) e.setAttribute(k, a[k]); return e; };
  const wires = {}, nodeEls = {};
  NODES.forEach(n => {
    const cx = 260, cy = 280, mx = (n.x + cx) / 2;
    const d = `M${n.x},${n.y} C${mx},${n.y} ${mx},${cy} ${cx + (n.x < cx ? -46 : 46)},${cy}`;
    const p = svgEl('path', { d, class: 'wire' }); $('#wires').appendChild(p); wires[n.id] = p;
    const g = svgEl('g', { class: 'node', transform: `translate(${n.x},${n.y})` });
    const w = Math.max(92, n.label.length * 7.6 + 32);
    g.appendChild(svgEl('rect', { x: -w / 2, y: -18, width: w, height: 36, rx: 8 }));
    const t1 = svgEl('text', { x: 0, y: 5, 'text-anchor': 'middle' }); t1.textContent = n.label; g.appendChild(t1);
    $('#nodes').appendChild(g); nodeEls[n.id] = g;
  });
  function light(ids) {
    ids.forEach(id => { const g = nodeEls[id], w = wires[id]; if (!g) return; g.classList.add('on'); w.classList.add('on');
      setTimeout(() => { g.classList.remove('on'); w.classList.remove('on'); }, 800); });
  }

  if (RM) seed(7);
  else new IntersectionObserver(es => es.forEach(e => e.isIntersecting ? startFeed() : stopFeed()), { threshold: .15 }).observe($('#console'));

  /* ---------- offers: accordion + (fine pointer) one-line hover marquee ---------- */
  $$('.flow-item').forEach(item => {
    const btn = item.querySelector('.flow-row');
    btn.addEventListener('click', () => { const o = item.classList.toggle('open'); btn.setAttribute('aria-expanded', o); setTimeout(() => window.ScrollTrigger && ScrollTrigger.refresh(), 280); });
    if (!FINE || RM) return;
    const m = document.createElement('div'); m.className = 'marq'; m.setAttribute('aria-hidden', 'true');
    const inner = document.createElement('div'); inner.className = 'marq-in';
    inner.innerHTML = Array(8).fill(`<span>${item.dataset.out}</span>`).join('');
    m.appendChild(inner); btn.appendChild(m);
  });

  /* ---------- preloader ---------- */
  const pre = $('#preload');
  let preDone = false;
  const hidePre = () => { if (preDone || !pre) return; preDone = true; $('#plBar').style.setProperty('--p', 1); setTimeout(() => pre.classList.add('done'), 60); setTimeout(() => pre.remove(), 400); };
  S.onReady = hidePre;
  if (RM || !gl || !pre) hidePre();
  else {
    const t0 = performance.now();
    const step = () => { if (preDone) return; $('#plBar').style.setProperty('--p', Math.min(.92, (performance.now() - t0) / 900)); requestAnimationFrame(step); };
    requestAnimationFrame(step);
    setTimeout(hidePre, 1200);
  }

  /* ---------- checklist form ---------- */
  const form = $('#leadForm');
  if (form) {
    const email = $('#lfEmail'), msg = $('#lfMsg'), btn = form.querySelector('button[type=submit]'), lbl = btn.querySelector('.lbl');
    const say = (t, cls) => { msg.textContent = t; msg.className = 'lf-msg ' + (cls || ''); };
    const valid = v => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim());
    email.addEventListener('input', () => { if (email.getAttribute('aria-invalid') === 'true' && valid(email.value)) { email.setAttribute('aria-invalid', 'false'); say(''); } });
    form.addEventListener('submit', async e => {
      e.preventDefault();
      if (!valid(email.value)) { email.setAttribute('aria-invalid', 'true'); say('Please enter a valid email address, like you@company.com.', 'err'); email.focus(); return; }
      if (form.querySelector('[name=_honey]').value) return;
      const action = form.getAttribute('action') || '';
      if (!/^https:\/\//.test(action)) { say('The signup form isn\u2019t connected yet. Email mo@deeplineop.ai and we\u2019ll send the checklist.', 'err'); return; }
      form.classList.add('loading'); btn.disabled = true; lbl.textContent = 'Sending…'; say('');
      try {
        const body = Object.assign({ _template: 'table', _captcha: 'false' }, Object.fromEntries(new FormData(form).entries()));
        const r = await fetch(action, { method: 'POST', headers: { 'Content-Type': 'application/json', Accept: 'application/json' }, body: JSON.stringify(body) });
        const j = await r.json().catch(() => ({}));
        if (!r.ok || !(j.success === true || j.success === 'true')) throw new Error(j.message || 'HTTP ' + r.status);
        say('Got it. Redirecting…', 'ok'); location.href = 'thank-you.html?src=checklist';
      } catch (err) {
        say('Something went wrong sending that. Try again, or email mo@deeplineop.ai.', 'err');
      } finally { form.classList.remove('loading'); btn.disabled = false; lbl.textContent = 'Send me the checklist'; }
    });
  }

  /* ---------- mobile bottom bar: after the hero, hidden over the final CTA (CSS hides it ≥821px) ---------- */
  const sticky = $('#stickyCta');
  const top = $('#top'), fin = $('#final');
  const barCheck = () => { const a = top.getBoundingClientRect().bottom < innerHeight * .25, b = fin.getBoundingClientRect().top > innerHeight * .7; sticky.classList.toggle('show', a && b); };
  addEventListener('scroll', barCheck, { passive: true }); barCheck();

  /* ---------- How it works: tabs (ARIA tablist, arrows/Home/End, swipe) ---------- */
  const tabs = $$('#howTabs [role=tab]'), panels = $$('.how-panel'), howProg = $$('.how-prog i');
  let howCur = 0, howGo = null;
  const howSet = (i, focus) => {
    i = Math.max(0, Math.min(tabs.length - 1, i));
    if (focus) tabs[i].focus({ preventScroll: true });
    if (i === howCur) return;
    howCur = i;
    tabs.forEach((t, k) => { t.setAttribute('aria-selected', k === i); t.tabIndex = k === i ? 0 : -1; });
    panels.forEach((p, k) => p.classList.toggle('on', k === i));
    howProg.forEach((p, k) => p.classList.toggle('on', k === i));
    $('#howBig').textContent = $('#howPos').textContent = '0' + (i + 1);
    const tl = $('#howTabs');
    if (tl.scrollWidth > tl.clientWidth + 2) tl.scrollTo({ left: tabs[i].offsetLeft - tl.offsetLeft - parseFloat(getComputedStyle(tl).paddingLeft), behavior: RM ? 'auto' : 'smooth' });
  };
  const howPick = (i, focus) => { i = Math.max(0, Math.min(tabs.length - 1, i)); howGo ? (howGo(i), howSet(i, focus)) : howSet(i, focus); };
  tabs.forEach((t, k) => t.addEventListener('click', () => howPick(k)));
  $('#howTabs').addEventListener('keydown', e => {
    const m = { ArrowRight: howCur + 1, ArrowDown: howCur + 1, ArrowLeft: howCur - 1, ArrowUp: howCur - 1, Home: 0, End: tabs.length - 1 };
    if (!(e.key in m)) return;
    e.preventDefault(); howPick(m[e.key], true);
  });
  {
    const stage = $('#howStage'); let sx = 0, sy = 0, on = false;
    stage.addEventListener('touchstart', e => { const t = e.touches[0]; sx = t.clientX; sy = t.clientY; on = true; }, { passive: true });
    stage.addEventListener('touchend', e => {
      if (!on) return; on = false;
      const t = e.changedTouches[0], dx = t.clientX - sx, dy = t.clientY - sy;
      if (Math.abs(dx) > 40 && Math.abs(dx) > Math.abs(dy) * 1.4) howPick(howCur + (dx < 0 ? 1 : -1));
    }, { passive: true });
  }

  /* Diagrams 02-04 load after first paint (keeps the HTML small); slots reserve their size */
  const loadDiagrams = () => $$('.dg-slot[data-src]').forEach(el => fetch(el.dataset.src).then(r => r.ok ? r.text() : Promise.reject(r.status)).then(t => { el.innerHTML = t; el.removeAttribute('data-src'); }).catch(() => {}));
  if (document.readyState === 'complete') (window.requestIdleCallback || setTimeout)(loadDiagrams); else addEventListener('load', () => (window.requestIdleCallback || setTimeout)(loadDiagrams));

  /* ---------- Proof: swipe-card position indicator ---------- */
  {
    const track = $('#pfTrack'), cards = $$('.pf-card', track), dash = $$('.pf-dash i'), pos = $('#pfPos');
    let last = -1, raf = 0;
    const upd = () => {
      raf = 0;
      const step = cards[1].offsetLeft - cards[0].offsetLeft || 1;
      let i = Math.round(track.scrollLeft / step);
      if (track.scrollLeft + track.clientWidth >= track.scrollWidth - 4) i = cards.length - 1;
      i = Math.max(0, Math.min(cards.length - 1, i));
      if (i === last) return; last = i;
      pos.textContent = '0' + (i + 1);
      dash.forEach((d, k) => d.classList.toggle('on', k === i));
    };
    track.addEventListener('scroll', () => { raf || (raf = requestAnimationFrame(upd)); }, { passive: true });
    upd();
  }

  if (RM) return;

  /* ================= GSAP ================= */
  gsap.registerPlugin(ScrollTrigger);
  const EASE = 'power3.out';

  let lenis = null;
  if (window.Lenis) {
    lenis = new Lenis({ lerp: 0.14, smoothWheel: true });
    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add(t => lenis.raf(t * 1000)); gsap.ticker.lagSmoothing(0);
    window.__lenis = lenis;
  }
  document.addEventListener('click', e => {
    const a = e.target.closest('a[href^="#"]'); if (!a) return;
    const id = a.getAttribute('href'); const el = id.length > 1 && $(id); if (!el) return;
    e.preventDefault(); lenis ? lenis.scrollTo(el, { offset: id === '#top' ? 0 : -64, duration: .8 }) : el.scrollIntoView({ behavior: 'smooth' });
  });

  /* Hero: quiet fade-in; the brain assembling is the moment */
  gsap.from('.hero-copy > *, .statrow', { opacity: 0, y: 10, duration: .45, ease: EASE, stagger: .04, delay: .05 });

  /* Brain */
  const brainCanvas = $('#brain');
  let host = null;
  const bootBrain = () => {
    if (!gl) return;
    S.intro = true;
    const load = window.__mountBrain ? Promise.resolve({ mountBrain: window.__mountBrain }) : import('./brain-host.js');
    load.then(m => { host = m.mountBrain(brainCanvas, S, hidePre, () => { html.classList.add('no-webgl'); brainCanvas.style.display = 'none'; hidePre(); }); })
      .catch(err => { console.warn('brain', err); html.classList.add('no-webgl'); hidePre(); });
  };
  const idle = window.requestIdleCallback || (f => setTimeout(f, 300));
  if (document.readyState === 'complete') idle(bootBrain, { timeout: 300 }); else addEventListener('load', () => idle(bootBrain, { timeout: 300 }));
  ScrollTrigger.create({
    trigger: '#top', start: 'top top', endTrigger: innerWidth < 821 ? '.pillars .cols4' : '#pillars', end: innerWidth < 821 ? 'top 52%' : 'bottom bottom', scrub: true,
    onUpdate: self => { S.scroll = self.progress; host && host.sync(); },
    onLeave: () => { host && host.run(false); brainCanvas.style.visibility = 'hidden'; },
    onEnterBack: () => { brainCanvas.style.visibility = 'visible'; host && host.run(true); },
  });

  const below = () => {
    /* One consistent, quiet reveal per section header; no per-element choreography */
    $$('.sec .sh, .pillars .sh, .how-head, .oc-head, .pf-head').forEach(h => gsap.from(h, { opacity: 0, y: 10, duration: .4, ease: EASE, scrollTrigger: { trigger: h, start: 'top 92%', once: true } }));
    /* Outcomes: count-up is the moment */
    $$('.count').forEach(el => {
      const to = parseFloat(el.dataset.to), dec = +(el.dataset.dec || 0), comma = el.dataset.format === 'comma';
      const o = { v: 0 }; el.textContent = dec ? (0).toFixed(dec) : '0';
      gsap.to(o, { v: to, duration: .8, ease: 'power2.out', scrollTrigger: { trigger: el, start: 'top 95%', once: true },
        onUpdate: () => { el.textContent = dec ? o.v.toFixed(dec) : (comma ? Math.round(o.v).toLocaleString('en-US') : Math.round(o.v)); } });
    });
    /* How it works (desktop): the step list stays put while the page scrolls through the four steps */
    gsap.matchMedia().add('(min-width: 1024px)', () => {
      const pin = $('#howPin'), sticky = pin.firstElementChild;
      const per = () => Math.round(innerHeight * .36), top = () => sticky.getBoundingClientRect().top - pin.getBoundingClientRect().top;
      pin.classList.add('is-pinned');
      const size = () => { pin.style.height = (sticky.offsetHeight + 3 * per()) + 'px'; };
      size();
      const st = ScrollTrigger.create({ trigger: pin, start: () => 'top ' + (parseFloat(getComputedStyle(sticky).top) || 0) + 'px', end: () => '+=' + 3 * per(),
        onRefreshInit: size, invalidateOnRefresh: true, onUpdate: self => howSet(Math.round(self.progress * 3)) });
      howGo = i => { const y = st.start + i * per() + 1; lenis ? lenis.scrollTo(y, { duration: .6 }) : scrollTo({ top: y, behavior: 'smooth' }); };
      return () => { howGo = null; pin.classList.remove('is-pinned'); pin.style.height = ''; };
    });
    /* Event: the faint date drifts, nothing else moves */
    gsap.fromTo('.ev-date', { xPercent: 4 }, { xPercent: -8, ease: 'none', scrollTrigger: { trigger: '#event', start: 'top bottom', end: 'bottom top', scrub: true } });
    ScrollTrigger.refresh();
  };
  document.fonts.ready.then(() => idle(below, { timeout: 1500 }));
  addEventListener('load', () => ScrollTrigger.refresh());
})();
