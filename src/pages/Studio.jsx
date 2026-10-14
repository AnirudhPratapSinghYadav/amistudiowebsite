import { useCallback, useState } from 'react';
import { BRAND } from '../config/brand';
import { IMAGES } from '../content/site';
import { BEATS } from '../content/music';
import { usePageMeta } from '../lib/usePageMeta';
import { Icon } from '../components/Icon';
import { Cta, Kicker, PageHero, Picture, Reveal, SectionHead } from '../components/ui';
import { RoomTour } from '../components/Interactive';
import { Modal, VideoModal } from '../components/Modal';
import { Deck } from '../components/Deck';

const GALLERY = [IMAGES.hero, IMAGES.vocal, IMAGES.wide, IMAGES.wide2];

const SPECS = [
  ['Acoustic foam', 'Walls and desk frame'],
  ['Neon treble clef', 'Above the desk'],
  ['Studio monitors', 'A pair, both sides'],
  ['Large screen', 'Running the DAW'],
  ['MIDI keyboard', 'In front of the screen'],
  ['Second keyboard', 'Left of the desk'],
  ['Condenser mic', 'Pop filter and reflection shield'],
  ['Softbox light', 'Right side of the room'],
  ['Acoustic guitar', 'In the corner'],
  ['Headphones', 'On the keys, ready'],
];

const CLIPS = [
  { id: 'walk', title: 'Room walkthrough', kind: 'Studio clip', genre: 'The room', artist: BRAND.name, full: '/media/room-walkthrough.mp4', poster: '/media/room-walkthrough.webp', href: '' },
  { id: 'daw', title: 'On the screen', kind: 'Studio clip', genre: 'The DAW', artist: BRAND.name, full: '/media/daw-closeup.mp4', poster: '/media/daw-closeup.webp', href: '' },
];

export default function Studio() {
  usePageMeta('/studio');
  const [shot, setShot] = useState(null);
  const [clip, setClip] = useState(null);
  const close = useCallback(() => setShot(null), []);
  const prev = useCallback(() => setShot((s) => (s + GALLERY.length - 1) % GALLERY.length), []);
  const next = useCallback(() => setShot((s) => (s + 1) % GALLERY.length), []);

  return (
    <>
      <PageHero
        crumb="Studio"
        kicker="The room"
        image={IMAGES.wide}
        title={
          <>
            Built for <em>the</em> take.
          </>
        }
        lead="Foam on the walls, a neon clef over the desk, keys on both sides and a vocal chain in the corner. This is where it happens."
      />

      <section className="section" aria-labelledby="tour-title">
        <div className="wrap">
          <SectionHead num="01" kicker="Room tour" title={<span id="tour-title">Tap around <em>the</em> room.</span>} split>
            <p className="lead">Every number is something you will sit next to. Click one, or use the arrows.</p>
          </SectionHead>
          <Reveal>
            <RoomTour />
          </Reveal>
        </div>
      </section>

      <section className="section section--deep" aria-labelledby="gallery-title">
        <div className="wrap">
          <SectionHead num="02" kicker="Gallery" title={<span id="gallery-title">Lights <em>low.</em> Neon on.</span>} />
          <div className="gallery">
            {GALLERY.map((g, i) => (
              <button key={g.slug} type="button" className="gallery__item" onClick={() => setShot(i)} aria-label={`Open photo ${String(i + 1).padStart(2, '0')}: ${g.alt}`}>
                <Picture slug={g.slug} alt="" sizes="(min-width: 900px) 50vw, 50vw" />
                <span className="work__pill">{String(i + 1).padStart(2, '0')}</span>
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="section" aria-labelledby="clips-title">
        <div className="wrap">
          <SectionHead num="03" kicker="In motion" title={<span id="clips-title">See it <em>move.</em></span>} split>
            <p className="lead">Shot on a phone, in the room, as it is.</p>
          </SectionHead>
          <div className="video-tiles">
            {CLIPS.map((c, i) => (
              <Reveal key={c.id} delay={i * 0.1}>
                <button type="button" className="work__hit" onClick={() => setClip(c)} aria-label={`Play ${c.title}`}>
                  <div className="work__media">
                    <img className="work__poster" src={c.poster} alt="" width="1280" height="720" loading="lazy" />
                    <span className="work__shade" />
                    <span className="work__badge"><span className="work__pill">{c.title}</span></span>
                    <span className="work__play" aria-hidden="true"><Icon name="play" size={22} /></span>
                  </div>
                </button>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <Deck
        id="studio-deck"
        kicker="Hear the room"
        photo="studio-hero"
        title={
          <>
            Hear it <em>before</em> you walk in.
          </>
        }
        lead={`${BEATS.length} beats from ${BRAND.producer} on the deck. Press play, flip between them, then picture your voice on top.`}
      />

      <section className="section section--plum" aria-labelledby="specs-title">
        <div className="wrap feature">
          <div className="stack">
            <Kicker num="04">In the room</Kicker>
            <Reveal as="h2" className="h2" id="specs-title">
              What you <em>will see</em> when you walk in.
            </Reveal>
            <p className="lead">Listed from the photos, nothing added.</p>
          </div>
          <ul className="specs" data-todo="Add exact gear models only if the client supplies them.">
            {SPECS.map(([k, v]) => (
              <li key={k}>
                <span>{k}</span>
                <span>{v}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <Cta kicker="Your turn" title={<>The room is set. <em>Bring</em> the idea.</>} />

      <Modal open={shot !== null} onClose={close} onPrev={prev} onNext={next} label="Studio photo">
        {shot !== null ? (
          <>
            <div className="modal__media">
              <Picture slug={GALLERY[shot].slug} alt={GALLERY[shot].alt} sizes="100vw" />
              <button type="button" className="modal__nav modal__nav--prev" onClick={prev} aria-label="Previous photo"><Icon name="left" size={20} /></button>
              <button type="button" className="modal__nav modal__nav--next" onClick={next} aria-label="Next photo"><Icon name="right" size={20} /></button>
            </div>
            <div className="modal__bar">
              <p className="body-dim">{GALLERY[shot].alt}</p>
              <span className="meter__label">{shot + 1} / {GALLERY.length}</span>
            </div>
          </>
        ) : null}
      </Modal>
      <VideoModal item={clip} onClose={() => setClip(null)} />
    </>
  );
}
