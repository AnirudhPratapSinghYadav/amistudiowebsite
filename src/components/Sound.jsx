import { useEffect, useRef } from 'react';
import { useReducedMotion } from 'framer-motion';
import { audio, useAudio } from '../lib/audio';
import { useProgress } from '../lib/useProgress';
import { BEATS, findBeat } from '../content/music';
import { Icon } from './Icon';

/* Live level bars from the analyser. Colour comes from the canvas's CSS `color`. */
export function Levels({ bars = 5, active, className = '' }) {
  const ref = useRef(null);
  const reduce = useReducedMotion();
  useEffect(() => {
    const c = ref.current;
    if (!c) return undefined;
    const g = c.getContext('2d');
    const dpr = Math.min(2, window.devicePixelRatio || 1);
    const w = c.clientWidth || 20;
    const h = c.clientHeight || 16;
    c.width = w * dpr;
    c.height = h * dpr;
    g.scale(dpr, dpr);
    const color = getComputedStyle(c).color;
    const cur = new Array(bars).fill(0.2);
    const gap = 2;
    const bw = (w - gap * (bars - 1)) / bars;
    let raf = 0;
    let t = 0;
    const draw = () => {
      const lv = active && !reduce ? audio.levels() : null;
      t += 1;
      g.clearRect(0, 0, w, h);
      g.fillStyle = color;
      for (let i = 0; i < bars; i += 1) {
        let target = 0.2;
        if (lv) {
          const idx = Math.min(lv.length - 1, Math.floor(((i + 0.5) * lv.length * 0.6) / bars));
          target = Math.max(0.14, lv[idx] / 255);
        } else if (active && !reduce) {
          target = 0.35 + 0.3 * Math.sin(t / 7 + i);
        }
        cur[i] += (target - cur[i]) * 0.35;
        const bh = Math.max(2, cur[i] * h);
        g.fillRect(i * (bw + gap), h - bh, bw, bh);
      }
      if (active && !reduce) raf = requestAnimationFrame(draw);
    };
    draw();
    return () => cancelAnimationFrame(raf);
  }, [active, bars, reduce]);
  return <canvas ref={ref} className={`levels ${className}`} aria-hidden="true" />;
}

/* Waveform from precomputed peaks. The filled copy is clipped by --p on a parent. */
export function Wave({ peaks, className = '' }) {
  return (
    <div className="wave-wrap" aria-hidden="true">
      <span className={`wave ${className}`}>
        {peaks.map((p, i) => (
          <i key={i} style={{ '--h': Math.max(8, p) / 100 }} />
        ))}
      </span>
      <span className={`wave wave--fill ${className}`}>
        {peaks.map((p, i) => (
          <i key={i} style={{ '--h': Math.max(8, p) / 100 }} />
        ))}
      </span>
    </div>
  );
}

/* Header switch. On plays the beat around the site, off silences everything. */
export function SoundToggle({ className = '' }) {
  const s = useAudio();
  return (
    <button
      type="button"
      className={`sound-btn${s.sound ? ' is-on' : ''} ${className}`}
      onClick={() => audio.toggleSound()}
      aria-pressed={s.sound}
      title={s.sound ? 'Sound on. Hover a release to hear it.' : `Turn sound on: ${(findBeat(s.beat) || BEATS[0]).title}`}
    >
      <Levels bars={4} active={s.playing} />
      <span className="sound-btn__txt">
        Sound <b>{s.sound ? 'On' : 'Off'}</b>
      </span>
    </button>
  );
}

/* Compact player for the client's beats. Plays only when pressed; the arrow switches beats. */
export function BeatPlayer({ className = '', label = 'Press play' }) {
  const s = useAudio();
  const beat = findBeat(s.beat) || BEATS[0];
  const ref = useRef(null);
  const timeRef = useRef(null);
  const active = useProgress(beat.id, ref, timeRef);
  const onClick = () => {
    if (active) audio.stopAll();
    else audio.playBeat(beat.id);
  };
  return (
    <div className={`beat${active ? ' is-playing' : ''} ${className}`} ref={ref}>
      <button type="button" className="beat__btn" onClick={onClick} aria-pressed={active} aria-label={active ? `Stop ${beat.title}` : `Play ${beat.title}`}>
        <Icon name={active ? 'pause' : 'play'} size={20} />
      </button>
      <div className="beat__body">
        <div className="beat__meta">
          <span className="beat__kind">{active ? 'Now playing' : s.current && s.playing ? 'Paused for a preview' : label}</span>
          <strong className="beat__title" key={beat.id}>
            {beat.title}
          </strong>
          <span className="beat__time">
            <span ref={timeRef}>0:00</span> / {beat.duration}
          </span>
        </div>
        <Wave peaks={beat.wave} />
      </div>
      {BEATS.length > 1 ? (
        <button type="button" className="beat__next" onClick={() => audio.nextBeat(1)} aria-label={`Switch beat. Now on ${beat.title}, beat ${beat.num} of ${BEATS.length}`}>
          <Icon name="skipNext" size={16} />
          <span aria-hidden="true">
            {beat.num}/{String(BEATS.length).padStart(2, '0')}
          </span>
        </button>
      ) : null}
    </div>
  );
}
