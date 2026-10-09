import { useEffect, useRef } from 'react';
import { useReducedMotion } from 'framer-motion';
import { BRAND } from '../config/brand';
import { BEATS, findBeat } from '../content/music';
import { MSG } from '../content/messages';
import { audio, useAudio } from '../lib/audio';
import { BrandIcon, Icon } from './Icon';
import { Picture } from './ui';
import { Wave } from './Sound';
import { whatsappLink } from '../lib/contact';
import { useProgress } from '../lib/useProgress';

const RPM = 33.333;
const DEG_PER_MS = (RPM * 360) / 60000;

/* Platter spin, tonearm-free: angle eases up to 33 1/3 rpm on play and spins down on stop.
   The ring around the record is the live spectrum from the analyser. One rAF loop, only
   while the deck is on screen and moving. */
function useDeckMotion(rootRef, platterRef, ringRef, playing, peaks) {
  const reduce = useReducedMotion();
  useEffect(() => {
    const root = rootRef.current;
    const platter = platterRef.current;
    const ring = ringRef.current;
    if (!root || !platter || !ring) return undefined;
    const g = ring.getContext('2d');
    if (!g) return undefined;

    let size = 0;
    let dpr = 1;
    const fit = () => {
      dpr = Math.min(2, window.devicePixelRatio || 1);
      size = ring.clientWidth;
      ring.width = Math.round(size * dpr);
      ring.height = Math.round(size * dpr);
      g.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    fit();
    const ro = new ResizeObserver(() => {
      fit();
      draw(null);
    });
    ro.observe(ring);

    const color = getComputedStyle(ring).color;
    const N = 96;
    const smooth = new Float32Array(N).fill(0);

    function draw(levels) {
      if (!size) return;
      const c = size / 2;
      const r0 = c * 0.8;
      const max = c * 0.17;
      g.clearRect(0, 0, size, size);
      g.strokeStyle = color;
      g.lineCap = 'round';
      g.lineWidth = Math.max(1.5, size / 220);
      for (let i = 0; i < N; i += 1) {
        const idle = ((peaks[Math.floor((i / N) * peaks.length)] || 0) / 100) * 0.3;
        let v = idle;
        if (levels) {
          // Four mirrored arcs, so the low end shows all the way round the record.
          const q = N / 4;
          const j = i % q;
          const k = Math.floor(i / q) % 2 ? q - 1 - j : j;
          const idx = Math.floor((k / q) * levels.length * 0.55);
          v = Math.max(idle * 0.6, levels[idx] / 255);
        }
        smooth[i] += (v - smooth[i]) * 0.4;
        const len = 2 + smooth[i] * max;
        const a = (i / N) * Math.PI * 2 - Math.PI / 2;
        const cos = Math.cos(a);
        const sin = Math.sin(a);
        g.globalAlpha = 0.35 + smooth[i] * 0.65;
        g.beginPath();
        g.moveTo(c + cos * r0, c + sin * r0);
        g.lineTo(c + cos * (r0 + len), c + sin * (r0 + len));
        g.stroke();
      }
      g.globalAlpha = 1;
    }

    if (reduce) {
      for (let i = 0; i < 6; i += 1) draw(null);
      return () => ro.disconnect();
    }

    let visible = true;
    let raf = 0;
    let last = 0;
    let angle = Number(platter.dataset.angle || 0);
    let speed = Number(platter.dataset.speed || 0);
    const target = playing ? DEG_PER_MS : 0;

    const tick = (now) => {
      const dt = last ? Math.min(64, now - last) : 16;
      last = now;
      speed += (target - speed) * (playing ? 0.045 : 0.03);
      angle = (angle + speed * dt) % 360;
      platter.style.transform = `rotate(${angle.toFixed(2)}deg)`;
      platter.dataset.angle = String(angle);
      platter.dataset.speed = String(speed);
      const lv = playing ? audio.levels() : null;
      draw(lv);
      if (lv) {
        const bass = (lv[1] + lv[2] + lv[3]) / (3 * 255);
        root.style.setProperty('--bass', bass.toFixed(3));
      } else {
        root.style.setProperty('--bass', '0');
      }
      const moving = playing || speed > 0.0005;
      if (visible && moving) raf = requestAnimationFrame(tick);
      else raf = 0;
    };
    const start = () => {
      if (!raf) {
        last = 0;
        raf = requestAnimationFrame(tick);
      }
    };

    const io = new IntersectionObserver(([e]) => {
      visible = e.isIntersecting;
      if (visible) start();
    });
    io.observe(root);
    draw(null);
    start();

    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
      ro.disconnect();
    };
  }, [rootRef, platterRef, ringRef, playing, peaks, reduce]);
}

/* Click or arrow keys to move through the beat. */
function Scrubber({ beat, active, timeRef, sliderRef }) {
  const onPointer = (e) => {
    if (!active) return;
    const r = e.currentTarget.getBoundingClientRect();
    audio.seek((e.clientX - r.left) / r.width);
  };
  const onKey = (e) => {
    if (!active) return;
    const { t, d } = audio.progress();
    if (!d) return;
    let next = null;
    if (e.key === 'ArrowRight') next = (t + 5) / d;
    if (e.key === 'ArrowLeft') next = (t - 5) / d;
    if (e.key === 'Home') next = 0;
    if (next !== null) {
      e.preventDefault();
      e.stopPropagation();
      audio.seek(next);
    }
  };
  return (
    <div
      className="deck__scrub"
      ref={sliderRef}
      role="slider"
      tabIndex={active ? 0 : -1}
      aria-label={`Position in ${beat.title}`}
      aria-valuemin={0}
      aria-valuemax={Math.floor(beat.durationSec)}
      aria-valuenow={0}
      aria-valuetext={active ? `Playing ${beat.title}` : `${beat.title}, ${beat.duration}, stopped`}
      aria-disabled={!active}
      onPointerDown={onPointer}
      onKeyDown={onKey}
    >
      <Wave peaks={beat.wave} />
      <span className="deck__time">
        <span ref={timeRef}>0:00</span> / {beat.duration}
      </span>
    </div>
  );
}

export function Deck({ id = 'deck', kicker = 'The deck', title, lead, photo = 'studio-wide' }) {
  const s = useAudio();
  const beat = findBeat(s.beat) || BEATS[0];
  const rootRef = useRef(null);
  const platterRef = useRef(null);
  const ringRef = useRef(null);
  const timeRef = useRef(null);
  const sliderRef = useRef(null);
  const active = useProgress(beat.id, rootRef, timeRef, sliderRef);
  useDeckMotion(rootRef, platterRef, ringRef, active, beat.wave);

  const toggle = () => (active ? audio.stopAll() : audio.playBeat(beat.id));
  const onKey = (e) => {
    const tag = e.target.tagName;
    if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'A') return;
    if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') {
      e.preventDefault();
      audio.nextBeat(e.key === 'ArrowRight' ? 1 : -1);
    } else if (e.key === ' ' && tag !== 'BUTTON') {
      e.preventDefault();
      toggle();
    }
  };

  return (
    <section className={`deck${active ? ' is-playing' : ''}`} ref={rootRef} aria-labelledby={`${id}-title`} onKeyDown={onKey}>
      <div className="deck__room" aria-hidden="true">
        <Picture slug={photo} alt="" sizes="100vw" />
      </div>
      <div className="wrap deck__inner">
        <div className="deck__head">
          <p className="kicker">
            <span className="kicker__dot" aria-hidden="true" />
            <span>{kicker}</span>
          </p>
          <h2 className="h2" id={`${id}-title`}>
            {title}
          </h2>
          {lead ? <p className="lead">{lead}</p> : null}
        </div>

        <div className="deck__unit">
          <div className="deck__table" aria-hidden="true">
            <canvas className="deck__ring" ref={ringRef} />
            <div className="deck__platter" ref={platterRef}>
              <div className="deck__record">
                <span className="deck__label">
                  <img src={BRAND.logo.icon} alt="" width="56" height="45" />
                  <b>{beat.title}</b>
                  <small>{beat.credit || BRAND.name}</small>
                </span>
              </div>
            </div>
            <span className="deck__spindle" />
            <span className="deck__arm">
              <span className="deck__arm-rod" />
              <span className="deck__arm-head" />
            </span>
            <span className="deck__pivot" />
          </div>

          <div className="deck__panel">
            <p className="deck__status" aria-live="polite">
              <span className="deck__led" aria-hidden="true" />
              {active ? 'Now playing' : 'Ready'} · Beat {beat.num} of {String(BEATS.length).padStart(2, '0')}
            </p>
            <p className="deck__title" key={beat.id} style={{ '--n': beat.title.length }}>
              <span>{beat.title}</span>
            </p>
            <p className="deck__credit">{beat.credit || `From the ${BRAND.name} crate`}</p>

            <Scrubber beat={beat} active={active} timeRef={timeRef} sliderRef={sliderRef} />

            <div className="deck__transport">
              <button type="button" className="deck__skip" onClick={() => audio.nextBeat(-1)} aria-label="Previous beat">
                <Icon name="skipPrev" size={20} />
              </button>
              <button type="button" className="deck__play" onClick={toggle} aria-pressed={active} aria-label={active ? `Stop ${beat.title}` : `Play ${beat.title}`}>
                <Icon name={active ? 'pause' : 'play'} size={26} />
              </button>
              <button type="button" className="deck__skip" onClick={() => audio.nextBeat(1)} aria-label="Next beat">
                <Icon name="skipNext" size={20} />
              </button>
            </div>

            <ul className="deck__crate" aria-label="Beats">
              {BEATS.map((b) => {
                const on = b.id === beat.id;
                return (
                  <li key={b.id}>
                    <button type="button" className={`deck__slot${on ? ' is-on' : ''}`} aria-pressed={on} onClick={() => (on && active ? audio.stopAll() : audio.playBeat(b.id))}>
                      <span className="deck__slot-num">{b.num}</span>
                      <span className="deck__slot-title">{b.title}</span>
                      <span className="deck__slot-dur">{b.duration}</span>
                    </button>
                  </li>
                );
              })}
            </ul>

            <a className="btn btn--ghost btn--sm deck__ask" href={whatsappLink(MSG.beat(beat))} target="_blank" rel="noopener noreferrer">
              <BrandIcon name="whatsapp" size={16} /> Want this sound? Ask {BRAND.producer}
            </a>
            <p className="deck__keys body-dim">Space plays and stops. Arrow keys switch beats.</p>
          </div>
        </div>
      </div>
    </section>
  );
}
