# Open questions

Every item marked [MARKER] has a matching `data-todo` attribute in the code. Open any page with
`?todo=1` (for example `http://127.0.0.1:5173/?todo=1`) to see each one outlined in magenta.
The client-facing version of this list, in plain words, is `docs/client-needs.md`.

## Resolved on 9 Oct 2026

- Name: Oneness Production (singular). Tagline stays "Audio Production House".
- Producer name: AMI, as on his Linktree, Spotify and the wall letters.
- Contact: WhatsApp only +1 (587) 433-2555, email iamimusic05@gmail.com.
- Address and hours: 356 Falmere Road NE, Calgary, Alberta. 8 am to 10 pm, every day.
- Offers: radio-ready song (vocal recording, music production, mix and master) and studio session at $60/hr.
- Music: 7 releases and every platform link from his Linktree; Instagram `@ami.a.official`.
- Beats: Rolling A Dice and Mysterious, the two tracks he wants playable on the site.
- Booking: no server. Requests go out as prefilled WhatsApp messages or emails.

## Still open

### Prices and delivery
- [MARKER] Radio-ready song price and delivery time (`src/content/site.js`, Services tip, Home offer card).
- [MARKER] Whether the $40/hr vocal-only rate from the poster is still current (`src/content/site.js`).
- [MARKER] How songwriting is priced (`src/content/site.js`).
- [MARKER] Delivery format (master, stems) and turnaround, process step 04 (`src/content/site.js`).
- [MARKER] Walk-ins or appointment only (`src/pages/Contact.jsx`).

### About
- [MARKER] Longer bio in his own words (`src/pages/About.jsx`).
- [MARKER] What "Oneness" means to him (`src/pages/About.jsx`).
- [MARKER] Exact gear models, only if he wants them listed (`src/pages/Studio.jsx`).

### Legal
- [MARKER] Contact for privacy requests (`src/pages/Privacy.jsx`).

### No marker (does not change visible copy)
- Domain (`domain` in `src/config/identity.json`). Turns on canonical links, absolute `og:image` and the sitemap.
- Rolling A Dice credit line (`credit` in `src/content/beats.json`, empty until confirmed).
- Whether the beats are for lease or showcase only.
- Other profiles: TikTok, Facebook, Google Business Profile.
- Official vector of the new "ONENESS PRODUCTION" wordmark.
- Permission to self-host the release previews, covers and portrait (his own music and photo).
- Postal code (T3J 2Z4 in public records) and whether to show it.
- Optional form endpoint (`formEndpoint` in `src/config/identity.json`). If set, add its origin to `connect-src` in `public/_headers` and `vercel.json`.
