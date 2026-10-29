(() => {
  'use strict';
  const doc = document.documentElement;
  const body = document.body;
  const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* Language toggle */
  document.querySelectorAll('[data-lang-toggle]').forEach(btn => btn.addEventListener('click', () => {
    const zh = body.classList.toggle('lang-zh');
    body.classList.toggle('lang-en', !zh);
    doc.lang = zh ? 'zh' : 'en';
  }));

  /* Navigation: background on scroll + scroll-spy */
  const nav = document.getElementById('nav');
  const navLinks = [...document.querySelectorAll('.nav-links a[href^="#"]')];
  const sections = navLinks.map(a => document.querySelector(a.getAttribute('href'))).filter(Boolean)
    .sort((a, b) => (a.compareDocumentPosition(b) & Node.DOCUMENT_POSITION_FOLLOWING ? -1 : 1));
  let ticking = false;
  function onScroll() {
    nav.classList.toggle('is-scrolled', scrollY > 24);
    const under = document.elementFromPoint(8, nav.offsetHeight + 2);
    nav.classList.toggle('on-light', !!(under && under.closest('.sec-light')));
    const current = sections.filter(s => s.getBoundingClientRect().top < innerHeight * 0.35).at(-1);
    navLinks.forEach(a => {
      if (current && a.hash === `#${current.id}`) a.setAttribute('aria-current', 'location');
      else a.removeAttribute('aria-current');
    });
    ticking = false;
  }
  addEventListener('scroll', () => { if (!ticking) { ticking = true; requestAnimationFrame(onScroll); } }, { passive: true });
  onScroll();

  /* Mobile menu */
  const menu = document.getElementById('menu');
  const openBtn = document.querySelector('[data-menu-open]');
  function setMenu(open) {
    menu.classList.toggle('is-open', open);
    body.classList.toggle('menu-open', open);
    openBtn.setAttribute('aria-expanded', String(open));
  }
  openBtn.addEventListener('click', () => setMenu(true));
  menu.querySelector('[data-menu-close]').addEventListener('click', () => setMenu(false));
  menu.querySelectorAll('a').forEach(a => a.addEventListener('click', () => setMenu(false)));
  addEventListener('keydown', e => { if (e.key === 'Escape' && menu.classList.contains('is-open')) setMenu(false); });

  /* Reveal on scroll and number count-up */
  const counters = [...document.querySelectorAll('[data-count]')];
  function countUp(el) {
    const target = Number(el.dataset.count);
    const start = performance.now();
    const duration = 1400;
    const step = now => {
      const p = Math.min(1, (now - start) / duration);
      el.textContent = Math.round(target * (1 - Math.pow(1 - p, 3))).toLocaleString('en-US');
      if (p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }
  if (!reduceMotion && 'IntersectionObserver' in window) {
    const io = new IntersectionObserver(entries => entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('in');
      entry.target.querySelectorAll('[data-count]').forEach(countUp);
      io.unobserve(entry.target);
    }), { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
    document.querySelectorAll('.reveal').forEach(el => io.observe(el));
  } else {
    doc.classList.remove('js');
    counters.forEach(el => { el.textContent = Number(el.dataset.count).toLocaleString('en-US'); });
  }

  /* Footer wordmark spans the full content width */
  const giant = document.querySelector('.giant');
  function fitGiant() {
    if (!giant) return;
    giant.style.fontSize = '';
    const inner = giant.firstElementChild;
    const ratio = giant.clientWidth / inner.getBoundingClientRect().width;
    giant.style.fontSize = `${parseFloat(getComputedStyle(giant).fontSize) * ratio * 0.995}px`;
  }
  addEventListener('resize', fitGiant, { passive: true });
  document.fonts?.ready.then(fitGiant);
  fitGiant();

  /* Hero field: a slowly rotating sphere of points */
  const canvas = document.getElementById('field');
  const ctx = canvas && canvas.getContext('2d');
  if (!ctx) return;
  const hero = canvas.parentElement;
  let W = 0, H = 0, dpr = 1, points = [], running = true, last = 0, angle = 0.6;
  let mx = 0, my = 0, ex = 0, ey = 0;

  function build() {
    const n = W < 700 ? 900 : 1700;
    const golden = Math.PI * (3 - Math.sqrt(5));
    points = Array.from({ length: n }, (_, i) => {
      const y = 1 - (i / (n - 1)) * 2;
      const r = Math.sqrt(1 - y * y);
      const t = golden * i;
      const jitter = 1 + (Math.sin(i * 12.9898) * 43758.5453 % 1) * 0.035;
      return { x: Math.cos(t) * r * jitter, y: y * jitter, z: Math.sin(t) * r * jitter, hot: (i * 7919) % 41 === 0, phase: (i * 0.618) % 6.283 };
    });
  }
  function resize() {
    const rect = hero.getBoundingClientRect();
    dpr = Math.min(2, devicePixelRatio || 1);
    W = rect.width; H = rect.height;
    canvas.width = Math.round(W * dpr); canvas.height = Math.round(H * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    build();
    draw(performance.now());
  }
  function draw(now) {
    ctx.clearRect(0, 0, W, H);
    const mobile = W < 860;
    const cx = mobile ? W * 0.5 : W * 0.68;
    const cy = mobile ? H * 0.34 : H * 0.46;
    const R = mobile ? Math.min(W * 0.62, H * 0.34) : Math.min(W, H) * 0.42;
    ex += (mx - ex) * 0.04; ey += (my - ey) * 0.04;
    const ry = angle + ex * 0.35, rx = -0.32 + ey * 0.2;
    const cY = Math.cos(ry), sY = Math.sin(ry), cX = Math.cos(rx), sX = Math.sin(rx);
    const D = 3.1, t = now / 1000;
    for (const p of points) {
      let x = p.x * cY + p.z * sY;
      let z = -p.x * sY + p.z * cY;
      const y = p.y * cX - z * sX;
      z = p.y * sX + z * cX;
      const k = D / (D - z);
      const px = cx + x * R * k, py = cy + y * R * k;
      const depth = (z + 1) / 2;
      if (p.hot) {
        const pulse = 0.55 + 0.45 * Math.sin(t * 1.6 + p.phase);
        ctx.fillStyle = `rgba(140,233,220,${(0.08 + 0.18 * depth) * pulse})`;
        ctx.beginPath(); ctx.arc(px, py, 5 + 5 * depth, 0, 6.283); ctx.fill();
        ctx.fillStyle = `rgba(160,240,230,${(0.35 + 0.65 * depth) * pulse})`;
        ctx.beginPath(); ctx.arc(px, py, 1.1 + 1.3 * depth, 0, 6.283); ctx.fill();
      } else {
        const a = 0.06 + 0.78 * Math.pow(depth, 1.7);
        const s = 0.5 + 1.25 * depth;
        ctx.fillStyle = `rgba(236,236,232,${a})`;
        ctx.fillRect(px - s / 2, py - s / 2, s, s);
      }
    }
  }
  function frame(now) {
    if (!running) return;
    const dt = Math.min(48, now - (last || now));
    last = now;
    angle += dt * 0.00007;
    draw(now);
    requestAnimationFrame(frame);
  }
  function setRunning(on) {
    if (reduceMotion) return;
    if (on && !running) { running = true; last = 0; requestAnimationFrame(frame); }
    running = on;
  }
  hero.addEventListener('pointermove', e => {
    const r = hero.getBoundingClientRect();
    mx = (e.clientX - r.left) / r.width - 0.5;
    my = (e.clientY - r.top) / r.height - 0.5;
  }, { passive: true });
  new ResizeObserver(resize).observe(hero);
  new IntersectionObserver(entries => setRunning(entries[0].isIntersecting && !document.hidden)).observe(hero);
  document.addEventListener('visibilitychange', () => setRunning(!document.hidden));
  resize();
  if (reduceMotion) running = false; else requestAnimationFrame(frame);
})();
