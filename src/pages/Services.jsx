import { Link } from 'react-router-dom';
import { BRAND } from '../config/brand';
import { IMAGES, PROCESS, SERVICES } from '../content/site';
import { usePageMeta } from '../lib/usePageMeta';
import { Icon } from '../components/Icon';
import { Cta, Kicker, PageHero, Picture, Reveal, SectionHead, Tip } from '../components/ui';
import { PrepChecklist, SessionMeter, SignalChain } from '../components/Interactive';
import { WhatsAppButton } from '../components/Visit';
import { MSG } from '../content/messages';

export default function Services() {
  usePageMeta('/services');

  return (
    <>
      <PageHero
        crumb="Services"
        kicker="Services"
        image={IMAGES.vocal}
        title={
          <>
            Two routes. <em>Three</em> extras.
          </>
        }
        lead={`Record your vocals and leave with a radio-ready song, or jam with ${BRAND.producer} in a studio session. Need just one piece? Vocals, production and songwriting are on the menu too.`}
      >
        <div className="row">
          {SERVICES.map((s) => (
            <a key={s.id} href={`#${s.id}`} className="chip">
              <Icon name={s.icon} size={16} /> {s.name}
            </a>
          ))}
        </div>
      </PageHero>

      {SERVICES.map((s, i) => (
        <section key={s.id} id={s.id} className={`section${i % 2 ? ' section--deep' : ''}`} aria-labelledby={`${s.id}-title`}>
          <div className={`wrap feature${i % 2 ? ' feature--flip' : ''}`}>
            <Reveal className="frame">
              <Picture slug={IMAGES[s.image].slug} alt={IMAGES[s.image].alt} sizes="(min-width: 900px) 50vw, 100vw" />
              <span className="frame__cap tag">{s.rate}</span>
            </Reveal>
            <div className="stack" data-todo={s.todo}>
              <Kicker num={s.num}>{i < 2 ? `Route ${i + 1} · ${s.name}` : s.name}</Kicker>
              <Reveal as="h2" className="h2" id={`${s.id}-title`}>
                {s.hook}
              </Reveal>
              <p className="lead">{s.body}</p>
              <ul className="bullets">
                {s.points.map((p) => (
                  <li key={p}>
                    <Icon name="check" size={16} strokeWidth={2.2} />
                    <span>{p}</span>
                  </li>
                ))}
              </ul>
              <div className="row mt-2">
                <Link to={`/book?service=${s.id}`} className="btn btn--primary">
                  Book {s.name.toLowerCase()} <Icon name="arrow" size={18} />
                </Link>
                <WhatsAppButton className="btn btn--ghost" text={MSG.service(s)}>Ask on WhatsApp</WhatsAppButton>
              </div>
            </div>
          </div>
        </section>
      ))}

      <section className="section" aria-labelledby="chain-title">
        <div className="wrap">
          <SectionHead num="06" kicker="The radio-ready route" title={<span id="chain-title">Follow <em>the</em> signal.</span>} split>
            <p className="lead">What happens between your first take and the finished song.</p>
          </SectionHead>
          <SignalChain />
        </div>
      </section>

      <section className="section section--deep" aria-labelledby="process-title">
        <div className="wrap">
          <SectionHead num="07" kicker="How it runs" title={<span id="process-title">From idea <em>to</em> playback.</span>} split>
            <p className="lead">Four steps. No mystery.</p>
          </SectionHead>
          <ol className="process">
            {PROCESS.map((p, i) => (
              <Reveal as="li" key={p.num} className="process__step" delay={i * 0.08} data-todo={p.todo}>
                <span className="process__num">{p.num}</span>
                <h3 className="process__title">{p.title}</h3>
                <p className="body-dim">{p.body}</p>
              </Reveal>
            ))}
          </ol>
        </div>
      </section>

      <section className="section" aria-labelledby="meter-title">
        <div className="wrap">
          <SectionHead num="08" kicker="The rate" title={<span id="meter-title">Know the number <em>before</em> the red light.</span>} />
          <div className="meter-grid">
            <Reveal>
              <SessionMeter />
            </Reveal>
            <Reveal delay={0.1} className="stack">
              <Tip />
              <div className="tip" data-todo="Radio-ready song price">
                <p className="tip__title">Priced per song</p>
                <p className="body-dim">The radio-ready song and music production depend on the song and the genre. Tell us both and get a number back.</p>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      <section className="section section--deep" aria-labelledby="prep-title">
        <div className="wrap">
          <SectionHead num="09" kicker="Before you pull up" title={<span id="prep-title">Your prep <em>list.</em></span>} split>
            <p className="lead">Tick them off. Your phone remembers, nothing gets sent anywhere.</p>
          </SectionHead>
          <PrepChecklist />
        </div>
      </section>

      <Cta kicker="Pick one" title={<>Radio-ready <em>or</em> jam it out.</>} />
    </>
  );
}
