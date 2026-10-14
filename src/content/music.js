// Releases from AMI's Linktree, verified against Spotify and YouTube (see releases.json `_source`).
// Covers and video stills are self-hosted copies made by scripts/build_media.py.
// The client wants no release years and no song previews on the site; every song leads to YouTube.
import DATA from './releases.json' with { type: 'json' };
import WAVES from './waveforms.json' with { type: 'json' };
import BEAT_DATA from './beats.json' with { type: 'json' };

export const PLATFORMS = {
  youtube: { label: 'YouTube', verb: 'Watch on YouTube' },
  spotify: { label: 'Spotify', verb: 'Listen on Spotify' },
  appleMusic: { label: 'Apple Music', verb: 'Listen on Apple Music' },
  youtubeMusic: { label: 'YouTube Music', verb: 'Listen on YouTube Music' },
  tidal: { label: 'TIDAL', verb: 'Listen on TIDAL' },
  soundcloud: { label: 'SoundCloud', verb: 'Listen on SoundCloud' },
};
const ORDER = Object.keys(PLATFORMS);

const fmtDur = (ms) => {
  const s = Math.round(ms / 1000);
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;
};
/* `date` stays in the data only to keep newest-first order; it is never rendered. */
export const RELEASES = DATA.releases.map((r, i) => ({
  id: r.id,
  title: r.title,
  explicit: r.explicit,
  video: r.video,
  youtube: r.links.youtube,
  num: String(i + 1).padStart(2, '0'),
  duration: fmtDur(r.durationMs),
  feat: r.artists.slice(1),
  credit: r.artists.length > 1 ? `${r.artists[0]} feat. ${r.artists.slice(1).join(', ')}` : r.artists[0],
  cover: { webp: `/releases/${r.id}-cover-320.webp 320w, /releases/${r.id}-cover-640.webp 640w`, jpg: `/releases/${r.id}-cover-640.jpg`, small: `/releases/${r.id}-cover-320.webp` },
  still: { webp: `/releases/${r.id}-video-640.webp 640w, /releases/${r.id}-video-1280.webp 1280w`, src: `/releases/${r.id}-video-640.webp` },
  /* Everywhere else the song lives, shown small under the YouTube button. */
  also: ORDER.filter((k) => k !== 'youtube' && r.links[k]).map((k) => ({ id: k, href: r.links[k], ...PLATFORMS[k] })),
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

export const MUSIC_STATS = {
  releases: RELEASES.length,
  onYouTube: RELEASES.filter((r) => r.youtube).length,
  videos: RELEASES.filter((r) => r.video === 'Official Music Video').length,
  visualizers: RELEASES.filter((r) => r.video === 'Official Visualizer').length,
  features: [...new Set(RELEASES.flatMap((r) => r.feat))],
};