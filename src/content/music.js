// Releases from AMI's Linktree, verified against Spotify and YouTube (see releases.json `_source`).
// Covers, previews and video stills are self-hosted copies made by scripts/build_media.py.
import DATA from './releases.json' with { type: 'json' };
import WAVES from './waveforms.json' with { type: 'json' };
import BEAT_DATA from './beats.json' with { type: 'json' };

export const PLATFORMS = {
  spotify: { label: 'Spotify', verb: 'Listen on Spotify' },
  appleMusic: { label: 'Apple Music', verb: 'Listen on Apple Music' },
  youtube: { label: 'YouTube', verb: 'Watch on YouTube' },
  youtubeMusic: { label: 'YouTube Music', verb: 'Listen on YouTube Music' },
  tidal: { label: 'TIDAL', verb: 'Listen on TIDAL' },
  soundcloud: { label: 'SoundCloud', verb: 'Listen on SoundCloud' },
};
const ORDER = Object.keys(PLATFORMS);

const fmtDur = (ms) => {
  const s = Math.round(ms / 1000);
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;
};
const fmtDate = (iso) =>
  new Intl.DateTimeFormat('en-US', { day: 'numeric', month: 'short', year: 'numeric', timeZone: 'UTC' }).format(new Date(`${iso}T00:00:00Z`));

export const ARTIST = DATA.artist;

export const RELEASES = DATA.releases.map((r, i) => ({
  ...r,
  num: String(i + 1).padStart(2, '0'),
  year: r.date.slice(0, 4),
  dateLabel: fmtDate(r.date),
  duration: fmtDur(r.durationMs),
  feat: r.artists.slice(1),
  credit: r.artists.length > 1 ? `${r.artists[0]} feat. ${r.artists.slice(1).join(', ')}` : r.artists[0],
  cover: { webp: `/releases/${r.id}-cover-320.webp 320w, /releases/${r.id}-cover-640.webp 640w`, jpg: `/releases/${r.id}-cover-640.jpg`, small: `/releases/${r.id}-cover-320.webp` },
  still: { webp: `/releases/${r.id}-video-640.webp 640w, /releases/${r.id}-video-1280.webp 1280w`, src: `/releases/${r.id}-video-640.webp` },
  preview: `/audio/${r.id}-preview.mp3`,
  wave: WAVES[r.id] || [],
  platforms: ORDER.filter((k) => r.links[k]).map((k) => ({ id: k, href: r.links[k], ...PLATFORMS[k] })),
}));

export const LATEST = RELEASES[0];

/* Beats the client sent to play on the site (beats.json). Encoded by scripts/build_media.py. */
export const BEATS = BEAT_DATA.beats.map((b, i) => ({
  id: b.id,
  title: b.title,
  credit: b.credit,
  kind: 'Beat',
  num: String(i + 1).padStart(2, '0'),
  src: `/audio/${b.id}.mp3`,
  durationSec: b.durationSec,
  duration: fmtDur(Math.floor(b.durationSec) * 1000),
  wave: WAVES[b.id] || [],
}));
export const BEAT = BEATS[0];
export const findBeat = (id) => BEATS.find((b) => b.id === id);
export const isBeat = (id) => BEATS.some((b) => b.id === id);

const years = RELEASES.map((r) => Number(r.year));
export const MUSIC_STATS = {
  releases: RELEASES.length,
  videos: RELEASES.filter((r) => r.video === 'Official Music Video').length,
  visualizers: RELEASES.filter((r) => r.video === 'Official Visualizer').length,
  since: Math.min(...years),
  latestYear: Math.max(...years),
  features: [...new Set(RELEASES.flatMap((r) => r.feat))],
};

export const findRelease = (id) => RELEASES.find((r) => r.id === id);
