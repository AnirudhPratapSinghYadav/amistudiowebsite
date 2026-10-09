# Oneness Record project rules (always active)

You are building a 3-page marketing site for a hip-hop focused music production and recording house.

Truth rules
- Use only facts from /content/facts.md and /content/copy.md. Never invent names, numbers, claims, testimonials, addresses, hours, awards or gear.
- If a fact is missing, render a visible TODO marker in the code (a `data-todo` attribute and an HTML comment) and list it in /docs/open-questions.md. Do not fill gaps with plausible text.
- Never state a claim you cannot trace to facts.md. Prefer fewer claims.

Brand rules
- Brand name, mark and tagline live only in /src/config/brand.* and are imported everywhere.
- Colors come only from the tokens in /src/styles/tokens.css. No new colors.
- Magenta is the single loud accent. Purple is atmosphere only.

Writing rules
- No emojis anywhere: copy, code comments, commit messages, alt text.
- No em dash. No filler openers. No phrases like "elevate", "unleash", "seamless", "cutting-edge", "state-of-the-art", "world-class", "journey", "passion for".
- Short sentences. Concrete verbs. Written like the engineer talking to an artist.

Engineering rules
- Mobile first, tested at 360, 390, 768, 1280 and 1536 px wide.
- Static output wherever possible. No client-side secrets. No third-party scripts unless listed in /docs/third-party.md with a reason.
- Follow the web-security-hardening skill before every commit.
- Accessibility: WCAG 2.2 AA contrast, keyboard navigation, visible focus, reduced-motion support, real alt text.
- Before saying a task is done, run the qa-crosscheck skill and show the results.
