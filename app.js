(() => {
  'use strict';

  // Mobile navigation toggle
  const navToggle = document.querySelector('[data-nav-toggle]');
  const navLinks = document.querySelector('[data-nav-links]');

  if (navToggle && navLinks) {
    navToggle.addEventListener('click', () => {
      const open = navLinks.classList.toggle('is-open');
      navToggle.setAttribute('aria-expanded', String(open));
    });

    navLinks.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', () => {
        navLinks.classList.remove('is-open');
        navToggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  // Theme switch: no saved choice follows the device; a click saves light or dark.
  const root = document.documentElement;
  const header = document.querySelector('.header-inner');
  const zhPage = (root.lang || '').toLowerCase().startsWith('zh');
  const SUN = '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 17a5 5 0 1 1 0-10 5 5 0 0 1 0 10Zm0-12.5a1 1 0 0 1-1-1V2a1 1 0 1 1 2 0v1.5a1 1 0 0 1-1 1Zm0 18.5a1 1 0 0 1-1-1v-1.5a1 1 0 1 1 2 0V22a1 1 0 0 1-1 1Zm9.5-10H20a1 1 0 1 1 0-2h1.5a1 1 0 1 1 0 2ZM4 13H2.5a1 1 0 1 1 0-2H4a1 1 0 1 1 0 2Zm13.66-5.66a1 1 0 0 1 0-1.41l1.06-1.06a1 1 0 1 1 1.41 1.41l-1.06 1.06a1 1 0 0 1-1.41 0ZM4.87 20.13a1 1 0 0 1 0-1.41l1.06-1.06a1 1 0 1 1 1.41 1.41l-1.06 1.06a1 1 0 0 1-1.41 0Zm14.26 0-1.06-1.06a1 1 0 1 1 1.41-1.41l1.06 1.06a1 1 0 1 1-1.41 1.41ZM6.34 7.34 5.28 6.28a1 1 0 1 1 1.41-1.41l1.06 1.06a1 1 0 1 1-1.41 1.41Z"/></svg>';
  const MOON = '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12.3 22A10 10 0 0 1 9.8 2.3a1 1 0 0 1 1.2 1.3 7.5 7.5 0 0 0 9.4 9.4 1 1 0 0 1 1.3 1.2A10 10 0 0 1 12.3 22Z"/></svg>';

  function currentTheme() {
    const saved = root.getAttribute('data-theme');
    if (saved === 'light' || saved === 'dark') return saved;
    return window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
  }

  if (header) {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'theme-toggle';
    const paint = () => {
      const dark = currentTheme() === 'dark';
      btn.innerHTML = dark ? SUN : MOON;
      const label = zhPage ? (dark ? '切換為淺色主題' : '切換為深色主題') : (dark ? 'Switch to light theme' : 'Switch to dark theme');
      btn.setAttribute('aria-label', label);
      btn.title = label;
      document.querySelectorAll('meta[name="theme-color"]').forEach((m) => {
        m.setAttribute('content', dark ? '#0B0F18' : '#F8F8FC');
      });
    };
    btn.addEventListener('click', () => {
      const next = currentTheme() === 'dark' ? 'light' : 'dark';
      root.setAttribute('data-theme', next);
      try { localStorage.setItem('theme', next); } catch (e) { /* private mode: works for this page only */ }
      paint();
    });
    const toggle = header.querySelector('.nav-toggle');
    header.insertBefore(btn, toggle || null);
    paint();
    window.matchMedia('(prefers-color-scheme: light)').addEventListener('change', paint);
  }

  // Interactive Phone HUD tabs + live motion reel
  const tabList = document.querySelector('[role="tablist"]');
  if (!tabList) return;

  const tabs = Array.from(tabList.querySelectorAll('[role="tab"]'));
  const panels = tabs
    .map((tab) => document.getElementById(tab.getAttribute('aria-controls')))
    .filter(Boolean);

  const phoneScreen = document.querySelector('[data-phone-screen]');
  const progressBar = document.querySelector('[data-reel-progress]');
  const playBtn = document.querySelector('[data-hud-play]');

  // Live telemetry DOM nodes
  const el = {
    soloDist: document.querySelector('[data-sim-solo-dist]'),
    soloSpeed: document.querySelector('[data-sim-solo-speed]'),
    convoyDist: document.querySelector('[data-sim-convoy-dist]'),
    samPin: document.querySelector('[data-sim-sam-pin]'),
    hemiPin: document.querySelector('[data-sim-hemi-pin]'),
    leadRow: document.querySelector('[data-sim-lead-row]'),
    samRow: document.querySelector('[data-sim-sam-row]'),
    hemiRow: document.querySelector('[data-sim-hemi-row]'),
    alertText: document.querySelector('[data-sim-alert-text]'),
    stragglerPin: document.querySelector('[data-sim-straggler-pin]'),
    fuel1Pin: document.querySelector('[data-sim-fuel1-pin]'),
    fuel2Pin: document.querySelector('[data-sim-fuel2-pin]'),
    fuel1Row: document.querySelector('[data-sim-fuel1-row]'),
    fuel2Row: document.querySelector('[data-sim-fuel2-row]'),
  };

  // Chinese pages (lang="zh-Hant-TW") get the demo text in Traditional Chinese, as the app shows it.
  const ZH = (document.documentElement.lang || '').toLowerCase().startsWith('zh');
  const M = ZH ? ' 公尺' : ' m';
  const KM = ZH ? ' 公里' : ' km';
  const P2 = ZH ? '小華' : 'Sam';
  const P3 = ZH ? '阿明' : 'Hemi';

  const SCENE_MS = 5500;
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  let activeIndex = 0;
  let isPlaying = !prefersReduced;
  let sceneElapsed = 0;
  let lastFrame = performance.now();

  function setPlaying(nextPlaying) {
    isPlaying = nextPlaying;
    if (phoneScreen) {
      phoneScreen.classList.toggle('is-paused', !isPlaying);
    }
    if (playBtn) {
      playBtn.textContent = ZH ? (isPlaying ? '暫停示範' : '播放示範') : (isPlaying ? 'Pause demo' : 'Play demo');
      playBtn.setAttribute('aria-pressed', String(!isPlaying));
    }
  }

  function updateTelemetry(progress) {
    // Scene 0: Solo Turn-by-Turn countdown (180 m -> 45 m) + live speed (58–60 km/h)
    if (activeIndex === 0) {
      const dist = Math.round(180 - progress * 135);
      const speed = 58 + Math.round(Math.sin(progress * Math.PI * 3) + 1);
      if (el.soloDist) el.soloDist.textContent = `${dist}${M}`;
      if (el.soloSpeed) el.soloSpeed.textContent = String(speed);
    }

    // Scene 1: Live Convoy formation (gaps gently shift while cruising)
    if (activeIndex === 1) {
      const turnKm = (7.0 - progress * 0.3).toFixed(1);
      const leadSpd = 48 + Math.round(Math.sin(progress * Math.PI * 2));
      const samGap = Math.round(80 + Math.sin(progress * Math.PI * 2) * 8);
      const hemiGap = Math.round(148 + Math.cos(progress * Math.PI * 2) * 10);
      if (el.convoyDist) el.convoyDist.textContent = `${turnKm}${KM}`;
      if (el.samPin) el.samPin.textContent = `${P2} · +${samGap}${M}`;
      if (el.hemiPin) el.hemiPin.textContent = `${P3} · +${hemiGap}${M}`;
      if (el.leadRow) el.leadRow.textContent = `${leadSpd} km/h · 0${M}`;
      if (el.samRow) el.samRow.textContent = `50 km/h · +${samGap}${M}`;
      if (el.hemiRow) el.hemiRow.textContent = `50 km/h · +${hemiGap}${M}`;
    }

    // Scene 2: Straggler alert (Hemi drifts from +720 m -> +920 m)
    if (activeIndex === 2) {
      const gap = Math.round(720 + progress * 200);
      if (el.stragglerPin) el.stragglerPin.textContent = `${P3} · +${gap}${M}`;
      if (el.alertText) el.alertText.textContent = ZH ? `${P3} 已落後車隊 ${gap} 公尺。` : `Hemi has fallen ${gap} m behind the group.`;
    }

    // Scene 3: Corridor Fuel & Food approaching (7.8 km -> 7.4 km)
    if (activeIndex === 3) {
      const f1 = (7.8 - progress * 0.4).toFixed(1);
      const f2 = (8.1 - progress * 0.4).toFixed(1);
      if (el.fuel1Pin) el.fuel1Pin.textContent = ZH ? `加油站 · ${f1}${KM}` : `Allied Fuel · ${f1} km`;
      if (el.fuel2Pin) el.fuel2Pin.textContent = ZH ? `加油 / 充電 · ${f2}${KM}` : `Fuel / EV · ${f2} km`;
      if (el.fuel1Row) el.fuel1Row.textContent = ZH ? `沿路線 ${f1}${KM}` : `${f1} km along route`;
      if (el.fuel2Row) el.fuel2Row.textContent = ZH ? `沿路線 ${f2}${KM}` : `${f2} km along route`;
    }
  }

  function activateTab(index, moveFocus = false) {
    activeIndex = index;
    sceneElapsed = 0;

    tabs.forEach((tab, i) => {
      const isSelected = i === activeIndex;
      tab.setAttribute('aria-selected', String(isSelected));
      tab.tabIndex = isSelected ? 0 : -1;
      if (panels[i]) {
        panels[i].hidden = !isSelected;
      }
    });

    updateTelemetry(0);
    if (progressBar) {
      progressBar.style.width = '0%';
    }
    if (moveFocus) {
      tabs[activeIndex].focus();
    }
  }

  tabs.forEach((tab, index) => {
    tab.addEventListener('click', () => activateTab(index));

    tab.addEventListener('keydown', (event) => {
      let targetIndex = null;
      if (event.key === 'ArrowRight') {
        targetIndex = (index + 1) % tabs.length;
      } else if (event.key === 'ArrowLeft') {
        targetIndex = (index - 1 + tabs.length) % tabs.length;
      } else if (event.key === 'Home') {
        targetIndex = 0;
      } else if (event.key === 'End') {
        targetIndex = tabs.length - 1;
      }

      if (targetIndex !== null) {
        event.preventDefault();
        activateTab(targetIndex, true);
      }
    });
  });

  if (playBtn) {
    playBtn.addEventListener('click', () => setPlaying(!isPlaying));
  }

  // Initialise state and start smooth animation loop
  setPlaying(isPlaying);
  updateTelemetry(0);

  function tick(now) {
    const dt = Math.min(now - lastFrame, 100);
    lastFrame = now;

    if (isPlaying && !document.hidden) {
      sceneElapsed += dt;
      const progress = Math.min(sceneElapsed / SCENE_MS, 1);

      if (progressBar) {
        progressBar.style.width = `${(progress * 100).toFixed(1)}%`;
      }
      updateTelemetry(progress);

      if (sceneElapsed >= SCENE_MS) {
        activateTab((activeIndex + 1) % tabs.length);
      }
    }

    requestAnimationFrame(tick);
  }

  requestAnimationFrame(tick);
})();
