'use strict';

/* =========================================================================
   Sadhana — meditation & yoga timer (installable web app)
   Data lives in localStorage on this device. Apple Health sync goes through
   two small Apple Shortcuts that the app opens with a shortcuts:// link.
   ========================================================================= */

// ---------- Practices ----------

const PRACTICES = [
  {
    id: 'kapalbhati', title: 'Kapalbhati', subtitle: 'Skull-shining breath', minutes: 5, kind: 'mindful',
    video: 'DsJYHWHGL-U', g: ['#ffd88a', '#ff9a62'], icon: 'wind',
    guidance: [
      'Sit tall with a relaxed face and shoulders, on an empty stomach.',
      'Take a comfortable breath in, then exhale sharply through the nose by snapping the belly in.',
      'Let the inhale happen passively. Keep a steady rhythm and rest between rounds.',
      'Go gently, or skip it, if pregnant or with high blood pressure, heart conditions, hernia or recent abdominal surgery.',
    ],
  },
  {
    id: 'tumo', title: 'Tumo Breathing', subtitle: 'Inner-fire breathing', minutes: 15, kind: 'mindful',
    video: 'A-bm1KKOCvU', g: ['#ffb36b', '#ff5f6d'], icon: 'flame',
    guidance: [
      'Sit or lie down somewhere safe. Never practise in water, while driving, or standing.',
      'Breathe in deeply and let go, for around 30–40 breaths per round.',
      'After the last exhale, hold for as long as is comfortable, then inhale and hold briefly.',
      'Set an interval bell in Settings if you want a cue for each round.',
    ],
  },
  {
    id: 'om', title: 'Om Chanting', subtitle: 'The primordial sound', minutes: 10, kind: 'mindful',
    video: null, g: ['#e3b8ff', '#9a7bff'], icon: 'om',
    guidance: [
      'Sit comfortably with the spine upright and eyes gently closed.',
      'Inhale deeply, then chant A‑U‑M slowly, letting the M hum resonate.',
      'Rest in the silence after each chant before the next breath.',
    ],
  },
  {
    id: 'shunya', title: 'Shunya Meditation', subtitle: 'Meditation on emptiness', minutes: 20, kind: 'mindful',
    video: 'GGjnxceYs60', g: ['#9fb4ff', '#6a5af9'], icon: 'shunya',
    guidance: [
      'Settle into a comfortable seat and follow along with the guided video.',
      'Let thoughts arise and pass without engaging them.',
      'When the bell sounds, take a few moments before opening your eyes.',
    ],
  },
  {
    id: 'yoga', title: 'Yoga', subtitle: 'Asana practice', minutes: 30, kind: 'yoga',
    video: 'oDP-89wRXUk', g: ['#a6f0c6', '#3cc9b4'], icon: 'yoga',
    guidance: [
      'Follow along with the video and move within your comfortable range.',
      'Breathe smoothly through the nose and never force a pose.',
      'Sent to Apple Health as a Yoga workout.',
    ],
  },
];
const P = Object.fromEntries(PRACTICES.map((p) => [p.id, p]));

// ---------- Icons ----------

const ICON_PATHS = {
  wind: '<path d="M3 8.5h10.5a3 3 0 1 0-3-3"/><path d="M3 12.5h15a3 3 0 1 1-3 3"/><path d="M3 16.5h6"/>',
  flame: '<path d="M12 3c.8 3.2 5.5 5.3 5.5 10.2A5.5 5.5 0 0 1 6.5 13c0-2.3 1.1-4 2.6-5.3.2 1.7 1 2.8 2.4 3.3C11 8 10.7 5.6 12 3z"/>',
  om: '<text x="12" y="18" text-anchor="middle" font-size="17" font-weight="600" fill="currentColor" stroke="none" font-family="Kohinoor Devanagari, Devanagari Sangam MN, Noto Sans Devanagari, sans-serif">ॐ</text>',
  shunya: '<circle cx="12" cy="12" r="8.5" stroke-dasharray="2.6 3.1"/><circle cx="12" cy="12" r="1.6" fill="currentColor" stroke="none"/>',
  yoga: '<circle cx="12" cy="4.8" r="2"/><path d="M12 8v5.5"/><path d="M6 10.5l6 2 6-2"/><path d="M4.5 19c2.3-2.2 4.8-3.2 7.5-3.2s5.2 1 7.5 3.2"/><path d="M8.5 19.2h7"/>',
  sun: '<circle cx="12" cy="12" r="4"/><path d="M12 2.5v2M12 19.5v2M4.6 4.6l1.4 1.4M18 18l1.4 1.4M2.5 12h2M19.5 12h2M4.6 19.4L6 18M18 6l1.4-1.4"/>',
  chart: '<path d="M3.5 20.5h17"/><rect x="5" y="11" width="3.2" height="6.5" rx="1"/><rect x="10.4" y="5.5" width="3.2" height="12" rx="1"/><rect x="15.8" y="8.5" width="3.2" height="9" rx="1"/>',
  sliders: '<path d="M4 6h9M17 6h3M4 12h3M11 12h9M4 18h11M19 18h1"/><circle cx="15" cy="6" r="2"/><circle cx="9" cy="12" r="2"/><circle cx="17" cy="18" r="2"/>',
  play: '<path d="M8 5.2v13.6L19 12z" fill="currentColor" stroke="none"/>',
  pause: '<rect x="6.5" y="5" width="4" height="14" rx="1.3" fill="currentColor" stroke="none"/><rect x="13.5" y="5" width="4" height="14" rx="1.3" fill="currentColor" stroke="none"/>',
  stop: '<rect x="6" y="6" width="12" height="12" rx="2.5" fill="currentColor" stroke="none"/>',
  close: '<path d="M6.5 6.5l11 11M17.5 6.5l-11 11"/>',
  check: '<path d="M5 12.5l4.5 4.5L19 7.5"/>',
  plus: '<path d="M12 5v14M5 12h14"/>',
  minus: '<path d="M5 12h14"/>',
  heart: '<path d="M12 20s-7.5-4.6-7.5-10.2A4.2 4.2 0 0 1 12 7.3a4.2 4.2 0 0 1 7.5 2.5C19.5 15.4 12 20 12 20z"/>',
  clock: '<circle cx="12" cy="12" r="8.5"/><path d="M12 7.5V12l3 2"/>',
  trophy: '<path d="M8 4h8v5a4 4 0 0 1-8 0V4z"/><path d="M8 6H5a3 3 0 0 0 3 4M16 6h3a3 3 0 0 1-3 4M12 13v4M8.5 20h7"/>',
  bell: '<path d="M6 16V11a6 6 0 1 1 12 0v5l1.5 2h-15z"/><path d="M10 20.5a2 2 0 0 0 4 0"/>',
  external: '<path d="M14 5h5v5M19 5l-8 8"/><path d="M18 14v4a1.5 1.5 0 0 1-1.5 1.5h-10A1.5 1.5 0 0 1 5 18V8a1.5 1.5 0 0 1 1.5-1.5H10"/>',
  chevron: '<path d="M9 5.5l6.5 6.5L9 18.5"/>',
  share: '<path d="M12 3.5v11M8 7.5l4-4 4 4"/><path d="M7 10.5H6a1.5 1.5 0 0 0-1.5 1.5v7A1.5 1.5 0 0 0 6 20.5h12a1.5 1.5 0 0 0 1.5-1.5v-7a1.5 1.5 0 0 0-1.5-1.5h-1"/>',
  trash: '<path d="M4.5 7h15M9.5 7V4.5h5V7M6.5 7l1 12.5h9l1-12.5"/>',
  sparkle: '<path d="M12 3l1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8z"/>',
  download: '<path d="M12 4v11M7.5 10.5L12 15l4.5-4.5M5 19.5h14"/>',
  upload: '<path d="M12 15V4M7.5 8.5L12 4l4.5 4.5M5 19.5h14"/>',
};

function icon(name, cls = '') {
  return `<svg class="i ${cls}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${ICON_PATHS[name] || ''}</svg>`;
}
const gradStyle = (p) => `--g1:${p.g[0]};--g2:${p.g[1]}`;
const tile = (p, size = '') => `<span class="tile ${size}" style="${gradStyle(p)}">${icon(p.icon)}</span>`;
const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

// ---------- Storage ----------

const STORE_KEY = 'sadhana.v1';
const DEFAULTS = {
  sessions: [], // { id, p, start, end, health }
  settings: {
    minutes: {}, bells: {}, routine: {},
    startBell: true, keepAwake: true,
    health: { enabled: false, mindful: 'Sadhana Mindful', yoga: 'Sadhana Yoga' },
    installDismissed: false,
  },
  active: null,
};

function load() {
  try {
    const raw = JSON.parse(localStorage.getItem(STORE_KEY) || 'null') || {};
    const s = raw.settings || {};
    return {
      ...DEFAULTS, ...raw,
      sessions: Array.isArray(raw.sessions) ? raw.sessions : [],
      settings: { ...DEFAULTS.settings, ...s, health: { ...DEFAULTS.settings.health, ...(s.health || {}) } },
    };
  } catch {
    return JSON.parse(JSON.stringify(DEFAULTS));
  }
}
let db = load();
function save() {
  try { localStorage.setItem(STORE_KEY, JSON.stringify(db)); } catch { /* storage full or blocked */ }
}

const S = () => db.settings;
const minutesFor = (id) => S().minutes[id] ?? P[id].minutes;
const bellFor = (id) => S().bells[id] ?? 0;
const inRoutine = (id) => S().routine[id] ?? true;
const routine = () => PRACTICES.filter((p) => inRoutine(p.id)).map((p) => p.id);

// ---------- Dates & stats ----------

const dayKey = (t) => { const d = new Date(t); return `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`; };
const addDays = (d, n) => { const x = new Date(d); x.setDate(x.getDate() + n); x.setHours(0, 0, 0, 0); return x; };
const todayStart = () => addDays(new Date(), 0);
const sessionsOn = (day) => db.sessions.filter((s) => dayKey(s.start) === dayKey(day));
const minutesOf = (list) => list.reduce((m, s) => m + (s.end - s.start), 0) / 60000;

function doneByDay() {
  const map = new Map();
  for (const s of db.sessions) {
    const k = dayKey(s.start);
    if (!map.has(k)) map.set(k, new Set());
    map.get(k).add(s.p);
  }
  return map;
}
function dayFraction(map, day) {
  const r = routine();
  if (!r.length) return 0;
  const done = map.get(dayKey(day));
  return done ? r.filter((id) => done.has(id)).length / r.length : 0;
}
function streaks() {
  const map = doneByDay();
  const complete = (d) => routine().length > 0 && dayFraction(map, d) >= 1;
  let day = todayStart();
  if (!complete(day)) day = addDays(day, -1);
  let current = 0;
  while (complete(day)) { current++; day = addDays(day, -1); }

  let best = 0, run = 0, prev = null;
  const days = [...map.keys()].map((k) => { const [y, m, d] = k.split('-').map(Number); return new Date(y, m - 1, d); })
    .filter(complete).sort((a, b) => a - b);
  for (const d of days) {
    run = prev && dayKey(addDays(prev, 1)) === dayKey(d) ? run + 1 : 1;
    best = Math.max(best, run);
    prev = d;
  }
  return { current, best, map };
}

const clock = (sec) => { const t = Math.max(0, Math.ceil(sec)); return `${Math.floor(t / 60)}:${String(t % 60).padStart(2, '0')}`; };
const durLabel = (sec) => (sec < 60 ? `${Math.round(sec)} sec` : `${Math.round(sec / 60)} min`);
const greeting = () => { const h = new Date().getHours(); return h < 5 ? 'Still night' : h < 12 ? 'Good morning' : h < 17 ? 'Good afternoon' : 'Good evening'; };
const uid = () => Math.random().toString(36).slice(2) + Date.now().toString(36);

// ---------- Rings ----------

function ring(progress, { size = 116, stroke = 10, id = 'r', colors = ['#ffd08a', '#ff8a5c'] } = {}) {
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const off = c * (1 - Math.min(1, Math.max(0, progress)));
  return `<svg viewBox="0 0 ${size} ${size}">
    <defs><linearGradient id="${id}" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${colors[0]}"/><stop offset="1" stop-color="${colors[1]}"/></linearGradient></defs>
    <circle class="ring-track" cx="${size / 2}" cy="${size / 2}" r="${r}" fill="none" stroke-width="${stroke}"/>
    ${progress > 0 ? `<circle class="ring-progress" cx="${size / 2}" cy="${size / 2}" r="${r}" fill="none" stroke="url(#${id})" stroke-width="${stroke}"
      stroke-linecap="round" stroke-dasharray="${c}" stroke-dashoffset="${off}"/>` : ''}
  </svg>`;
}

// ---------- Audio: synthesised singing bowl ----------

let actx = null;
function unlockAudio() {
  try { if (navigator.audioSession) navigator.audioSession.type = 'playback'; } catch { /* unsupported */ }
  if (!actx) {
    const Ctx = window.AudioContext || window.webkitAudioContext;
    if (Ctx) actx = new Ctx();
  }
  if (actx && actx.state === 'suspended') actx.resume();
}
function bell(strikes = 1) {
  if (!actx) return;
  for (let i = 0; i < strikes; i++) strike(actx.currentTime + 0.05 + i * 2.4);
}
function strike(t0) {
  const master = actx.createGain();
  master.gain.value = 0.2;
  master.connect(actx.destination);
  const partials = [[1, 1, 0.9], [1.004, 0.6, 0.9], [2.71, 0.45, 1.6], [5.15, 0.22, 2.6], [8.43, 0.1, 3.6]];
  for (const [ratio, amp, decay] of partials) {
    const osc = actx.createOscillator();
    const gain = actx.createGain();
    const end = t0 + 6 / decay;
    osc.type = 'sine';
    osc.frequency.value = 330 * ratio;
    gain.gain.setValueAtTime(0.0001, t0);
    gain.gain.linearRampToValueAtTime(amp, t0 + 0.008);
    gain.gain.exponentialRampToValueAtTime(0.0001, end);
    osc.connect(gain).connect(master);
    osc.start(t0);
    osc.stop(end + 0.1);
  }
}

// ---------- Screen wake lock ----------

let wakeLock = null;
async function setAwake(on) {
  try {
    if (on && S().keepAwake && 'wakeLock' in navigator) {
      if (!wakeLock) {
        wakeLock = await navigator.wakeLock.request('screen');
        wakeLock.addEventListener('release', () => { wakeLock = null; });
      }
    } else if (!on && wakeLock) {
      await wakeLock.release();
      wakeLock = null;
    }
  } catch { /* not allowed right now */ }
}

// ---------- Apple Health via Shortcuts ----------

function healthURL(session) {
  const p = P[session.p];
  const name = p.kind === 'yoga' ? S().health.yoga : S().health.mindful;
  const minutes = Math.max(1, Math.round((session.end - session.start) / 60000));
  return `shortcuts://run-shortcut?name=${encodeURIComponent(name)}&input=text&text=${minutes}`;
}
function sendToHealth(id) {
  const s = db.sessions.find((x) => x.id === id);
  if (!s) return;
  if (!S().health.enabled) {
    closeTimer(true);
    go('settings', 'health');
    toast('Set up Apple Health first');
    return;
  }
  s.health = true;
  save();
  window.location.href = healthURL(s);
}

// ---------- Toast & modal ----------

let toastTimer;
function toast(msg) {
  const el = document.getElementById('toast');
  el.textContent = msg;
  el.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => el.classList.remove('show'), 2200);
}

const modalRoot = document.getElementById('modal-root');
let modalHandlers = {};
function openModal(html, handlers = {}) {
  modalHandlers = handlers;
  modalRoot.innerHTML = `<div class="modal"><div class="scrim" data-action="modal-close"></div><div class="panel"><div class="grabber"></div>${html}</div></div>`;
}
function closeModal() { modalRoot.innerHTML = ''; modalHandlers = {}; }

function actionSheet({ title, lead = '', actions }) {
  const handlers = {};
  const buttons = actions.map((a, i) => {
    handlers[`a${i}`] = a.run;
    return `<button class="btn block ${a.style || 'glass'}" data-action="modal-run" data-key="a${i}" style="${a.grad ? gradStyle(a.grad) : ''}">${a.icon ? icon(a.icon) : ''}${esc(a.label)}</button>`;
  }).join('');
  openModal(`<h2>${esc(title)}</h2>${lead ? `<p class="lead">${esc(lead)}</p>` : '<div style="height:14px"></div>'}
    <div class="stack">${buttons}<button class="btn text block" data-action="modal-close">Cancel</button></div>`, handlers);
}

// ---------- Navigation ----------

let tab = 'today';
const view = document.getElementById('view');
const TABS = { today: ['Today', 'sun'], history: ['History', 'chart'], settings: ['Settings', 'sliders'] };
let openPractice = null; // expanded row in settings
let showAllHistory = false;

function renderTabbar() {
  document.querySelectorAll('.tabbar button').forEach((b) => {
    const [label, ic] = TABS[b.dataset.tab];
    b.innerHTML = `${icon(ic)}<span>${label}</span>`;
    b.classList.toggle('active', b.dataset.tab === tab);
  });
}
function render() {
  view.innerHTML = tab === 'today' ? renderToday() : tab === 'history' ? renderHistory() : renderSettings();
  renderTabbar();
}
function go(next, anchor) {
  tab = next;
  view.style.animation = 'none';
  void view.offsetWidth;
  view.style.animation = '';
  render();
  if (anchor) document.getElementById(anchor)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  else window.scrollTo(0, 0);
}

// ---------- Today ----------

function installBanner() {
  const standalone = window.navigator.standalone || window.matchMedia('(display-mode: standalone)').matches;
  const ios = /iPad|iPhone|iPod/.test(navigator.userAgent) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
  if (standalone || !ios || S().installDismissed) return '';
  return `<div class="card install">
    <img src="icons/apple-touch-icon.png" alt="">
    <div><b>Install Sadhana</b><span>Tap ${icon('share', 'share')} Share, then <b style="display:inline">Add to Home Screen</b></span></div>
    <button class="icon-btn" data-action="dismiss-install" aria-label="Dismiss">${icon('close')}</button>
  </div>`;
}

function renderToday() {
  const today = sessionsOn(new Date());
  const done = new Set(today.map((s) => s.p));
  const r = routine();
  const doneCount = r.filter((id) => done.has(id)).length;
  const { current, map } = streaks();
  const label = doneCount === 0 ? 'Begin today’s practice' : doneCount >= r.length ? 'Practise again' : 'Continue your routine';
  const date = new Date().toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric' });

  const week = Array.from({ length: 7 }, (_, i) => addDays(new Date(), i - 6)).map((d, i) => {
    const frac = dayFraction(map, d);
    return `<div class="day ${i === 6 ? 'today' : ''}">
      <span>${d.toLocaleDateString(undefined, { weekday: 'narrow' })}</span>
      ${ring(frac, { size: 34, stroke: 4, id: `wk${i}` })}
      <span class="num">${d.getDate()}</span>
    </div>`;
  }).join('');

  const cards = PRACTICES.map((p) => {
    const mine = today.filter((s) => s.p === p.id);
    const isDone = mine.length > 0;
    return `<button class="practice" data-action="start" data-id="${p.id}" style="${gradStyle(p)}">
      ${tile(p)}
      <span class="meta"><b>${p.title}</b><small>${isDone ? `Done · ${Math.round(minutesOf(mine))} min today` : `${minutesFor(p.id)} min · ${p.subtitle}`}</small></span>
      <span class="status ${isDone ? 'done' : ''}">${icon(isDone ? 'check' : 'play')}</span>
    </button>`;
  }).join('');

  return `
    <header class="page-head">
      <p class="eyebrow">${greeting()} · ${date}</p>
      <h1 class="display">Your <em>sadhana</em></h1>
    </header>
    ${installBanner()}
    <section class="card hero">
      <div class="hero-top">
        <div class="ring-box">${ring(r.length ? doneCount / r.length : 0, { id: 'hero' })}
          <div class="label"><b>${doneCount}</b><span>of ${r.length}</span></div></div>
        <div class="stats">
          <div class="stat"><span class="badge flame-c">${icon('flame')}</span><div><b>${current}</b><span>day streak</span></div></div>
          <div class="stat"><span class="badge clock-c">${icon('clock')}</span><div><b>${Math.round(minutesOf(today))}</b><span>minutes today</span></div></div>
        </div>
      </div>
      ${r.length ? `<button class="btn primary lg block" data-action="routine">${icon('play')}${label}</button>` : ''}
      <p class="hint">${r.map((id) => P[id].title).join('  →  ') || 'Choose your routine in Settings'}</p>
    </section>
    <section class="card week" aria-label="This week">${week}</section>
    <h2 class="section-title">Practices</h2>
    <div class="practice-list">${cards}</div>`;
}

// ---------- History ----------

function renderHistory() {
  const { current, best, map } = streaks();
  const weekMin = minutesOf(db.sessions.filter((s) => s.start >= addDays(new Date(), -6).getTime()));

  // 14-day stacked bars
  const days = Array.from({ length: 14 }, (_, i) => addDays(new Date(), i - 13));
  const perDay = days.map((d) => {
    const list = sessionsOn(d);
    return PRACTICES.map((p) => ({ p, m: minutesOf(list.filter((s) => s.p === p.id)) })).filter((x) => x.m > 0);
  });
  const max = Math.max(10, ...perDay.map((segs) => segs.reduce((a, x) => a + x.m, 0)));
  const bars = perDay.map((segs) => segs.length
    ? `<div class="bar">${segs.map((x) => `<div class="seg" style="${gradStyle(x.p)};height:${(x.m / max) * 100}%"></div>`).join('')}</div>`
    : '<div class="bar empty"></div>').join('');
  const labels = days.map((d, i) => `<span class="${i === 13 ? 'today' : ''}">${i % 2 === 1 ? d.getDate() : ''}</span>`).join('');
  const legend = PRACTICES.map((p) => `<span style="${gradStyle(p)}"><i></i>${p.title.split(' ')[0]}</span>`).join('');

  // 5-week consistency calendar, Monday first
  const today = todayStart();
  const offset = (today.getDay() + 6) % 7;
  const startCal = addDays(today, -offset - 28);
  const cal = Array.from({ length: 35 }, (_, i) => {
    const d = addDays(startCal, i);
    if (d > today) return '<div class="c future"></div>';
    const f = dayFraction(map, d);
    return `<div class="c ${f >= 1 ? 'full' : ''} ${dayKey(d) === dayKey(today) ? 'today' : ''}" style="--a:${(0.05 + f * 0.55).toFixed(2)}"></div>`;
  }).join('');
  const heads = ['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((h) => `<div class="h">${h}</div>`).join('');

  // Log grouped by day
  const groups = new Map();
  [...db.sessions].sort((a, b) => b.start - a.start).forEach((s) => {
    const k = dayKey(s.start);
    if (!groups.has(k)) groups.set(k, []);
    groups.get(k).push(s);
  });
  const allGroups = [...groups.values()];
  const log = allGroups.slice(0, showAllHistory ? undefined : 7).map((list) => {
    const d = new Date(list[0].start);
    const complete = dayFraction(map, d) >= 1;
    const isToday = dayKey(d) === dayKey(new Date());
    const rows = list.map((s) => {
      const p = P[s.p];
      if (!p) return '';
      return `<button class="log-row" data-action="session" data-id="${s.id}" style="${gradStyle(p)}">
        ${tile(p, 'sm')}
        <span><b>${p.title}</b><small>${new Date(s.start).toLocaleTimeString(undefined, { hour: 'numeric', minute: '2-digit' })} · ${durLabel((s.end - s.start) / 1000)}</small></span>
        <span class="h ${s.health ? 'sent' : ''}">${icon('heart')}</span>
      </button>`;
    }).join('');
    return `<section class="log-day">
      <header><b>${isToday ? 'Today' : d.toLocaleDateString(undefined, { weekday: 'long', month: 'short', day: 'numeric' })}</b>
      ${complete ? `<span class="tag">${icon('check')}Complete</span>` : ''}</header>
      <div class="card log">${rows}</div>
    </section>`;
  }).join('');

  return `
    <header class="page-head"><div class="head-row">
      <div><p class="eyebrow">Your journey</p><h1 class="display">History</h1></div>
      <button class="icon-btn" data-action="manual" aria-label="Log a session">${icon('plus')}</button>
    </div></header>
    <div class="stat-grid">
      <div class="stat-card"><span class="flame-c">${icon('flame')}</span><b>${current}</b><span>current streak</span></div>
      <div class="stat-card"><span style="color:#ffd76b">${icon('trophy')}</span><b>${best}</b><span>best streak</span></div>
      <div class="stat-card"><span class="clock-c">${icon('clock')}</span><b>${Math.round(weekMin)}</b><span>min this week</span></div>
    </div>
    <h2 class="section-title">Last 14 days</h2>
    <section class="card"><div class="chart">${bars}</div><div class="chart-labels">${labels}</div><div class="legend">${legend}</div></section>
    <h2 class="section-title">Consistency</h2>
    <section class="card"><p class="muted small" style="margin:0">Days on which your whole routine was completed glow in saffron.</p><div class="cal">${heads}${cal}</div></section>
    ${db.sessions.length ? log + (allGroups.length > 7 && !showAllHistory ? `<button class="btn glass block show-all" data-action="show-all">Show all ${allGroups.length} days</button>` : '') : `<section class="card empty" style="margin-top:22px">${tile(P.shunya, 'lg')}<h3>Nothing here yet</h3><p class="muted small">Finish a practice and it will appear here.</p></section>`}`;
}

// ---------- Settings ----------

function stepper(action, id, value, label) {
  return `<div class="stepper">
    <button data-action="${action}" data-id="${id}" data-d="-1" aria-label="Decrease">${icon('minus')}</button>
    <span>${label}</span>
    <button data-action="${action}" data-id="${id}" data-d="1" aria-label="Increase">${icon('plus')}</button>
  </div>`;
}
const toggle = (action, on, id = '') => `<button class="switch ${on ? 'on' : ''}" data-action="${action}" data-id="${id}" role="switch" aria-checked="${on}"></button>`;

function renderSettings() {
  const h = S().health;
  const rows = PRACTICES.map((p) => {
    const open = openPractice === p.id;
    const bellMin = bellFor(p.id);
    return `<div>
      <button class="row ${open ? 'open' : ''}" data-action="expand" data-id="${p.id}">
        ${tile(p, 'sm')}
        <span class="grow"><b>${p.title}</b><small>${inRoutine(p.id) ? 'In daily routine' : 'Not in routine'}${bellMin ? ` · bell every ${bellMin} min` : ''}</small></span>
        <span class="val">${minutesFor(p.id)} min</span>${icon('chevron', 'chev')}
      </button>
      ${open ? `<div class="row-detail">
        <div class="field"><label>Duration</label>${stepper('step-min', p.id, minutesFor(p.id), `${minutesFor(p.id)} min`)}</div>
        <div class="field"><label>Interval bell<small>Rings during the session</small></label>${stepper('step-bell', p.id, bellMin, bellMin ? `${bellMin} min` : 'Off')}</div>
        <div class="field"><label>Part of daily routine<small>Counts towards your streak</small></label>${toggle('toggle-routine', inRoutine(p.id), p.id)}</div>
        <div class="field"><label>Apple Health</label><span class="muted small">${p.kind === 'yoga' ? 'Yoga workout' : 'Mindful Minutes'}</span></div>
      </div>` : ''}
    </div>`;
  }).join('');

  return `
    <header class="page-head"><p class="eyebrow">Make it yours</p><h1 class="display">Settings</h1></header>

    <h2 class="section-title">Practices</h2>
    <section class="card list">${rows}</section>

    <h2 class="section-title" id="health">Apple Health</h2>
    <section class="card">
      <div class="field"><label><b>Save sessions to Apple Health</b><small>Through two Apple Shortcuts, one tap after each session</small></label>${toggle('toggle-health', h.enabled)}</div>
      <p class="sub-head">One-time setup (about 2 minutes)</p>
      <ol class="steps-guide">
        <li>Open the <b>Shortcuts</b> app, tap <b>+</b> and name the shortcut <code>${esc(h.mindful)}</code>.</li>
        <li>Add the action <b>Log Health Sample</b>. Set the type to <b>Mindful Minutes</b>, then tap the value and choose <b>Shortcut Input</b>, in minutes.</li>
        <li>Open the shortcut's details (ⓘ) and turn on <b>Receive input</b> as <b>Text</b>, used when it's run from the app.</li>
        <li>Make a second shortcut named <code>${esc(h.yoga)}</code> with the action <b>Log Workout</b>. Set the type to <b>Yoga</b> and the duration to <b>Shortcut Input</b> minutes.</li>
        <li>Turn on the switch above. After each session, tap <b>Save to Apple Health</b>. The first time, allow Shortcuts to write to Health.</li>
      </ol>
      <p class="sub-head">Shortcut names</p>
      <div class="stack" style="display:grid;gap:8px">
        <input class="text-input" data-input="mindful" value="${esc(h.mindful)}" aria-label="Mindful shortcut name" autocapitalize="words">
        <input class="text-input" data-input="yoga" value="${esc(h.yoga)}" aria-label="Yoga shortcut name" autocapitalize="words">
      </div>
    </section>

    <h2 class="section-title">Timer</h2>
    <section class="card list">
      <div class="row"><span class="grow"><b>Bell when starting</b><small>A soft singing-bowl strike</small></span>${toggle('toggle-startbell', S().startBell)}</div>
      <div class="row"><span class="grow"><b>Keep screen awake</b><small>While a session is running</small></span>${toggle('toggle-awake', S().keepAwake)}</div>
      <button class="row" data-action="test-bell"><span class="grow"><b>Test the bell</b><small>Check your volume</small></span>${icon('bell')}</button>
    </section>

    <h2 class="section-title">Daily reminder</h2>
    <section class="card">
      <p class="muted small" style="margin:0">Web apps can't schedule reminders on iPhone, so use Shortcuts: <b>Automation</b> → <b>+</b> → <b>Time of Day</b> → choose your time → add <b>Show Notification</b> “Time for your sadhana 🙏”.</p>
    </section>

    <h2 class="section-title">Your data</h2>
    <section class="card list">
      <button class="row" data-action="export"><span class="grow"><b>Export backup</b><small>${db.sessions.length} sessions, saved as a file</small></span>${icon('download')}</button>
      <button class="row" data-action="import"><span class="grow"><b>Import backup</b><small>Restore from a file</small></span>${icon('upload')}</button>
      <button class="row" data-action="erase"><span class="grow"><b style="color:#ff8a8a">Erase all data</b><small>Can't be undone</small></span>${icon('trash')}</button>
    </section>

    <p class="foot">Sessions are stored only on this device.<br>Practise breathwork seated or lying down. Never in water or while driving.</p>`;
}

// ---------- Timer ----------

const sheet = document.getElementById('timer');
let T = null; // active run

function freshTimer(id) {
  return { id, duration: minutesFor(id) * 60, accumulated: 0, resumedAt: null, state: 'idle', bellsRung: 0, completedAt: null, sessionId: null, discarded: false };
}
const elapsed = () => (T ? Math.min(T.duration, T.accumulated + (T.resumedAt ? (Date.now() - T.resumedAt) / 1000 : 0)) : 0);
function persistTimer() { db.active = T; save(); }

function openRun(queue) {
  unlockAudio();
  T = { queue, index: 0, ...freshTimer(queue[0]) };
  persistTimer();
  showSheet();
}
function showSheet() {
  renderTimer();
  sheet.hidden = false;
  document.body.classList.add('sheet-open');
  requestAnimationFrame(() => requestAnimationFrame(() => sheet.classList.add('open')));
}
function closeTimer(immediate = false) {
  setAwake(false);
  T = null;
  persistTimer();
  sheet.classList.remove('open');
  document.body.classList.remove('sheet-open');
  const done = () => { sheet.hidden = true; sheet.innerHTML = ''; };
  if (immediate) done(); else setTimeout(done, 450);
  render();
}

const RING_SIZE = 300, RING_STROKE = 7;
const RING_C = 2 * Math.PI * ((RING_SIZE - RING_STROKE) / 2);

function renderTimer() {
  const p = P[T.id];
  const multi = T.queue.length > 1;
  const steps = multi ? `<div class="steps">${T.queue.map((_, i) => `<span class="${i < T.index ? 'done' : i === T.index ? 'now' : ''}"></span>`).join('')}</div>` : '';
  const video = p.video ? `
    <section class="card video-card">
      <div class="card-head"><h3>Guided video</h3><a href="https://youtu.be/${p.video}" target="_blank" rel="noopener">YouTube ${icon('external')}</a></div>
      <button class="video" data-action="play-video" style="background-image:url('https://i.ytimg.com/vi/${p.video}/hqdefault.jpg')" aria-label="Play guided video">
        <span class="play">${icon('play')}</span><span class="cap">Play alongside the timer</span>
      </button>
    </section>` : '';

  sheet.style.cssText = gradStyle(p);
  sheet.innerHTML = `<div class="sheet-inner">
    <div class="sheet-top">
      <button class="icon-btn" data-action="close-timer" aria-label="Close">${icon('close')}</button>
      ${steps}
      <span class="icon-btn ghost"></span>
    </div>
    <div class="timer-head">
      ${tile(p, 'lg')}
      <p class="eyebrow">${multi ? `Step ${T.index + 1} of ${T.queue.length}` : p.kind === 'yoga' ? 'Yoga' : 'Meditation'}</p>
      <h1 class="display">${p.title}</h1>
      <p class="muted">${p.subtitle}</p>
    </div>
    <div class="orb-wrap" id="t-orb">
      <div class="orb"></div>
      <svg viewBox="0 0 ${RING_SIZE} ${RING_SIZE}">
        <defs><linearGradient id="t-grad" x1="0" y1="0" x2="1" y2="1"><stop offset="0" style="stop-color:var(--g1)"/><stop offset="1" style="stop-color:var(--g2)"/></linearGradient></defs>
        <circle class="ring-track" cx="${RING_SIZE / 2}" cy="${RING_SIZE / 2}" r="${(RING_SIZE - RING_STROKE) / 2}" fill="none" stroke-width="${RING_STROKE}"/>
        <circle class="ring-progress" id="t-ring" cx="${RING_SIZE / 2}" cy="${RING_SIZE / 2}" r="${(RING_SIZE - RING_STROKE) / 2}" fill="none"
          stroke="url(#t-grad)" stroke-width="${RING_STROKE}" stroke-linecap="round" stroke-dasharray="${RING_C}" stroke-dashoffset="${RING_C}"/>
      </svg>
      <div class="orb-center">
        <div class="time" id="t-time"></div>
        <div id="t-sub"></div>
      </div>
    </div>
    <div id="t-controls"></div>
    ${video}
    <section class="card guide"><h3>How to practise</h3><ul>${p.guidance.map((g) => `<li>${g}</li>`).join('')}</ul></section>
  </div>`;
  sheet.scrollTop = 0;
  updateControls();
  updateClock();
}

// Re-renders only the parts that change with state, so a playing video isn't interrupted.
function updateControls() {
  if (!T) return;
  const p = P[T.id];
  document.getElementById('t-orb').className = `orb-wrap ${T.state}`;
  const bellMin = bellFor(T.id);
  const sub = document.getElementById('t-sub');
  sub.innerHTML = T.state === 'idle'
    ? `<div class="adjust">
        <button class="icon-btn" data-action="adjust" data-d="-1" aria-label="One minute less">${icon('minus')}</button>
        <span>${Math.round(T.duration / 60)} min</span>
        <button class="icon-btn" data-action="adjust" data-d="1" aria-label="One minute more">${icon('plus')}</button>
      </div>${bellMin ? `<span class="bell-note">${icon('bell')}Bell every ${bellMin} min</span>` : ''}`
    : `<span class="time-sub">${T.state === 'finished' ? 'complete' : T.state === 'paused' ? 'paused' : `of ${durLabel(T.duration)}`}</span>`;

  const c = document.getElementById('t-controls');
  if (T.state === 'idle') {
    c.innerHTML = `<div class="controls"><button class="btn primary lg block" data-action="begin">${icon('play')}Begin</button></div>`;
  } else if (T.state === 'running' || T.state === 'paused') {
    c.innerHTML = `<div class="controls two">
      <button class="btn primary lg" data-action="${T.state === 'running' ? 'pause' : 'resume'}">${icon(T.state === 'running' ? 'pause' : 'play')}${T.state === 'running' ? 'Pause' : 'Resume'}</button>
      <button class="btn glass lg" data-action="end">${icon('stop')}End</button>
    </div>`;
  } else {
    const next = T.queue[T.index + 1] ? P[T.queue[T.index + 1]] : null;
    const s = db.sessions.find((x) => x.id === T.sessionId);
    const health = s ? `<button class="btn glass lg block health ${s.health ? 'sent' : ''}" data-action="health" data-id="${s.id}">
        ${icon('heart')}${s.health ? 'Sent to Apple Health' : 'Save to Apple Health'}</button>` : '';
    c.innerHTML = `<section class="card complete">
      <div class="seal">${icon(s ? 'check' : 'close')}</div>
      <h2>${s ? 'Beautifully done' : 'Session discarded'}</h2>
      <p>${s ? `${durLabel((s.end - s.start) / 1000)} of ${p.title} logged` : 'Nothing was logged'}</p>
      <div class="stack">
        ${health}
        ${next ? `<button class="btn primary lg block" data-action="next" style="${gradStyle(next)}">Next: ${next.title} ${icon('chevron')}</button>` : ''}
        <button class="btn ${next ? 'text' : 'glass lg'} block" data-action="close-timer">${next ? 'Finish for now' : 'Done'}</button>
      </div>
    </section>`;
  }
}

function updateClock() {
  if (!T) return;
  const e = elapsed();
  const remaining = T.duration - e;
  const timeEl = document.getElementById('t-time');
  const ringEl = document.getElementById('t-ring');
  if (timeEl) timeEl.textContent = clock(T.state === 'finished' ? e : remaining);
  if (ringEl) {
    ringEl.style.opacity = e > 0 ? 1 : 0; // a zero-length round cap would still draw a dot
    ringEl.setAttribute('stroke-dashoffset', RING_C * (1 - e / T.duration));
  }
}

function begin() {
  unlockAudio();
  if (T.state === 'idle' && S().startBell) bell(1);
  T.resumedAt = Date.now();
  T.state = 'running';
  persistTimer();
  setAwake(true);
  updateControls();
}
function pause() {
  T.accumulated = elapsed();
  T.resumedAt = null;
  T.state = 'paused';
  persistTimer();
  setAwake(false);
  updateControls();
}
function finish({ early, keep }) {
  const now = Date.now();
  let end = now;
  if (!early && T.resumedAt) end = T.resumedAt + (T.duration - T.accumulated) * 1000;
  T.accumulated = early ? elapsed() : T.duration;
  T.resumedAt = null;
  T.state = 'finished';
  T.completedAt = end;
  if (keep && T.accumulated >= 1) {
    const s = { id: uid(), p: T.id, start: end - T.accumulated * 1000, end, health: false };
    db.sessions.push(s);
    T.sessionId = s.id;
  }
  persistTimer();
  setAwake(false);
  if (!early && now - end < 3000) bell(3);
  updateControls();
  updateClock();
}

function tick() {
  if (!T || T.state !== 'running') return;
  const e = elapsed();
  if (e >= T.duration) { finish({ early: false, keep: true }); return; }
  const bellMin = bellFor(T.id);
  if (bellMin) {
    const interval = bellMin * 60;
    const due = Math.floor(e / interval);
    if (due > T.bellsRung) {
      T.bellsRung = due;
      persistTimer();
      if (e - due * interval < 3) bell(1);
    }
  }
  updateClock();
}
setInterval(tick, 250);

function confirmEnd(closeAfter) {
  const e = elapsed();
  actionSheet({
    title: `End ${P[T.id].title}?`,
    lead: `You've practised for ${durLabel(e)}.`,
    actions: [
      ...(e >= 1 ? [{ label: `Save ${durLabel(e)}`, style: 'primary lg', grad: P[T.id], run: () => { finish({ early: true, keep: true }); if (closeAfter) closeTimer(); } }] : []),
      { label: 'Discard', style: 'glass lg danger', run: () => { finish({ early: true, keep: false }); if (closeAfter) closeTimer(); } },
    ],
  });
}

// ---------- Manual log ----------

let manual = null;
function openManual() {
  const start = new Date(Date.now() - 30 * 60000);
  start.setSeconds(0, 0);
  manual = { p: 'kapalbhati', minutes: minutesFor('kapalbhati'), start };
  renderManual();
}
function renderManual() {
  const local = new Date(manual.start.getTime() - manual.start.getTimezoneOffset() * 60000).toISOString().slice(0, 16);
  const chips = PRACTICES.map((p) => `<button class="chip ${manual.p === p.id ? 'on' : ''}" style="${gradStyle(p)}" data-action="manual-pick" data-id="${p.id}">${tile(p)}${p.title.split(' ')[0]}</button>`).join('');
  openModal(`<h2>Log a session</h2><p class="lead">For practice you did without the timer.</p>
    <div class="chips">${chips}</div>
    <div class="stack" style="margin-top:16px">
      <div class="field"><label>Started</label><input class="text-input" style="width:auto" type="datetime-local" data-input="manual-start" value="${local}"></div>
      <div class="field"><label>Duration</label>${stepper('manual-step', '', manual.minutes, `${manual.minutes} min`)}</div>
      <button class="btn primary lg block" data-action="manual-save" style="${gradStyle(P[manual.p])}">${icon('check')}Save session</button>
      <button class="btn text block" data-action="modal-close">Cancel</button>
    </div>`);
}

// ---------- Backup ----------

async function exportData() {
  const name = `sadhana-backup-${new Date().toISOString().slice(0, 10)}.json`;
  const blob = new Blob([JSON.stringify({ app: 'sadhana', version: 1, sessions: db.sessions, settings: db.settings }, null, 2)], { type: 'application/json' });
  const file = new File([blob], name, { type: 'application/json' });
  if (navigator.canShare && navigator.canShare({ files: [file] })) {
    try { await navigator.share({ files: [file], title: 'Sadhana backup' }); return; } catch { /* cancelled */ return; }
  }
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = name;
  a.click();
  setTimeout(() => URL.revokeObjectURL(a.href), 2000);
}
document.getElementById('import-file').addEventListener('change', async (e) => {
  const file = e.target.files[0];
  e.target.value = '';
  if (!file) return;
  try {
    const data = JSON.parse(await file.text());
    if (!Array.isArray(data.sessions)) throw new Error('bad file');
    const valid = data.sessions.filter((s) => s && P[s.p] && Number.isFinite(s.start) && Number.isFinite(s.end));
    const known = new Set(db.sessions.map((s) => s.id));
    valid.forEach((s) => { if (!known.has(s.id)) db.sessions.push({ id: String(s.id || uid()), p: s.p, start: s.start, end: s.end, health: !!s.health }); });
    if (data.settings) db.settings = { ...db.settings, ...data.settings, health: { ...db.settings.health, ...(data.settings.health || {}) } };
    save();
    render();
    toast(`Imported ${valid.length} sessions`);
  } catch {
    toast('That file isn’t a Sadhana backup');
  }
});

// ---------- Events ----------

const clampMin = (v) => Math.min(180, Math.max(1, v));
const actions = {
  start: (el) => openRun([el.dataset.id]),
  routine: () => {
    const done = new Set(sessionsOn(new Date()).map((s) => s.p));
    const r = routine();
    const remaining = r.filter((id) => !done.has(id));
    openRun(remaining.length ? remaining : r);
  },
  'dismiss-install': () => { S().installDismissed = true; save(); render(); },
  adjust: (el) => { T.duration = clampMin(Math.round(T.duration / 60) + Number(el.dataset.d)) * 60; persistTimer(); updateControls(); updateClock(); },
  begin,
  resume: begin,
  pause,
  end: () => confirmEnd(false),
  'close-timer': () => { if (T && (T.state === 'running' || T.state === 'paused')) confirmEnd(true); else closeTimer(); },
  next: () => { T = { ...T, ...freshTimer(T.queue[T.index + 1]), index: T.index + 1 }; persistTimer(); renderTimer(); },
  health: (el) => sendToHealth(el.dataset.id),
  'play-video': (el) => {
    const id = P[T.id].video;
    el.outerHTML = `<div class="video"><iframe src="https://www.youtube.com/embed/${id}?playsinline=1&rel=0&autoplay=1" title="${esc(P[T.id].title)} guide"
      allow="autoplay; encrypted-media; picture-in-picture; fullscreen" allowfullscreen referrerpolicy="strict-origin-when-cross-origin"></iframe></div>`;
  },
  'show-all': () => { showAllHistory = true; render(); },
  manual: openManual,
  'manual-pick': (el) => { manual.p = el.dataset.id; manual.minutes = minutesFor(el.dataset.id); renderManual(); },
  'manual-step': (el) => { manual.minutes = clampMin(manual.minutes + Number(el.dataset.d)); renderManual(); },
  'manual-save': () => {
    const length = manual.minutes * 60000;
    const start = Math.min(manual.start.getTime(), Date.now() - length);
    db.sessions.push({ id: uid(), p: manual.p, start, end: start + length, health: false });
    save();
    closeModal();
    render();
    toast('Session logged');
  },
  session: (el) => {
    const s = db.sessions.find((x) => x.id === el.dataset.id);
    if (!s) return;
    const p = P[s.p];
    actionSheet({
      title: p.title,
      lead: `${new Date(s.start).toLocaleString(undefined, { weekday: 'short', month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' })} · ${durLabel((s.end - s.start) / 1000)}`,
      actions: [
        { label: s.health ? 'Send to Apple Health again' : 'Save to Apple Health', icon: 'heart', run: () => { closeModal(); sendToHealth(s.id); } },
        { label: 'Delete session', icon: 'trash', style: 'glass danger', run: () => {
          db.sessions = db.sessions.filter((x) => x.id !== s.id);
          save(); closeModal(); render();
          toast(s.health ? 'Deleted. Remove it in the Health app too' : 'Session deleted');
        } },
      ],
    });
  },
  expand: (el) => { openPractice = openPractice === el.dataset.id ? null : el.dataset.id; render(); },
  'step-min': (el) => { S().minutes[el.dataset.id] = clampMin(minutesFor(el.dataset.id) + Number(el.dataset.d)); save(); render(); },
  'step-bell': (el) => { S().bells[el.dataset.id] = Math.min(30, Math.max(0, bellFor(el.dataset.id) + Number(el.dataset.d))); save(); render(); },
  'toggle-routine': (el) => { S().routine[el.dataset.id] = !inRoutine(el.dataset.id); save(); render(); },
  'toggle-health': () => { S().health.enabled = !S().health.enabled; save(); render(); },
  'toggle-startbell': () => { S().startBell = !S().startBell; save(); render(); },
  'toggle-awake': () => { S().keepAwake = !S().keepAwake; save(); render(); },
  'test-bell': () => { unlockAudio(); bell(1); },
  export: exportData,
  import: () => document.getElementById('import-file').click(),
  erase: () => actionSheet({
    title: 'Erase everything?',
    lead: 'All sessions and settings on this device will be deleted.',
    actions: [{ label: 'Erase all data', style: 'glass lg danger', icon: 'trash', run: () => {
      db = JSON.parse(JSON.stringify(DEFAULTS)); save(); closeModal(); render(); toast('All data erased');
    } }],
  }),
  'modal-close': closeModal,
  'modal-run': (el) => {
    const fn = modalHandlers[el.dataset.key];
    closeModal();
    fn?.();
  },
};

document.addEventListener('click', (e) => {
  const tabBtn = e.target.closest('[data-tab]');
  if (tabBtn) { if (tabBtn.dataset.tab !== tab) go(tabBtn.dataset.tab); return; }
  const el = e.target.closest('[data-action]');
  if (el && actions[el.dataset.action]) actions[el.dataset.action](el, e);
});

document.addEventListener('input', (e) => {
  const key = e.target.dataset?.input;
  if (key === 'mindful' || key === 'yoga') { S().health[key] = e.target.value.trim() || DEFAULTS.settings.health[key]; save(); }
  if (key === 'manual-start' && e.target.value) {
    const d = new Date(e.target.value);
    if (!Number.isNaN(d.getTime())) manual.start = d;
  }
});

document.addEventListener('visibilitychange', () => {
  if (document.visibilityState !== 'visible') return;
  tick();
  if (T && T.state === 'running') setAwake(true);
  if (!T) render(); // the date may have changed
});

// ---------- Boot ----------

render();
if (db.active && P[db.active.id]) {
  T = db.active;
  showSheet();
  tick();
} else if (db.active) {
  db.active = null;
  save();
}

if ('serviceWorker' in navigator && location.protocol === 'https:') {
  navigator.serviceWorker.register('sw.js').catch(() => {});
}
