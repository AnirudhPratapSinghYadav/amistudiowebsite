// Title, description and hero image for every route. Pages read this through usePageMeta,
// and the build writes it into each route's own HTML file, so a shared link previews the right page.
import { BRAND } from '../config/brand.js';
import { IMAGES } from './site.js';
import { MUSIC_STATS, RELEASES } from './music.js';

const { contact, currency: $, producer, name } = BRAND;
const city = contact.address.city;

export const pageTitle = (title) => (title ? `${title} | ${name}` : `${name} | ${BRAND.descriptor}`);

export const PAGE_META = {
  '/': {
    page: 'Home',
    title: null,
    hero: IMAGES.hero.slug,
    description: `Bring the voice, leave with the record. Vocal recording, production and mix and master in one radio-ready song, or a ${$}${BRAND.sessionRate}/hr studio session with ${producer} in ${city}. Open ${contact.hours.days.toLowerCase()}, ${contact.hours.label}.`,
  },
  '/services': {
    page: 'Services',
    title: 'Services',
    hero: IMAGES.vocal.slug,
    description: `Radio-ready songs (vocal recording, production, mix and master), studio sessions at ${$}${BRAND.sessionRate} per hour, vocal recording at ${$}${BRAND.vocalRate} per hour, music production and songwriting.`,
  },
  '/music': {
    page: 'Music',
    title: 'Music',
    description: `${MUSIC_STATS.releases} songs from ${producer}: ${RELEASES.map((r) => r.title).join(', ')}. Watch every one on YouTube, then play his beats on the deck.`,
  },
  '/studio': {
    page: 'Studio',
    title: 'The Studio',
    hero: IMAGES.wide.slug,
    description: `Inside the ${name} room: acoustic foam, a neon treble clef, studio monitors, keyboards and a condenser mic with a reflection shield.`,
  },
  '/about': {
    page: 'About',
    title: 'About',
    hero: IMAGES.hero.slug,
    description: `${producer}: music producer, songwriter and artist, ${BRAND.years} years of experience. The person behind ${name} in ${city}.`,
  },
  '/contact': {
    page: 'Contact',
    title: 'Contact',
    hero: IMAGES.wide.slug,
    description: `${contact.address.street}, ${city}. Open every day, ${contact.hours.label}. WhatsApp ${contact.whatsappDisplay} or email ${contact.email}.`,
  },
  '/faq': {
    page: 'Faq',
    title: 'FAQ',
    description: `Radio-ready songs, studio sessions, rates, hours, location and how to reach ${name}.`,
  },
  '/book': {
    page: 'Book',
    title: 'Book a session',
    hero: IMAGES.vocal.slug,
    description: `Book a radio-ready song, a ${$}${BRAND.sessionRate}/hr studio session with ${producer}, vocal recording, production or songwriting at ${name}. Sends straight to WhatsApp or email.`,
  },
  '/privacy': {
    page: 'Privacy',
    title: 'Privacy',
    description: `How ${name} handles the details you send through the booking form.`,
  },
  '/404': {
    page: 'NotFound',
    title: 'Page not found',
    noindex: true,
    description: 'That page is not here. Head back to the home page or book a session.',
  },
};
