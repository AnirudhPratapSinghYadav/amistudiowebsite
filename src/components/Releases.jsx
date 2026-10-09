import { useRef, useState } from 'react';
import { AnimatePresence, motion, useMotionValue, useSpring } from 'framer-motion';
import { BRAND } from '../config/brand';
import { LATEST } from '../content/music';
import { MSG } from '../content/messages';
import { whatsappLink } from '../lib/contact';
import { audio, useAudio } from '../lib/audio';
import { BrandIcon, Icon } from './Icon';
import { Kicker } from './ui';
import { Wave } from './Sound';
import { useProgress } from '../lib/useProgress';

const ext = { target: '_blank', rel: 'noopener noreferrer' };

function Cover({ r, sizes, eager }) {
  return (
    <picture>
      <source type="image/webp" srcSet={r.cover.webp} sizes={sizes} />
      <img src={r.cover.jpg} alt="" width="640" height="640" loading={eager ? 'eager' : 'lazy'} decoding="async" />
    </picture>
  );
}

function Disc({ r, className = '' }) {
  return (
    <span className={`disc ${className}`} aria-hidden="true">
      <img src={r.cover.small} alt="" width="320" height="320" loading="lazy" decoding="async" />
    </span>
  );
}

function Explicit() {
  return (
    <span className="rel__e">
      <span aria-hidden="true">E</span>
      <span className="sr-only">Explicit</span>
    </span>
  );
}

/* Every platform the release is on, straight from the Linktree. */
export function PlatformIcons({ r, size = 18, className = '' }) {
  return (
    <ul className={`plat ${className}`} aria-label={`Where to hear ${r.title}`}>
      {r.platforms.map((p) => (
        <li key={p.id}>
          <a href={p.href} {...ext} className="plat__a" aria-label={`${r.title}: ${p.verb}`} title={p.verb}>
            <BrandIcon name={p.id} size={size} />
          </a>
        </li>
      ))}
    </ul>
  );
}

const hoverIn = (id) => (e) => e.pointerType === 'mouse' && audio.playPreview(id, 'hover');
const hoverOut = (id) => (e) => e.pointerType === 'mouse' && audio.stopPreview(id, 'hover');

/* The hover card: sleeve on top, the record slides out and spins while the preview plays. */
export function ReleaseCard({ r, sizes = '(min-width: 1100px) 30vw, (min-width: 640px) 45vw, 90vw' }) {
  const s = useAudio();
  const ref = useRef(null);
  const active = useProgress(r.id, ref);
  return (
    <article className={`rel${active ? ' is-playing' : ''}`} ref={ref} onPointerEnter={hoverIn(r.id)} onPointerLeave={hoverOut(r.id)}>
      <div className="rel__stage">
        <Disc r={r} className="rel__disc" />
        <a className="rel__sleeve" href={r.links.spotify} {...ext} aria-label={`${r.title} on Spotify`}>
          <Cover r={r} sizes={sizes} />
          <span className="rel__shade" />
        </a>
        <span className="rel__tags">
          <span className="rel__year">{r.year}</span>
          {r.explicit ? <Explicit /> : null}
        </span>
        <button type="button" className="rel__play" onClick={() => audio.togglePreview(r.id)} aria-pressed={active} aria-label={`Play a preview of ${r.title}`}>
          <Icon name={active ? 'pause' : 'play'} size={22} />
        </button>
        <span className="rel__hint" aria-hidden="true">
          {active ? 'Preview playing' : s.sound ? 'Hover plays it' : 'Press play for a preview'}
        </span>
      </div>
      <Wave peaks={r.wave} className="rel__wave" />
      <div className="rel__meta">
        <span className="rel__num">{r.num}</span>
        <div>
          <h3 className="rel__title">
            <a href={r.links.spotify} {...ext}>
              {r.title}
            </a>
          </h3>
          <p className="rel__sub">
            {r.credit} · {r.duration}
          </p>
        </div>
      </div>
      <PlatformIcons r={r} />
    </article>
  );
}

/* List view: big titles, the sleeve follows the cursor on desktop. */
export function ReleaseList({ list }) {
  const s = useAudio();
  const [hover, setHover] = useState(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 300, damping: 30 });
  const sy = useSpring(y, { stiffness: 300, damping: 30 });
  const [fine] = useState(() => window.matchMedia('(hover: hover) and (pointer: fine)').matches);

  return (
    <ol
      className="rel-list"
      onPointerMove={(e) => {
        x.set(e.clientX + 28);
        y.set(e.clientY - 120);
      }}
      onPointerLeave={() => setHover(null)}
    >
      {list.map((r) => {
        const active = s.current === r.id && s.playing;
        return (
          <li
            key={r.id}
            className={`rel-row${active ? ' is-playing' : ''}`}
            onPointerEnter={(e) => {
              if (!hover) {
                x.jump(e.clientX + 28);
                y.jump(e.clientY - 120);
                sx.jump(e.clientX + 28);
                sy.jump(e.clientY - 120);
              }
              setHover(r);
              hoverIn(r.id)(e);
            }}
            onPointerLeave={hoverOut(r.id)}
          >
            <span className="rel__num">{r.num}</span>
            <button type="button" className="rel-row__play" onClick={() => audio.togglePreview(r.id)} aria-pressed={active} aria-label={`Play a preview of ${r.title}`}>
              <Icon name={active ? 'pause' : 'play'} size={14} />
            </button>
            <a className="rel-row__title" href={r.links.spotify} {...ext}>
              {r.title}
              <small>
                {r.credit}
                {r.explicit ? ' · Explicit' : ''}
              </small>
            </a>
            <span className="rel-row__col">{r.dateLabel}</span>
            <span className="rel-row__col">{r.duration}</span>
            <PlatformIcons r={r} size={16} />
          </li>
        );
      })}
      <AnimatePresence>
        {fine && hover ? (
          <motion.div
            className="cursor-preview cursor-preview--sq"
            style={{ x: sx, y: sy }}
            initial={{ opacity: 0, scale: 0.8, rotate: -6 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.25 }}
            aria-hidden="true"
          >
            <img key={hover.id} src={hover.cover.small} alt="" width="320" height="320" />
          </motion.div>
        ) : null}
      </AnimatePresence>
    </ol>
  );
}

/* Latest release, front and centre. */
export function LatestSpotlight({ r = LATEST }) {
  const ref = useRef(null);
  const timeRef = useRef(null);
  const active = useProgress(r.id, ref, timeRef);
  return (
    <div className={`spot-rel${active ? ' is-playing' : ''}`} ref={ref}>
      <div className="spot-rel__bg" aria-hidden="true">
        <img src={r.cover.small} alt="" width="320" height="320" loading="lazy" decoding="async" />
      </div>
      <div className="spot-rel__art">
        <Disc r={r} className="spot-rel__disc" />
        <a className="spot-rel__sleeve" href={r.links.spotify} {...ext} aria-label={`${r.title} on Spotify`}>
          <Cover r={r} sizes="(min-width: 900px) 40vw, 85vw" />
        </a>
      </div>
      <div className="spot-rel__text">
        <Kicker dot>Latest release · {r.dateLabel}</Kicker>
        <h3 className="spot-rel__title">{r.title}</h3>
        <p className="lead">
          {r.credit}. {r.video} on YouTube{r.explicit ? '. Explicit' : ''}. {r.duration} long.
        </p>
        <div className="spot-rel__wave">
          <Wave peaks={r.wave} />
          <span className="beat__time">
            <span ref={timeRef}>0:00</span> preview
          </span>
        </div>
        <div className="row">
          <button type="button" className="btn btn--primary" onClick={() => audio.togglePreview(r.id)} aria-pressed={active}>
            <Icon name={active ? 'pause' : 'play'} size={16} /> {active ? 'Stop the preview' : 'Play the preview'}
          </button>
          <a className="btn btn--ghost" href={r.links.spotify} {...ext}>
            <BrandIcon name="spotify" size={18} /> Open in Spotify
          </a>
        </div>
        <a className="link-arrow" href={whatsappLink(MSG.release(r))} {...ext}>
          <BrandIcon name="whatsapp" size={14} /> Want a song with this energy? Tell {BRAND.producer}
        </a>
        <PlatformIcons r={r} size={20} />
      </div>
    </div>
  );
}

export function VideoCard({ r }) {
  return (
    <a className="vid" href={r.links.youtube} {...ext}>
      <span className="vid__media">
        <picture>
          <source type="image/webp" srcSet={r.still.webp} sizes="(min-width: 1100px) 30vw, (min-width: 640px) 45vw, 90vw" />
          <img src={r.still.src} alt="" width="640" height="360" loading="lazy" decoding="async" />
        </picture>
        <span className="vid__shade" />
        <span className="work__pill vid__kind">{r.video}</span>
        <span className="vid__play" aria-hidden="true">
          <BrandIcon name="youtube" size={30} />
        </span>
      </span>
      <span className="vid__meta">
        <span className="vid__title">{r.title}</span>
        <span className="vid__sub">
          {r.credit} · {r.year}
        </span>
        <span className="vid__go">
          Watch on YouTube <Icon name="arrowUp" size={14} />
        </span>
      </span>
    </a>
  );
}

/* AMI's artist profiles. */
export function ArtistLinks({ className = '' }) {
  return (
    <ul className={`artist-links ${className}`}>
      {BRAND.socials.map((s) => (
        <li key={s.id}>
          <a className="artist-link" href={s.href} {...ext}>
            <BrandIcon name={s.id} size={22} />
            <span>{s.label}</span>
            <Icon name="arrowUp" size={14} />
          </a>
        </li>
      ))}
    </ul>
  );
}
