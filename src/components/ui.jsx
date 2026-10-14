import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { BRAND } from '../config/brand';
import { MUSIC_STATS } from '../content/music';
import { IMAGE_WIDTHS } from '../content/site';
import { Icon } from './Icon';

const EASE = [0.22, 1, 0.36, 1];

/* Mounts its children one frame after the page, so the hero paints before the long tail of a page. */
export function Later({ children }) {
  const [ready, setReady] = useState(false);
  useEffect(() => {
    let timer = 0;
    const raf = requestAnimationFrame(() => {
      timer = setTimeout(() => setReady(true), 0);
    });
    return () => {
      cancelAnimationFrame(raf);
      clearTimeout(timer);
    };
  }, []);
  return ready ? children : null;
}

export function Reveal({ as = 'div', delay = 0, y = 24, className, children, ...rest }) {
  const Comp = motion[as];
  return (
    <Comp
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.8, ease: EASE, delay }}
      {...rest}
    >
      {children}
    </Comp>
  );
}

export function Kicker({ num, dot, children, className = '' }) {
  return (
    <p className={`kicker ${className}`}>
      {num ? <span className="kicker__num">{num}</span> : null}
      {dot ? <span className="kicker__dot" aria-hidden="true" /> : null}
      <span>{children}</span>
    </p>
  );
}

export function Brush({ children, delay = 0.3, instant = false }) {
  const play = instant ? { animate: { scaleX: 1 } } : { whileInView: { scaleX: 1 }, viewport: { once: true } };
  return (
    <span className="brush">
      {children}
      <motion.svg
        className="brush__svg"
        viewBox="0 0 300 24"
        preserveAspectRatio="none"
        aria-hidden="true"
        initial={{ scaleX: 0 }}
        {...play}
        transition={{ duration: 0.9, ease: EASE, delay }}
      >
        <path
          fill="currentColor"
          d="M4 13.5C38 8 92 5.2 150 5.6c52 .3 104 2.2 145 5.4l1 2.6c-5 .5-9 1.4-6 2.6-46-2.4-98-3.2-146-1.6-46 1.4-90 4.4-138 8.4l-3-3.2c5-.8 10-2 3-2.8l-2-3.5Z"
        />
        <path fill="currentColor" opacity=".55" d="M18 19.5c60-4 130-6 210-4.6l-1 1.6c-74-.6-144 1-208 4.4Z" />
      </motion.svg>
    </span>
  );
}

export function Picture({ slug, alt, sizes = '100vw', priority = false, className, imgClassName }) {
  return (
    <picture className={className}>
      <source type="image/webp" srcSet={IMAGE_WIDTHS.map((w) => `/img/${slug}-${w}.webp ${w}w`).join(', ')} sizes={sizes} />
      <img
        src={`/img/${slug}-1600.jpg`}
        alt={alt}
        width="1600"
        height="900"
        loading={priority ? 'eager' : 'lazy'}
        fetchPriority={priority ? 'high' : 'auto'}
        decoding={priority ? 'sync' : 'async'}
        className={imgClassName}
      />
    </picture>
  );
}

export function Equalizer({ bars = 7, paused = false }) {
  return (
    <span className={`eq${paused ? ' is-paused' : ''}`} aria-hidden="true">
      {Array.from({ length: bars }, (_, i) => (
        <span key={i} style={{ animationDelay: `${(i * 0.13) % 0.9}s` }} />
      ))}
    </span>
  );
}

export function Marquee({ items, variant }) {
  const group = (hidden) => (
    <div className="marquee__group" aria-hidden={hidden || undefined}>
      {items.map((t, i) => (
        <span className="marquee__item" key={i}>
          {t}
          <span className="marquee__sep" />
        </span>
      ))}
    </div>
  );
  const strip = (
    <div className={`marquee${variant ? ` marquee--${variant}` : ''}`}>
      <p className="sr-only">{items.join(', ')}</p>
      <div className="marquee__track" aria-hidden="true">
        {group()}
        {group(true)}
        {group(true)}
        {group(true)}
      </div>
    </div>
  );
  return variant === 'magenta' ? <div className="marquee-tilt">{strip}</div> : strip;
}

/* The icon comes from the logo artwork; the name is live text from identity.json. */
const [NAME_FIRST, ...NAME_REST] = BRAND.name.split(' ');

export function Logo({ variant = 'lockup', className = '', height = 40 }) {
  const label = `${BRAND.name}, ${BRAND.descriptor}`;
  const icon = (
    <img
      className="logo__icon"
      src={BRAND.logo.icon}
      alt={variant === 'icon' ? label : ''}
      width={Math.round(height * BRAND.logo.iconRatio)}
      height={height}
      decoding="async"
    />
  );
  if (variant === 'icon') return <span className={`logo logo--icon ${className}`}>{icon}</span>;
  return (
    <span className={`logo logo--${variant} ${className}`} role="img" aria-label={label} style={{ '--logo-h': `${height}px` }}>
      {icon}
      <span className="logo__text" aria-hidden="true">
        <span className="logo__word">
          <b>{NAME_FIRST}</b> <i>{NAME_REST.join(' ')}</i>
        </span>
        {variant === 'stacked' ? <span className="logo__tag">{BRAND.descriptor}</span> : null}
      </span>
    </span>
  );
}

export function Tip({ title = 'Got a reference?', children, icon = 'headphones' }) {
  return (
    <div className="tip">
      <span className="tip__icon">
        <Icon name={icon} size={22} />
      </span>
      <p className="tip__title">{title}</p>
      <p className="body-dim">
        {children || 'Bring a reference beat or a sound idea and we move faster. Do not have one? We still get it done.'}
      </p>
      <span className="brush-note">reference optional. ideas required.</span>
    </div>
  );
}

export function Facts() {
  const { hours } = BRAND.contact;
  const facts = [
    { num: BRAND.years.replace('+', ''), unit: '+', label: 'Years of experience' },
    { num: BRAND.sessionRate, pre: BRAND.currency, label: 'Per hour, studio session' },
    { num: MUSIC_STATS.onYouTube, label: 'Songs on YouTube' },
    { num: hours.close - hours.open, unit: 'h', label: `Hours a day, ${hours.days.toLowerCase()}. ${hours.label}` },
  ];
  return (
    <div className="facts">
      {facts.map((f, i) => (
        <Reveal className="fact" key={f.label} delay={i * 0.08} data-todo={f.todo}>
          <span className="fact__num">
            {f.pre ? <small>{f.pre}</small> : null}
            {f.num}
            {f.unit ? <small>{f.unit}</small> : null}
          </span>
          <span className="fact__label">{f.label}</span>
        </Reveal>
      ))}
    </div>
  );
}

export function PageHero({ crumb, kicker, title, lead, image, children, short }) {
  return (
    <section className={`page-hero${short ? ' page-hero--short' : ''}`}>
      {image ? (
        <div className="page-hero__media">
          <Picture slug={image.slug} alt="" priority />
        </div>
      ) : null}
      <div className="wrap page-hero__inner">
        <nav className="crumbs" aria-label="Breadcrumb">
          <Link to="/">Home</Link>
          <span aria-hidden="true">/</span>
          <span aria-current="page">{crumb}</span>
        </nav>
        <motion.div initial={{ y: 24 }} animate={{ y: 0 }} transition={{ duration: 0.9, ease: EASE }}>
          <Kicker dot>{kicker}</Kicker>
          <h1 className="display">{title}</h1>
        </motion.div>
        {lead ? (
          <motion.p className="lead" initial={{ y: 12 }} animate={{ y: 0 }} transition={{ duration: 0.8, delay: 0.15 }}>
            {lead}
          </motion.p>
        ) : null}
        {children}
      </div>
    </section>
  );
}

export function Cta({ kicker = 'Your move', title, line, button = 'Book a session', to = '/book' }) {
  return (
    <section className="section cta">
      <div className="cta__glow" aria-hidden="true" />
      <div className="wrap cta__inner">
        <Kicker dot>{kicker}</Kicker>
        <Reveal as="h2" className="display cta__title">
          {title || (
            <>
              The idea is the hard part. <em>You already</em> <Brush>have it.</Brush>
            </>
          )}
        </Reveal>
        {line ? <p className="lead">{line}</p> : null}
        <Reveal delay={0.15}>
          <Link to={to} className="btn btn--primary">
            {button} <Icon name="arrow" size={18} />
          </Link>
        </Reveal>
      </div>
    </section>
  );
}

export function SectionHead({ num, kicker, title, children, split }) {
  return (
    <div className={`section-head${split ? ' section-head--split' : ''}`}>
      <div>
        <Kicker num={num}>{kicker}</Kicker>
        <Reveal as="h2" className="h2">
          {title}
        </Reveal>
      </div>
      {children ? <Reveal delay={0.1}>{children}</Reveal> : null}
    </div>
  );
}
