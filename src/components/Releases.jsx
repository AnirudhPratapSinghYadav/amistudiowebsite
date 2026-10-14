import { useState } from 'react';
import { AnimatePresence, motion, useMotionValue, useSpring } from 'framer-motion';
import { BRAND } from '../config/brand';
import { LATEST } from '../content/music';
import { MSG } from '../content/messages';
import { whatsappLink } from '../lib/contact';
import { BrandIcon, Icon } from './Icon';
import { Kicker } from './ui';

const ext = { target: '_blank', rel: 'noopener noreferrer' };
const YT = BRAND.social.youtube;

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

/* The main action on every song. Nothing on a song card is bigger than this. */
export function YouTubeButton({ r, size = '', className = '' }) {
  return (
    <a className={`yt-btn${size ? ` yt-btn--${size}` : ''} ${className}`} href={r.youtube} {...ext}>
      <BrandIcon name="youtube" size={size === 'xl' ? 34 : 28} />
      <span>Watch on YouTube</span>
      <span className="sr-only">: {r.title}</span>
    </a>
  );
}

/* AMI's YouTube channel, for page-level calls to action. */
export function YouTubeChannelButton({ className = '', children }) {
  if (!YT) return null;
  return (
    <a className={`yt-btn yt-btn--channel ${className}`} href={YT.href} {...ext}>
      <BrandIcon name="youtube" size={30} />
      <span>{children || `Watch ${BRAND.producer} on YouTube`}</span>
    </a>
  );
}

/* Every other platform the song is on, kept small so YouTube stays first. */
export function AlsoOn({ r, className = '' }) {
  if (!r.also.length) return null;
  return (
    <div className={`also ${className}`}>
      <span className="also__label" aria-hidden="true">
        Also on
      </span>
      <ul className="plat" aria-label={`${r.title} also on`}>
        {r.also.map((p) => (
          <li key={p.id}>
            <a href={p.href} {...ext} className="plat__a" aria-label={`${r.title}: ${p.verb}`} title={p.verb}>
              <BrandIcon name={p.id} size={15} />
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}

/* Song card: sleeve on top, the record slides out on hover. The cover and the button both open YouTube. */
export function ReleaseCard({ r, sizes = '(min-width: 1200px) 22vw, (min-width: 640px) 45vw, 30vw' }) {
  return (
    <article className="rel">
      <div className="rel__stage">
        <Disc r={r} className="rel__disc" />
        <a className="rel__sleeve" href={r.youtube} {...ext} tabIndex={-1} aria-hidden="true">
          <Cover r={r} sizes={sizes} />
          <span className="rel__shade" />
          <span className="rel__yt" aria-hidden="true">
            <BrandIcon name="youtube" size={22} />
          </span>
        </a>
        {r.explicit ? (
          <span className="rel__tags">
            <Explicit />
          </span>
        ) : null}
      </div>
      <div className="rel__meta">
        <span className="rel__num">{r.num}</span>
        <div>
          <h3 className="rel__title">{r.title}</h3>
          <p className="rel__sub">
            {r.credit} · {r.video} · {r.duration}
          </p>
        </div>
      </div>
      <YouTubeButton r={r} className="rel__go" />
      <AlsoOn r={r} />
    </article>
  );
}

/* List view: big titles, the sleeve follows the cursor on desktop. */
export function ReleaseList({ list }) {
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
      {list.map((r) => (
        <li
          key={r.id}
          className="rel-row"
          onPointerEnter={(e) => {
            if (!hover) {
              x.jump(e.clientX + 28);
              y.jump(e.clientY - 120);
              sx.jump(e.clientX + 28);
              sy.jump(e.clientY - 120);
            }
            setHover(r);
          }}
        >
          <span className="rel__num">{r.num}</span>
          <h3 className="rel-row__title">
            {r.title}
            <small>
              {r.credit}
              {r.explicit ? ' · Explicit' : ''}
            </small>
          </h3>
          <span className="rel-row__col">{r.video}</span>
          <span className="rel-row__col">{r.duration}</span>
          <YouTubeButton r={r} className="rel-row__go" />
          <AlsoOn r={r} className="rel-row__also" />
        </li>
      ))}
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
  return (
    <div className="spot-rel">
      <div className="spot-rel__bg" aria-hidden="true">
        <img src={r.cover.small} alt="" width="320" height="320" loading="lazy" decoding="async" />
      </div>
      <div className="spot-rel__art">
        <Disc r={r} className="spot-rel__disc" />
        <a className="spot-rel__sleeve" href={r.youtube} {...ext} tabIndex={-1} aria-hidden="true">
          <Cover r={r} sizes="(min-width: 900px) 40vw, 85vw" />
        </a>
      </div>
      <div className="spot-rel__text">
        <Kicker dot>Latest release</Kicker>
        <h3 className="spot-rel__title">{r.title}</h3>
        <p className="lead">
          {r.credit}. {r.video}
          {r.explicit ? '. Explicit' : ''}. {r.duration} long.
        </p>
        <YouTubeButton r={r} size="xl" />
        <AlsoOn r={r} />
        <a className="link-arrow" href={whatsappLink(MSG.release(r))} {...ext}>
          <BrandIcon name="whatsapp" size={14} /> Want a song with this energy? Tell {BRAND.producer}
        </a>
      </div>
    </div>
  );
}

export function VideoCard({ r }) {
  return (
    <a className="vid" href={r.youtube} {...ext}>
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
          {r.credit} · {r.duration}
        </span>
        <span className="vid__go">
          Watch on YouTube <Icon name="arrowUp" size={14} />
        </span>
      </span>
    </a>
  );
}

/* AMI's artist profiles. YouTube always leads: as its own big button (full layout, or `channel`),
   otherwise as the first, filled pill. */
export function ArtistLinks({ className = '', channel }) {
  const compact = className.includes('artist-links--compact');
  const big = channel ?? !compact;
  const rest = big ? BRAND.socials.filter((s) => s.id !== 'youtube') : BRAND.socials;
  return (
    <div className="artist-links-wrap">
      {big ? <YouTubeChannelButton className={compact ? '' : 'yt-btn--wide'} /> : null}
      <ul className={`artist-links ${className}`}>
        {rest.map((s) => (
          <li key={s.id}>
            <a className={`artist-link${s.id === 'youtube' ? ' artist-link--yt' : ''}`} href={s.href} {...ext}>
              <BrandIcon name={s.id} size={22} />
              <span>{s.label}</span>
              <Icon name="arrowUp" size={14} />
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
