import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { BRAND } from '../config/brand';
import { BEATS, MUSIC_STATS, RELEASES } from '../content/music';
import { usePageMeta } from '../lib/usePageMeta';
import { useAudio } from '../lib/audio';
import { Icon } from '../components/Icon';
import { Cta, Kicker, Reveal, SectionHead } from '../components/ui';
import { SoundToggle } from '../components/Sound';
import { Deck } from '../components/Deck';
import { ArtistLinks, LatestSpotlight, ReleaseCard, ReleaseList, VideoCard } from '../components/Releases';

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
  const s = useAudio();
  const [year, setYear] = useState('All');
  const [view, setView] = useState('grid');
  const years = useMemo(() => ['All', ...new Set(RELEASES.map((r) => r.year))], []);
  const list = year === 'All' ? RELEASES : RELEASES.filter((r) => r.year === year);

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
            {MUSIC_STATS.releases} songs, {MUSIC_STATS.videos} music videos, one producer. Hover a cover to hear it, then open it wherever you listen.
          </p>
          <div className="music-hero__sound">
            <SoundToggle className="sound-btn--big" />
            <span className="body-dim">{s.sound ? 'Sound is on. Hover any cover.' : 'Turn the sound on and hovering a cover plays it.'}</span>
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
              <dt>Releasing since</dt>
              <dd>{MUSIC_STATS.since}</dd>
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
          <SectionHead num="01" kicker="Discography" title={<span id="all-title">Hover <em>the</em> covers.</span>} split>
            <p className="lead">The record slides out and spins while the preview plays. Tap play on a phone. Every icon under a cover opens that song on that platform.</p>
          </SectionHead>
          <div className="work-toolbar">
            <div className="work-filters" role="group" aria-label="Filter by year">
              {years.map((y) => (
                <button key={y} type="button" className="chip" aria-pressed={year === y} onClick={() => setYear(y)}>
                  {y}
                  {y !== 'All' ? <span aria-hidden="true">{RELEASES.filter((r) => r.year === y).length}</span> : null}
                </button>
              ))}
            </div>
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
            <div className="rel-grid">
              {list.map((r, i) => (
                <Reveal key={r.id} delay={(i % 3) * 0.08}>
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
            <ReleaseList list={list} />
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
        lead={`${BEATS.map((b) => b.title).join(' and ')}, straight from ${BRAND.producer}. Drop the needle, flip between them, and hear the room before you walk in. They also play when you turn the sound on, and step aside whenever you preview a song.`}
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
