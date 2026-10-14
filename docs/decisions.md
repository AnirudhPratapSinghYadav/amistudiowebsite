# Decisions

## 2026-10-14 (client's final changes before launch)

- **YouTube first.** Every song's main action is a large "Watch on YouTube" button, the biggest control on the card, and the cover opens the same video. Spotify, Apple Music and the rest drop to small "Also on" icons. YouTube leads every profile list (footer, menus, Contact, About) and gets its own channel button on Home, Music and About.
- **No previews.** Songs no longer play on the site: no hover audio, no play buttons, no preview files, no Spotify preview URLs in the data. The beat deck is unchanged; those are his beats, not his songs.
- **No years.** No release year or date appears anywhere: the year chips, year filter, "Releasing since" stats and dated timeline are gone. The timeline is numbered instead. `date` stays in `releases.json` only to keep newest-first order.
- **All seven songs on Home.** The grid shows every release plus the "Your record goes here" slot, which makes two full rows of four on wide screens. Phones get a compact card (cover beside the title, full-width YouTube button).
- **YouTube red from the poster.** The button uses `--neon-red-pink`, the closest poster token to YouTube red. White text on it is about 4:1, so the label is set as large text (19.2 px, weight 900) to pass contrast. The small compact pill uses dark text instead.

## 2026-10-09

- **Name.** Oneness Production, typed once in `src/config/identity.json`. A Vite plugin (`scripts/identity-plugin.js`) writes it into the page head, JSON-LD, manifest, robots and sitemap, so no file repeats it.
- **Logo.** The client's icon stays. The wordmark is live text in Montserrat ("ONENESS" heavy, "PRODUCTION" light italic) so it is sharp at every size and follows the name. The share image and stacked PNGs are rendered from the same font by `build_media.py --brand`.
- **Beats deck.** Both beats play on a turntable: platter spins up to 33 rpm, tonearm drops, a ring around the record moves with the music, the label shows the beat. Arrow keys switch beats, Space plays and stops. It sits on Music, Studio and, as a compact player, on Home. Reduced motion gets a still record.
- **Previews and hover.** Hover plays a release preview only after the visitor turns sound on (browsers block sound before a click). Clicking play during a hover preview keeps it going instead of stopping it. (Replaced on 14 Oct: previews removed.)
- **Bookings.** No server. Every button that books, asks or follows up opens WhatsApp or email with a message already written for that context (service, beat, release, hours). The booking form writes a full ticket.
- **Per-page HTML.** The build writes `music.html`, `book.html` and so on with that page's title, description and preloads, because WhatsApp and Instagram link previews do not run JavaScript.
- **Speed over a static prerender.** A full server prerender would paint sooner, but it needs inline styles for the entrance animations, which the strict CSP forbids. Instead: the hero paints first and the rest of Home mounts one frame later, the headline font and hero photo are preloaded per page, and page chunks are preloaded per route.
- **Header.** The full nav needs 1280 px. From 1100 to 1279 px the header shows the logo, sound, Book and the menu button.
- **Name in copy.** "Records" is gone everywhere outside the dated history in this file and `content/facts.md`.

## 2026-10-05

- **Theme back to the poster palette.** The cream and red "vinyl" theme was dropped. The client's studio photo is the hero background, and the poster tokens (near-black, magenta, violet) match the real room lighting. The new logo is black and white, so it is used in white on dark.
- **Logo.** The WhatsApp JPEG was converted to transparent white and black PNGs with `scripts/build_media.py`. The header uses a horizontal lockup (icon plus wordmark) built from the same artwork, because the stacked logo is unreadable at header size. The footer and the social image use the full stacked logo.
- **Name.** "Oneness Records" (plural), matching the latest logo.
- **Fonts.** Montserrat (variable, upright and italic) for display, which echoes the logo's bold upright "ONENESS" and lighter italic "RECORDS". Inter for body. Permanent Marker for the small handwritten notes, a nod to the poster's brush lettering. All self-hosted through `@fontsource`.
- **Hover demos.** Cards play a silent 3 to 4 second loop on hover or keyboard focus. A click opens the full file: the `href` link when set, otherwise the local clip in a player. Phones get a tap-to-play player (no autoplay).
- **No invented claims.** Removed the fake stats (200+ tracks, 50+ artists, 24/7), the fake testimonials, "EST. 2020" and "Mixing & Mastering". The numbers strip uses only facts: 4+ years, $40 per hour, 5 named genres, 3 services.
- **Quotes.** Studio lines are attributed to Oneness Records itself, never to people.
- **Pages.** Expanded from 3 to 8 routes plus a 404: Home, Services, Work, Studio, About, FAQ, Book, Privacy.
