import { useEffect, useState } from 'react';
import { BRAND } from '../config/brand';
import { HELLO, MAPS_LINK, hourLabel, mailLink, studioNow, whatsappLink } from '../lib/contact';
import { MSG, SUBJECT } from '../content/messages';
import { BrandIcon, Icon } from './Icon';
import { Reveal } from './ui';

const { contact } = BRAND;
const ext = { target: '_blank', rel: 'noopener noreferrer' };

/* Live open or closed badge, worked out in Calgary time. */
export function OpenNow({ className = '' }) {
  const [now, setNow] = useState(() => studioNow());
  useEffect(() => {
    const id = setInterval(() => setNow(studioNow()), 30_000);
    return () => clearInterval(id);
  }, []);
  return (
    <span className={`open-now${now.open ? ' is-open' : ''} ${className}`}>
      <span className="open-now__dot" aria-hidden="true" />
      <span>
        {now.open ? `Open now, until ${hourLabel(contact.hours.close)}` : `Closed now, opens ${hourLabel(contact.hours.open)}`}
      </span>
      <span className="open-now__time">{now.time} in {contact.address.city}</span>
    </span>
  );
}

export function WhatsAppButton({ text = HELLO, className = 'btn btn--primary', children = 'Message on WhatsApp' }) {
  return (
    <a className={className} href={whatsappLink(text)} {...ext}>
      <BrandIcon name="whatsapp" size={18} /> {children}
    </a>
  );
}

const IG = BRAND.social.instagram;

export function InstagramButton({ className = 'btn btn--ghost', children }) {
  if (!IG) return null;
  return (
    <a className={className} href={IG.href} {...ext} aria-label={`${BRAND.producer} on Instagram, ${IG.handle}`}>
      <BrandIcon name="instagram" size={18} /> {children || `Follow ${IG.handle}`}
    </a>
  );
}

/* Small icon row of every profile, for tight spots like the mobile menu. */
export function SocialRow({ className = '', size = 20 }) {
  return (
    <ul className={`social-row ${className}`} aria-label={`${BRAND.producer} online`}>
      {BRAND.socials.map((s) => (
        <li key={s.id}>
          <a href={s.href} {...ext} aria-label={`${BRAND.producer} on ${s.label}`} title={s.label}>
            <BrandIcon name={s.id} size={size} />
          </a>
        </li>
      ))}
    </ul>
  );
}

export function VisitGrid() {
  const cards = [
    {
      icon: <Icon name="pin" size={22} />,
      label: 'The studio',
      value: (
        <>
          {contact.address.street}
          <br />
          {contact.address.city}, {contact.address.region}
        </>
      ),
      link: { href: MAPS_LINK, text: 'Get directions', ext: true },
    },
    {
      icon: <Icon name="clock" size={22} />,
      label: 'Hours',
      value: (
        <>
          {hourLabel(contact.hours.open)} to {hourLabel(contact.hours.close)}
          <br />
          {contact.hours.days}
        </>
      ),
      extra: <OpenNow />,
    },
    {
      icon: <BrandIcon name="whatsapp" size={22} />,
      label: 'WhatsApp only',
      value: contact.whatsappDisplay,
      note: 'This number is on WhatsApp only. No regular calls or texts.',
      link: { href: whatsappLink(HELLO), text: 'Message on WhatsApp', ext: true },
    },
    {
      icon: <Icon name="mail" size={22} />,
      label: 'Email',
      value: contact.email,
      link: { href: mailLink(SUBJECT.hello, MSG.hello), text: 'Send an email' },
    },
  ];
  return (
    <div className="visit-grid">
      {cards.map((c, i) => (
        <Reveal key={c.label} className="card visit-card" delay={i * 0.06}>
          <span className="service-icon">{c.icon}</span>
          <h3 className="card__title">{c.label}</h3>
          <p className="visit-card__value">{c.value}</p>
          {c.note ? <p className="body-dim">{c.note}</p> : null}
          {c.extra || null}
          {c.link ? (
            <a className="link-arrow" href={c.link.href} {...(c.link.ext ? ext : {})}>
              {c.link.text} <Icon name="arrowUp" size={14} />
            </a>
          ) : null}
        </Reveal>
      ))}
    </div>
  );
}