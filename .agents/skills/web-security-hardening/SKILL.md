---
name: web-security-hardening
description: Security checklist for the Oneness Record site covering headers, CSP, form handling, dependencies, secrets and privacy. Run before every commit and before deployment.
---

# Web security hardening

## Architecture
- Prefer a static build. The only dynamic piece is the booking form.
- Form submissions go to a serverless endpoint or a vetted form service. No secrets in client code or in the repo.

## Headers (set at the host, verify with curl -I)
- Content-Security-Policy: default-src 'self'; script-src 'self'; style-src 'self'; img-src 'self' data:; font-src 'self'; connect-src 'self' <form-endpoint>; frame-ancestors 'none'; base-uri 'self'; form-action 'self' <form-endpoint>. No inline scripts or styles. Add only explicitly approved embeds (for example a music player) to frame-src.
- Strict-Transport-Security: max-age=31536000; includeSubDomains
- X-Content-Type-Options: nosniff
- Referrer-Policy: strict-origin-when-cross-origin
- Permissions-Policy: camera=(), microphone=(), geolocation=()
- Cross-Origin-Opener-Policy: same-origin

## Form handling
- Validate on client and again on server. Allow-list fields, length caps, trim, reject control characters.
- Honeypot field plus rate limit per IP. Add a CAPTCHA only if abuse appears.
- Escape on output. Never use innerHTML with user data.
- Do not store more than needed. No payment data. State what is collected in a short privacy note.
- Email in markup is obfuscated or replaced with the form to reduce scraping.

## Dependencies and supply chain
- Minimal dependencies. Lockfile committed. Run `npm audit` and fix high or critical.
- Pin versions. No unpinned CDN scripts. External links use rel="noopener noreferrer".

## Repo hygiene
- .env in .gitignore, an .env.example with names only. Run a secret scan before each commit.

## Privacy
- No tracking by default. If analytics are wanted, use a cookieless option and disclose it.
- Include a Privacy page link in the footer (short, plain language) [CONFIRM jurisdiction].

## Report
Output a checklist with pass or fail and the command or evidence for each line.
