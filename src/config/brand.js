// The only import path for identity in components. Values come from identity.json, which
// vite.config.js also reads to fill index.html and site.webmanifest at build time.
// Empty strings are unconfirmed details: the UI hides them. Each one is tracked in /docs/open-questions.md.
import ID from './identity.json' with { type: 'json' };

export const BRAND = {
  name: ID.name,
  shortName: ID.shortName,
  descriptor: ID.descriptor,
  producer: ID.producer,
  wallMark: ID.wallMark,
  roles: ID.roles,
  tagline: ID.tagline,
  years: ID.years,
  vocalRate: ID.rates.vocal,
  sessionRate: ID.rates.session,
  currency: ID.rates.currency,

  logo: {
    icon: '/brand/logo-icon-white.png',
    iconRatio: 696 / 558,
  },

  // WhatsApp only. No regular calls or SMS, so there is no tel: link anywhere.
  contact: ID.contact,
  socials: ID.socials,
  social: Object.fromEntries(ID.socials.map((s) => [s.id, s])),

  // Optional POST target for the booking form. When empty, requests go out on WhatsApp or email.
  formEndpoint: ID.formEndpoint,
};

export const SITE_URL = ID.domain ? `https://${ID.domain}` : '';
