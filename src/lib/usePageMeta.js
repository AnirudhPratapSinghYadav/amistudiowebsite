import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { SITE_URL } from '../config/brand';
import { PAGE_META, pageTitle } from '../content/meta';

function setTag(selector, create, attr, value) {
  let el = document.head.querySelector(selector);
  if (value == null) {
    el?.remove();
    return;
  }
  if (!el) {
    el = create();
    document.head.appendChild(el);
  }
  el.setAttribute(attr, value);
}

const meta = (key, name) => () => {
  const el = document.createElement('meta');
  el.setAttribute(key, name);
  return el;
};

/* route is a key of PAGE_META, for example '/music'. */
export function usePageMeta(route) {
  const { pathname } = useLocation();
  const { title, description, noindex = false } = PAGE_META[route];
  useEffect(() => {
    document.title = pageTitle(title);
    document.querySelector('meta[name="description"]')?.setAttribute('content', description);
    document.querySelector('meta[property="og:description"]')?.setAttribute('content', description);
    document.querySelector('meta[property="og:title"]')?.setAttribute('content', document.title);

    const url = SITE_URL && !noindex ? `${SITE_URL}${pathname === '/' ? '/' : pathname.replace(/\/+$/, '')}` : null;
    setTag('link[rel="canonical"]', () => {
      const el = document.createElement('link');
      el.rel = 'canonical';
      return el;
    }, 'href', url);
    setTag('meta[property="og:url"]', meta('property', 'og:url'), 'content', url);
    setTag('meta[name="robots"]', meta('name', 'robots'), 'content', noindex ? 'noindex' : null);
  }, [title, description, noindex, pathname]);
}
