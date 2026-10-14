// One audio engine for the whole site: the beat deck (the client's beats, one after another
// while "sound" is on). Songs are not played here; they open on YouTube. Browsers only allow
// sound after a click or key press, so nothing starts until the visitor asks for it.
import { useSyncExternalStore } from 'react';
import { BEATS, findBeat, isBeat } from '../content/music';
import { BRAND } from '../config/brand';

const FADE_MS = 220;

let state = { sound: false, current: null, playing: false, beat: BEATS[0].id };
const subs = new Set();
const emit = (patch) => {
  state = { ...state, ...patch };
  subs.forEach((fn) => fn());
};

let beatEl = null;
let ctx = null;
let analyser = null;
let bins = null;
let switchToken = 0;
const gains = new WeakMap();

function connect(el) {
  if (!ctx || !el || gains.has(el)) return;
  try {
    const gain = ctx.createGain();
    ctx.createMediaElementSource(el).connect(gain);
    gain.connect(analyser);
    gains.set(el, gain);
  } catch {
    /* already wired or unsupported: audio still plays, the visualiser stays flat */
  }
}

function ensureContext() {
  const AC = window.AudioContext || window.webkitAudioContext;
  if (!AC) return;
  if (!ctx) {
    try {
      ctx = new AC();
    } catch {
      return;
    }
    analyser = ctx.createAnalyser();
    analyser.fftSize = 128;
    analyser.smoothingTimeConstant = 0.8;
    analyser.connect(ctx.destination);
    bins = new Uint8Array(analyser.frequencyBinCount);
  }
  if (ctx.state === 'suspended') ctx.resume().catch(() => {});
  connect(beatEl);
}

/* Fade an element's level. Uses the gain node when wired, element volume otherwise. */
function fade(el, to, ms = FADE_MS) {
  const gain = gains.get(el);
  if (gain && ctx) {
    const t = ctx.currentTime;
    gain.gain.cancelScheduledValues(t);
    gain.gain.setValueAtTime(gain.gain.value, t);
    gain.gain.linearRampToValueAtTime(to, t + ms / 1000);
  } else {
    try {
      el.volume = to;
    } catch {
      /* volume is read-only on some mobile browsers */
    }
  }
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

function setLevel(el, v) {
  const gain = gains.get(el);
  if (gain && ctx) {
    gain.gain.cancelScheduledValues(ctx.currentTime);
    gain.gain.setValueAtTime(v, ctx.currentTime);
  } else {
    try {
      el.volume = v;
    } catch {
      /* read-only volume */
    }
  }
}

function beatPlayer() {
  if (!beatEl) {
    beatEl = new Audio();
    beatEl.preload = 'none';
    beatEl.addEventListener('ended', () => {
      if (state.current === beatEl.dataset.id && state.sound) audio.nextBeat(1);
    });
    connect(beatEl);
  }
  return beatEl;
}

function mediaSession(title, artist) {
  if (!('mediaSession' in navigator)) return;
  const ms = navigator.mediaSession;
  if (typeof window.MediaMetadata === 'function') {
    ms.metadata = new window.MediaMetadata({
      title,
      artist,
      album: BRAND.name,
      artwork: [{ src: '/icon-512.png', sizes: '512x512', type: 'image/png' }],
    });
  }
  const set = (action, fn) => {
    try {
      ms.setActionHandler(action, fn);
    } catch {
      /* action not supported by this browser */
    }
  };
  set('nexttrack', () => audio.nextBeat(1));
  set('previoustrack', () => audio.nextBeat(-1));
  set('pause', () => audio.stopAll());
  set('play', () => audio.playBeat());
}

function play(el) {
  let p;
  try {
    p = el.play();
  } catch {
    emit({ playing: false });
    return;
  }
  if (p) p.catch(() => emit({ playing: false }));
}

async function startBeat(id = state.beat) {
  const b = findBeat(id) || BEATS[0];
  const el = beatPlayer();
  const token = ++switchToken;
  const switching = !el.paused && el.dataset.id && el.dataset.id !== b.id;
  if (switching) {
    await fade(el, 0);
    if (token !== switchToken) return;
  }
  if (el.dataset.id !== b.id) {
    el.src = b.src;
    el.dataset.id = b.id;
  }
  if (switching) el.currentTime = 0;
  setLevel(el, switching ? 0 : 0.85);
  play(el);
  if (switching) fade(el, 0.85);
  mediaSession(b.title, b.credit || BRAND.producer);
  emit({ current: b.id, beat: b.id, playing: true });
}

export const audio = {
  subscribe(fn) {
    subs.add(fn);
    return () => subs.delete(fn);
  },
  get: () => state,

  /* Sound switch: on plays the selected beat, off silences everything. Must run from a click. */
  toggleSound() {
    if (state.sound) {
      this.stopAll();
      return;
    }
    beatPlayer();
    ensureContext();
    emit({ sound: true });
    startBeat();
  },

  /* Start a beat (the selected one by default). Click or key press only. */
  playBeat(id = state.beat) {
    beatPlayer();
    ensureContext();
    emit({ sound: true });
    startBeat(id);
  },

  /* Pick a beat in the crate. Switches straight away if a beat is already playing. */
  selectBeat(id) {
    if (!findBeat(id)) return;
    if (isBeat(state.current) && state.playing) startBeat(id);
    else emit({ beat: id });
  },

  nextBeat(dir = 1) {
    const i = BEATS.findIndex((b) => b.id === state.beat);
    const next = BEATS[(i + dir + BEATS.length) % BEATS.length].id;
    this.selectBeat(next);
  },

  stopAll() {
    switchToken += 1;
    beatEl?.pause();
    emit({ sound: false, current: null, playing: false });
  },

  /* Jump to a point (0 to 1) in the playing beat. */
  seek(fraction) {
    const el = beatEl;
    if (!el || !state.playing || !Number.isFinite(el.duration)) return;
    el.currentTime = Math.min(Math.max(fraction, 0), 0.999) * el.duration;
  },

  /* Playback position of the beat, read inside rAF loops (no re-renders). */
  progress() {
    const el = beatEl;
    if (!el || !state.playing) return { t: 0, d: 0 };
    return { t: el.currentTime || 0, d: Number.isFinite(el.duration) ? el.duration : 0 };
  },

  levels() {
    if (!analyser || !state.playing) return null;
    analyser.getByteFrequencyData(bins);
    return bins;
  },
};

export function useAudio() {
  return useSyncExternalStore(audio.subscribe, audio.get, audio.get);
}
