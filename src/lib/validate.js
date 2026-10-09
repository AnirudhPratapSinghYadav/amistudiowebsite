// Client-side checks. Any server endpoint added later must repeat every one of these.
import { GENRES, SERVICES } from '../content/site';

// eslint-disable-next-line no-control-regex
const CONTROL = /[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/;
// eslint-disable-next-line no-control-regex
const LINE_BREAKS = /[\u0000-\u001F\u007F\u2028\u2029]+/g;
// Zero-width and bidirectional override characters: invisible, and able to disguise text.
const INVISIBLE = /[\u200B-\u200F\u202A-\u202E\u2060-\u2064\u2066-\u2069\uFEFF]/g;
const EMAIL = /^[^\s@]{1,64}@[^\s@]{1,190}\.[^\s@]{2,24}$/;
const PHONE = /^\+?[0-9 ()-]{7,20}$/;
const ISO_DATE = /^\d{4}-\d{2}-\d{2}$/;

export const LIMITS = { name: 80, contact: 120, message: 1200, reference: 300 };
export const HOURS = { min: 1, max: 10 };
export const SERVICE_IDS = SERVICES.map((s) => s.id);
export const GENRE_NAMES = [...GENRES.filter((g) => g.name !== 'And more').map((g) => g.name), 'Other'];

/* Multi-line text (the idea): invisible characters out, line endings normalised. */
export function clean(v) {
  return String(v ?? '')
    .replace(INVISIBLE, '')
    .replace(/\r\n?/g, '\n')
    .trim();
}

/* Single-line fields: also flattens any line break, so nobody can fake extra lines in the message. */
export function cleanLine(v) {
  return clean(v).replace(LINE_BREAKS, ' ').trim();
}

export const clampHours = (h) => Math.min(HOURS.max, Math.max(HOURS.min, Math.round(Number(h)) || HOURS.min));

export function validate(data) {
  const e = {};
  const name = cleanLine(data.name);
  const contact = cleanLine(data.contact);
  const message = clean(data.message);
  const reference = cleanLine(data.reference);
  const service = SERVICES.find((s) => s.id === data.service);

  if (!service) e.service = 'Pick a service.';
  else if (service.hourly) {
    const h = Number(data.hours);
    if (!Number.isInteger(h) || h < HOURS.min || h > HOURS.max) e.hours = `Pick between ${HOURS.min} and ${HOURS.max} hours.`;
  }
  if (!GENRE_NAMES.includes(data.genre)) e.genre = 'Pick the closest genre.';

  if (name.length < 2) e.name = 'Tell us your name or artist name.';
  else if (name.length > LIMITS.name) e.name = `Keep it under ${LIMITS.name} characters.`;

  if (data.method === 'whatsapp') {
    if (!PHONE.test(contact) || contact.replace(/\D/g, '').length < 7) e.contact = 'Enter a WhatsApp number with country code.';
  } else if (!EMAIL.test(contact) || contact.length > LIMITS.contact) {
    e.contact = 'Enter an email we can reply to.';
  }

  if (message.length < 10) e.message = 'A line or two about the idea. At least 10 characters.';
  else if (message.length > LIMITS.message || CONTROL.test(message.replace(/[\n\t]/g, ''))) e.message = `Keep it under ${LIMITS.message} characters.`;

  if (reference) {
    let ok = false;
    try {
      const u = new URL(reference);
      ok = (u.protocol === 'https:' || u.protocol === 'http:') && reference.length <= LIMITS.reference && !u.username && !u.password;
    } catch {
      ok = false;
    }
    if (!ok) e.reference = 'Paste a full link starting with https://';
  }

  if (data.date) {
    const d = new Date(`${data.date}T00:00:00`);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const limit = new Date(today);
    limit.setFullYear(limit.getFullYear() + 2);
    if (!ISO_DATE.test(data.date) || Number.isNaN(d.getTime()) || d < today || d > limit) e.date = 'Pick a date from today on.';
  }

  return e;
}
