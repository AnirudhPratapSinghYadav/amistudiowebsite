import { useRef, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, useMotionValueEvent, useReducedMotion, useScroll, useTransform } from 'framer-motion';
import { BRAND } from '../config/brand';
import { IMAGES } from '../content/site';
import { MUSIC_STATS, RELEASES } from '../content/music';
import { Icon } from './Icon';
import { Kicker, Picture, Reveal } from './ui';

const YEARS = Number.parseInt(BRAND.years, 10);

function useWide() {
  const [wide, setWide] = useState(() => window.matchMedia('(min-width: 900px)').matches);
  useEffect(() => {
    const mq = window.matchMedia('(min-width: 900px)');
    const on = () => setWide(mq.matches);
    mq.addEventListener('change', on);
    return () => mq.removeEventListener('change', on);
  }, []);
  return wide;
}

function Stats() {
  const items = [
    { n: MUSIC_STATS.onYouTube, l: 'Songs on YouTube' },
    { n: MUSIC_STATS.videos, l: 'Official music videos' },
    { n: MUSIC_STATS.visualizers, l: 'Official visualizer' },
  ];
  return (
    <dl className="bio__stats">
      {items.map((s) => (
        <div key={s.l}>
          <dt>{s.l}</dt>
          <dd>{s.n}</dd>
        </div>
      ))}
    </dl>
  );
}

function Panel({ countRef }) {
  return (
    <>
      <p className="bio__years">
        <span ref={countRef}>{YEARS}</span>
        <small>+</small>
      </p>
      <p className="bio__years-label">Years of experience</p>
      <p className="bio__roles">
        {BRAND.roles.map((r, i) => (
          <span key={r}>
            {r}
            {i < BRAND.roles.length - 1 ? <i aria-hidden="true"> / </i> : null}
          </span>
        ))}
      </p>
      <Stats />
    </>
  );
}

/* Big photo of AMI at his setup. Scroll and it pulls back into a frame while the years count up. */
export function BioReveal() {
  const ref = useRef(null);
  const countRef = useRef(null);
  const reduce = useReducedMotion();
  const wide = useWide();
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end end'] });
  const clipPath = useTransform(
    scrollYProgress,
    [0, 0.5],
    wide ? ['inset(0% 0% 0% 0% round 0px)', 'inset(10% 50% 10% 4% round 24px)'] : ['inset(0% 0% 0% 0% round 0px)', 'inset(6% 5% 50% 5% round 20px)'],
  );
  const scale = useTransform(scrollYProgress, [0, 0.5], [1.12, 1]);
  const introOpacity = useTransform(scrollYProgress, [0, 0.22], [1, 0]);
  const introY = useTransform(scrollYProgress, [0, 0.22], [0, -60]);
  const panelOpacity = useTransform(scrollYProgress, [0.32, 0.55], [0, 1]);
  const panelY = useTransform(scrollYProgress, [0.32, 0.6], [60, 0]);
  const count = useTransform(scrollYProgress, [0.36, 0.7], [0, YEARS]);
  useMotionValueEvent(count, 'change', (v) => {
    if (countRef.current) countRef.current.textContent = String(Math.round(v));
  });

  if (reduce) {
    return (
      <section className="bio bio--static" aria-labelledby="bio-title">
        <div className="wrap feature">
          <div className="frame frame--tall">
            <Picture slug={IMAGES.hero.slug} alt={IMAGES.hero.alt} sizes="(min-width: 900px) 50vw, 100vw" priority />
          </div>
          <div className="stack">
            <Kicker dot>About {BRAND.producer}</Kicker>
            <h1 className="display" id="bio-title">{BRAND.producer}</h1>
            <Panel />
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="bio" ref={ref} aria-labelledby="bio-title">
      <div className="bio__stage">
        <motion.div className="bio__photo" style={{ clipPath }}>
          <motion.div className="bio__photo-inner" style={{ scale }}>
            <Picture slug={IMAGES.hero.slug} alt={IMAGES.hero.alt} priority />
          </motion.div>
          <span className="bio__photo-shade" />
        </motion.div>

        <motion.div className="bio__intro wrap" style={{ opacity: introOpacity, y: introY }}>
          <nav className="crumbs" aria-label="Breadcrumb">
            <Link to="/">Home</Link>
            <span aria-hidden="true">/</span>
            <span aria-current="page">About</span>
          </nav>
          <Kicker dot>About {BRAND.producer}</Kicker>
          <h1 className="bio__name" id="bio-title">
            {BRAND.producer}
          </h1>
          <p className="bio__tag">{BRAND.roles.join('. ')}.</p>
          <span className="bio__scroll meter__label">
            Scroll <Icon name="arrow" size={14} />
          </span>
        </motion.div>

        <motion.div className="bio__panel" style={{ opacity: panelOpacity, y: panelY }}>
          <Panel countRef={countRef} />
        </motion.div>
      </div>
    </section>
  );
}

/* Song timeline, first record to latest. Numbered, never dated: the client does not want years shown. */
export function ReleaseTimeline() {
  const list = [...RELEASES].reverse();
  return (
    <ol className="timeline">
      {list.map((r, i) => (
        <Reveal as="li" key={r.id} className="timeline__item" delay={(i % 3) * 0.06}>
          <span className="timeline__date">
            <span className="sr-only">Song </span>
            {String(i + 1).padStart(2, '0')}
          </span>
          <span className="timeline__dot" aria-hidden="true" />
          <div className="timeline__body">
            <img src={r.cover.small} alt="" width="320" height="320" loading="lazy" decoding="async" />
            <div>
              <h3 className="timeline__title">
                <a href={r.youtube} target="_blank" rel="noopener noreferrer">
                  {r.title}
                  <span className="sr-only"> on YouTube</span>
                </a>
              </h3>
              <p className="body-dim">
                {r.credit} · {r.video}
              </p>
            </div>
          </div>
        </Reveal>
      ))}
      <Reveal as="li" className="timeline__item timeline__item--now">
        <span className="timeline__date">Now</span>
        <span className="timeline__dot" aria-hidden="true" />
        <div className="timeline__body">
          <div>
            <h3 className="timeline__title">{BRAND.name}</h3>
            <p className="body-dim">
              The studio in {BRAND.contact.address.city}. Open to artists every day.
            </p>
          </div>
        </div>
      </Reveal>
    </ol>
  );
}
