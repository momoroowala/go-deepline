/* Cookie consent: Microsoft Clarity loads only after the visitor accepts. Choice is kept in localStorage. */
(() => {
  const KEY = 'dl-consent-v1', CLARITY_ID = 'vr7qncllbq';
  const get = () => { try { return localStorage.getItem(KEY); } catch (e) { return null; } };
  const set = v => { try { localStorage.setItem(KEY, v); } catch (e) {} };
  let loaded = false;
  function loadClarity() {
    if (loaded) return; loaded = true;
    (function (c, l, a, r, i, t, y) {
      c[a] = c[a] || function () { (c[a].q = c[a].q || []).push(arguments); };
      t = l.createElement(r); t.async = 1; t.src = 'https://www.clarity.ms/tag/' + i;
      y = l.getElementsByTagName(r)[0]; y.parentNode.insertBefore(t, y);
    })(window, document, 'clarity', 'script', CLARITY_ID);
    window.clarity && window.clarity('consent');
  }
  function banner() {
    if (document.getElementById('cookieBar')) return;
    const b = document.createElement('div');
    b.id = 'cookieBar'; b.className = 'cookie'; b.setAttribute('role', 'dialog'); b.setAttribute('aria-live', 'polite'); b.setAttribute('aria-label', 'Cookie preferences');
    b.innerHTML = '<p><b>Cookies?</b> We use Microsoft Clarity to see how people use this site (heatmaps and anonymous session replays). It only loads if you say yes. <a href="/privacy.html#cookies">Details</a></p>' +
      '<div class="cookie-btns"><button type="button" class="btn btn-secondary" data-c="declined">Decline</button><button type="button" class="btn btn-primary" data-c="accepted">Accept</button></div>';
    b.addEventListener('click', e => {
      const v = e.target.closest('[data-c]'); if (!v) return;
      set(v.dataset.c); b.classList.remove('show'); document.documentElement.classList.remove('cookie-open'); setTimeout(() => b.remove(), 400);
      if (v.dataset.c === 'accepted') loadClarity();
    });
    document.body.appendChild(b);
    document.documentElement.classList.add('cookie-open');
    requestAnimationFrame(() => requestAnimationFrame(() => b.classList.add('show')));
  }
  const choice = get();
  if (choice === 'accepted') loadClarity();
  else if (!choice) (document.readyState === 'loading' ? document.addEventListener('DOMContentLoaded', () => setTimeout(banner, 1200)) : setTimeout(banner, 1200));
  // "Cookie settings" links reopen the banner
  document.addEventListener('click', e => { if (e.target.closest('[data-cookie-settings]')) { e.preventDefault(); banner(); } });
})();
