// Fills index.html, site.webmanifest, robots.txt and sitemap.xml from src/config/identity.json
// and src/content/meta.js, so the business name, contact details and links are typed in one place.
// Builds also get one HTML file per route (music.html, book.html, ...) carrying that page's title,
// description and preloads, because link previews on WhatsApp and Instagram never run JavaScript.
import ID from '../src/config/identity.json' with { type: 'json' };
import { PAGE_META, pageTitle } from '../src/content/meta.js';
import { IMAGE_WIDTHS } from '../src/content/site.js';

const esc = (s) =>
  String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);

const origin = ID.domain ? `https://${ID.domain}` : '';
const abs = (p) => `${origin}${p}`;
const { contact } = ID;
const pad = (h) => `${String(h).padStart(2, '0')}:00`;
const ROUTES = Object.keys(PAGE_META).filter((r) => !PAGE_META[r].noindex);

function jsonLd() {
  const data = {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    name: ID.name,
    description: `${ID.descriptor}. Radio-ready songs (vocal recording, music production, mix and master) and studio sessions with ${ID.producer}.`,
    image: abs('/og-image.jpg'),
    email: contact.email,
    ...(origin ? { url: origin } : {}),
    address: {
      '@type': 'PostalAddress',
      streetAddress: contact.address.street,
      addressLocality: contact.address.city,
      addressRegion: contact.address.regionCode,
      addressCountry: contact.address.countryCode,
    },
    openingHoursSpecification: {
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
      opens: pad(contact.hours.open),
      closes: pad(contact.hours.close),
    },
    priceRange: `${ID.rates.currency}${ID.rates.session}/hr studio session`,
    sameAs: ID.socials.map((s) => s.href),
    founder: {
      '@type': 'Person',
      name: ID.producer,
      jobTitle: ID.roles.join(', '),
      sameAs: ID.socials.map((s) => s.href),
    },
  };
  // `<` is escaped so no value can ever close the script element.
  return JSON.stringify(data, null, 2).replace(/</g, '\\u003c');
}

/* The tags that change from page to page. */
function routeHead(route) {
  const m = PAGE_META[route];
  const t = esc(pageTitle(m.title));
  const d = esc(m.description);
  const lines = [
    `<title>${t}</title>`,
    `<meta name="description" content="${d}" />`,
    `<meta property="og:title" content="${t}" />`,
    `<meta property="og:description" content="${d}" />`,
  ];
  if (origin) {
    const url = esc(abs(route === '/' ? '/' : route));
    lines.push(`<link rel="canonical" href="${url}" />`, `<meta property="og:url" content="${url}" />`);
  }
  if (m.hero) {
    const set = IMAGE_WIDTHS.map((w) => `/img/${m.hero}-${w}.webp ${w}w`).join(', ');
    lines.push(
      `<link rel="preload" as="image" type="image/webp" href="/img/${m.hero}-1600.webp" imagesrcset="${set}" imagesizes="100vw" fetchpriority="high" />`,
    );
  }
  return lines.join('\n    ');
}

function siteHead() {
  return [
    `<meta property="og:type" content="website" />`,
    `<meta property="og:site_name" content="${esc(ID.name)}" />`,
    `<meta property="og:image" content="${esc(abs('/og-image.jpg'))}" />`,
    `<meta property="og:image:width" content="1200" />`,
    `<meta property="og:image:height" content="630" />`,
    `<meta property="og:image:alt" content="${esc(`${ID.name}, ${ID.descriptor}`)}" />`,
    `<meta name="twitter:card" content="summary_large_image" />`,
    `<meta name="application-name" content="${esc(ID.name)}" />`,
    `<meta name="apple-mobile-web-app-title" content="${esc(ID.shortName)}" />`,
    `<script type="application/ld+json">\n${jsonLd()}\n</script>`,
  ].join('\n    ');
}

function noscript() {
  const a = contact.address;
  return [
    `${esc(ID.name)}, the ${esc(ID.descriptor.toLowerCase())} of ${esc(ID.producer)}. ${esc(ID.tagline.join('. '))}.`,
    `${esc(a.street)}, ${esc(a.city)}, ${esc(a.region)}. Open ${esc(contact.hours.days.toLowerCase())}, ${esc(contact.hours.label)}.`,
    `WhatsApp only: ${esc(contact.whatsappDisplay)}. Email: ${esc(contact.email)}.`,
    'Turn on JavaScript to see the full site.',
  ].join('\n      ');
}

const manifest = () =>
  JSON.stringify(
    {
      name: ID.name,
      short_name: ID.shortName,
      description: `${ID.descriptor}. ${ID.tagline.join(', ')}.`,
      start_url: '/',
      display: 'standalone',
      background_color: '#040410',
      theme_color: '#040410',
      icons: [
        { src: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
        { src: '/icon-512.png', sizes: '512x512', type: 'image/png' },
      ],
    },
    null,
    2,
  );

const robots = () => ['User-agent: *', 'Allow: /', ...(origin ? ['', `Sitemap: ${origin}/sitemap.xml`] : []), ''].join('\n');

const sitemap = () =>
  [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    ...ROUTES.map((r) => `  <url><loc>${esc(abs(r))}</loc></url>`),
    '</urlset>',
    '',
  ].join('\n');

const files = () => ({
  'site.webmanifest': { type: 'application/manifest+json', body: manifest() },
  'robots.txt': { type: 'text/plain', body: robots() },
  ...(origin ? { 'sitemap.xml': { type: 'application/xml', body: sitemap() } } : {}),
});

/* The page's own chunk and everything it imports, minus what index.html already loads. */
function routeChunks(bundle, page, html) {
  const byFile = new Map(Object.values(bundle).filter((c) => c.type === 'chunk').map((c) => [c.fileName, c]));
  const entry = [...byFile.values()].find((c) => c.facadeModuleId?.replace(/\\/g, '/').endsWith(`/src/pages/${page}.jsx`));
  if (!entry) return [];
  const out = new Set();
  const walk = (c) => {
    if (out.has(c.fileName)) return;
    out.add(c.fileName);
    c.imports.forEach((f) => byFile.has(f) && walk(byFile.get(f)));
  };
  walk(entry);
  return [...out].filter((f) => !html.includes(`/${f}"`));
}

export default function identity() {
  return {
    name: 'oneness-identity',
    transformIndexHtml: {
      order: 'pre',
      handler(html) {
        return html
          .replace('<!-- identity:head -->', `${routeHead('/')}\n    ${siteHead()}`)
          .replace('<!-- identity:noscript -->', noscript());
      },
    },
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        const f = files()[(req.url || '').split('?')[0].slice(1)];
        if (!f) return next();
        res.setHeader('Content-Type', f.type);
        res.end(f.body);
        return undefined;
      });
    },
    generateBundle: {
      order: 'post',
      handler(_, bundle) {
        for (const [fileName, f] of Object.entries(files())) {
          this.emitFile({ type: 'asset', fileName, source: f.body });
        }
        const index = bundle['index.html'];
        if (!index) return;
        const html = String(index.source);
        const home = routeHead('/');
        if (!html.includes(home)) this.error('index.html head was changed after the identity plugin ran');
        for (const route of ROUTES.filter((r) => r !== '/')) {
          const preloads = routeChunks(bundle, PAGE_META[route].page, html)
            .map((f) => `<link rel="modulepreload" crossorigin href="/${f}">`)
            .join('\n    ');
          const source = html.replace(home, routeHead(route)).replace('</head>', `  ${preloads}\n  </head>`);
          this.emitFile({ type: 'asset', fileName: `${route.slice(1)}.html`, source });
        }
      },
    },
  };
}
