import { Link } from 'react-router-dom';
import { BRAND } from '../config/brand';
import { CODE, IMAGES, PORTRAIT } from '../content/site';
import { MUSIC_STATS } from '../content/music';
import { usePageMeta } from '../lib/usePageMeta';
import { Icon } from '../components/Icon';
import { Cta, Facts, Kicker, Picture, Reveal, SectionHead } from '../components/ui';
import { QuoteBand } from '../components/Interactive';
import { BioReveal, ReleaseTimeline } from '../components/Bio';
import { ArtistLinks } from '../components/Releases';
import { InstagramButton } from '../components/Visit';

const ROLES = [
  { icon: 'laptop', title: 'Music producer', body: 'Builds the music around your voice. Hip-hop first, plus trap, R&B, Afro and drill.' },
  { icon: 'bulb', title: 'Songwriter', body: 'Helps land the hook, fix the second verse and shape where the song goes next.' },
  { icon: 'mic', title: 'Artist', body: `Puts out his own records as ${BRAND.producer}. ${MUSIC_STATS.releases} releases and counting, each with its own video.` },
];

export default function About() {
  usePageMeta('/about');

  return (
    <>
      <BioReveal />

      <section className="section" aria-labelledby="story-title">
        <div className="wrap feature">
          <div className="stack">
            <span className="wall-mark" aria-hidden="true">{BRAND.wallMark}</span>
            <p className="brush-note">producer. songwriter. artist.</p>
          </div>
          <div className="stack">
            <Kicker num="01">The story so far</Kicker>
            <Reveal as="h2" className="h2" id="story-title">
              {BRAND.years} years <em>behind</em> the desk.
            </Reveal>
            <p className="lead" data-todo="Client to supply a longer bio in his own words.">
              {BRAND.producer} is a music producer, songwriter and artist with {BRAND.years} years of experience. He runs {BRAND.name}, an audio production house in {BRAND.contact.address.city}, and releases his own music on Spotify, Apple Music and YouTube.
            </p>
            <p className="body-dim">
              Look above the desk: three letters, {BRAND.wallMark}. The poster on the wall says the rest. Bring your ideas, let&apos;s make it real.
            </p>
          </div>
        </div>
      </section>

      <section className="section section--deep" aria-labelledby="roles-title">
        <div className="wrap">
          <SectionHead num="02" kicker="Three hats" title={<span id="roles-title">One person. <em>Three</em> jobs.</span>} />
          <div className="cards">
            {ROLES.map((r, i) => (
              <Reveal key={r.title} className="card" delay={i * 0.08}>
                <span className="service-icon"><Icon name={r.icon} size={24} /></span>
                <h3 className="card__title">{r.title}</h3>
                <p className="body-dim">{r.body}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="section" aria-labelledby="artist-title">
        <div className="wrap feature feature--flip">
          <Reveal className="portrait">
            <picture>
              <source type="image/webp" srcSet="/img/artist-portrait-480.webp 480w, /img/artist-portrait-960.webp 960w" sizes="(min-width: 900px) 45vw, 90vw" />
              <img src="/img/artist-portrait-960.jpg" alt={PORTRAIT.alt} width="960" height="960" loading="lazy" decoding="async" />
            </picture>
            <span className="portrait__tag tag">{BRAND.producer} · Artist</span>
          </Reveal>
          <div className="stack">
            <Kicker num="03">The artist</Kicker>
            <Reveal as="h2" className="h2" id="artist-title">
              He makes records <em>for himself</em> too.
            </Reveal>
            <p className="lead">
              {MUSIC_STATS.releases} releases since {MUSIC_STATS.since}, {MUSIC_STATS.videos} official music videos and a feature with {MUSIC_STATS.features.join(', ')} on Barood. When you jam with him, you are working with someone who ships his own songs.
            </p>
            <ArtistLinks className="artist-links--compact" />
            <div className="row">
              <InstagramButton className="btn btn--primary" />
              <Link to="/music" className="link-arrow">
                Hear the releases <Icon name="arrowUp" size={14} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="section section--deep" aria-labelledby="timeline-title">
        <div className="wrap">
          <SectionHead num="04" kicker="On the record" title={<span id="timeline-title">Release <em>by</em> release.</span>} split>
            <p className="lead">Oldest first, straight from the release dates on Spotify. Click any title to play it there.</p>
          </SectionHead>
          <ReleaseTimeline />
        </div>
      </section>

      <section className="section" aria-labelledby="oneness-title">
        <div className="wrap feature">
          <Reveal className="frame">
            <Picture slug={IMAGES.vocal.slug} alt={IMAGES.vocal.alt} sizes="(min-width: 900px) 50vw, 100vw" />
          </Reveal>
          <div className="stack" data-todo="Confirm what the name Oneness means to the client.">
            <Kicker num="05">Why Oneness</Kicker>
            <Reveal as="h2" className="h2" id="oneness-title">
              You, the room, <em>the record.</em> As one.
            </Reveal>
            <p className="lead">
              Vocals, production, mix and master in the same place, with the same ears on all of it. Nothing gets lost between rooms because there is only one.
            </p>
            <Link to="/studio" className="link-arrow">
              See the room <Icon name="arrowUp" size={14} />
            </Link>
          </div>
        </div>
      </section>

      <section className="section section--deep" aria-labelledby="code-title">
        <div className="wrap">
          <SectionHead num="06" kicker="The Oneness code" title={<span id="code-title">How the room <em>works.</em></span>} />
          <ol className="code-list">
            {CODE.map((c, i) => (
              <Reveal as="li" key={c.k} delay={i * 0.06}>
                <span className="code-list__n">{String(i + 1).padStart(2, '0')}</span>
                <span className="code-list__k">{c.k}</span>
                <span className="body-dim">{c.v}</span>
              </Reveal>
            ))}
          </ol>
        </div>
      </section>

      <QuoteBand image="studio-vocal" />

      <section className="section section--tight">
        <div className="wrap">
          <Facts />
        </div>
      </section>

      <Cta kicker="Meet him" title={<>Pull up. <em>Play him</em> the idea.</>} />
    </>
  );
}
