---
name: poster-theme-frontend
description: Builds Oneness Record pages strictly in the poster theme: near-black base, single magenta accent, violet atmosphere, dry-brush headlines, outlined boxes and brush-stroke tags. Use for any layout, styling or component work.
---

# Poster theme frontend

## Tokens (only these)
--bg-void #040410, --bg-deep #150222, --plum #2E022C, --violet #842DB1, --violet-bright #9412B2, --magenta #FE05B2, --magenta-mid #F70198, --crown #E9069C, --neon-red-pink #F50C70, --text #FFFFFF, --text-soft #FFD6F9

## Components to build once and reuse
- BrushHeadline: white slanted brush display text with a magenta brush-stroke underline (SVG, not an image).
- BrushTag: rough-edged magenta strip used for prices and genre chips, white or dark text chosen for AA contrast.
- OutlineBox: rounded 1px magenta border on a dark plum fill, used for the reference-beat tip.
- LineIcon set: microphone, laptop with waveform, lightbulb, waveform, treble clef. Single-weight magenta strokes, SVG.
- SplitService: two columns with a thin vertical divider (collapses to stacked on mobile).
- NeonGlow: soft magenta/violet radial gradient behind photos, never behind body text.
- GrainEdge: subtle scratch texture on section bottoms, CSS or small SVG, under 10 KB.

## Layout rules
- Sections alternate full-bleed photo with gradient overlay and flat near-black panels.
- One primary button style: magenta fill, dark text. One secondary: magenta outline.
- Body text white on near-black. Never magenta body text on violet.
- Motion: subtle fade and 8px rise on scroll, slow glow pulse on the neon clef only. Respect prefers-reduced-motion. No autoplay audio or video.

## Typography
- Display: use the client's logo SVG if provided. Otherwise test free brush faces and ask the client to choose; record the choice in /docs/decisions.md.
- Body and labels: a geometric sans, uppercase tracked labels for kickers, sentence case for paragraphs.
- Self-host all fonts. No font CDN.

## Performance
- LCP image under 200 KB (AVIF or WebP with a JPEG fallback), explicit width and height, lazy-load below the fold.
- Lighthouse targets on mobile: Performance 90+, Accessibility 100, Best Practices 100, SEO 100.
