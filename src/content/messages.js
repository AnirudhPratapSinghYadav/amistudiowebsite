// Every prefilled WhatsApp and email message on the site. Buttons pass one of these to
// whatsappLink() or mailLink() in lib/contact.js, so the visitor only has to press send.
import { BRAND } from '../config/brand';

const P = BRAND.producer;
const N = BRAND.name;
const $ = BRAND.currency;
const { address } = BRAND.contact;

export const MSG = {
  hello: `Hi ${P}, I found ${N} online and want to book a session.`,
  question: `Hi ${P}, I have a question before I book at ${N}.`,
  visit: `Hi ${P}, I want to come by ${N} at ${address.street}, ${address.city}. What time works?`,
  radio: `Hi ${P}, I want a radio-ready song at ${N}: vocal recording, production and mix and master. My idea is:`,
  session: `Hi ${P}, I am a vocalist and want a studio session at ${N} (${$}${BRAND.sessionRate}/hr). The kind of song I want is:`,

  /* A specific service from content/site.js SERVICES. */
  service(s) {
    if (s.id === 'radio') return this.radio;
    if (s.id === 'session') return this.session;
    const rate = s.hourly ? ` (${$}${s.hourly}/hr)` : '';
    return `Hi ${P}, I want to book ${s.name}${rate} at ${N}. Here is what I have:`;
  },

  /* After hearing one of AMI's releases. */
  release: (r) => `Hi ${P}, I just played ${r.title} on the ${N} site. I want to make a song with that energy.`,

  /* After hearing one of the beats on the deck. */
  beat: (b) => `Hi ${P}, I heard your beat ${b.title} on the ${N} site. I want something in that lane for my song.`,

  /* From the rate meter: service and hours already picked. */
  hours: (s, h) => `Hi ${P}, I want ${h} ${h === 1 ? 'hour' : 'hours'} of ${s.name} at ${N} (${$}${s.hourly * h} total). When can I come in?`,
};

export const SUBJECT = {
  hello: `Session at ${N}`,
  question: `Question for ${N}`,
  service: (s) => `${s.name} at ${N}`,
};
