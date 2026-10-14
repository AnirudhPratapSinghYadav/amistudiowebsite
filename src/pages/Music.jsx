import { useState } from 'react';
import { Link } from 'react-router-dom';
import { BRAND } from '../config/brand';
import { BEATS, MUSIC_STATS, RELEASES } from '../content/music';
import { usePageMeta } from '../lib/usePageMeta';
import { Icon } from '../components/Icon';
import { Cta, Kicker, Reveal, SectionHead } from '../components/ui';
import { Deck } from '../components/Deck';
import { ArtistLinks, LatestSpotlight, ReleaseCard, ReleaseList, VideoCard, YouTubeChannelButton } from '../components/Releases';

function CoverWall() {
  const row = [...RELEASES, ...RELEASES];
  return (
    <div className="cover-wall" aria-hidden="true">
      {[0, 1, 2].map((n) => (
        <div key={n} className={`cover-wall__row cover-wall__row--${n}`}>
          {row.map((r, i) => (
            <img key={`${r.id}-${i}`} src={r.cover.small} alt="" width="320" height="320" loading={n === 0 ? 'eager' : 'lazy'} decoding="async" />
          ))}
        </div>
      ))}
    </div>
  );
}

export default function Music() {
  usePageMeta('/music');
  const [view, setView] = useState('grid');

  return (
    <>
      <section className="page-hero page-hero--music">
        <CoverWall />
        <div className="wrap page-hero__inner">
          <nav className="crumbs" aria-label="Breadcrumb">
            <Link to="/">Home</Link>
            <span aria-hidden="true">/</span>
            <span aria-current="page">Music</span>
          </nav>
          <Kicker dot>{BRAND.producer} on record</Kicker>
          <h1 className="display">
            {MUSIC_STATS.releases} records. <em>Press</em> play.
          </h1>
          <p className="lead">
            {MUSIC_STATS.releases} songs, {MUSIC_STATS.videos} music videos, one producer. Every song plays on YouTube.
          </p>
          <div className="music-hero__cta">
            <YouTubeChannelButton className="yt-btn--xl" />
          </div>
        </div>
      </section>

      <section className="section section--tight" aria-label="In numbers">
        <div className="wrap">
          <dl className="stat-strip">
            <div>
              <dt>Releases</dt>
              <dd>{MUSIC_STATS.releases}</dd>
            </div>
            <div>
              <dt>Official music videos</dt>
              <dd>{MUSIC_STATS.videos}</dd>
            </div>
            <div>
              <dt>Visualizer</dt>
              <dd>{MUSIC_STATS.visualizers}</dd>
            </div>
            <div>
              <dt>Years of experience</dt>
              <dd>{BRAND.years}</dd>
            </div>
          </dl>
        </div>
      </section>

      <section className="section" aria-labelledby="latest-title">
        <div className="wrap">
          <h2 className="sr-only" id="latest-title">Latest release</h2>
          <LatestSpotlight />
        </div>
      </section>

      <section className="section section--deep" aria-labelledby="all-title">
        <div className="wrap">
          <SectionHead num="01" kicker="Discography" title={<span id="all-title">Pick a song. <em>Watch it</em> on YouTube.</span>} split>
            <p className="lead">Every song opens on {BRAND.producer}&apos;s YouTube. The small icons underneath take you to Spotify, Apple Music and the rest.</p>
          </SectionHead>
          <div className="work-toolbar">
            <span className="meter__label">{MUSIC_STATS.releases} songs</span>
            <div className="view-toggle" role="group" aria-label="Layout">
              <button type="button" aria-pressed={view === 'grid'} onClick={() => setView('grid')} aria-label="Grid view">
                <Icon name="grid" size={16} />
              </button>
              <button type="button" aria-pressed={view === 'list'} onClick={() => setView('list')} aria-label="List view">
                <Icon name="list" size={16} />
              </button>
            </div>
          </div>

          {view === 'grid' ? (
            <div className="rel-grid rel-grid--songs">
              {RELEASES.map((r, i) => (
                <Reveal key={r.id} delay={(i % 4) * 0.08}>
                  <ReleaseCard r={r} />
                </Reveal>
              ))}
              <Reveal>
                <Link to="/book" className="work-slot rel-slot">
                  <span className="work-slot__plus">
                    <Icon name="plus" size={24} />
                  </span>
                  <span className="h3">
                    Your record <em>goes here</em>
                  </span>
                  <span className="body-dim">Record your vocals here and leave with a radio-ready song.</span>
                </Link>
              </Reveal>
            </div>
          ) : (
            <ReleaseList list={RELEASES} />
          )}
        </div>
      </section>

      <section className="section" aria-labelledby="videos-title">
        <div className="wrap">
          <SectionHead num="02" kicker="Watch" title={<span id="videos-title">Every song <em>has a</em> video.</span>} split>
            <p className="lead">
              {MUSIC_STATS.videos} official music videos and {MUSIC_STATS.visualizers} visualizer on {BRAND.producer}&apos;s YouTube channel. Each one opens on YouTube.
            </p>
          </SectionHead>
          <div className="rel-grid">
            {RELEASES.map((r, i) => (
              <Reveal key={r.id} delay={(i % 3) * 0.08}>
                <VideoCard r={r} />
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <Deck
        id="music-deck"
        kicker="03 · The crate"
        title={
          <>
            {BEATS.length} beats. <em>One</em> needle.
          </>
        }
        lead={`${BEATS.map((b) => b.title).join(' and ')}, straight from ${BRAND.producer}. Drop the needle, flip between them, and hear the room before you walk in. They also play when you turn the sound on.`}
      />

      <section className="section" aria-labelledby="follow-title">
        <div className="wrap">
          <SectionHead num="04" kicker="Follow" title={<span id="follow-title">Find {BRAND.producer} <em>everywhere.</em></span>} />
          <ArtistLinks />
        </div>
      </section>

      <Cta kicker="Next release" title={<>The next record <em>could be</em> yours.</>} />
    </>
  );
}
