import { useState } from 'react';
import { Link } from 'react-router-dom';
import { BRAND } from '../config/brand';
import { FAQ, IMAGES } from '../content/site';
import { MAPS_LINK, hourLabel } from '../lib/contact';
import { usePageMeta } from '../lib/usePageMeta';
import { Icon } from '../components/Icon';
import { Cta, Kicker, PageHero, Picture, Reveal, SectionHead } from '../components/ui';
import { InstagramButton, OpenNow, VisitGrid, WhatsAppButton } from '../components/Visit';
import { ArtistLinks } from '../components/Releases';
import { FaqList } from './Faq';
import { MSG } from '../content/messages';

const { contact } = BRAND;

/* A week strip: the same hours every day, today highlighted. */
function Week() {
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const [today] = useState(() => new Intl.DateTimeFormat('en-US', { weekday: 'short', timeZone: contact.hours.tz }).format(new Date()));
  return (
    <ul className="week" aria-label="Opening hours">
      {days.map((d) => (
        <li key={d} className={d === today ? 'is-today' : ''}>
          <span className="week__d">
            {d}
            {d === today ? <span className="sr-only"> (today)</span> : null}
          </span>
          <span className="week__bar" aria-hidden="true">
            <i style={{ left: `${(contact.hours.open / 24) * 100}%`, width: `${((contact.hours.close - contact.hours.open) / 24) * 100}%` }} />
          </span>
          <span className="week__h">
            {hourLabel(contact.hours.open)} to {hourLabel(contact.hours.close)}
          </span>
        </li>
      ))}
    </ul>
  );
}

export default function Contact() {
  usePageMeta('/contact');
  const faqs = FAQ.filter((f) => /reach|open|Where|cost/.test(f.q));

  return (
    <>
      <PageHero
        crumb="Contact"
        kicker="Pull up"
        image={IMAGES.wide}
        title={
          <>
            Open every day. <em>Message</em> first.
          </>
        }
        lead={`${contact.address.street}, ${contact.address.city}. ${hourLabel(contact.hours.open)} to ${hourLabel(contact.hours.close)}, seven days a week. The fastest way in is WhatsApp.`}
      >
        <div className="row">
          <WhatsAppButton text={MSG.visit} />
          <Link to="/book" className="btn btn--ghost">
            Use the booking form
          </Link>
        </div>
        <OpenNow className="open-now--hero" />
      </PageHero>

      <section className="section" aria-labelledby="lines-title">
        <div className="wrap">
          <SectionHead num="01" kicker="Direct lines" title={<span id="lines-title">Four ways <em>to find</em> us.</span>} />
          <VisitGrid />
        </div>
      </section>

      <section className="section section--deep" aria-labelledby="where-title">
        <div className="wrap feature">
          <Reveal className="frame map-frame">
            <Picture slug={IMAGES.hero.slug} alt="" sizes="(min-width: 900px) 50vw, 100vw" />
            <div className="map-frame__card">
              <span className="service-icon"><Icon name="pin" size={22} /></span>
              <p className="map-frame__addr">
                {contact.address.street}
                <br />
                {contact.address.city}, {contact.address.region}
              </p>
              <a className="btn btn--primary btn--sm" href={MAPS_LINK} target="_blank" rel="noopener noreferrer">
                Open in Maps <Icon name="arrowUp" size={14} />
              </a>
            </div>
          </Reveal>
          <div className="stack">
            <Kicker num="02">Where and when</Kicker>
            <h2 className="h2" id="where-title">
              Northeast {contact.address.city}. <em>Seven</em> days.
            </h2>
            <p className="lead" data-todo="Confirm whether walk-ins are welcome or sessions are by appointment only.">
              Same hours every day, weekends included. Send a message before you come so the room is ready for you.
            </p>
            <Week />
          </div>
        </div>
      </section>

      <section className="section" aria-labelledby="follow-title">
        <div className="wrap">
          <SectionHead num="03" kicker="Follow" title={<span id="follow-title">Hear {BRAND.producer} <em>before</em> you pull up.</span>} split>
            <p className="lead">Every release is on Spotify, Apple Music and YouTube. Instagram is where you follow him.</p>
          </SectionHead>
          <ArtistLinks />
          <div className="row follow-row">
            <InstagramButton className="btn btn--primary" />
          </div>
        </div>
      </section>

      <section className="section section--deep" aria-labelledby="cfaq-title">
        <div className="wrap">
          <Kicker num="?">Quick answers</Kicker>
          <h2 className="h2" id="cfaq-title" style={{ marginBottom: '2rem' }}>
            Before <em>you</em> message.
          </h2>
          <FaqList items={faqs} />
        </div>
      </section>

      <Cta kicker="Ready" title={<>Tell us the song. <em>We provide</em> everything else.</>} />
    </>
  );
}
