# Oneness Production website

> **Freelance project.** Designed and built by [Anirudh Pratap Singh Yadav](https://github.com/AnirudhPratapSinghYadav)
> for **AMI**, music producer, songwriter and artist, and his recording studio **Oneness Production**
> in Calgary, Alberta.

A fast, static website for an independent recording studio. Artists can hear the producer's beats
on a turntable deck in the browser, browse his releases, see the room, and book a session in under
a minute. Every booking goes out as a prefilled WhatsApp message or email, so the studio needs no
backend, no database and no monthly bill.

## The brief

The client came with a poster, a logo, a few phone photos and videos of the studio, two beats and a
Linktree. He wanted:

- a site that feels like the room: dark, neon pink and violet, the "AMI" letters on the wall
- his beats playable on the site
- booking through WhatsApp (his only phone channel) and email, with the message already written
- his releases and every streaming profile in one place, plus Instagram
- clear rates: studio session $60 per hour, vocal recording $40 per hour, production quoted per song
- something that loads fast on a phone

## What I built

| Area | Details |
|---|---|
| **Turntable deck** | Custom audio player built from scratch: spinning platter, moving tonearm, radial spectrum from the Web Audio API, beat crate, scrubber with waveform peaks, crossfade between beats, Media Session controls on the lock screen, full keyboard support and a reduced-motion mode |
| **Booking flow** | Service, hours, genre and idea in, a ticket number and live price out. Opens WhatsApp or email with the full message prefilled. Input sanitising, a honeypot, a rate limit and a strict allow-list on query parameters |
| **Context-aware CTAs** | Every button on the site carries its own prefilled WhatsApp or email text, so the studio knows where the enquiry came from |
| **Nine pages** | Home, Services, Music, Studio, About, Contact, FAQ, Book, Privacy, plus a 404. Lazy-loaded routes with a "tape stop" page transition and an error boundary that recovers from a failed chunk |
| **Releases** | Seven releases with covers, 30 second previews and links to Spotify, Apple Music, YouTube and SoundCloud, all from one JSON file |
| **Single source of truth** | Name, rates, contact details, hours and socials live in one JSON file. A custom Vite plugin writes the page head, JSON-LD, web manifest, robots.txt, sitemap and one HTML file per route, so shared links preview the right page |
| **Brand** | The client's logo icon rebuilt with a live "ONENESS PRODUCTION" wordmark; share image generated from the same font |
| **Media pipeline** | Python and ffmpeg scripts turn the client's raw WAVs, phone photos and videos into responsive images, compressed clips, MP3s and waveform data |

## Quality

Checked across three full QA passes (Playwright and Lighthouse 13.5 mobile, simulated slow 4G):

- **Lighthouse mobile:** Performance 83 to 91, Accessibility 100, Best Practices 100, SEO 100 on all nine pages
- **Layout shift** 0 to 0.002
- **Security:** strict Content Security Policy with no inline scripts or styles, HSTS, frame and referrer headers, no third-party scripts, no secrets in the client, `npm audit` clean
- **Accessibility:** skip link, visible focus on every stop, labelled controls, deck usable by keyboard and screen reader, reduced motion respected
- **Content:** every fact on the site traces back to something the client sent (`content/facts.md`)

Full results are in [`docs/qa-report.md`](docs/qa-report.md) and [`docs/security-audit.md`](docs/security-audit.md).

## Tech stack

- [Vite 8](https://vite.dev) and [React 19](https://react.dev), static output
- [React Router 7](https://reactrouter.com) for routes, [Framer Motion](https://motion.dev) for motion
- Web Audio API and Canvas for the deck
- Self-hosted Montserrat, Inter and Permanent Marker (no font CDN)
- Custom Vite plugins for the page head, per-route HTML and font preloads
- Python, Pillow and ffmpeg for the media pipeline
- Hosting on Vercel; Netlify and Cloudflare Pages configs included

## Run it

```bash
npm install
npm run dev            # http://localhost:5173
npm run build          # static files in dist/
npm run preview        # serve the build on http://localhost:4173
npm run check:links    # every outbound link is https on an allowed host (add -- --live to request each one)
npx oxlint src scripts # lint
```

Add `?todo=1` to any URL to outline every spot that still needs an answer from the client.

## Project structure

```
src/
  config/      identity.json (name, rates, contact, socials, domain), routes
  content/     page meta, releases, beats, services, FAQ, WhatsApp and email messages
  components/  Deck, Layout, Releases, Modal, ErrorBoundary, icons
  pages/       one file per route
  lib/         audio engine, validation, rate limit, contact links
  styles/      tokens.css (the only place a colour is defined) plus partials
scripts/       Vite plugins, media pipeline, link checker
public/        built media, icons, share image, Netlify and Cloudflare headers
assets/        client originals and reference files (fonts, logo)
content/       verified facts and copy
docs/          plan, decisions, QA, security audit, open questions
```

### Where to change things

| What | Where |
|---|---|
| Name, producer, rates, email, WhatsApp, address, hours, socials, domain | `src/config/identity.json` |
| Page titles, descriptions and hero images | `src/content/meta.js` |
| Releases and platform links | `src/content/releases.json` |
| Beats on the deck | `src/content/beats.json` |
| Services, genres, FAQ, studio lines | `src/content/site.js` |
| Prefilled WhatsApp and email text | `src/content/messages.js` |
| Colours | `src/styles/tokens.css` |

## Media

Originals go in `assets/client/` and `assets/reference/`. The client's WAV masters are not committed;
the site ships the encoded MP3s in `public/audio/`. With ffmpeg on the PATH and Pillow installed:

| Command | Does |
|---|---|
| `python scripts/build_media.py` | Everything: photos, logos, wordmark, share image, studio clips, releases and beats |
| `python scripts/build_media.py --brand` | Logos, wordmark PNGs and `og-image.jpg` only |
| `python scripts/build_media.py --releases` | Release covers, previews, video stills, beats and waveforms |
| `python scripts/fetch_releases.py` | Downloads covers and previews for anything new in `releases.json` |
| `node scripts/brand_icons.mjs` | Regenerates `src/components/brandIcons.js` from simple-icons |

To add a beat: drop the WAV in `assets/client/`, add a line to `src/content/beats.json`, run
`python scripts/build_media.py --releases`.

## Deploy

`vercel.json` sets the framework, clean URLs, the strict CSP and security headers, cache rules, the
`/work` to `/music` redirect and the app fallback. `public/_headers` and `public/_redirects` do the
same on Netlify and Cloudflare Pages. Set `domain` in `src/config/identity.json` before the
production build so canonical URLs and the sitemap are written.

## Docs

- [`docs/client-needs.md`](docs/client-needs.md): what the client still needs to answer or send
- [`docs/open-questions.md`](docs/open-questions.md): the same list mapped to the code
- [`docs/security-audit.md`](docs/security-audit.md): headers, form handling, dependencies, with evidence
- [`docs/qa-report.md`](docs/qa-report.md): the three QA passes and their results
- [`docs/decisions.md`](docs/decisions.md), [`docs/third-party.md`](docs/third-party.md), [`content/facts.md`](content/facts.md)

## Credits and rights

- Design and development: **Anirudh Pratap Singh Yadav**, as a freelance commission
- Client: **AMI / Oneness Production**, Calgary. The name, logo, music, photos, videos and release
  artwork belong to the client and are not licensed for reuse
- Fonts: Montserrat and Inter under the SIL Open Font License 1.1 (`assets/reference/fonts/OFL.txt`),
  Permanent Marker under the Apache License 2.0, all self-hosted via Fontsource
- Platform icons: [simple-icons](https://simpleicons.org)
