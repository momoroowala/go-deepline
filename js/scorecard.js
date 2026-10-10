/* AI Ops Scorecard: UI + transparent rules engine. All content/rules live in scorecard-data.js. */
(() => {
  const D = window.SCORECARD; if (!D) return;
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
  const esc = s => String(s == null ? '' : s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const money = n => '$' + Math.round(n).toLocaleString('en-US');
  const round500 = n => Math.round(n / 500) * 500;
  const stage = $('#scStage'), bar = $('#scBar'), prog = $('#scProgress'), intro = $('#scIntro');
  const A = { first: '', company: '', industry: '', industryOther: '', team: '', revenue: '', tools: [], crmName: '', toolsOther: '', sinks: [], sinkOther: '', hours: '', cost: D.assumptions.defaultHourlyCost, sop: 0, data: '', ai: '', email: '' };

  /* ---------------- rules engine ---------------- */
  const clamp = (v, a = 5, b = 98) => Math.max(a, Math.min(b, Math.round(v)));
  const ind = () => D.industries[A.industry] || D.industries.other;
  const teamMid = () => (D.teamSizes.find(t => t.id === A.team) || { mid: 10 }).mid;
  const TOOLNAME = { email: 'email', accounting: 'QuickBooks/Xero', crm: 'your CRM', shopify: 'Shopify', chat: 'Slack/Teams', drive: 'Google Drive', sheets: 'spreadsheets', other: 'your other tools' };
  const toolName = id => id === 'crm' && A.crmName ? A.crmName : id === 'other' && A.toolsOther ? A.toolsOther : TOOLNAME[id];
  const listJoin = arr => arr.length <= 1 ? (arr[0] || '') : arr.slice(0, -1).join(', ') + ' and ' + arr[arr.length - 1];
  const typedIndustry = () => (A.industry === 'other' && A.industryOther ? A.industryOther : ind().label).trim().replace(/^(a|an|the)\s+/i, '').replace(/^[A-Z](?![A-Z])/, c => c.toLowerCase());
  const dec = h => { const t = document.createElement('textarea'); t.innerHTML = h; return t.value; };
  const cap = t => t.charAt(0).toUpperCase() + t.slice(1);
  function tokens() {
    const i = ind(), per = teamMid() ? (+A.hours / teamMid()) : 0;
    return {
      first: A.first, company: A.company, noun: A.industry === 'other' && A.industryOther ? 'business' : i.noun, clients: i.clients, unit: i.unit,
      tools: listJoin(A.tools.filter(t => t !== 'other' || A.toolsOther).map(toolName)) || 'your tools',
      crm: A.tools.includes('crm') ? (A.crmName || 'your CRM') : 'a CRM',
      accounting: A.tools.includes('accounting') ? 'QuickBooks/Xero' : 'your accounting system',
      shopify: A.tools.includes('shopify') ? 'Shopify' : 'your store',
      team: (D.teamSizes.find(t => t.id === A.team) || {}).label || '', hours: A.hours, cost: money(A.cost),
      perPerson: per >= 10 ? Math.round(per) : per.toFixed(1),
      sop: A.sop, dataLabel: ({ siloed: 'siloed', partial: 'only partly connected', connected: 'connected' })[A.data] || '',
      sheetsNote: A.tools.includes('sheets') ? ', and spreadsheets are doing the job a system should' : '',
      industry: typedIndustry(), aIndustry: (/^[aeiou]/i.test(typedIndustry()) ? 'an ' : 'a ') + typedIndustry(), sink: A.sinkOther,
    };
  }
  // fill(): replace {tokens}. Values are escaped; templates are trusted (from scorecard-data.js).
  function fill(str, T) { return String(str).replace(/\{(\w+)\}/g, (m, k) => (k in T ? esc(T[k]) : m)).replace(/^./, c => c.toUpperCase()); }

  function compute() {
    const T = tokens(), has = t => A.tools.includes(t);
    const process = clamp([12, 30, 55, 76, 92][A.sop - 1] - (has('sheets') ? 6 : 0));
    const systems = clamp(({ siloed: 25, partial: 52, connected: 80 })[A.data] + (has('crm') ? 6 : 0) + (has('accounting') ? 6 : 0) + ((has('drive') || has('chat')) ? 3 : 0) - (has('sheets') ? 10 : 0));
    const automation = clamp(({ none: 12, adhoc: 30, some: 58, integrated: 82 })[A.ai] + (A.data === 'connected' ? 6 : 0) - (A.sop <= 2 ? 6 : 0));
    const per = +A.hours / teamMid();
    const leverage = per <= 1 ? 88 : per <= 2 ? 74 : per <= 4 ? 56 : per <= 7 ? 38 : per <= 12 ? 24 : 12;
    const overall = Math.round((process + systems + automation + leverage) / 4);
    const band = [...D.scoreBands].reverse().find(b => overall >= b.min);
    const lvl = v => v < 40 ? 'low' : v < 70 ? 'mid' : 'high';
    const Dg = D.diagnoses;
    const subs = [
      { key: 'process', label: 'Process & SOPs', v: process, text: fill(Dg.process[lvl(process)], T) },
      { key: 'systems', label: 'Systems & data', v: systems, text: fill(Dg.systems[lvl(systems)], T) },
      { key: 'automation', label: 'Automation', v: automation, text: fill(Dg.automation[A.ai], T) },
      { key: 'leverage', label: 'Team leverage', v: leverage, text: fill(Dg.leverage[lvl(leverage)], T) },
    ];
    // money
    const annual = +A.hours * +A.cost * D.assumptions.weeksPerYear;
    let [lo, hi] = D.assumptions.recoverable[A.data] || D.assumptions.recoverable.partial;
    if (A.ai === 'integrated') { lo *= D.assumptions.integratedAiDiscount; hi *= D.assumptions.integratedAiDiscount; }
    const rec = [round500(annual * lo), round500(annual * hi)];
    // leaks
    const i = ind(), leaks = [];
    const dataTail = { siloed: ', and with your data siloed, it\u2019s done by hand.', partial: ', and the handoffs still run on exports and copy-paste.', connected: '. Your data is already connected, so this one is fast to build.' }[A.data];
    [...A.sinks].sort((a, b) => (b === '__other') - (a === '__other')).forEach(id => { // typed-in sink leads: it's the most personal
      if (id === '__other') {
        if (!A.sinkOther) return;
        const rule = (D.customSinkRules || []).find(r => new RegExp(r.match, 'i').test(A.sinkOther)) || { fix: 'We map \u201c{sink}\u201d step by step in the Teardown, then build the fix around your SOPs.', ex: 'ivy_assistant' };
        const toolList = A.tools.filter(t => t !== 'other' || A.toolsOther).map(toolName);
        const why = `You told us \u201c${esc(A.sinkOther)}\u201d eats time at ${esc(A.company)}. ` + (toolList.length ? `Today it runs on ${esc(listJoin(toolList))}${dataTail}` : 'Today it\u2019s manual work.');
        leaks.push({ title: esc(cap(A.sinkOther)), why, fix: fill(rule.fix, T), ex: D.examples[rule.ex] || '', exId: rule.ex, own: true });
        return;
      }
      const s = i.sinks.find(x => x.id === id); if (!s) return;
      const rel = (s.tools || []).filter(t => A.tools.includes(t)).map(toolName);
      const why = `You picked \u201c${esc(s.label)}\u201d as a top time sink. ` + (rel.length ? `It runs through ${esc(listJoin(rel))}${dataTail}` : `None of your current tools handle it, so today it\u2019s manual work.`);
      leaks.push({ title: fill(s.leak, T), why, fix: fill(s.fix, T), ex: D.examples[s.ex] || '', exId: s.ex });
    });
    for (const r of D.ruleLeaks) { if (leaks.length >= 3) break; if (r.when(A)) leaks.push({ title: fill(r.leak, T), why: fill(r.why, T), fix: fill(r.fix, T), ex: D.examples[r.ex] || '', exId: r.ex, rule: true }); }
    const top = leaks.slice(0, 3), usedEx = new Set();
    top.forEach(l => { // never show the same build twice in one report
      if (!l.exId) return;
      let id = l.exId; if (usedEx.has(id)) id = (D.exampleAlternates || {})[id];
      if (!id || usedEx.has(id)) { l.ex = ''; return; }
      usedEx.add(id); l.ex = D.examples[id] || '';
    });
    // roadmap
    const sopNote = A.sop <= 2 ? ' We write down the SOPs that only exist in people\u2019s heads.' : ' We pressure-test the SOPs you already have.';
    const dataNote = A.data !== 'connected' ? fill(' First design decision: how {tools} connect, so data moves once.', T) : ' Your systems already talk, so design goes straight to the workflows.';
    const train = { '1-5': 'We train you and your team hands-on, workflow by workflow.', '6-15': 'We train the whole team hands-on, in small groups, on the workflows they own.', '16-50': 'We train team leads first, then roll out department by department.', '51-200': 'We train team leads and an internal owner first, then roll out by department with written playbooks.', '200+': 'We train an internal owner and department leads, then roll out in waves with written playbooks.' }[A.team] || 'We train your team hands-on.';
    const q = s => `\u201c${s}\u201d`;
    const roadmap = [
      { n: 'Days 1\u201314', h: 'Diagnose', p: `Your free Teardown starts with ${q(top[0] ? top[0].title : 'your biggest leak')}. Then the AI Ops Audit maps how work actually moves through ${esc(A.company)}, end to end.${sopNote}` },
      { n: 'Days 15\u201330', h: 'Design', p: `We design the system around ${listJoin(top.map(l => q(l.title)))}, highest impact first.${dataNote} Guardrails: ${esc(i.guardrail)}` },
      { n: 'Days 31\u201375', h: 'Build & integrate', p: `We build the fix for ${q(top[0] ? top[0].title : '')} first${top[1] ? `, then ${q(top[1].title)}` : ''}, connect ${esc(T.tools)}, and deploy an AI employee trained on your SOPs, drafts-only wherever it touches ${esc(T.clients)}.` },
      { n: 'Days 76\u201390', h: 'Hand over & train', p: `${train} You own every login, file and pipeline. After hand-over you pay only for the software you run.` },
    ];
    // summary
    const rev = { '<1m': 'At this stage, the goal is to build the system before you hire into the chaos.', '1-5m': 'This is the stage where most owners hire to cope. A designed system lets you scale without that.', '5-20m': 'At your scale, small leaks compound: the same fix pays off across a lot of volume.', '20-50m': 'At your scale, small leaks compound: the same fix pays off across a lot of volume, and integration matters more than any single tool.', '50m+': 'At your scale, small leaks compound fast. Integration across teams matters more than any single tool.' }[A.revenue] || '';
    const industryLabel = A.industry === 'other' && A.industryOther ? cap(A.industryOther.trim()) : i.label;
    const context = A.industry === 'other' && A.industryOther && D.otherIndustryContext ? fill(D.otherIndustryContext, T) : esc(i.context);
    return { overall, band, subs, annual, rec, top, roadmap, rev, industryLabel, context, T };
  }

  /* ---------------- steps ---------------- */
  const radio = (name, opts, cur) => `<div class="sc-opts">${opts.map(o => `<label class="sc-opt"><input type="radio" name="${name}" value="${esc(o.id ?? o.v)}" ${String(cur) === String(o.id ?? o.v) ? 'checked' : ''}><span><b>${esc(o.label)}</b>${o.hint ? `<small>${esc(o.hint)}</small>` : ''}</span></label>`).join('')}</div>`;
  const check = (name, opts, cur) => `<div class="sc-opts">${opts.map(o => `<label class="sc-opt"><input type="checkbox" name="${name}" value="${esc(o.id)}" ${cur.includes(o.id) ? 'checked' : ''}><span><b>${esc(o.label)}</b></span></label>`).join('')}</div>`;
  const STEPS = [
    { q: 'First, who is this scorecard for?', sub: 'We use your name and company to personalize the report.',
      html: () => `<div class="sc-fields"><div class="sc-field"><label for="f_first">First name</label><input id="f_first" name="first" autocomplete="given-name" value="${esc(A.first)}" required></div><div class="sc-field"><label for="f_company">Company name</label><input id="f_company" name="company" autocomplete="organization" value="${esc(A.company)}" required></div></div>`,
      save: f => { A.first = f.first.value.trim(); A.company = f.company.value.trim(); return A.first && A.company ? '' : 'Please add your first name and company.'; } },
    { q: () => `What kind of business is ${esc(A.company)}?`, sub: 'Your industry changes the questions and the fixes we suggest.',
      html: () => radio('industry', Object.entries(D.industries).map(([id, v]) => ({ id, label: v.label })), A.industry) + `<div class="sc-field sc-other" ${A.industry === 'other' ? '' : 'hidden'}><label for="f_indother">Which industry?</label><input id="f_indother" name="indother" value="${esc(A.industryOther)}"></div>`,
      bind: f => $$('input[name=industry]', f).forEach(r => r.addEventListener('change', () => { $('.sc-other', f).hidden = r.value !== 'other' || !r.checked; })),
      save: f => { const v = f.industry.value; if (!v) return 'Pick the closest match.'; if (v !== A.industry) A.sinks = []; A.industry = v; A.industryOther = v === 'other' ? f.indother.value.trim() : ''; return v === 'other' && !A.industryOther ? 'Tell us your industry.' : ''; } },
    { q: 'How big is the team?', sub: 'Everyone on payroll, including you.', html: () => radio('team', D.teamSizes, A.team), save: f => (A.team = f.team.value) ? '' : 'Pick a team size.' },
    { q: 'Roughly what\u2019s annual revenue?', sub: 'A band is enough. It helps us size the opportunity.', html: () => radio('revenue', D.revenueBands, A.revenue), save: f => (A.revenue = f.revenue.value) ? '' : 'Pick a band, or \u201cPrefer not to say\u201d.' },
    { q: () => `Which tools does ${esc(A.company)} run on?`, sub: 'Pick all that apply.',
      html: () => check('tools', D.tools, A.tools) + `<div class="sc-field sc-crm" ${A.tools.includes('crm') ? '' : 'hidden'}><label for="f_crm">Which CRM? (optional)</label><input id="f_crm" name="crm" placeholder="e.g. HubSpot, GoHighLevel" value="${esc(A.crmName)}"></div><div class="sc-field sc-tother" ${A.tools.includes('other') ? '' : 'hidden'}><label for="f_tother">Other tools</label><input id="f_tother" name="tother" value="${esc(A.toolsOther)}"></div>`,
      bind: f => $$('input[name=tools]', f).forEach(c => c.addEventListener('change', () => { if (c.value === 'crm') $('.sc-crm', f).hidden = !c.checked; if (c.value === 'other') $('.sc-tother', f).hidden = !c.checked; })),
      save: f => { A.tools = $$('input[name=tools]:checked', f).map(c => c.value); A.crmName = A.tools.includes('crm') ? f.crm.value.trim() : ''; A.toolsOther = A.tools.includes('other') ? f.tother.value.trim() : ''; return A.tools.length ? '' : 'Pick at least one.'; } },
    { q: () => `Where does ${esc(A.company)}\u2019s time go?`, sub: 'Pick up to 3 of your biggest time sinks.',
      html: () => { const s = ind().sinks; return `<div class="sc-opts">${s.map(o => `<label class="sc-opt"><input type="checkbox" name="sinks" value="${o.id}" ${A.sinks.includes(o.id) ? 'checked' : ''}><span><b>${esc(o.label)}</b></span></label>`).join('')}<label class="sc-opt"><input type="checkbox" name="sinks" value="__other" ${A.sinks.includes('__other') ? 'checked' : ''}><span><b>Something else</b></span></label></div><div class="sc-field sc-sother" ${A.sinks.includes('__other') ? '' : 'hidden'}><label for="f_sother">What is it?</label><input id="f_sother" name="sother" value="${esc(A.sinkOther)}"></div>`; },
      bind: f => { const boxes = $$('input[name=sinks]', f); const upd = () => { const n = boxes.filter(b => b.checked).length; boxes.forEach(b => { b.disabled = !b.checked && n >= 3; b.closest('.sc-opt').classList.toggle('off', b.disabled); }); $('.sc-sother', f).hidden = !f.querySelector('input[value=__other]').checked; }; boxes.forEach(b => b.addEventListener('change', upd)); upd(); },
      save: f => { A.sinks = $$('input[name=sinks]:checked', f).map(c => c.value); A.sinkOther = A.sinks.includes('__other') ? f.sother.value.trim() : ''; if (!A.sinks.length) return 'Pick at least one.'; return A.sinks.includes('__other') && !A.sinkOther ? 'Tell us what the other time sink is.' : ''; } },
    { q: 'How much manual admin does the team do?', sub: 'Your best guess is fine. We use it to estimate what manual work costs you.',
      html: () => `<div class="sc-fields"><div class="sc-field"><label for="f_hours">Hours per week, whole team</label><input id="f_hours" name="hours" type="number" inputmode="numeric" min="1" max="2000" value="${esc(A.hours)}" placeholder="e.g. 25" required></div><div class="sc-field"><label for="f_cost">Average loaded hourly cost ($)</label><input id="f_cost" name="cost" type="number" inputmode="numeric" min="10" max="500" value="${esc(A.cost)}" required><small>Default $${D.assumptions.defaultHourlyCost}/hr (wages plus overhead). Change it to your number.</small></div></div>`,
      save: f => { A.hours = Math.round(+f.hours.value); A.cost = Math.round(+f.cost.value); return A.hours > 0 && A.cost > 0 ? '' : 'Add hours per week and an hourly cost.'; } },
    { q: 'How documented are your SOPs?', sub: '1 means everything lives in people\u2019s heads. 5 means current, written and used.', html: () => radio('sop', D.sopLevels.map(o => ({ ...o, label: o.v + ' \u00b7 ' + o.label })), A.sop), save: f => (A.sop = +f.sop.value) ? '' : 'Pick a level.' },
    { q: 'Is your data connected or siloed?', sub: 'Think about orders, clients, money and reporting.', html: () => radio('data', D.dataStatus, A.data), save: f => (A.data = f.data.value) ? '' : 'Pick one.' },
    { q: 'How are you using AI today?', sub: 'No wrong answer.', html: () => radio('ai', D.aiUse, A.ai), save: f => (A.ai = f.ai.value) ? '' : 'Pick one.' },
  ];
  const TOTAL = STEPS.length + 1; // + gate
  let cur = 0;
  const setProg = n => { const p = Math.round(n / TOTAL * 100); bar.style.setProperty('--p', p / 100); prog.setAttribute('aria-valuenow', p); $('#scCount').textContent = n < TOTAL ? `${n + 1} / ${TOTAL}` : 'Done'; };
  function swap(html, after) {
    stage.classList.add('out');
    setTimeout(() => { stage.innerHTML = html; stage.classList.remove('out'); after && after(); const h = $('h2', stage); h && h.focus({ preventScroll: true }); scrollTo({ top: 0 }); }, 140);
  }
  function show(i) {
    cur = i; setProg(i);
    const s = STEPS[i], q = typeof s.q === 'function' ? s.q() : s.q;
    swap(`<form class="sc-step" novalidate><h2 tabindex="-1">${q}</h2><p class="sc-sub">${s.sub}</p>${s.html()}<p class="lf-msg" role="status" aria-live="polite"></p><div class="sc-nav">${i ? '<button type="button" class="btn btn-secondary sc-back">Back</button>' : '<span></span>'}<button class="btn btn-primary" type="submit">${i === STEPS.length - 1 ? 'See my score' : 'Continue'} <svg viewBox="0 0 16 16" width="14" height="14" aria-hidden="true"><path d="M3 8h10M9 4l4 4-4 4" fill="none" stroke="currentColor" stroke-width="1.6"/></svg></button></div></form>`, () => {
      const f = $('form', stage); s.bind && s.bind(f);
      f.addEventListener('submit', e => { e.preventDefault(); const err = s.save(f); const m = $('.lf-msg', f); if (err) { m.textContent = err; m.className = 'lf-msg err'; return; } i + 1 < STEPS.length ? show(i + 1) : gate(); });
      const b = $('.sc-back', f); b && b.addEventListener('click', () => { s.save(f); show(i - 1); });
    });
  }

  /* ---------------- teaser + email gate (same states/logic as the checklist form) ---------------- */
  let R = null;
  function gate() {
    R = compute(); setProg(STEPS.length);
    const T = R.T;
    swap(`<section class="sc-gate"><p class="eyebrow">Your teaser score</p><h2 tabindex="-1">${esc(A.first)}, ${esc(A.company)} scored <span class="sc-big">${R.overall}</span><span class="muted">/100</span></h2><p class="sc-band">${esc(R.band.label)}. ${esc(R.band.line)}</p>
      <div class="sc-teaser" aria-hidden="true">${R.subs.map(s => `<div><span>${s.label}</span><i><b style="width:${s.v}%"></b></i></div>`).join('')}</div>
      <p class="sc-sub">Your full report covers the 4 sub-scores with a diagnosis for each, the top 3 leaks at ${esc(A.company)} with the fix we\u2019d build, what manual work costs you a year, and a 90-day roadmap.</p>
      <form class="lf" id="scForm" action="https://formsubmit.co/ajax/mo@deeplineop.ai" method="POST" novalidate>
        <label for="scEmail">Work email</label>
        <div class="lf-row"><input type="email" id="scEmail" name="email" autocomplete="email" inputmode="email" placeholder="you@${esc((A.company || 'company').toLowerCase().replace(/[^a-z0-9]+/g, '') || 'company')}.com" required aria-describedby="scMsg"><button class="btn btn-primary" type="submit"><span class="spin" aria-hidden="true"></span><span class="lbl">Show my full report</span></button></div>
        <div class="hp" aria-hidden="true"><label for="scHp">Leave this empty</label><input type="text" id="scHp" name="_honey" tabindex="-1" autocomplete="off"></div>
        <div id="scHidden"></div>
        <p class="lf-msg" id="scMsg" role="status" aria-live="polite"></p>
        <p class="lf-fine">We\u2019ll email you a copy and may follow up once. Unsubscribe anytime. See the <a href="/privacy.html">privacy policy</a>.</p>
      </form>
      <div class="sc-nav"><button type="button" class="btn btn-secondary sc-back">Back</button><span></span></div></section>`, () => {
      $('.sc-back', stage).addEventListener('click', () => show(STEPS.length - 1));
      const form = $('#scForm'), email = $('#scEmail'), msg = $('#scMsg'), btn = form.querySelector('button[type=submit]'), lbl = btn.querySelector('.lbl');
      const say = (t, cls) => { msg.textContent = t; msg.className = 'lf-msg ' + (cls || ''); };
      const valid = v => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim());
      email.addEventListener('input', () => { if (email.getAttribute('aria-invalid') === 'true' && valid(email.value)) { email.setAttribute('aria-invalid', 'false'); say(''); } });
      form.addEventListener('submit', async e => {
        e.preventDefault();
        if (!valid(email.value)) { email.setAttribute('aria-invalid', 'true'); say('Please enter a valid email address, like you@company.com.', 'err'); email.focus(); return; }
        if (form.querySelector('[name=_honey]').value) return; // honeypot: bots fill it, people never see it
        A.email = email.value.trim();
        fillHidden(form);
        const action = form.getAttribute('action') || '';
        if (!/^https:\/\//.test(action)) { report(); return; } // endpoint not connected yet: never block the visitor
        form.classList.add('loading'); btn.disabled = true; lbl.textContent = 'Building your report…'; say('');
        let sent = true;
        try {
          // FormSubmit AJAX: JSON in, JSON out ({ success: "true" } or { success: "false", message })
          const body = Object.fromEntries(new FormData(form).entries());
          const r = await fetch(action, { method: 'POST', headers: { 'Content-Type': 'application/json', Accept: 'application/json' }, body: JSON.stringify(body) });
          const j = await r.json().catch(() => ({}));
          if (!r.ok || !(j.success === true || j.success === 'true')) throw new Error(j.message || 'HTTP ' + r.status);
        } catch (err) { sent = false; console.warn('Scorecard lead not sent:', err.message); }
        finally { form.classList.remove('loading'); btn.disabled = false; lbl.textContent = 'Show my full report'; }
        report(sent);
      });
    });
  }
  function fillHidden(form) {
    const T = R.T, i = ind();
    const F = {
      _subject: `New AI Ops Scorecard lead: ${A.company}`, _template: 'table', _captcha: 'false',
      first_name: A.first, company: A.company, industry: R.industryLabel, team_size: T.team, revenue: (D.revenueBands.find(b => b.id === A.revenue) || {}).label,
      tools: A.tools.map(toolName).join('; '), crm_name: A.crmName, tools_other: A.toolsOther,
      time_sinks: A.sinks.map(id => id === '__other' ? 'Other: ' + A.sinkOther : (i.sinks.find(s => s.id === id) || {}).label).join('; '),
      admin_hours_per_week: A.hours, hourly_cost: A.cost, sop_level: A.sop, data_status: A.data, ai_use: A.ai,
      score_overall: R.overall, score_band: R.band.label, ...Object.fromEntries(R.subs.map(s => ['score_' + s.key, s.v])),
      top_leaks: R.top.map(l => dec(l.title)).join(' | '), annual_manual_cost: Math.round(R.annual), recoverable_low: R.rec[0], recoverable_high: R.rec[1], source: 'scorecard',
    };
    $('#scHidden').innerHTML = Object.entries(F).map(([k, v]) => `<input type="hidden" name="${k}" value="${esc(v)}">`).join('');
  }

  /* ---------------- full report ---------------- */
  function calLink() {
    const u = new URL(D.calendly);
    u.searchParams.set('name', A.first); u.searchParams.set('email', A.email);
    u.searchParams.set('a1', `AI Ops Scorecard: ${A.company}, ${R.overall}/100. Top leak: ${R.top[0] ? dec(R.top[0].title) : ''}`);
    return u.toString();
  }
  function report(sent = true) {
    if (!$('meta[name=robots][content*=noindex]')) { const m = document.createElement('meta'); m.name = 'robots'; m.content = 'noindex, nofollow'; document.head.appendChild(m); }
    const old = $('meta[name=robots]:not([content*=noindex])'); old && old.remove();
    document.title = `${A.company}: AI Ops Scorecard | Deepline Operations`;
    intro && (intro.hidden = true); $('.sc-head').hidden = true;
    const T = R.T, i = ind(), date = new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
    const [lo, hi] = D.assumptions.recoverable[A.data] || D.assumptions.recoverable.partial;
    const pct = v => Math.round(v * (A.ai === 'integrated' ? D.assumptions.integratedAiDiscount : 1) * 100) + '%';
    const ARR = '<svg viewBox="0 0 16 16" width="14" height="14" aria-hidden="true"><path d="M3 8h10M9 4l4 4-4 4" fill="none" stroke="currentColor" stroke-width="1.6"/></svg>';
    swap(`<article class="sc-report" id="scReport">
      ${sent ? '' : '<p class="lf-msg err no-print">We couldn\u2019t send your copy to our team. Your report is below. Email mo@deeplineop.ai if you\u2019d like us to review it.</p>'}
      <header class="sr-head">
        <p class="eyebrow">AI Ops Scorecard \u00b7 ${esc(R.industryLabel)} \u00b7 ${esc(date)}</p>
        <h2 tabindex="-1">${esc(A.first)}, here\u2019s how ${esc(A.company)} runs today.</h2>
        <div class="sr-score"><div class="sr-num"><b>${R.overall}</b><span>/100</span></div><div><p class="sr-band">${esc(R.band.label)}</p><p>${esc(R.band.line)} ${R.context} ${esc(R.rev)}</p></div></div>
      </header>
      <section class="sr-sec"><h3>Your four sub-scores</h3><div class="sr-subs">${R.subs.map(s => `<div class="sr-sub"><div class="sr-sub-top"><span>${s.label}</span><b>${s.v}</b></div><i class="sr-bar"><b style="width:${s.v}%"></b></i><p>${s.text}</p></div>`).join('')}</div></section>
      <section class="sr-sec"><h3>What manual work costs ${esc(A.company)}</h3>
        <div class="sr-facts"><div><b>${money(R.annual)}</b><span>a year in manual admin (${esc(A.hours)} hrs/week \u00d7 ${money(A.cost)}/hr \u00d7 ${D.assumptions.weeksPerYear} weeks)</span></div><div><b>${money(R.rec[0])}\u2013${money(R.rec[1])}</b><span>estimated recoverable each year with a designed system</span></div><div><b>10\u201330x</b><span>the return we scope every engagement to target on the setup fee</span></div></div>
        <p class="sr-assume"><b>Assumptions:</b> the hours and hourly cost are your inputs. The recoverable range assumes a well-designed system takes back ${pct(lo)}\u2013${pct(hi)} of those manual hours, a range we set by how connected your data is (${esc(T.dataLabel)})${A.ai === 'integrated' ? ', reduced because you already run integrated AI' : ''}. ${esc(D.assumptions.roiNote)}</p></section>
      <section class="sr-sec"><h3>Your top 3 leaks</h3><ol class="sr-leaks">${R.top.map((l, k) => `<li><span class="mono sr-n">0${k + 1}</span><div class="sr-leak"><h4>${l.title}</h4><p class="sr-why">${l.why}</p><p class="sr-fix"><b>What we\u2019d build:</b> ${l.fix}</p>${l.ex ? `<p class="sr-ex">${esc(l.ex)}</p>` : ''}</div></li>`).join('')}</ol></section>
      <section class="sr-sec"><h3>Your first 90 days</h3><ol class="sr-road">${R.roadmap.map(r => `<li><span class="mono">${r.n}</span><h4>${r.h}</h4><p>${r.p}</p></li>`).join('')}</ol></section>
      <section class="sr-cta"><h3>Book your free AI Ops Teardown. We\u2019ll walk through this report with you.</h3><p>A free 30-minute call where we map ${R.top[0] ? `\u201c${R.top[0].title}\u201d` : 'one of your workflows'} live. You leave with a one-page plan showing what to automate first and its estimated return.</p>
        <div class="sr-cta-row no-print"><a class="btn btn-primary btn-lg" id="scCal" href="${esc(calLink())}">Book your free Teardown ${ARR}</a><button type="button" class="btn btn-secondary btn-lg" id="scPdf">Download as PDF</button><button type="button" class="btn btn-secondary btn-lg" id="scRestart">Start over</button></div>
        <p class="print-only">Book your free Teardown: calendly.com/mo-deeplineop/30min \u00b7 mo@deeplineop.ai \u00b7 deeplineop.ai</p></section>
      <p class="sr-fine">Scores come from a transparent rules engine based only on your answers. Nothing you typed was sent to an AI model. Results vary by business, and the estimates are a starting point for the Teardown, not a quote or a guarantee.</p>
    </article>`, () => {
      $('#scPdf').addEventListener('click', () => window.print());
      $('#scRestart').addEventListener('click', () => location.reload());
      document.body.classList.add('sc-done');
    });
  }

  /* ---------------- start ---------------- */
  const start = $('#scStart');
  start.addEventListener('click', () => { intro.hidden = true; $('.sc-head').hidden = false; show(0); });
  window.__scorecard = { A, compute };
})();
