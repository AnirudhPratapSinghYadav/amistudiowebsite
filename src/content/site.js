// All on-site content lives here. Every line traces to /content/facts.md or is
// marked `todo` (shown in /docs/open-questions.md and highlighted with ?todo=1).

import { BRAND } from '../config/brand.js';
import { BEATS } from './music.js';

const $ = BRAND.currency;

export const IMAGE_WIDTHS = [640, 1024, 1600, 2400];

export const IMAGES = {
  hero: {
    slug: 'studio-hero',
    alt: 'AMI seated at his desk in a studio lit pink and purple, a neon treble clef glowing on the wall above his monitor.',
  },
  wide: {
    slug: 'studio-wide',
    alt: 'Wide view of the studio: foam panels on every wall, AMI lettering above a neon treble clef, keyboards, monitors and an acoustic guitar.',
  },
  wide2: {
    slug: 'studio-wide-2',
    alt: 'AMI at the desk facing the screen, with a softbox light and an acoustic guitar on the right side of the room.',
  },
  vocal: {
    slug: 'studio-vocal',
    alt: 'AMI at the keyboard in front of the DAW screen, a condenser mic with a reflection shield set up to his right.',
  },
};

export const PORTRAIT = {
  alt: 'Portrait of AMI in a glossy black jacket and dark sunglasses, hands pressed together in front of his face.',
};

// The two offers come word for word from the client's message (9 Oct 2026).
// Vocal recording, production and songwriting are the earlier confirmed services.
export const SERVICES = [
  {
    id: 'radio',
    num: '01',
    name: 'Radio-Ready Song',
    icon: 'radio',
    hook: 'You record the vocals. We deliver a radio-ready song.',
    body: 'Come in and record your vocals. We take it from there and hand you a finished, radio-ready song: vocal recording, music production, and the mix and master. One room, start to finish.',
    includes: ['Vocal recording', 'Music production', 'Mix and master'],
    rate: 'Priced per song',
    rateShort: 'Per song',
    points: ['Vocal recording in the treated room', 'Music production built around your voice', 'Mix and master included', 'You leave with a radio-ready song'],
    image: 'vocal',
    todo: 'Confirm the price of the radio-ready song and how long delivery takes.',
  },
  {
    id: 'session',
    num: '02',
    name: 'Studio Session',
    icon: 'headphones',
    hook: `Jam with ${BRAND.producer}. Leave knowing your next move.`,
    body: `For vocalists. Jam with ${BRAND.producer}, music producer, songwriter and artist. We guide you on how to take the song further, and we provide everything. Just tell us what kind of song you are looking for.`,
    rate: `${$}${BRAND.sessionRate} per hour`,
    rateShort: `${$}${BRAND.sessionRate}/hr`,
    hourly: BRAND.sessionRate,
    points: ['Made for vocalists', `Jam with ${BRAND.producer}: producer, songwriter, artist`, 'Guidance on how to take it further', 'We provide everything. Bring the song idea'],
    image: 'hero',
  },
  {
    id: 'vocal',
    num: '03',
    name: 'Vocal Recording',
    icon: 'mic',
    hook: 'Step in. Put the headphones on. Get the take.',
    body: 'Condenser mic, pop filter, reflection shield and foam on the walls. You focus on the performance. The room handles the rest.',
    rate: `${$}${BRAND.vocalRate} per hour`,
    rateShort: `${$}${BRAND.vocalRate}/hr`,
    hourly: BRAND.vocalRate,
    points: ['Condenser mic with pop filter', 'Reflection shield behind the mic', 'Foam-treated walls', `Billed at ${$}${BRAND.vocalRate} per hour`],
    image: 'vocal',
    todo: `Confirm the ${$}${BRAND.vocalRate}/hr vocal-only rate from the poster is still current next to the ${$}${BRAND.sessionRate}/hr studio session.`,
  },
  {
    id: 'production',
    num: '04',
    name: 'Music Production',
    icon: 'laptop',
    hook: 'Your song, built around your sound.',
    body: 'Hip-hop first, plus trap, R&B, Afro, drill and more. Bring a reference beat or start from nothing. The price depends on the song and the genre.',
    rate: 'Priced per song and genre',
    rateShort: 'Per song',
    points: ['Hip-Hop, Trap, R&B, Afro, Drill and more', 'Reference beat welcome, never required', 'Built on the keys and the DAW in the room', 'Quoted on the song and the genre'],
    image: 'wide2',
  },
  {
    id: 'songwriting',
    num: '05',
    name: 'Songwriting',
    icon: 'bulb',
    hook: 'Stuck on the hook? Work it out in the room.',
    body: 'Half a chorus. A verse that will not land. A melody you keep humming. Bring the rough idea and leave with something you can perform.',
    rate: 'Ask when you book',
    rateShort: 'Ask',
    points: ['Hooks, verses and bridges', 'Start from a voice memo or a single line', 'Write over your beat or a new one', 'Leave with something you can perform'],
    image: 'wide',
    todo: 'Confirm how songwriting is priced.',
  },
];

export const HOURLY = SERVICES.filter((s) => s.hourly);

export const GENRES = [
  { name: 'Hip-Hop', line: 'Bars first. Everything else serves them.', main: true },
  { name: 'Trap', line: 'Hi-hats, 808s and space for the hook.' },
  { name: 'R&B', line: 'Room for the voice to breathe.' },
  { name: 'Afro', line: 'The bounce you feel before you hear it.' },
  { name: 'Drill', line: 'Cold, sliding, relentless.' },
  { name: 'And more', line: 'Not on the list? Bring it anyway.' },
];

// The radio-ready route, in the order the client described it.
export const CHAIN = [
  { icon: 'bulb', title: 'Your idea', body: 'Tell us what kind of song you are looking for.' },
  { icon: 'mic', title: 'Vocal recording', body: 'You step up to the mic and record.' },
  { icon: 'laptop', title: 'Music production', body: 'The music gets built around your voice.' },
  { icon: 'sliders', title: 'Mix and master', body: 'Every part balanced, then the final polish.' },
  { icon: 'radio', title: 'Radio-ready', body: 'You walk out with the finished song.' },
];

export const PROCESS = [
  { num: '01', title: 'Tell us the song', body: 'Pick the service and the genre, and tell us what kind of song you are looking for. Two minutes on the booking page or one WhatsApp message.' },
  { num: '02', title: 'Bring a reference, if you have one', body: 'A beat, a song, a sound in your head. It makes things faster. It is not required.' },
  { num: '03', title: 'Record, jam or build', body: `Vocals go down in the treated room. In a studio session you jam with ${BRAND.producer} and work out where the song goes next.` },
  { num: '04', title: 'Leave radio-ready', body: 'On the radio-ready route, production, mix and master are handled for you.', todo: 'Confirm the delivery format (files, stems) and turnaround.' },
];

export const PREP = [
  'Lyrics written, or at least started',
  'A reference track, if you have one',
  'Know the kind of song you want',
  'Rest your voice the night before a vocal session',
  'Water. Room temperature is easier on the voice',
  'Your best idea, even if it is unfinished',
];

export const QUOTES = [
  { text: 'Just tell us what kind of song you are looking for.' },
  { text: 'You bring the voice. We provide everything else.' },
  { text: 'Walk in with an idea. Walk out radio-ready.' },
  { text: 'His name is on the wall. Yours goes on the record.' },
  { text: 'No reference beat? No problem.' },
];

export const CODE = [
  { k: 'Bring the idea', v: 'Not the pressure. Half-finished is fine.' },
  { k: 'We provide everything', v: 'You do not need gear. Just the song you hear in your head.' },
  { k: 'Every genre gets respect', v: 'Hip-hop, trap, R&B, Afro, drill and whatever you bring.' },
  { k: 'The take is the point', v: 'Everything in the room is set up to get it.' },
];

export const ROOM_SPOTS = [
  { id: 'wall', x: 47.9, y: 8.3, title: 'The name on the wall', body: 'AMI, in letters above the desk. The room is his.' },
  { id: 'foam', x: 33.7, y: 30, title: 'Acoustic foam', body: 'Panels frame the desk and line the walls, so you hear the voice, not the room.' },
  { id: 'clef', x: 48.8, y: 40, title: 'The neon clef', body: 'A neon treble clef over the desk. The light the whole room is built around.' },
  { id: 'monitors', x: 26.4, y: 52, title: 'Studio monitors', body: 'A pair of monitors, one each side of the screen, for honest playback.' },
  { id: 'daw', x: 48.8, y: 59, title: 'The DAW', body: 'A large screen running the session. Every beat and every take lives here.' },
  { id: 'mic', x: 83, y: 58, title: 'The vocal chain', body: 'Condenser mic, pop filter and a reflection shield. This is where the take happens.' },
  { id: 'keys', x: 53, y: 71, title: 'MIDI keyboard', body: 'Full keyboard in front of the screen. Melodies and chords go in by hand.' },
  { id: 'keys2', x: 17, y: 79, title: 'Second keyboard', body: 'Another set of keys on the left, headphones ready on top.' },
];

const { contact } = BRAND;

export const FAQ = [
  { q: 'What is a radio-ready song?', a: 'You come in and record your vocals, and we deliver the finished song. Vocal recording, music production, and the mix and master are all included.' },
  { q: 'What is a studio session?', a: `A session for vocalists at ${$}${BRAND.sessionRate} per hour. You jam with ${BRAND.producer}, music producer, songwriter and artist, and we guide you on how to take the song further. We provide everything.` },
  { q: 'Do I need to bring anything?', a: 'Just the idea. Tell us what kind of song you are looking for. A reference beat helps the session move faster, but it is not required.' },
  { q: 'What does it cost?', a: `Studio sessions are ${$}${BRAND.sessionRate} per hour. Vocal recording is ${$}${BRAND.vocalRate} per hour. The radio-ready song and production are priced per song, so send the details and we come back with a number.` },
  { q: 'Where is the studio?', a: `${contact.address.street}, ${contact.address.city}, ${contact.address.region}.` },
  { q: 'When are you open?', a: `Every day, from ${contact.hours.label}.` },
  { q: 'How do I reach you?', a: `WhatsApp ${contact.whatsappDisplay} (WhatsApp only, no regular calls or texts), or email ${contact.email}. The booking form sends straight to either one.` },
  { q: 'Which genres do you take?', a: 'Hip-hop is home. Trap, R&B, Afro, drill and more are all welcome.' },
  { q: `Can I hear ${BRAND.producer}'s work?`, a: `Yes. Every one of his songs is on YouTube, and the Music page links straight to each video. They are on Spotify, Apple Music and more too. His beats ${BEATS.map((b) => b.title).join(' and ')} play on the deck on the Music and Studio pages.` },
  { q: `Where do I follow ${BRAND.producer}?`, a: `YouTube first: every song and video is on his channel. Instagram is ${BRAND.social.instagram.handle}. His music is also on Spotify, Apple Music and SoundCloud, and every link is in the site footer.` },
  { q: 'Who runs the room?', a: `${BRAND.producer}: music producer, songwriter and artist, with ${BRAND.years} years of experience.` },
];

export const NAV = [
  { to: '/', label: 'Home' },
  { to: '/services', label: 'Services' },
  { to: '/music', label: 'Music' },
  { to: '/studio', label: 'Studio' },
  { to: '/about', label: 'About' },
  { to: '/contact', label: 'Contact' },
  { to: '/faq', label: 'FAQ' },
];
