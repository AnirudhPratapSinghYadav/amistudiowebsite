import { useMemo, useRef, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { BRAND } from '../config/brand';
import { FAQ, SERVICES } from '../content/site';
import { GENRE_NAMES, HOURS, LIMITS, clampHours, clean, cleanLine, validate } from '../lib/validate';
import { mailLink, whatsappLink } from '../lib/contact';
import { coolingDown, markSent } from '../lib/rateLimit';
import { usePageMeta } from '../lib/usePageMeta';
import { BrandIcon, Icon } from '../components/Icon';
import { Kicker, Logo, Picture } from '../components/ui';
import { OpenNow, VisitGrid } from '../components/Visit';
import { FaqList } from './Faq';

const $ = BRAND.currency;

function priceOf(service, hours) {
  if (!service) return 'Pick a service';
  if (service.hourly) return `${$}${hours * service.hourly}`;
  return service.id === 'songwriting' ? 'Ask' : 'Quoted';
}

/* Plain-text request, the same for WhatsApp and email. */
function compose(data, no) {
  const service = SERVICES.find((s) => s.id === data.service);
  const hours = clampHours(data.hours);
  const lines = [
    `Hi ${BRAND.producer}, here is my session request from the ${BRAND.name} site.`,
    `Ticket No. ${no}`,
    '',
    `Service: ${service?.name}${service?.hourly ? `, ${hours} ${hours === 1 ? 'hour' : 'hours'} (${priceOf(service, hours)})` : ''}`,
    `Genre: ${data.genre}`,
    data.date ? `Preferred date: ${data.date}` : null,
    `Name: ${cleanLine(data.name)}`,
    `Reply to me on ${data.method === 'whatsapp' ? 'WhatsApp' : 'email'}: ${cleanLine(data.contact)}`,
    cleanLine(data.reference) ? `Reference: ${cleanLine(data.reference)}` : null,
    '',
    'The idea:',
    clean(data.message),
  ];
  return lines.filter((l) => l !== null).join('\n');
}

function Ticket({ data, no, sent, className = '' }) {
  const service = SERVICES.find((s) => s.id === data.service);
  const hours = clampHours(data.hours);
  const bars = useMemo(() => String(no).repeat(6).split('').map((d, i) => (Number(d) % 3) + 1 + (i % 2)), [no]);
  const row = (k, v) => (
    <div className="ticket__row">
      <span>{k}</span>
      <span className={v ? '' : 'is-empty'}>{v || 'Not set'}</span>
    </div>
  );
  return (
    <aside className={`ticket ${className}`} aria-label="Your session ticket">
      <div className="ticket__head">
        <Logo variant="icon" height={44} />
        <span className="ticket__no">
          Session ticket
          <strong>No. {no}</strong>
        </span>
      </div>
      <div className="ticket__body">
        {row('Artist', cleanLine(data.name))}
        {row('Service', service?.name)}
        {service?.hourly ? row('Hours', `${hours} × ${$}${service.hourly}`) : null}
        {row('Genre', data.genre)}
        {row('Reference', cleanLine(data.reference) ? 'Attached' : '')}
        {row('Date', data.date)}
        {row('Reply by', data.method === 'whatsapp' ? 'WhatsApp' : 'Email')}
      </div>
      <div className="ticket__rate">
        <span className="meter__label">{service?.hourly ? 'Estimate' : 'Price'}</span>
        <strong>{priceOf(service, hours)}</strong>
      </div>
      <div className="ticket__code" aria-hidden="true">
        {bars.map((w, i) => (
          <i key={i} style={{ flex: w }} />
        ))}
      </div>
      {sent ? (
        <motion.span className="ticket__stamp" initial={{ scale: 2.4, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ type: 'spring', stiffness: 260, damping: 14 }}>
          Ready
        </motion.span>
      ) : null}
    </aside>
  );
}

function Err({ id, msg }) {
  return msg ? (
    <p className="field__err" id={id}>
      {msg}
    </p>
  ) : null;
}

export default function Book() {
  usePageMeta('/book');
  const [params] = useSearchParams();
  const initialService = SERVICES.some((s) => s.id === params.get('service')) ? params.get('service') : '';
  const initialGenre = GENRE_NAMES.includes(params.get('genre')) ? params.get('genre') : '';
  const initialHours = params.get('hours') ? clampHours(params.get('hours')) : 2;

  const [data, setData] = useState({
    service: initialService,
    hours: String(initialHours),
    genre: initialGenre,
    message: '',
    reference: '',
    name: '',
    method: 'whatsapp',
    contact: '',
    date: '',
    company: '',
  });
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState('idle');
  const [channel, setChannel] = useState('whatsapp');
  const [alert, setAlert] = useState('');
  const [no] = useState(() => String(1000 + Math.floor(Math.random() * 9000)));
  const formRef = useRef(null);
  const layoutRef = useRef(null);
  const [today] = useState(() => new Date().toLocaleDateString('en-CA'));
  const selected = SERVICES.find((s) => s.id === data.service);
  const text = compose(data, no);
  const subject = `Session request: ${selected?.name || BRAND.name} (No. ${no})`;

  const set = (k) => (e) => {
    const v = e.target.value;
    setData((d) => ({ ...d, [k]: v }));
    if (errors[k]) setErrors((x) => ({ ...x, [k]: undefined }));
  };

  const submit = async (e) => {
    e.preventDefault();
    if (status === 'sending') return;
    setAlert('');
    const via = e.nativeEvent?.submitter?.value === 'email' ? 'email' : 'whatsapp';
    if (data.company) {
      setStatus('sent');
      return;
    }
    const errs = validate(data);
    setErrors(errs);
    const keys = Object.keys(errs);
    if (keys.length) {
      setAlert('Something did not go through. Check the highlighted fields and try again.');
      const el = formRef.current?.querySelector(`[name="${keys[0]}"]`);
      el?.focus();
      return;
    }
    if (coolingDown()) {
      setAlert('You just sent one. Give it a minute before sending another.');
      return;
    }
    setChannel(via);

    if (BRAND.formEndpoint) {
      setStatus('sending');
      const payload = {
        service: data.service,
        hours: selected?.hourly ? clampHours(data.hours) : null,
        genre: data.genre,
        message: clean(data.message).slice(0, LIMITS.message),
        reference: cleanLine(data.reference).slice(0, LIMITS.reference),
        name: cleanLine(data.name).slice(0, LIMITS.name),
        method: data.method === 'whatsapp' ? 'whatsapp' : 'email',
        contact: cleanLine(data.contact).slice(0, LIMITS.contact),
        date: data.date || null,
        ticket: no,
      };
      const ctrl = new AbortController();
      const timer = setTimeout(() => ctrl.abort(), 15_000);
      try {
        const res = await fetch(BRAND.formEndpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
          body: JSON.stringify(payload),
          credentials: 'omit',
          signal: ctrl.signal,
        });
        if (!res.ok) throw new Error(String(res.status));
      } catch {
        setStatus('idle');
        setAlert('Something did not go through. Check your connection and try again.');
        return;
      } finally {
        clearTimeout(timer);
      }
    } else if (via === 'email') {
      window.location.assign(mailLink(subject, text));
    } else {
      window.open(whatsappLink(text), '_blank', 'noopener,noreferrer');
    }

    markSent();
    setStatus('sent');
    layoutRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const desc = (k, help) => [help, errors[k] ? `${k}-err` : null].filter(Boolean).join(' ') || undefined;

  return (
    <>
      <section className="page-hero page-hero--book">
        <div className="page-hero__media">
          <Picture slug="studio-vocal" alt="" priority />
        </div>
        <div className="wrap page-hero__inner">
          <nav className="crumbs" aria-label="Breadcrumb">
            <Link to="/">Home</Link>
            <span aria-hidden="true">/</span>
            <span aria-current="page">Book</span>
          </nav>
          <Kicker dot>Book a session</Kicker>
          <h1 className="display">
            Tell us what <em>you are</em> making.
          </h1>
          <p className="lead">Four parts, two minutes. Hit send and your request opens in WhatsApp or email, written and ready to go to {BRAND.producer}.</p>
          <OpenNow />
        </div>
      </section>

      <section className="section section--tight">
        <div className="wrap book-layout" ref={layoutRef}>
          <div>
            {status === 'sent' ? (
              <motion.div className="success" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} role="status">
                <span className="success__icon"><Icon name="check" size={28} strokeWidth={2.5} /></span>
                <h2 className="h2">
                  {BRAND.formEndpoint ? (
                    <>
                      Got it. <em>We will</em> be in touch.
                    </>
                  ) : (
                    <>
                      Almost there. <em>Hit send</em> in {channel === 'email' ? 'your email' : 'WhatsApp'}.
                    </>
                  )}
                </h2>
                <p className="lead">
                  Ticket No. {no} is written up. {BRAND.formEndpoint ? 'Keep working on that idea while you wait.' : 'If nothing opened, use one of these buttons. The message is already filled in.'}
                </p>
                {!BRAND.formEndpoint ? (
                  <div className="row">
                    <a className="btn btn--primary" href={whatsappLink(text)} target="_blank" rel="noopener noreferrer">
                      <BrandIcon name="whatsapp" size={18} /> Open WhatsApp
                    </a>
                    <a className="btn btn--ghost" href={mailLink(subject, text)}>
                      <Icon name="mail" size={18} /> Open email
                    </a>
                  </div>
                ) : null}
                <div className="row">
                  <Link to="/music" className="link-arrow">Hear the music while you wait <Icon name="arrowUp" size={14} /></Link>
                  <Link to="/services#prep-title" className="link-arrow">Your prep list <Icon name="arrowUp" size={14} /></Link>
                </div>
              </motion.div>
            ) : (
              <form ref={formRef} className="form" onSubmit={submit} noValidate>
                <fieldset className="fieldset">
                  <legend><span>01</span> The service</legend>
                  <div className="choice-grid" role="radiogroup" aria-describedby={errors.service ? 'service-err' : undefined}>
                    {SERVICES.map((s, i) => (
                      <label className={`choice${i < 2 ? ' choice--main' : ''}`} key={s.id}>
                        <input type="radio" name="service" value={s.id} checked={data.service === s.id} onChange={set('service')} />
                        <span className="choice__icon"><Icon name={s.icon} size={24} /></span>
                        <span className="choice__name">{s.name}</span>
                        <span className="choice__rate">{s.rate}</span>
                      </label>
                    ))}
                  </div>
                  <Err id="service-err" msg={errors.service} />
                  {selected?.hourly ? (
                    <div className="field">
                      <label htmlFor="hours">How many hours</label>
                      <select id="hours" name="hours" className="input" value={data.hours} onChange={set('hours')}>
                        {Array.from({ length: HOURS.max - HOURS.min + 1 }, (_, i) => i + HOURS.min).map((h) => (
                          <option key={h} value={h}>
                            {h} {h === 1 ? 'hour' : 'hours'} · {$}{h * selected.hourly}
                          </option>
                        ))}
                      </select>
                      <Err id="hours-err" msg={errors.hours} />
                    </div>
                  ) : null}
                </fieldset>

                <fieldset className="fieldset">
                  <legend><span>02</span> The genre</legend>
                  <div className="chip-row" role="radiogroup" aria-describedby={errors.genre ? 'genre-err' : undefined}>
                    {GENRE_NAMES.map((g) => (
                      <label className="chip-radio" key={g}>
                        <input type="radio" name="genre" value={g} checked={data.genre === g} onChange={set('genre')} />
                        <span className="chip">{g}</span>
                      </label>
                    ))}
                  </div>
                  <Err id="genre-err" msg={errors.genre} />
                </fieldset>

                <fieldset className="fieldset">
                  <legend><span>03</span> The song</legend>
                  <div className="field">
                    <label htmlFor="message">What kind of song are you looking for?</label>
                    <textarea
                      id="message"
                      name="message"
                      className="input"
                      maxLength={LIMITS.message}
                      placeholder="A verse and a hook over a dark trap beat. Want it to feel like late night."
                      value={data.message}
                      onChange={set('message')}
                      aria-invalid={!!errors.message}
                      aria-describedby={desc('message', 'message-count')}
                    />
                    <p className="field__help" id="message-count">{data.message.length} / {LIMITS.message}</p>
                    <Err id="message-err" msg={errors.message} />
                  </div>
                  <div className="field">
                    <label htmlFor="reference">Reference link <i>(optional)</i></label>
                    <input
                      id="reference"
                      name="reference"
                      type="url"
                      inputMode="url"
                      className="input"
                      maxLength={LIMITS.reference}
                      placeholder="https://"
                      value={data.reference}
                      onChange={set('reference')}
                      aria-invalid={!!errors.reference}
                      aria-describedby={desc('reference', 'reference-help')}
                    />
                    <p className="field__help" id="reference-help">A reference beat or sound idea makes things easier. Not required.</p>
                    <Err id="reference-err" msg={errors.reference} />
                  </div>
                </fieldset>

                <fieldset className="fieldset">
                  <legend><span>04</span> You</legend>
                  <div className="field-row">
                    <div className="field">
                      <label htmlFor="name">Name or artist name</label>
                      <input id="name" name="name" className="input" autoComplete="name" maxLength={LIMITS.name} value={data.name} onChange={set('name')} aria-invalid={!!errors.name} aria-describedby={desc('name')} />
                      <Err id="name-err" msg={errors.name} />
                    </div>
                    <div className="field">
                      <label htmlFor="date">Preferred date <i>(optional)</i></label>
                      <input id="date" name="date" type="date" min={today} className="input" value={data.date} onChange={set('date')} aria-invalid={!!errors.date} aria-describedby={desc('date')} />
                      <Err id="date-err" msg={errors.date} />
                    </div>
                  </div>
                  <div className="field">
                    <span className="label" id="method-label">Reply to me on</span>
                    <div className="seg" role="radiogroup" aria-labelledby="method-label">
                      {[['whatsapp', 'WhatsApp'], ['email', 'Email']].map(([v, l]) => (
                        <label key={v}>
                          <input type="radio" name="method" value={v} checked={data.method === v} onChange={set('method')} />
                          <span>{l}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                  <div className="field">
                    <label htmlFor="contact">{data.method === 'whatsapp' ? 'Your WhatsApp number' : 'Your email'}</label>
                    <input
                      id="contact"
                      name="contact"
                      className="input"
                      type={data.method === 'whatsapp' ? 'tel' : 'email'}
                      autoComplete={data.method === 'whatsapp' ? 'tel' : 'email'}
                      inputMode={data.method === 'whatsapp' ? 'tel' : 'email'}
                      maxLength={LIMITS.contact}
                      placeholder={data.method === 'whatsapp' ? '+1 555 000 0000' : 'you@example.com'}
                      value={data.contact}
                      onChange={set('contact')}
                      aria-invalid={!!errors.contact}
                      aria-describedby={desc('contact')}
                    />
                    <Err id="contact-err" msg={errors.contact} />
                  </div>
                  <div className="hp" aria-hidden="true">
                    <label htmlFor="company">Company</label>
                    <input id="company" name="company" tabIndex={-1} autoComplete="off" value={data.company} onChange={set('company')} />
                  </div>
                </fieldset>

                <div className="hide-desktop">
                  <Ticket data={data} no={no} className="ticket--mobile" />
                </div>

                <div className="form-foot">
                  {alert ? (
                    <p className="form-alert" role="alert">
                      {alert}
                    </p>
                  ) : null}
                  {BRAND.formEndpoint ? (
                    <button type="submit" className="btn btn--primary btn--block" disabled={status === 'sending'}>
                      {status === 'sending' ? 'Sending...' : 'Send the details'} <Icon name="arrow" size={18} />
                    </button>
                  ) : (
                    <div className="send-row">
                      <button type="submit" name="via" value="whatsapp" className="btn btn--primary">
                        <BrandIcon name="whatsapp" size={18} /> Send on WhatsApp
                      </button>
                      <button type="submit" name="via" value="email" className="btn btn--ghost">
                        <Icon name="mail" size={18} /> Send by email
                      </button>
                    </div>
                  )}
                  <p className="privacy-note">
                    Your request opens in WhatsApp or your email app, addressed to {BRAND.producer}. Nothing is stored on this site. <Link to="/privacy">Privacy</Link>
                  </p>
                </div>
              </form>
            )}
          </div>

          <div className="hide-mobile">
            <Ticket data={data} no={no} sent={status === 'sent'} />
          </div>
        </div>
      </section>

      <section className="section section--deep" aria-labelledby="direct-title">
        <div className="wrap">
          <Kicker num="+">Direct lines</Kicker>
          <h2 className="h2" id="direct-title" style={{ marginBottom: '2rem' }}>
            Rather <em>skip</em> the form?
          </h2>
          <VisitGrid />
        </div>
      </section>

      <section className="section" aria-labelledby="bookfaq-title">
        <div className="wrap">
          <Kicker num="?">Before you send</Kicker>
          <h2 className="h2" id="bookfaq-title" style={{ marginBottom: '2rem' }}>
            Quick <em>answers.</em>
          </h2>
          <FaqList items={FAQ.slice(0, 4)} />
        </div>
      </section>
    </>
  );
}
