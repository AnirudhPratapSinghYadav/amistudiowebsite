import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { AnimatePresence, motion, useScroll, useTransform, useReducedMotion } from 'framer-motion';
import { BRAND } from '../config/brand';
import { CHAIN, GENRES, HOURLY, QUOTES, ROOM_SPOTS, PREP } from '../content/site';
import { MSG } from '../content/messages';
import { whatsappLink } from '../lib/contact';
import { BrandIcon, Icon } from './Icon';
import { Picture } from './ui';

/* Live REC timecode: hh:mm:ss:ff since the page opened. */
export function Timecode() {
  const ref = useRef(null);
  useEffect(() => {
    const pad = (n) => String(n).padStart(2, '0');
    const start = performance.now();
    let raf = 0;
    let last = -1;
    const tick = (now) => {
      const t = now - start;
      const f = Math.floor((t % 1000) / (1000 / 30));
      if (f !== last && ref.current) {
        last = f;
        const s = Math.floor(t / 1000);
        ref.current.textContent = `${pad(Math.floor(s / 3600))}:${pad(Math.floor(s / 60) % 60)}:${pad(s % 60)}:${pad(f)}`;
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);
  return (
    <span className="rec__time" aria-hidden="true" ref={ref}>
      00:00:00:00
    </span>
  );
}

/* Cost meter for the hourly services. Only uses confirmed hourly rates. */
export function SessionMeter() {
  const [hours, setHours] = useState(2);
  const [svc, setSvc] = useState(HOURLY[0].id);
  const service = HOURLY.find((s) => s.id === svc) || HOURLY[0];
  const rate = service.hourly;
  const min = 1;
  const max = 10;
  const total = hours * rate;
  const pct = ((hours - min) / (max - min)) * 100;

  return (
    <div className="meter">
      <div className="meter__head">
        <span className="meter__label">Session meter</span>
        <div className="seg seg--sm" role="radiogroup" aria-label="Service">
          {HOURLY.map((s) => (
            <label key={s.id}>
              <input type="radio" name="meter-service" value={s.id} checked={svc === s.id} onChange={() => setSvc(s.id)} />
              <span>
                {s.name} · {s.rateShort}
              </span>
            </label>
          ))}
        </div>
      </div>
      <div className="meter__readout" aria-live="polite">
        <AnimatePresence mode="popLayout" initial={false}>
          <motion.span
            key={total}
            className="meter__total"
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -30, opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <small>{BRAND.currency}</small>
            {total}
          </motion.span>
        </AnimatePresence>
        <span className="meter__calc">
          <b>{hours} {hours === 1 ? 'hour' : 'hours'}</b> × {BRAND.currency}{rate}
        </span>
      </div>
      <div className="meter__control">
        <button type="button" className="meter__step" onClick={() => setHours((h) => Math.max(min, h - 1))} disabled={hours <= min} aria-label="One hour less">
          <Icon name="minus" size={18} />
        </button>
        <label className="sr-only" htmlFor="meter-hours">Hours</label>
        <input
          id="meter-hours"
          type="range"
          className="range"
          min={min}
          max={max}
          step="1"
          value={hours}
          onChange={(e) => setHours(Number(e.target.value))}
          style={{ '--pct': `${pct}%` }}
          aria-valuetext={`${hours} hours, ${BRAND.currency}${total}`}
        />
        <button type="button" className="meter__step" onClick={() => setHours((h) => Math.min(max, h + 1))} disabled={hours >= max} aria-label="One hour more">
          <Icon name="plus" size={18} />
        </button>
      </div>
      <div className="meter__ticks" aria-hidden="true">
        <span>1 hr</span>
        <span>5 hrs</span>
        <span>10 hrs</span>
      </div>
      <div className="meter__note">
        <span>The radio-ready song and production are priced per song. Ask when you book.</span>
        <div className="row" style={{ '--gap': '1.25rem' }}>
          <Link to={`/book?service=${service.id}&hours=${hours}`} className="link-arrow">
            Book {hours} {hours === 1 ? 'hour' : 'hours'} <Icon name="arrowUp" size={14} />
          </Link>
          <a className="link-arrow" href={whatsappLink(MSG.hours(service, hours))} target="_blank" rel="noopener noreferrer">
            <BrandIcon name="whatsapp" size={14} /> Send it on WhatsApp
          </a>
        </div>
      </div>
    </div>
  );
}

/* Clickable hotspots on the vocal-room photo. Only describes what is visible. */
export function RoomTour() {
  const [i, setI] = useState(0);
  const spot = ROOM_SPOTS[i];
  const go = (d) => setI((v) => (v + d + ROOM_SPOTS.length) % ROOM_SPOTS.length);

  return (
    <div className="tour">
      <div className="tour__stage">
        <Picture slug="studio-vocal" alt="The studio with numbered points on the mic, keyboards, monitors, screen, foam and neon clef." sizes="(min-width: 1100px) 900px, 100vw" />
        {ROOM_SPOTS.map((s, n) => (
          <button
            key={s.id}
            type="button"
            className={`spot${n === i ? ' is-active' : ''}`}
            style={{ left: `${s.x}%`, top: `${s.y}%` }}
            onClick={() => setI(n)}
            aria-label={`${n + 1}. ${s.title}`}
            aria-pressed={n === i}
          >
            <span className="spot__dot">{n + 1}</span>
          </button>
        ))}
      </div>
      <div className="tour__panel">
        <span className="tour__count">
          {String(i + 1).padStart(2, '0')} / {String(ROOM_SPOTS.length).padStart(2, '0')}
        </span>
        <AnimatePresence mode="wait">
          <motion.div key={spot.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.25 }} className="stack" style={{ '--gap': '0.75rem' }} aria-live="polite">
            <h3 className="tour__title">{spot.title}</h3>
            <p className="body-dim">{spot.body}</p>
          </motion.div>
        </AnimatePresence>
        <div className="tour__nav">
          <button type="button" onClick={() => go(-1)} aria-label="Previous point">
            <Icon name="left" size={18} />
          </button>
          <button type="button" onClick={() => go(1)} aria-label="Next point">
            <Icon name="right" size={18} />
          </button>
        </div>
        <div className="tour__list" aria-label="All points">
          {ROOM_SPOTS.map((s, n) => (
            <button key={s.id} type="button" aria-pressed={n === i} onClick={() => setI(n)}>
              {n + 1}. {s.title}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

/* Rotating house lines over a parallax photo. */
export function QuoteBand({ image = 'studio-wide' }) {
  const [i, setI] = useState(0);
  const [paused, setPaused] = useState(false);
  const ref = useRef(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  const y = useTransform(scrollYProgress, [0, 1], reduce ? ['0%', '0%'] : ['-8%', '8%']);

  useEffect(() => {
    if (paused) return undefined;
    const id = setInterval(() => setI((v) => (v + 1) % QUOTES.length), 5500);
    return () => clearInterval(id);
  }, [paused]);

  return (
    <section
      ref={ref}
      className="quote-band"
      onPointerEnter={() => setPaused(true)}
      onPointerLeave={() => setPaused(false)}
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={() => setPaused(false)}
      aria-label="Studio lines"
    >
      <motion.div className="quote-band__media" style={{ y }}>
        <Picture slug={image} alt="" />
      </motion.div>
      <div className="wrap quote">
        <span className="quote__mark" aria-hidden="true">“</span>
        <AnimatePresence mode="wait">
          <motion.blockquote
            key={i}
            className="quote__text"
            initial={{ opacity: 0, y: 24, filter: 'blur(8px)' }}
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            exit={{ opacity: 0, y: -24, filter: 'blur(8px)' }}
            transition={{ duration: 0.6 }}
          >
            {QUOTES[i].text}
          </motion.blockquote>
        </AnimatePresence>
        <span className="quote__by">{BRAND.name}</span>
        <div className="quote__dots">
          {QUOTES.map((q, n) => (
            <button key={q.text} type="button" onClick={() => setI(n)} aria-label={`Line ${n + 1}`} aria-current={n === i}>
              <span />
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}

/* Manifesto: words light up as you scroll past. */
function Word({ word, range, progress, accent }) {
  const opacity = useTransform(progress, range, accent ? [1, 1] : [0.45, 1]);
  return (
    <motion.span className={`manifesto__word${accent ? ' is-accent' : ''}`} style={{ opacity }}>
      {word}
    </motion.span>
  );
}

export function ScrollWords({ text, accents = [] }) {
  const ref = useRef(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 0.85', 'end 0.45'] });
  const words = text.split(' ');
  if (reduce) {
    return (
      <p className="manifesto">
        {words.map((w, i) => (
          <span key={i} className={`manifesto__word${accents.includes(i) ? ' is-accent' : ''}`}>{w}</span>
        ))}
      </p>
    );
  }
  return (
    <p className="manifesto" ref={ref}>
      {words.map((w, i) => (
        <Word key={i} word={w} accent={accents.includes(i)} progress={scrollYProgress} range={[i / words.length, (i + 1) / words.length]} />
      ))}
    </p>
  );
}

/* Genre board: hover or tap a genre, the panel answers. */
export function GenreBoard() {
  const [i, setI] = useState(0);
  const g = GENRES[i];
  return (
    <div className="genres">
      <div className="genre-list" role="group" aria-label="Genres">
        {GENRES.map((x, n) => (
          <button
            key={x.name}
            type="button"
            className={`genre-btn${n === i ? ' is-active' : ''}`}
            onPointerEnter={() => setI(n)}
            onFocus={() => setI(n)}
            onClick={() => setI(n)}
            aria-pressed={n === i}
          >
            {x.name}
            <small>{x.main ? 'Home base' : String(n + 1).padStart(2, '0')}</small>
          </button>
        ))}
      </div>
      <div className="genre-panel" aria-live="polite">
        <AnimatePresence mode="wait">
          <motion.span key={g.name} className="genre-panel__ghost" aria-hidden="true" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }} transition={{ duration: 0.35 }}>
            {g.name}
          </motion.span>
        </AnimatePresence>
        <AnimatePresence mode="wait">
          <motion.p key={g.line} className="genre-panel__line" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }}>
            {g.line}
          </motion.p>
        </AnimatePresence>
        <Link to={`/book?genre=${encodeURIComponent(g.name === 'And more' ? 'Other' : g.name)}`} className="link-arrow">
          Book a {g.name === 'And more' ? '' : `${g.name} `}session <Icon name="arrowUp" size={14} />
        </Link>
      </div>
    </div>
  );
}

/* The radio-ready route as a signal chain. The cable fills and each stage lights as you scroll. */
function ChainNode({ step, i, n, progress }) {
  const at = n > 1 ? i / (n - 1) : 1;
  const on = useTransform(progress, [Math.max(0, at - 0.12), at], [0, 1]);
  return (
    <motion.li className="chain__node" style={{ '--on': on }}>
      <span className="chain__ring">
        <span className="chain__glow" aria-hidden="true" />
        <Icon name={step.icon} size={22} />
      </span>
      <span className="chain__n">{String(i + 1).padStart(2, '0')}</span>
      <h3 className="chain__title">{step.title}</h3>
      <p className="body-dim">{step.body}</p>
    </motion.li>
  );
}

export function SignalChain({ steps = CHAIN }) {
  const ref = useRef(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 0.8', 'end 0.6'] });
  const progress = useTransform(scrollYProgress, [0, 1], reduce ? [1, 1] : [0, 1]);
  return (
    <motion.div className="chain" ref={ref} style={{ '--s': progress }}>
      <span className="chain__track" aria-hidden="true">
        <span className="chain__fill" />
      </span>
      <ol className="chain__list">
        {steps.map((s, i) => (
          <ChainNode key={s.title} step={s} i={i} n={steps.length} progress={progress} />
        ))}
      </ol>
    </motion.div>
  );
}

/* Prep checklist, remembered on this device only. */
export function PrepChecklist() {
  const KEY = 'oneness-prep';
  const [done, setDone] = useState(() => {
    try {
      const v = JSON.parse(localStorage.getItem(KEY) || '[]');
      return Array.isArray(v) ? v.filter((n) => Number.isInteger(n)) : [];
    } catch {
      return [];
    }
  });
  useEffect(() => {
    try { localStorage.setItem(KEY, JSON.stringify(done)); } catch { /* storage blocked */ }
  }, [done]);
  const toggle = (n) => setDone((d) => (d.includes(n) ? d.filter((x) => x !== n) : [...d, n]));
  const pct = Math.round((done.length / PREP.length) * 100);

  return (
    <div className="stack">
      <div className="row" style={{ justifyContent: 'space-between' }}>
        <span className="meter__label">{done.length} of {PREP.length} ready</span>
        <span className="meter__label">{pct === 100 ? 'Ready. Pull up.' : `${pct}%`}</span>
      </div>
      <div className="progress-line" aria-hidden="true">
        <span style={{ width: `${pct}%` }} />
      </div>
      <ul className="checklist">
        {PREP.map((p, n) => (
          <li key={p}>
            <label className={`check${done.includes(n) ? ' is-done' : ''}`}>
              <input type="checkbox" checked={done.includes(n)} onChange={() => toggle(n)} />
              <span className="check__box"><Icon name="check" size={16} strokeWidth={2.5} /></span>
              <span className="check__text">{p}</span>
            </label>
          </li>
        ))}
      </ul>
    </div>
  );
}
