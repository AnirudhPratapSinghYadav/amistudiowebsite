import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { BRAND } from '../config/brand';
import { IMAGES, SERVICES } from '../content/site';
import { MUSIC_STATS, RELEASES } from '../content/music';
import { usePageMeta } from '../lib/usePageMeta';
import { Icon } from '../components/Icon';
import { Brush, Cta, Equalizer, Facts, Kicker, Later, Marquee, Picture, Reveal, SectionHead, Tip } from '../components/ui';
import { GenreBoard, QuoteBand, ScrollWords, SessionMeter, SignalChain, Timecode } from '../components/Interactive';
import { BeatPlayer } from '../components/Sound';
import { ArtistLinks, LatestSpotlight, ReleaseCard } from '../components/Releases';
import { OpenNow, VisitGrid, WhatsAppButton } from '../components/Visit';

const EASE = [0.22, 1, 0.36, 1];

function HeroLine({ children, delay }) {
  return (
    <span className="line">
      <motion.span initial={{ y: '105%' }} animate={{ y: 0 }} transition={{ duration: 0.75, ease: EASE, delay }}>
        {children}
      </motion.span>
    </span>
  );
}

function Hero() {
  return (
    <section className="hero grain-edge" aria-label="Intro">
      <div className="hero__media">
        <Picture slug={IMAGES.hero.slug} alt={IMAGES.hero.alt} priority />
      </div>
      <div className="hero__shade" aria-hidden="true" />
      <div className="hero__glow" aria-hidden="true" />

      <div className="hero__top">
        <div className="wrap">
          <span className="rec">
            <span className="rec__dot" aria-hidden="true" />
            REC
            <Timecode />
          </span>
          <span className="rec" aria-hidden="true">
            <Equalizer bars={5} />
          </span>
        </div>
      </div>

      <span className="hero__vert" aria-hidden="true">
        {BRAND.name} · {BRAND.descriptor}
      </span>

      <div className="wrap hero__content">
        <Kicker dot>Studio sessions · {BRAND.contact.address.city}</Kicker>
        <h1 className="display hero__title">
          <HeroLine delay={0.05}>Bring your</HeroLine>
          <HeroLine delay={0.13}>ideas.</HeroLine>
          <HeroLine delay={0.22}>
            <em>Let&apos;s make it</em> <Brush delay={1.1} instant>real.</Brush>
          </HeroLine>
        </h1>
        <motion.div className="hero__sub" initial={{ y: 16 }} animate={{ y: 0 }} transition={{ duration: 0.8, delay: 0.4 }}>
          <div className="hero__actions">
            <Link to="/book" className="btn btn--primary">
              Book a session <Icon name="arrow" size={18} />
            </Link>
            <Link to="/music" className="btn btn--ghost">
              Hear the work
            </Link>
          </div>
          <p className="lead">
            Record your vocals and leave with a radio-ready song. Or book a studio session and jam with {BRAND.producer}. {BRAND.currency}
            {BRAND.sessionRate} an hour, open every day.
          </p>
        </motion.div>
        <motion.div initial={{ y: 16, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.8, delay: 0.9 }}>
          <BeatPlayer className="hero__beat" label="Turn it up" />
        </motion.div>
      </div>

      <motion.div className="hero__note" initial={{ opacity: 0, rotate: -8 }} animate={{ opacity: 1, rotate: 0 }} transition={{ delay: 1.4, duration: 0.6 }} aria-hidden="true">
        <span className="brush-note">
          we provide everything.
          <br />
          you bring the song.
        </span>
        <svg width="70" height="46" viewBox="0 0 70 46" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
          <path d="M60 4C52 26 32 38 8 40" />
          <path d="M16 32 7 40l11 4" />
        </svg>
      </motion.div>

      <div className="hero__foot">
        <div className="wrap">
          <p className="hero__tagline">
            {BRAND.tagline.map((t, i) => (
              <span key={t}>
                {t}
                {i < BRAND.tagline.length - 1 ? <i> |</i> : null}
              </span>
            ))}
          </p>
          <OpenNow className="hero__open" />
        </div>
      </div>
    </section>
  );
}

export default function Home() {
  usePageMeta('/');
  const [radio, session] = SERVICES;
  const extras = SERVICES.slice(2);

  return (
    <>
      <Hero />

      <Marquee items={['Radio-ready songs', `Studio sessions ${BRAND.currency}${BRAND.sessionRate}/hr`, 'Vocal recording', 'Music production', 'Mix and master', 'Songwriting', 'Hip-Hop', 'Trap', 'R&B', 'Afro', 'Drill']} />

      <Later>
        <section className="section">
          <div className="wrap">
            <Kicker dot>Read this slowly</Kicker>
            <ScrollWords
              text="You already have the voice memo. The hook you hum in the car. The verse in your notes app. That is the hard part. Tell us the song. We provide everything else."
              accents={[4, 5, 22, 23, 26, 27, 30, 31]}
            />
          </div>
        </section>

        <section className="section section--deep" aria-labelledby="offers-title">
          <div className="wrap">
            <SectionHead num="01" kicker="Two ways in" title={<span id="offers-title">Walk in with a voice. <em>Walk out</em> with a song.</span>} split>
              <p className="lead">Pick the route. Either way, {BRAND.producer} is on the other side of the desk.</p>
            </SectionHead>

            <div className="offers">
              {[radio, session].map((s, i) => (
                <Reveal key={s.id} className={`offer offer--${s.id}`} delay={i * 0.1} data-todo={s.todo}>
                  <div className="offer__bg" aria-hidden="true">
                    <Picture slug={IMAGES[s.image].slug} alt="" sizes="(min-width: 900px) 50vw, 100vw" />
                  </div>
                  <span className="service-num" aria-hidden="true">{s.num}</span>
                  <span className="service-icon"><Icon name={s.icon} size={24} /></span>
                  <h3 className="offer__name">{s.name}</h3>
                  <p className="service-hook">{s.hook}</p>
                  <p className="body-dim">{s.body}</p>
                  {s.includes ? (
                    <ul className="offer__inc" aria-label="Included">
                      {s.includes.map((x) => (
                        <li key={x}>
                          <Icon name="check" size={14} strokeWidth={2.4} /> {x}
                        </li>
                      ))}
                    </ul>
                  ) : null}
                  <div className="offer__foot">
                    <span className="offer__rate">
                      {s.hourly ? (
                        <>
                          <small>{BRAND.currency}</small>
                          {s.hourly}
                          <small>/hr</small>
                        </>
                      ) : (
                        s.rate
                      )}
                    </span>
                    <Link to={`/book?service=${s.id}`} className="btn btn--primary btn--sm">
                      Book this <Icon name="arrow" size={16} />
                    </Link>
                  </div>
                </Reveal>
              ))}
            </div>

            <div className="extras">
              <span className="meter__label">Also on the menu</span>
              {extras.map((s) => (
                <Link key={s.id} to={`/services#${s.id}`} className="extra">
                  <Icon name={s.icon} size={18} />
                  <span>{s.name}</span>
                  <span className="extra__rate">{s.rateShort}</span>
                  <Icon name="arrowUp" size={14} />
                </Link>
              ))}
            </div>
          </div>
        </section>

        <section className="section" aria-labelledby="chain-title">
          <div className="wrap">
            <SectionHead num="02" kicker="The radio-ready route" title={<span id="chain-title">From your voice <em>to the</em> radio.</span>} split>
              <p className="lead">Five stages, one room. Scroll and follow the signal.</p>
            </SectionHead>
            <SignalChain />
          </div>
        </section>

        <Marquee variant="magenta" items={['Record', 'Produce', 'Create', 'Record', 'Produce', 'Create']} />

        <section className="section" aria-labelledby="music-title">
          <div className="wrap">
            <SectionHead num="03" kicker={`${BRAND.producer} on record`} title={<span id="music-title">Don&apos;t take our word. <em>Press</em> play.</span>} split>
              <div className="stack" style={{ '--gap': '1rem' }}>
                <p className="lead">
                  {MUSIC_STATS.releases} releases since {MUSIC_STATS.since}. Turn the sound on and every cover plays its preview when you hover. Every icon opens the song where you listen.
                </p>
                <Link to="/music" className="link-arrow">
                  All the music <Icon name="arrowUp" size={14} />
                </Link>
              </div>
            </SectionHead>
            <Reveal>
              <LatestSpotlight />
            </Reveal>
            <div className="rel-grid mt-3">
              {RELEASES.slice(1, 4).map((r, i) => (
                <Reveal key={r.id} delay={i * 0.08}>
                  <ReleaseCard r={r} />
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        <section className="section section--deep" aria-labelledby="rate-title">
          <div className="wrap">
            <SectionHead num="04" kicker="The rate" title={<span id="rate-title">Count the hours. <em>Not the</em> surprises.</span>} split>
              <p className="lead">
                Studio sessions are {BRAND.currency}
                {BRAND.sessionRate} an hour. Vocal recording is {BRAND.currency}
                {BRAND.vocalRate}. Slide it and see the number before you walk in.
              </p>
            </SectionHead>
            <div className="meter-grid">
              <Reveal>
                <SessionMeter />
              </Reveal>
              <Reveal delay={0.1}>
                <Tip title="No reference beat? No problem." />
              </Reveal>
            </div>
          </div>
        </section>

        <QuoteBand image="studio-wide" />

        <section className="section" aria-labelledby="genre-title">
          <div className="wrap">
            <SectionHead num="05" kicker="Genres" title={<span id="genre-title">Whatever you make, <em>bring it.</em></span>} />
            <GenreBoard />
          </div>
        </section>

        <section className="section section--plum" aria-labelledby="ami-title">
          <div className="wrap feature">
            <Reveal className="frame frame--tall">
              <Picture slug={IMAGES.wide2.slug} alt={IMAGES.wide2.alt} sizes="(min-width: 900px) 50vw, 100vw" />
              <span className="frame__cap tag">{BRAND.producer} at the desk</span>
            </Reveal>
            <div className="stack">
              <Kicker num="06">The producer</Kicker>
              <span className="wall-mark" aria-hidden="true">{BRAND.wallMark}</span>
              <Reveal as="h2" className="h2" id="ami-title">
                His name is on the wall. <em>Yours goes on</em> the record.
              </Reveal>
              <p className="lead">
                {BRAND.producer} is a {BRAND.roles.join(', ').toLowerCase()}, {BRAND.years} years in. He runs {BRAND.name} and puts out his own records too. In a studio session, that is who you jam with.
              </p>
              <ArtistLinks className="artist-links--compact" />
              <div className="row">
                <Link to="/about" className="btn btn--ghost">
                  Meet {BRAND.producer}
                </Link>
                <Link to="/studio" className="link-arrow">
                  Tour the room <Icon name="arrowUp" size={14} />
                </Link>
              </div>
            </div>
          </div>
        </section>

        <section className="section section--tight">
          <div className="wrap">
            <Facts />
          </div>
        </section>

        <section className="section" aria-labelledby="visit-title">
          <div className="wrap">
            <SectionHead num="07" kicker="Pull up" title={<span id="visit-title">Open every day. <em>Message</em> first.</span>} split>
              <div className="stack" style={{ '--gap': '1rem' }}>
                <p className="lead">
                  {BRAND.contact.address.street}, {BRAND.contact.address.city}. Send a WhatsApp, tell us the song, pick a time.
                </p>
                <div className="row">
                  <WhatsAppButton />
                  <Link to="/contact" className="link-arrow">
                    Contact page <Icon name="arrowUp" size={14} />
                  </Link>
                </div>
              </div>
            </SectionHead>
            <VisitGrid />
          </div>
        </section>

        <Cta />
      </Later>
    </>
  );
}
