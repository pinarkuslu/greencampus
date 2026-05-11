/* ============================================================
   ECOMETRICS · Vanilla JS
   - Loader, scroll progress, nav, cursor glow, particles
   - Reveal animations, counters
   - Charts: donut, hbar, grouped bars
   - Tabs (Demografi / Farkındalık / Karbon / Su)
   ============================================================ */

(() => {
  'use strict';

  /* ---------- LOADER (session-based: show once per tab session) ---------- */
  const loader = document.getElementById('loader');
  const ringFg = document.getElementById('ringFg');
  const loaderPct = document.getElementById('loaderPct');

  const LOADER_SESSION_KEY = 'loaderShown';
  let skipLoader = false;
  try {
    if (sessionStorage.getItem(LOADER_SESSION_KEY) === '1') skipLoader = true;
  } catch (e) {}

  // Single entry point that defers to startReveal (defined later in this IIFE)
  let revealStarted = false;
  const beginReveal = () => {
    if (revealStarted) return;
    revealStarted = true;
    startReveal();
  };

  const finishLoader = () => {
    setTimeout(() => {
      loader.classList.add('hide');
      document.body.style.overflow = '';
      beginReveal();
      try { sessionStorage.setItem(LOADER_SESSION_KEY, '1'); } catch (e) {}
    }, 250);
  };

  if (skipLoader) {
    // Already seen this session — hide immediately, no animation, no scroll lock
    loader.style.display = 'none';
    // Defer one tick so startReveal is defined by the time we call it
    setTimeout(beginReveal, 0);
  } else {
    // First visit this session — run the full loader animation
    const ldrSvg = loader.querySelector('svg');
    ldrSvg.insertAdjacentHTML('afterbegin', `
      <defs>
        <linearGradient id="loaderGrad" x1="0" x2="1" y1="0" y2="1">
          <stop offset="0" stop-color="#34f5c5"/>
          <stop offset="1" stop-color="#3aa8ff"/>
        </linearGradient>
      </defs>
    `);

    document.body.style.overflow = 'hidden';

    let pct = 0;
    const tick = () => {
      pct += Math.random() * 8 + 4;
      if (pct >= 100) {
        pct = 100;
        loaderPct.textContent = '100%';
        ringFg.style.strokeDashoffset = 0;
        finishLoader();
        return;
      }
      loaderPct.textContent = Math.floor(pct) + '%';
      ringFg.style.strokeDashoffset = 264 - (264 * pct / 100);
      setTimeout(tick, 80 + Math.random() * 80);
    };
    window.addEventListener('load', () => setTimeout(tick, 200));
    // Safety fallback if 'load' never fires within 3.5s
    setTimeout(() => { if (!loader.classList.contains('hide')) finishLoader(); }, 3500);
  }

  /* ---------- SCROLL PROGRESS + NAV ---------- */
  const nav = document.getElementById('nav');
  const scrollBar = document.getElementById('scrollProgress');
  const onScroll = () => {
    const sc = window.scrollY;
    const h = document.documentElement.scrollHeight - window.innerHeight;
    scrollBar.style.width = Math.min(100, (sc / h) * 100) + '%';
    nav.classList.toggle('scrolled', sc > 40);
  };
  document.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ---------- CURSOR GLOW ---------- */
  const glow = document.getElementById('cursorGlow');
  let mx = window.innerWidth / 2, my = window.innerHeight / 2;
  let gx = mx, gy = my;
  document.addEventListener('pointermove', e => { mx = e.clientX; my = e.clientY; });
  const animateGlow = () => {
    gx += (mx - gx) * 0.08;
    gy += (my - gy) * 0.08;
    glow.style.transform = `translate(${gx}px, ${gy}px) translate(-50%, -50%)`;
    requestAnimationFrame(animateGlow);
  };
  animateGlow();

  /* ---------- PARTICLES (hero canvas) ---------- */
  // Read particle color from CSS variable so it adapts to the active theme
  const getParticleRGB = () =>
    getComputedStyle(document.documentElement)
      .getPropertyValue('--particle-color').trim() || '91, 232, 216';

  // Pause the particle canvas + flag the hero-offscreen class to pause its CSS animations
  let heroVisible = true;
  const heroSection = document.getElementById('hero');
  if (heroSection && 'IntersectionObserver' in window) {
    new IntersectionObserver((entries) => {
      heroVisible = entries[0].isIntersecting;
      document.body.classList.toggle('hero-offscreen', !heroVisible);
    }, { threshold: 0 }).observe(heroSection);
  }

  const canvas = document.getElementById('particles');
  if (canvas) {
    const ctx = canvas.getContext('2d');
    let particles = [];
    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = canvas.offsetWidth * dpr;
      canvas.height = canvas.offsetHeight * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    window.addEventListener('resize', resize);

    const COUNT = Math.min(80, Math.floor(window.innerWidth / 22));
    for (let i = 0; i < COUNT; i++) {
      particles.push({
        x: Math.random() * canvas.offsetWidth,
        y: Math.random() * canvas.offsetHeight,
        vx: (Math.random() - 0.5) * 0.25,
        vy: (Math.random() - 0.5) * 0.25,
        r: Math.random() * 1.6 + 0.4,
        a: Math.random() * 0.6 + 0.2,
      });
    }
    const tickParticles = () => {
      // Skip drawing when hero is offscreen — huge scroll perf win
      if (!heroVisible) {
        requestAnimationFrame(tickParticles);
        return;
      }
      const w = canvas.offsetWidth, h = canvas.offsetHeight;
      const rgb = getParticleRGB();
      ctx.clearRect(0, 0, w, h);
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        p.x += p.vx; p.y += p.vy;
        if (p.x < 0) p.x = w; if (p.x > w) p.x = 0;
        if (p.y < 0) p.y = h; if (p.y > h) p.y = 0;
        ctx.beginPath();
        ctx.fillStyle = `rgba(${rgb}, ${p.a})`;
        ctx.shadowColor = `rgba(${rgb}, 0.6)`;
        ctx.shadowBlur = 6;
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fill();
      }
      // light connecting lines
      ctx.shadowBlur = 0;
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const a = particles[i], b = particles[j];
          const dx = a.x - b.x, dy = a.y - b.y;
          const d2 = dx * dx + dy * dy;
          if (d2 < 110 * 110) {
            ctx.strokeStyle = `rgba(${rgb}, ${(1 - Math.sqrt(d2) / 110) * 0.12})`;
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke();
          }
        }
      }
      requestAnimationFrame(tickParticles);
    };
    tickParticles();
  }

  /* ---------- THEME TOGGLE ---------- */
  const themeToggle = document.getElementById('themeToggle');
  const themeMeta = document.querySelector('meta[name="theme-color"]');
  const setTheme = (theme) => {
    const root = document.documentElement;
    // smooth crossfade during the switch
    root.classList.add('theme-transitioning');
    root.setAttribute('data-theme', theme);
    try { localStorage.setItem('theme', theme); } catch (e) {}
    if (themeMeta) themeMeta.setAttribute('content', theme === 'light' ? '#dfe7e0' : '#04110e');
    setTimeout(() => root.classList.remove('theme-transitioning'), 500);
  };
  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      const current = document.documentElement.getAttribute('data-theme') || 'dark';
      setTheme(current === 'light' ? 'dark' : 'light');
    });
  }

  /* ---------- REVEAL ON SCROLL ---------- */
  const io = new IntersectionObserver((entries) => {
    entries.forEach(en => {
      if (en.isIntersecting) {
        en.target.classList.add('in-view');
        if (en.target.dataset.counted !== '1') {
          animateCounters(en.target);
          en.target.dataset.counted = '1';
        }
        // Trigger chart draws inside
        drawChartsIn(en.target);
        io.unobserve(en.target);
      }
    });
  }, { threshold: 0.15, rootMargin: '0px 0px -50px 0px' });

  const startReveal = () => {
    document.querySelectorAll('.reveal').forEach(el => io.observe(el));
    // Also observe stat cards for bar fill
    document.querySelectorAll('.stat-card').forEach(el => io.observe(el));
    // First-paint: charts in hero metrics aren't reveal — count immediately
    setTimeout(() => animateCounters(document.querySelector('.hero')), 200);
    // Build charts now (drawing actual SVG/DOM), animations triggered on reveal
    buildAllCharts();
  };

  /* ---------- COUNTERS ---------- */
  function animateCounters(scope) {
    if (!scope) return;
    const els = scope.querySelectorAll('[data-count]');
    els.forEach(el => {
      const target = parseFloat(el.dataset.count);
      const suffix = el.dataset.suffix || '';
      const dur = 1600;
      const start = performance.now();
      const isInt = Number.isInteger(target) && !suffix.includes('.');
      const step = (now) => {
        const t = Math.min(1, (now - start) / dur);
        const eased = 1 - Math.pow(1 - t, 3);
        const v = target * eased;
        el.textContent = (isInt ? Math.floor(v) : v.toFixed(1)) + suffix;
        if (t < 1) requestAnimationFrame(step);
        else el.textContent = (isInt ? target : target) + suffix;
      };
      requestAnimationFrame(step);
    });
  }

  /* ---------- TABS ---------- */
  document.querySelectorAll('.tab').forEach(tab => {
    tab.addEventListener('click', () => {
      const key = tab.dataset.tab;
      document.querySelectorAll('.tab').forEach(t => t.classList.toggle('active', t === tab));
      document.querySelectorAll('.panel').forEach(p => p.classList.toggle('active', p.dataset.panel === key));
      // Re-trigger reveal for newly visible reveal elements
      const panel = document.querySelector(`.panel[data-panel="${key}"]`);
      panel.querySelectorAll('.reveal').forEach(el => {
        // small delay so reveal animation is visible after panel switch
        el.classList.remove('in-view');
        requestAnimationFrame(() => requestAnimationFrame(() => el.classList.add('in-view')));
      });
      // Re-animate charts inside the panel
      panel.querySelectorAll('[data-donut], [data-hbar], [data-grouped]').forEach(host => {
        animateChart(host);
      });
    });
  });

  /* ---------- CHARTS ---------- */
  // Build all charts on init (DOM structure), animation triggered when revealed
  function buildAllCharts() {
    document.querySelectorAll('[data-donut]').forEach(buildDonut);
    document.querySelectorAll('[data-hbar]').forEach(buildHBar);
    document.querySelectorAll('[data-grouped]').forEach(buildGrouped);
  }

  function drawChartsIn(scope) {
    scope.querySelectorAll?.('[data-donut], [data-hbar], [data-grouped]').forEach(animateChart);
    if (scope.matches?.('[data-donut], [data-hbar], [data-grouped]')) animateChart(scope);
  }

  function animateChart(host) {
    if (host.matches('[data-donut]')) animateDonut(host);
    else if (host.matches('[data-hbar]')) animateHBar(host);
    else if (host.matches('[data-grouped]')) animateGrouped(host);
  }

  /* ----- DONUT ----- */
  function buildDonut(host) {
    const data = JSON.parse(host.dataset.donut);
    const svg = host.querySelector('svg');
    svg.innerHTML = '';
    const cx = 60, cy = 60, r = 48, C = 2 * Math.PI * r;
    // background ring
    const bg = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    bg.setAttribute('cx', cx); bg.setAttribute('cy', cy); bg.setAttribute('r', r);
    bg.setAttribute('fill', 'none');
    bg.setAttribute('stroke', 'rgba(120,220,200,0.08)');
    bg.setAttribute('stroke-width', '14');
    svg.appendChild(bg);

    // Center text refs + remember the default (largest slice or whatever HTML had)
    const center = host.querySelector('.donut-center');
    const centerStrong = center?.querySelector('strong');
    const centerSpan = center?.querySelector('span');
    const defaultText = centerStrong ? centerStrong.textContent : '';
    const defaultLabel = centerSpan ? centerSpan.textContent : '';

    const applyCenter = (text, label, color) => {
      if (!centerStrong) return;
      if (centerStrong.textContent === text && centerSpan.textContent === label) return;
      centerStrong.textContent = text;
      centerSpan.textContent = label;
      if (color) {
        centerStrong.style.backgroundImage = `linear-gradient(135deg, ${color}, ${shiftColor(color, 40)})`;
      } else {
        centerStrong.style.backgroundImage = '';
      }
      center.classList.remove('swap');
      void center.offsetWidth;
      center.classList.add('swap');
    };

    const total = data.reduce((s, d) => s + d.value, 0);
    let offset = 0;
    const slices = [];
    data.forEach((d) => {
      const frac = d.value / total;
      const len = frac * C;
      const c = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
      c.setAttribute('cx', cx); c.setAttribute('cy', cy); c.setAttribute('r', r);
      c.classList.add('slice');
      c.setAttribute('stroke', d.color);
      c.style.color = d.color;
      c.setAttribute('stroke-dasharray', `0 ${C}`);
      c.dataset.target = `${len} ${C}`;
      c.dataset.offset = `${-offset}`;
      c.style.strokeDashoffset = `${-offset}`;
      slices.push(c);
      svg.appendChild(c);
      offset += len;
    });

    /* ---- Auto-cycle through slices every 2s, paused on hover ---- */
    // Start the cycle at whichever slice matches the static HTML default (so first transition feels natural)
    let initialIdx = data.findIndex(d => d.label === defaultLabel);
    if (initialIdx < 0) initialIdx = 0;
    let currentIdx = initialIdx;
    let cycleTimer = null;
    let isHovering = false;

    const highlightSlice = (idx) => {
      const d = data[idx];
      applyCenter(`%${d.value}`, d.label, d.color);
      slices.forEach((s, i) => s.style.opacity = i === idx ? '1' : '0.4');
      const items = host.parentElement.querySelectorAll('.legend li');
      items.forEach((x, i) => x.classList.toggle('active', i === idx));
    };

    const advance = () => {
      if (isHovering || document.hidden) return;
      currentIdx = (currentIdx + 1) % data.length;
      highlightSlice(currentIdx);
    };

    host._startCycle = () => {
      if (cycleTimer || data.length < 2) return;
      // Highlight the default slice right away (no center-text change since it already matches)
      highlightSlice(currentIdx);
      // Random initial delay so multiple donuts don't tick in lockstep
      setTimeout(() => {
        if (cycleTimer) return;
        cycleTimer = setInterval(advance, 5000);
      }, 600 + Math.random() * 1400);
    };
    host._stopCycle = () => {
      if (cycleTimer) { clearInterval(cycleTimer); cycleTimer = null; }
    };

    // Slice hover handlers (pause cycle, show hovered, then resume cycled slice on leave)
    slices.forEach((c, idx) => {
      const d = data[idx];
      const enter = () => {
        isHovering = true;
        applyCenter(`%${d.value}`, d.label, d.color);
        slices.forEach((s, i) => s.style.opacity = i === idx ? '1' : '0.35');
        const items = host.parentElement.querySelectorAll('.legend li');
        items.forEach((x, i) => x.classList.toggle('active', i === idx));
      };
      const leave = () => {
        isHovering = false;
        // Resume the cycled position so center doesn't snap back to default
        highlightSlice(currentIdx);
      };
      c.addEventListener('pointerenter', enter);
      c.addEventListener('pointerleave', leave);
      c._enter = enter; c._leave = leave; c._label = d.label;
    });

    // Build legend (hover-linked to slices)
    const legend = host.parentElement.querySelector('.legend');
    if (legend) {
      legend.innerHTML = '';
      data.forEach((d, idx) => {
        const li = document.createElement('li');
        li.dataset.idx = d.label;
        li.innerHTML = `<span class="swatch" style="background:${d.color};color:${d.color}"></span>${d.label}<span class="val">%${d.value}</span>`;
        li.addEventListener('pointerenter', () => slices[idx]._enter());
        li.addEventListener('pointerleave', () => slices[idx]._leave());
        legend.appendChild(li);
      });
    }
  }
  function animateDonut(host) {
    host.querySelectorAll('.slice').forEach((c) => {
      c.setAttribute('stroke-dasharray', `0 ${2 * Math.PI * 48}`);
      requestAnimationFrame(() => requestAnimationFrame(() => {
        c.setAttribute('stroke-dasharray', c.dataset.target);
      }));
    });
    // Kick off the 2s auto-cycle once slice draw animation has settled
    if (host._startCycle) {
      setTimeout(() => host._startCycle(), 1500);
    }
  }

  /* ----- HORIZONTAL BAR ----- */
  function buildHBar(host) {
    const data = JSON.parse(host.dataset.hbar);
    host.innerHTML = '';
    const max = Math.max(...data.map(d => d.value));
    data.forEach((d) => {
      const li = document.createElement('li');
      const pct = (d.value / Math.max(max, 100)) * 100;
      li.innerHTML = `
        <span class="lab">${d.label}</span>
        <div class="track"><div class="fill" data-w="${pct}%" style="background:linear-gradient(90deg, ${d.color}, ${shiftColor(d.color, 30)});color:${d.color}"></div></div>
        <span class="val">%${d.value}</span>
      `;
      host.appendChild(li);
    });
  }
  function animateHBar(host) {
    host.querySelectorAll('.fill').forEach((f) => {
      f.style.width = '0%';
      requestAnimationFrame(() => requestAnimationFrame(() => {
        f.style.width = f.dataset.w;
      }));
    });
  }

  /* ----- GROUPED BARS (Likert scale) ----- */
  function buildGrouped(host) {
    const data = JSON.parse(host.dataset.grouped);
    const defaultColors = ['#0aa37a', '#34f5c5', '#3aa8ff', '#a17bff', '#ff6f91'];
    const colors = data.colors || defaultColors;
    host.innerHTML = '';

    // legend
    const legend = document.createElement('ul');
    legend.className = 'gb-legend';
    data.categories.forEach((cat, i) => {
      const li = document.createElement('li');
      li.innerHTML = `<span class="swatch" style="background:${colors[i]}"></span>${cat}`;
      legend.appendChild(li);
    });
    host.appendChild(legend);

    data.groups.forEach((g) => {
      const wrap = document.createElement('div');
      wrap.className = 'gb-group';
      const total = g.values.reduce((s, v) => s + v, 0);
      const max = Math.max(...g.values);
      const bars = g.values.map((v, i) => {
        const pct = total ? Math.round((v / total) * 1000) / 10 : 0;
        const height = max ? (v / max) * 100 : 0;
        return `
          <div class="gb-bar-wrap">
            <div class="gb-bar" style="--c:${colors[i]}" data-h="${height}%" data-val="${pct}"></div>
            <div class="gb-cat">${data.categories[i]}</div>
          </div>
        `;
      }).join('');
      wrap.innerHTML = `
        <div class="gb-label">${g.label}</div>
        <div class="gb-bars">${bars}</div>
      `;
      host.appendChild(wrap);
    });
  }
  function animateGrouped(host) {
    const bars = host.querySelectorAll('.gb-bar');
    bars.forEach((b, i) => {
      b.style.transition = 'none';
      b.style.height = '0%';
      // stagger
      setTimeout(() => {
        b.style.transition = 'height 1.1s cubic-bezier(.22,1,.36,1)';
        b.style.height = b.dataset.h;
      }, 60 + i * 18);
    });
  }

  /* ---------- HELPERS ---------- */
  // Shift a hex/rgb-ish color brightness slightly for gradient end
  function shiftColor(hex, amount = 20) {
    // accept #rrggbb
    if (!hex.startsWith('#') || hex.length !== 7) return hex;
    let r = parseInt(hex.slice(1, 3), 16);
    let g = parseInt(hex.slice(3, 5), 16);
    let b = parseInt(hex.slice(5, 7), 16);
    r = Math.min(255, r + amount);
    g = Math.min(255, g + amount);
    b = Math.min(255, b + amount);
    return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
  }

  /* ---------- SMOOTH ANCHOR SCROLL with offset for fixed nav ---------- */
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', (e) => {
      const id = a.getAttribute('href');
      if (id.length < 2) return;
      const t = document.querySelector(id);
      if (!t) return;
      e.preventDefault();
      const top = t.getBoundingClientRect().top + window.scrollY - 70;
      window.scrollTo({ top, behavior: 'smooth' });
    });
  });

})();
