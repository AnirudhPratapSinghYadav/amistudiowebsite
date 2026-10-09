# Security audit

Site: Oneness Production. Static Vite build, no server, no database, no cookies, no tracking.
Bookings leave the site as a prefilled WhatsApp message or email that the visitor sends themselves.

Each line is pass or fail with the evidence used.

## Architecture

| Check | Result | Evidence |
| --- | --- | --- |
| Static output only | Pass | `npm run build` writes plain files to `dist/`. No server code ships. |
| No secrets in the client or repo | Pass | Search for `api_key`, `secret`, `token`, `password`, `Bearer`, `sk_live`, `AKIA` across the repo (outside `node_modules` and `dist`) finds only variable names. No `.env` files exist; `.env*` is gitignored. |
| Third-party scripts | Pass | None. No analytics, no embeds, no CDN. Fonts are self-hosted through Fontsource. |
| Source maps in production | Pass | `build.sourcemap: false` in `vite.config.js`. |

## Headers (`public/_headers` for Netlify or Cloudflare Pages, `vercel.json` for Vercel)

| Header | Value |
| --- | --- |
| Content-Security-Policy | `default-src 'self'; script-src 'self'; style-src 'self'; img-src 'self' data:; media-src 'self'; font-src 'self'; connect-src 'self'; manifest-src 'self'; worker-src 'none'; frame-src 'none'; object-src 'none'; frame-ancestors 'none'; base-uri 'self'; form-action 'self'; upgrade-insecure-requests` |
| Strict-Transport-Security | `max-age=31536000; includeSubDomains` |
| X-Content-Type-Options | `nosniff` |
| Referrer-Policy | `strict-origin-when-cross-origin` |
| Permissions-Policy | camera, microphone, geolocation, payment, usb and interest-cohort all off |
| Cross-Origin-Opener-Policy | `same-origin` |
| Cross-Origin-Resource-Policy | `same-origin` (stops other sites hotlinking the audio and photos) |
| X-Frame-Options | `DENY` |
| Cache-Control | `index.html` no-cache; hashed `/assets/*` one year immutable; `/img`, `/media`, `/audio`, `/releases`, `/brand` 30 days |

The CSP has no `'unsafe-inline'` and no `'unsafe-eval'`. The site is tested under this exact policy
(see `docs/qa-report.md`): JSON-LD, Web Audio, fonts and animations all work with zero violations.
JSON-LD is a `type="application/ld+json"` data block, which CSP does not treat as a script.

If a form endpoint is ever added to `src/config/identity.json` (`formEndpoint`), its origin must
be added to `connect-src` in both header files, or the browser will block the request.

After deploying, confirm with `curl -I https://<domain>/` that every header above comes back.

## Code

| Check | Result | Evidence |
| --- | --- | --- |
| No HTML injection sinks | Pass | No `innerHTML`, `dangerouslySetInnerHTML`, `outerHTML`, `insertAdjacentHTML`, `document.write`, `eval` or `new Function` in `src/`. React escapes all text. |
| JSON-LD built safely | Pass | `scripts/identity-plugin.js` serialises with `JSON.stringify` and escapes `<` as `\u003c`, so data cannot close the script tag. |
| Query strings allow-listed | Pass | `/book?service=`, `?genre=` and `?hours=` are only used if they match a known service id, a known genre, or a clamped number from 1 to 10. Anything else is ignored. |
| External links | Pass | Every `target="_blank"` link and `window.open` call uses `noopener noreferrer`. |
| Outbound link allow-list | Pass | `npm run check:links` checks all 31 outbound links (socials, releases, WhatsApp) are `https:` on an allowed host with no tracking parameters. `--live` mode: all 31 returned 200 on 9 Oct 2026. |
| Async races | Pass | The audio engine guards beat switches with a token so a slow fade cannot start the wrong track. The booking fetch has a 15 second abort and a double-submit guard. Lazy routes retry once, then reload once, then show an error screen instead of a blank page. |
| Error handling | Pass | `ErrorBoundary` catches render errors and failed chunk loads after a deploy; it resets on navigation. |

## Booking form (`src/pages/Book.jsx`, `src/lib/validate.js`)

| Check | Result |
| --- | --- |
| Allow-listed fields | Service and genre must be from the known lists; hours must be a whole number from 1 to 10. |
| Length caps | Name 80, contact 120, idea 1200, reference link 300. Also enforced with `maxLength`. |
| Control and invisible characters | Control characters are rejected; zero-width and bidirectional override characters are stripped; single-line fields have line breaks flattened, so nobody can forge extra lines in the message AMI receives. |
| Reference link | Must parse as an `http:` or `https:` URL with no username or password inside. |
| Date | Must be ISO format, today or later, and within two years. |
| Honeypot | Hidden `company` field. If filled, the form pretends to succeed and sends nothing. |
| Rate limit | 60 second cooldown between sends, stored in `localStorage` (a courtesy against double sends, not a defence). |
| Server repeat | No server exists today. If `formEndpoint` is set, that endpoint must repeat every check in `validate.js` and add a per-IP rate limit. |
| Data collected | Nothing is stored by the site. The message goes from the visitor's own WhatsApp or email app. The Privacy page says this. |

## Dependencies

| Check | Result | Evidence |
| --- | --- | --- |
| `npm audit` | Pass | 0 vulnerabilities. |
| Versions pinned | Pass | Exact versions in `package.json` (no `^`), lockfile present. |
| Runtime dependencies | 7 | react, react-dom, react-router-dom, framer-motion, three Fontsource font packages. |

## Accepted risks

- The email address and WhatsApp number are visible in the page. The client wants people to reach
  AMI directly, so they are not obfuscated. Expect some spam to the email address.
- `vite preview` and the dev server do not send these headers. Only the host config does.
