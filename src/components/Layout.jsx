import { useEffect, useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { AnimatePresence, motion, useScroll } from 'framer-motion';
import { BRAND } from '../config/brand';
import { NAV, SERVICES } from '../content/site';
import { HELLO, MAPS_LINK, mailLink, whatsappLink } from '../lib/contact';
import { MSG, SUBJECT } from '../content/messages';
import { BrandIcon, Icon } from './Icon';
import { Logo, Picture } from './ui';
import { SoundToggle } from './Sound';
import { OpenNow, SocialRow, WhatsAppButton } from './Visit';

const YEAR = new Date().getFullYear();
const { contact } = BRAND;

function Header({ menuOpen, setMenuOpen }) {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const on = () => setScrolled(window.scrollY > 40);
    on();
    window.addEventListener('scroll', on, { passive: true });
    return () => window.removeEventListener('scroll', on);
  }, []);

  return (
    <header className={`site-header${scrolled || menuOpen ? ' is-scrolled' : ''}`}>
      <div className="wrap site-header__inner">
        <Link to="/" className="brand-link" aria-label={`${BRAND.name} home`}>
          <Logo height={40} />
        </Link>
        <nav className="nav" aria-label="Main">
          {NAV.map((l) => (
            <NavLink key={l.to} to={l.to} end={l.to === '/'} className={({ isActive }) => `nav__link${isActive ? ' is-active' : ''}`}>
              {({ isActive }) => (
                <>
                  {l.label}
                  {isActive ? <motion.span layoutId="nav-line" className="nav__line" /> : null}
                </>
              )}
            </NavLink>
          ))}
        </nav>
        <div className="row header-actions">
          <SoundToggle />
          <Link to="/book" className="btn btn--primary btn--sm header-book">
            Book a session
          </Link>
          <button
            type="button"
            className="menu-btn"
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
            onClick={() => setMenuOpen(!menuOpen)}
          >
            <span className="menu-btn__bars">
              <span />
              <span />
              <span />
            </span>
          </button>
        </div>
      </div>
    </header>
  );
}

function MobileMenu({ open }) {
  const links = [...NAV, { to: '/book', label: 'Book' }];
  return (
    <AnimatePresence>
      {open ? (
        <motion.div
          id="mobile-menu"
          className="mobile-menu"
          initial={{ clipPath: 'circle(0% at 95% 4%)' }}
          animate={{ clipPath: 'circle(150% at 95% 4%)' }}
          exit={{ clipPath: 'circle(0% at 95% 4%)' }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="mobile-menu__bg" aria-hidden="true">
            <Picture slug="studio-hero" alt="" />
          </div>
          <nav aria-label="Mobile">
            <ul className="mobile-menu__list">
              {links.map((l, i) => (
                <motion.li key={l.to} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.15 + i * 0.05 }}>
                  <NavLink to={l.to} end={l.to === '/'} className={({ isActive }) => `mobile-menu__link${isActive ? ' is-active' : ''}`}>
                    <span>{String(i + 1).padStart(2, '0')}</span>
                    {l.label}
                  </NavLink>
                </motion.li>
              ))}
            </ul>
          </nav>
          <div className="mobile-menu__foot">
            <OpenNow />
            <div className="mobile-menu__btns">
              <Link to="/book" className="btn btn--primary">
                Book a session <Icon name="arrow" size={18} />
              </Link>
              <WhatsAppButton className="btn btn--ghost">WhatsApp</WhatsAppButton>
            </div>
            <SocialRow />
          </div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}

function Footer() {
  return (
    <footer className="footer">
      <div className="wrap">
        <div className="footer__big">
          <div className="stack" style={{ '--gap': '2rem' }}>
            <Logo variant="stacked" className="footer__logo" height={150} />
            <p className="footer__tag">
              {BRAND.tagline.map((t, i) => (
                <span key={t}>
                  {t}
                  {i < BRAND.tagline.length - 1 ? <i> | </i> : null}
                </span>
              ))}
            </p>
          </div>
          <div className="footer__cta">
            <p className="h2">
              Got an idea? <em>Bring it</em> in.
            </p>
            <Link to="/book" className="btn btn--primary">
              Book a session <Icon name="arrow" size={18} />
            </Link>
          </div>
        </div>
        <div className="footer__grid">
          <div className="footer__intro stack" style={{ '--gap': '1rem' }}>
            <p>
              {BRAND.name} is the audio production house of {BRAND.producer}: {BRAND.roles.join(', ').toLowerCase()}. Radio-ready songs and studio sessions, all in one room.
            </p>
            <OpenNow />
          </div>
          <div className="footer__col">
            <h2>Pages</h2>
            <ul>
              {NAV.map((l) => (
                <li key={l.to}>
                  <Link to={l.to}>{l.label}</Link>
                </li>
              ))}
              <li>
                <Link to="/book">Book</Link>
              </li>
            </ul>
          </div>
          <div className="footer__col">
            <h2>Services</h2>
            <ul>
              {SERVICES.map((s) => (
                <li key={s.id}>
                  <Link to={`/services#${s.id}`}>{s.name}</Link>
                </li>
              ))}
            </ul>
          </div>
          <div className="footer__col">
            <h2>Follow and listen</h2>
            <ul>
              {BRAND.socials.map((s) => (
                <li key={s.id}>
                  <a href={s.href} target="_blank" rel="noopener noreferrer" className="footer__icon-link">
                    <BrandIcon name={s.id} size={16} />
                    {s.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          <div className="footer__col">
            <h2>Visit</h2>
            <ul>
              <li>
                <a href={MAPS_LINK} target="_blank" rel="noopener noreferrer">
                  {contact.address.street}
                  <br />
                  {contact.address.city}, {contact.address.region}
                </a>
              </li>
              <li>
                <span>Every day, {contact.hours.label}</span>
              </li>
              <li>
                <a href={whatsappLink(HELLO)} target="_blank" rel="noopener noreferrer" className="footer__icon-link">
                  <BrandIcon name="whatsapp" size={16} />
                  {contact.whatsappDisplay}
                </a>
              </li>
              <li>
                <a href={mailLink(SUBJECT.hello, MSG.hello)} className="footer__icon-link">
                  <Icon name="mail" size={16} />
                  {contact.email}
                </a>
              </li>
            </ul>
          </div>
        </div>
        <div className="footer__bottom">
          <span>
            © {YEAR} {BRAND.name}. Record. Produce. Create.
          </span>
          <Link to="/privacy">Privacy</Link>
        </div>
      </div>
      <span className="footer__watermark" aria-hidden="true">
        {BRAND.wallMark}
      </span>
    </footer>
  );
}

function BookBar() {
  return (
    <div className="book-bar">
      <span className="book-bar__meta">
        <strong>Studio sessions</strong>
        {BRAND.currency}
        {BRAND.sessionRate}/hr · open daily
      </span>
      <a className="book-bar__wa" href={whatsappLink(HELLO)} target="_blank" rel="noopener noreferrer" aria-label="Message on WhatsApp">
        <BrandIcon name="whatsapp" size={20} />
      </a>
      <Link to="/book" className="btn btn--primary btn--sm">
        Book <Icon name="arrow" size={16} />
      </Link>
    </div>
  );
}

export function Layout({ children }) {
  const location = useLocation();
  const [menuPath, setMenuPath] = useState(null);
  const menuOpen = menuPath === location.pathname;
  const setMenuOpen = (open) => setMenuPath(open ? location.pathname : null);
  const { scrollYProgress } = useScroll();
  const showBar = location.pathname !== '/book';

  useEffect(() => {
    document.body.classList.toggle('has-book-bar', showBar);
  }, [showBar]);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : '';
    if (!menuOpen) return undefined;
    const onKey = (e) => e.key === 'Escape' && setMenuPath(null);
    // Matches the breakpoint in header.css where the full nav replaces the menu button.
    const wide = window.matchMedia('(min-width: 1280px)');
    const onWide = (e) => e.matches && setMenuPath(null);
    window.addEventListener('keydown', onKey);
    wide.addEventListener('change', onWide);
    return () => {
      window.removeEventListener('keydown', onKey);
      wide.removeEventListener('change', onWide);
    };
  }, [menuOpen]);

  useEffect(() => {
    const on = new URLSearchParams(location.search).has('todo');
    if (on) document.documentElement.classList.add('show-todo');
  }, [location.search]);

  return (
    <>
      <a className="skip-link" href="#main">
        Skip to content
      </a>
      <motion.div className="scroll-progress" style={{ scaleX: scrollYProgress }} aria-hidden="true" />
      <Header menuOpen={menuOpen} setMenuOpen={setMenuOpen} />
      <MobileMenu open={menuOpen} />
      <main id="main" tabIndex={-1}>
        {children}
      </main>
      <Footer />
      {showBar ? <BookBar /> : null}
    </>
  );
}
