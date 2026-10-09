import { Suspense, lazy, useEffect, useState } from 'react';
import { BrowserRouter, Navigate, Route, Routes, useLocation } from 'react-router-dom';
import { AnimatePresence, MotionConfig, motion, useReducedMotion } from 'framer-motion';
import { BRAND } from './config/brand';
import { Layout } from './components/Layout';
import { ErrorBoundary } from './components/ErrorBoundary';
import { RELOAD_KEY } from './lib/chunk';
import Home from './pages/Home';

/* Lazy page with one quiet retry, for flaky mobile connections. A successful load clears
   the one-time reload flag that ErrorBoundary sets after a failed one. */
const loaded = (mod) => {
  try {
    sessionStorage.removeItem(RELOAD_KEY);
  } catch {
    /* storage blocked */
  }
  return mod;
};
const page = (load) =>
  lazy(() =>
    load()
      .catch(
        () =>
          new Promise((resolve, reject) => {
            setTimeout(() => load().then(resolve, reject), 700);
          }),
      )
      .then(loaded),
  );

const Services = page(() => import('./pages/Services'));
const Music = page(() => import('./pages/Music'));
const Contact = page(() => import('./pages/Contact'));
const Studio = page(() => import('./pages/Studio'));
const About = page(() => import('./pages/About'));
const Faq = page(() => import('./pages/Faq'));
const Book = page(() => import('./pages/Book'));
const Privacy = page(() => import('./pages/Privacy'));
const NotFound = page(() => import('./pages/NotFound'));

const EASE = [0.22, 1, 0.36, 1];

function Page({ children }) {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }}>
      <Suspense fallback={<div className="page-loading" aria-hidden="true" />}>{children}</Suspense>
    </motion.div>
  );
}

function ScrollManager() {
  const { pathname, hash } = useLocation();
  useEffect(() => {
    if (hash) {
      const id = decodeURIComponent(hash.slice(1));
      const t = setTimeout(() => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 420);
      return () => clearTimeout(t);
    }
    const t = setTimeout(() => window.scrollTo(0, 0), 300);
    return () => clearTimeout(t);
  }, [pathname, hash]);
  return null;
}

/* Panel that sweeps over the page on every route change (not on first load). */
function RouteWipe() {
  const { pathname } = useLocation();
  const reduce = useReducedMotion();
  const [nav, setNav] = useState({ path: pathname, n: 0 });
  if (nav.path !== pathname) setNav({ path: pathname, n: nav.n + 1 });
  if (reduce || nav.n === 0) return null;
  return (
    <motion.div
      key={nav.n}
      className="route-wipe"
      aria-hidden="true"
      initial={{ y: '100%' }}
      animate={{ y: ['100%', '0%', '0%', '-100%'] }}
      transition={{ duration: 0.85, times: [0, 0.38, 0.55, 1], ease: EASE }}
    >
      <img src={BRAND.logo.icon} alt="" width="84" height="67" />
    </motion.div>
  );
}

function AnimatedRoutes() {
  const location = useLocation();
  return (
    <AnimatePresence mode="wait" initial={false}>
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<Page><Home /></Page>} />
        <Route path="/services" element={<Page><Services /></Page>} />
        <Route path="/music" element={<Page><Music /></Page>} />
        <Route path="/work" element={<Navigate to="/music" replace />} />
        <Route path="/contact" element={<Page><Contact /></Page>} />
        <Route path="/studio" element={<Page><Studio /></Page>} />
        <Route path="/about" element={<Page><About /></Page>} />
        <Route path="/faq" element={<Page><Faq /></Page>} />
        <Route path="/book" element={<Page><Book /></Page>} />
        <Route path="/privacy" element={<Page><Privacy /></Page>} />
        <Route path="*" element={<Page><NotFound /></Page>} />
      </Routes>
    </AnimatePresence>
  );
}

function Shell() {
  const { pathname } = useLocation();
  return (
    <Layout>
      <ErrorBoundary resetKey={pathname}>
        <AnimatedRoutes />
      </ErrorBoundary>
    </Layout>
  );
}

export default function App() {
  return (
    <MotionConfig reducedMotion="user">
      <BrowserRouter>
        <ScrollManager />
        <RouteWipe />
        <Shell />
      </BrowserRouter>
    </MotionConfig>
  );
}
