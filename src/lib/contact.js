import { BRAND } from '../config/brand';
import { MSG } from '../content/messages';

const { contact } = BRAND;

export const HELLO = MSG.hello;

export const hourLabel = (h) => `${h % 12 || 12} ${h < 12 ? 'am' : 'pm'}`;

export function whatsappLink(text = '') {
  const q = text ? `?text=${encodeURIComponent(text)}` : '';
  return `https://wa.me/${contact.whatsapp}${q}`;
}

export function mailLink(subject = '', body = '') {
  const parts = [];
  if (subject) parts.push(`subject=${encodeURIComponent(subject)}`);
  if (body) parts.push(`body=${encodeURIComponent(body)}`);
  return `mailto:${contact.email}${parts.length ? `?${parts.join('&')}` : ''}`;
}

export const MAPS_LINK = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
  `${contact.address.street}, ${contact.address.city}, ${contact.address.region}, ${contact.address.country}`,
)}`;

/* Studio clock in Calgary time, whatever the visitor's own time zone is. */
export function studioNow(date = new Date()) {
  const parts = new Intl.DateTimeFormat('en-CA', {
    timeZone: contact.hours.tz,
    hour: 'numeric',
    minute: '2-digit',
    hourCycle: 'h23',
  }).formatToParts(date);
  const h = Number(parts.find((p) => p.type === 'hour')?.value ?? 0);
  const m = Number(parts.find((p) => p.type === 'minute')?.value ?? 0);
  const open = h >= contact.hours.open && h < contact.hours.close;
  const time = new Intl.DateTimeFormat('en-US', { timeZone: contact.hours.tz, hour: 'numeric', minute: '2-digit' }).format(date);
  return { h, m, open, time };
}
