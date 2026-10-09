# Build plan (current)

## Routes
| Path | Sections |
|---|---|
| `/` | Hero on the studio photo (REC timecode, neon glow on the clef), genre marquee, scroll-lit manifesto, two-column services split plus songwriting row, session meter and reference tip, tagline strip, three hover-demo cards, rotating studio lines over parallax photo, genre board, producer feature, facts strip, closing call to action |
| `/services` | Hero, one block per service with points and a Book button, four-step process, session meter, production pricing note, prep checklist saved on the device |
| `/work` | Hero, filter by type, grid or list view, hover-demo cards, cursor-following preview in list view, "Your record goes here" slot |
| `/studio` | Hero, interactive room tour with 8 hotspots, gallery with lightbox, two click-to-play studio clips, "In the room" list taken from the photos |
| `/about` | Hero, story, three roles, why Oneness, the Oneness code, studio lines, facts |
| `/faq` | Accordion with confirmed answers only |
| `/book` | Four-part form with live session ticket, direct contact cards, short FAQ |
| `/privacy` | Plain-language privacy note |
| `*` | 404 "Wrong take" |

## File map
- `src/config/brand.js`: name, producer, tagline, rate, logo paths, contact, socials, form endpoint
- `src/content/site.js`: services, genres, process, prep list, studio lines, work cards, room hotspots, FAQ, nav
- `src/styles/tokens.css`: poster colors only. `src/styles/main.css`: every style
- `src/components/`: `Layout`, `ui` (Reveal, Kicker, Brush, Picture, Marquee, Logo, Tip, Facts, PageHero, Cta, SectionHead), `Work` (hover cards, list view, player hook), `Interactive` (timecode, session meter, room tour, quote band, scroll words, genre board, prep checklist), `Modal`, `Icon`
- `src/lib/`: `validate.js` (form rules), `usePageMeta.js`
- `scripts/build_media.py`: regenerates every image, logo, favicon, social image and video clip in `public/` from `assets/`

## Image mapping
| Slot | File |
|---|---|
| Home hero, About feature, gallery 01 | IMG_9025 (`studio-hero`) |
| Studio hero, quote band, gallery 03 | IMG_9026 (`studio-wide`) |
| Producer feature, About hero, Work hero, gallery 04 | IMG_9027 (`studio-wide-2`) |
| Services hero, Book hero, room tour, vocal service, gallery 02 | IMG_9028 (`studio-vocal`) |
| Hover previews 01, 03, 04, 06 and the room clip | IMG_9029 |
| Hover previews 02, 05 and the DAW clip | IMG_9030 |
