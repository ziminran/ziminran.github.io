(() => {
  'use strict';
  const progress = document.querySelector('.scroll-progress');
  const navLinks = [...document.querySelectorAll('.site-nav a[href^="#"]')];
  const sections = navLinks.map(link => document.querySelector(link.getAttribute('href'))).filter(Boolean)
    .sort((a, b) => (a.compareDocumentPosition(b) & Node.DOCUMENT_POSITION_FOLLOWING ? -1 : 1));
  let scrollQueued = false;

  function updateNavigation() {
    const available = document.documentElement.scrollHeight - innerHeight;
    if (progress) progress.style.transform = `scaleX(${available > 0 ? scrollY / available : 0})`;
    const current = sections.filter(section => section.getBoundingClientRect().top < innerHeight * .35).at(-1);
    navLinks.forEach(link => {
      if (current && link.hash === `#${current.id}`) link.setAttribute('aria-current', 'location');
      else link.removeAttribute('aria-current');
    });
    scrollQueued = false;
  }
  addEventListener('scroll', () => {
    if (!scrollQueued) {
      scrollQueued = true;
      requestAnimationFrame(updateNavigation);
    }
  }, { passive: true });
  addEventListener('resize', updateNavigation, { passive: true });
  updateNavigation();

  // Scroll reveal: content stays visible without JS or with reduced motion.
  if (!matchMedia('(prefers-reduced-motion: reduce)').matches && 'IntersectionObserver' in window) {
    const revealTargets = document.querySelectorAll('.section-heading, .research-hero, .research-map, .research-stage, .research-next, .about-grid > *, .bibliography > li, .investing-card, .investing-stats, .chat-section, .contact-section');
    const observer = new IntersectionObserver(entries => entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('is-visible');
      observer.unobserve(entry.target);
    }), { rootMargin: '0px 0px -6% 0px', threshold: 0.06 });
    document.documentElement.classList.add('js-reveal');
    revealTargets.forEach(el => {
      if (el.parentElement.matches('.investing-grid, .about-grid')) el.style.setProperty('--reveal-delay', `${[...el.parentElement.children].indexOf(el) * 90}ms`);
      el.classList.add('reveal');
      observer.observe(el);
    });
  }

  const canvas = document.getElementById('visionCanvas');
  const ctx = canvas?.getContext('2d');
  if (!ctx) return;
  const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
  const art = canvas.parentElement;
  let width = 0, height = 0, visible = true, frame = 0, previous = 0;
  let pointerX = 0, pointerY = 0, easedX = 0, easedY = 0;
  const rows = 29, columns = 48;
  const tau = Math.PI * 2;
  const dots = [];
  for (let row = 1; row < rows; row++) {
    for (let col = 0; col < columns; col++) {
      const latitude = Math.PI * row / rows;
      const longitude = tau * col / columns + (row % 2) * Math.PI / columns;
      dots.push({ latitude, longitude, row, col });
    }
  }
  const stars = Array.from({ length: 65 }, (_, index) => ({
    x: (Math.sin(index * 127.1 + 3) * 43758.5453) % 1,
    y: (Math.sin(index * 311.7 + 7) * 12741.371) % 1,
    size: index % 5 === 0 ? 1 : .55,
  }));

  function point(x, y, z, rotationY, rotationX, radius, cx, cy) {
    const cosY = Math.cos(rotationY), sinY = Math.sin(rotationY);
    const xx = x * cosY + z * sinY;
    const zz = -x * sinY + z * cosY;
    const yy = y * Math.cos(rotationX) - zz * Math.sin(rotationX);
    const depth = y * Math.sin(rotationX) + zz * Math.cos(rotationX);
    const perspective = 3.8 / (3.8 - depth * .5);
    return { x: cx + xx * radius * perspective, y: cy + yy * radius * perspective, z: depth };
  }

  function draw(time = 0) {
    if (!width || !height) return;
    ctx.clearRect(0, 0, width, height);
    const radius = Math.min(width * .32, height * .345);
    const cx = width * .51, cy = height * .49;
    easedX += (pointerX - easedX) * .035;
    easedY += (pointerY - easedY) * .035;
    const rotationY = .3 + time * .085 + easedX * .15;
    const rotationX = -.19 + easedY * .12;

    const glow = ctx.createRadialGradient(cx, cy, radius * .2, cx, cy, radius * 1.7);
    glow.addColorStop(0, '#24657013'); glow.addColorStop(.6, '#16354908'); glow.addColorStop(1, '#080b1100');
    ctx.fillStyle = glow; ctx.fillRect(0, 0, width, height);
    for (const star of stars) {
      ctx.fillStyle = '#86b1c233';
      ctx.beginPath(); ctx.arc(Math.abs(star.x) * width, Math.abs(star.y) * height, star.size, 0, tau); ctx.fill();
    }

    // A quiet perspective plane grounds the floating representation space.
    ctx.strokeStyle = '#4f9aab0b'; ctx.lineWidth = .7;
    const floor = cy + radius * 1.05;
    for (let line = 0; line < 6; line++) {
      const y = floor + line * line * 3;
      ctx.beginPath(); ctx.moveTo(cx - radius * 1.6, y); ctx.lineTo(cx + radius * 1.6, y); ctx.stroke();
    }
    for (let line = -5; line <= 5; line++) {
      ctx.beginPath(); ctx.moveTo(cx + line * radius * .17, floor); ctx.lineTo(cx + line * radius * .4, height); ctx.stroke();
    }

    // Orbit paths use the same 3D projection as the point surface.
    for (let orbit = 0; orbit < 3; orbit++) {
      const orbitRadius = radius * (1.27 + orbit * .12);
      const angle = [-.47, .72, -.06][orbit];
      ctx.save(); ctx.translate(cx, cy); ctx.rotate(angle);
      ctx.strokeStyle = ['#8ce9dc25', '#819dff29', '#8ce9dc12'][orbit];
      ctx.lineWidth = .7; ctx.beginPath(); ctx.ellipse(0, 0, orbitRadius, orbitRadius * .34, 0, 0, tau); ctx.stroke();
      const position = time * (.13 + orbit * .035) + orbit * 2.3;
      const sx = Math.cos(position) * orbitRadius, sy = Math.sin(position) * orbitRadius * .34;
      ctx.fillStyle = orbit === 1 ? '#adc0ff' : '#aaf6e6';
      ctx.shadowColor = ctx.fillStyle; ctx.shadowBlur = 12;
      ctx.beginPath(); ctx.arc(sx, sy, orbit === 1 ? 2.1 : 2.6, 0, tau); ctx.fill(); ctx.restore();
    }

    const projected = dots.map(dot => {
      const ripple = 1 + .025 * Math.sin(dot.longitude * 4 + time * .3) * Math.sin(dot.latitude * 3);
      const sinLatitude = Math.sin(dot.latitude);
      return point(sinLatitude * Math.cos(dot.longitude) * ripple, Math.cos(dot.latitude) * ripple,
        sinLatitude * Math.sin(dot.longitude) * ripple, rotationY, rotationX, radius, cx, cy);
    });
    ctx.lineWidth = .55;
    for (let index = 0; index < projected.length; index++) {
      const dot = dots[index], p = projected[index];
      if (dot.row % 3 === 0 || dot.col % 4 === 0) {
        const nextIndex = dot.row % 3 === 0 ? index - dot.col + (dot.col + 1) % columns : index + columns;
        const next = projected[nextIndex];
        if (next) {
          const opacity = .025 + (p.z + 1) * .042;
          ctx.strokeStyle = `rgba(109,187,202,${opacity})`;
          ctx.beginPath(); ctx.moveTo(p.x, p.y); ctx.lineTo(next.x, next.y); ctx.stroke();
        }
      }
    }
    const sorted = projected.map((p, index) => ({ ...p, index })).sort((a, b) => a.z - b.z);
    for (const p of sorted) {
      const front = (p.z + 1) / 2;
      const twinkle = .8 + .2 * Math.sin(p.index * 1.9 + time * .6);
      const alpha = (.1 + front * .73) * twinkle;
      const color = p.index % 13 === 0 ? '154,174,255' : p.index % 7 === 0 ? '205,249,245' : '110,221,208';
      ctx.fillStyle = `rgba(${color},${alpha})`;
      ctx.beginPath(); ctx.arc(p.x, p.y, .45 + front * .85, 0, tau); ctx.fill();
    }

    // Small coordinate marks give the scene a scientific instrument feel.
    ctx.strokeStyle = '#83b4bf42'; ctx.lineWidth = .7;
    for (const [x, y] of [[cx - radius * 1.42, cy], [cx + radius * 1.42, cy], [cx, cy - radius * 1.35]]) {
      ctx.beginPath(); ctx.moveTo(x - 4, y); ctx.lineTo(x + 4, y); ctx.moveTo(x, y - 4); ctx.lineTo(x, y + 4); ctx.stroke();
    }
    canvas.dataset.rendered = 'true';
  }

  function animate(now) {
    frame = 0;
    if (!visible || document.hidden || reducedMotion.matches) return;
    if (now - previous > 32) { draw(now / 1000); previous = now; }
    frame = requestAnimationFrame(animate);
  }
  function refresh() {
    if (frame) cancelAnimationFrame(frame);
    frame = 0;
    if (reducedMotion.matches) draw(0);
    else if (visible && !document.hidden) frame = requestAnimationFrame(animate);
  }
  function resize() {
    const bounds = art.getBoundingClientRect();
    width = bounds.width; height = bounds.height;
    const dpr = Math.min(devicePixelRatio || 1, 2);
    canvas.width = Math.round(width * dpr); canvas.height = Math.round(height * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    draw(reducedMotion.matches ? 0 : performance.now() / 1000);
    refresh();
  }
  art.addEventListener('pointermove', event => {
    if (event.pointerType === 'touch') return;
    const bounds = art.getBoundingClientRect();
    pointerX = (event.clientX - bounds.left) / width - .5;
    pointerY = (event.clientY - bounds.top) / height - .5;
  }, { passive: true });
  art.addEventListener('pointerleave', () => { pointerX = 0; pointerY = 0; });
  new ResizeObserver(resize).observe(art);
  new IntersectionObserver(entries => { visible = entries[0].isIntersecting; refresh(); }).observe(art);
  document.addEventListener('visibilitychange', refresh);
  reducedMotion.addEventListener('change', refresh);
  resize();
})();
