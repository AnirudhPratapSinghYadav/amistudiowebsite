# QA report

Date: 9 Oct 2026. Build: Vite 8 production build served by `vite preview`, tested in headless Chrome
(Playwright) and Lighthouse 13.5 mobile (simulated slow 4G, 4x CPU slowdown).
Routes: `/`, `/services`, `/music`, `/studio`, `/about`, `/contact`, `/faq`, `/book`, `/privacy`, a 404, and the `/work` redirect.

The full suite ran three times. Pass 1 found the issues listed at the end, which were fixed.
Passes 2 and 3 re-ran everything from a clean build and came back green. After pass 3, a
module-import change was re-checked with the interaction, facts and CSP suites, all green.

## Results by step (qa-crosscheck)

| Step | Pass 2 | Pass 3 | Evidence |
|---|---|---|---|
| 1. Facts | Pass | Pass | 58 checks against the rendered pages: name, descriptor, AMI, WhatsApp number and "WhatsApp only", email, address, Calgary, hours, every day, $60, radio-ready, vocal recording, mix and master, 4+ years, both beats, all 7 releases, every platform link of every release (25), Instagram, Linktree, Maps, unique title per page, and no "Oneness Records" anywhere in text, titles or descriptions |
| 2. Theme | Pass | Pass | No hex, `rgb(` or `rgba(` outside `tokens.css`; none in JS either (the deck canvas reads CSS tokens) |
| 3. Copy | Pass | Pass | No banned words, em dashes, exclamation marks or emoji in `src/` or the rendered text (the only pictographic match is the © in the footer) |
| 4. Placeholders | Pass | Pass | 9 open items carry `data-todo` markers, each listed in `docs/open-questions.md` |
| 5. Accessibility | Pass | Pass | Lighthouse 100 on all 9 pages. Keyboard pass: skip link first, logical order, visible focus ring on every stop. Deck: Space plays and stops, arrows switch beats, the position slider reports `aria-valuenow` and "0:09 of 0:46" |
| 6. Responsive | Pass | Pass | 50 full-page screens (10 routes at 360, 390, 768, 1280, 1536): no horizontal scroll, no console errors, no failed requests. Header fits at 1100, 1200, 1280, 1366, 1440. Hero note clear of all text from 1440 to 2560 |
| 7. Security | Pass | Pass | `docs/security-audit.md`. CSP run: zero violations on every page with the deployed policy, JSON-LD, Web Audio, fonts all working. `npm audit`: 0. Link allow-list: 31 of 31 |
| 8. Performance | See below | See below | |
| 9. Links and forms | Pass | Pass | See the interaction list |
| 10. Report | This file | | |

## Interaction tests (all pass in passes 2 and 3)

- Music: Sound on, hover a cover plays its preview, leaving stops it. Clicking play keeps a preview going after the mouse leaves. List view shows 7 rows.
- Deck: play starts and the clock moves, next switches to Mysterious and keeps playing, previous returns to Rolling A Dice, stop works, "Want this sound? Ask AMI" opens WhatsApp with a message.
- Home: the beat switch changes beats, play works. Studio: room hotspot opens its panel, the Studio deck is present.
- Route change: the wipe covers the screen, then leaves; the new page title is correct.
- Booking: a hostile query (`?service=<script>&hours=999`) is ignored; `?service=session&hours=3&genre=Trap` prefills all three. Empty send shows 4+ field errors and an alert. A link with a username and password inside, and a bad contact, are both rejected. A valid send opens `wa.me/15874332555` with the ticket number, service, hours and price ($120 for 2 hours), genre, name (line break flattened), contact and idea, with the hidden right-to-left character stripped. The success screen's email button opens `mailto:iamimusic05@gmail.com` with subject and body. A second send within a minute is blocked. The honeypot sends nothing and shows success.
- Every WhatsApp and mail link on all 9 pages: correct number or address and a message filled in. Instagram is linked on every page.
- Mobile: the menu opens, has Instagram, closes on navigation. `/work` lands on `/music`. Unknown paths show the 404 with `noindex`.

## Performance (Lighthouse mobile)

| Page | Pass 2 | Pass 3 | Accessibility, Best practices, SEO |
|---|---|---|---|
| Home | 88 | 83 | 100, 100, 100 |
| Services | 86 | 87 | 100, 100, 100 |
| Music | 85 | 85 | 100, 100, 100 |
| Studio | 85 | 84 | 100, 100, 100 |
| About | 85 | 87 | 100, 100, 100 |
| Contact | 88 | 87 | 100, 100, 100 |
| FAQ | 91 | 91 | 100, 100, 100 |
| Book | 87 | 87 | 100, 100, 100 |
| Privacy | 91 | 91 | 100, 100, 100 |

Layout shift 0 to 0.002, total blocking time 30 to 220 ms. The LCP element is the hero headline
(Home) or the page hero heading or photo. Scores vary by a few points between identical runs.

Home started this round at 72 to 76. What moved it: the page fade no longer hides the first page,
the long tail of Home mounts one frame after the hero, the headline font is preloaded, each route's
HTML preloads its own chunk and hero photo, and the headline reveal is shorter.
What is left is the time to first paint (about 2.1 s on simulated slow 4G), because the page is drawn
by JavaScript. A full prerender would fix that but needs inline styles, which the strict CSP blocks;
see `docs/decisions.md`.

## Found in pass 1 and fixed

- Clicking play on a cover whose preview hover had started stopped it. It now keeps playing.
- At 1100 to 1279 px the header overflowed and cut off the Book button. The full nav now starts at 1280 px; the menu closes itself if the window grows past that.
- The handwritten hero note overlapped the intro paragraph at 1100 to 1440 px. Moved and limited to 1440 px and up.
- The record label text ran into the spindle hole on phones. The label is now laid out like a pressed record and scales with it.
- The deck's position slider had no `aria-valuenow`.
- The booking date picker used the UTC date, so after 6 pm in Calgary it blocked booking for the same day.
- A `content-visibility` experiment hid off-screen text from find and could misplace anchor jumps. Reverted.
- The home SEO description repeated the rate, city and hours as fixed text. It is now built from `identity.json`.
- The 404 page had no `noindex`, and every page would have shared one canonical URL once a domain is set. Both fixed.
- Vite warned that the config's imports would break under its future native loader. Fixed and verified with `--configLoader native`.
