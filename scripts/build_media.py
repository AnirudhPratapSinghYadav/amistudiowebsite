"""Builds every web asset in /public from the client originals in /assets.

Run from the project root:  python scripts/build_media.py
Needs Pillow and ffmpeg on PATH. Re-run whenever the client sends new files.
"""
import subprocess
from pathlib import Path

from PIL import Image, ImageDraw, ImageEnhance, ImageFilter

ROOT = Path(__file__).resolve().parent.parent
SRC = ROOT / "assets" / "client"
REF = ROOT / "assets" / "reference"
OUT_IMG = ROOT / "public" / "img"
OUT_MEDIA = ROOT / "public" / "media"
OUT_BRAND = ROOT / "public" / "brand"
for d in (OUT_IMG, OUT_MEDIA, OUT_BRAND):
    d.mkdir(parents=True, exist_ok=True)

VOID = (4, 4, 16)

PHOTOS = {
    "studio-hero": "studio-hero-IMG_9025.jpg",
    "studio-wide": "studio-wide-IMG_9026.jpg",
    "studio-wide-2": "studio-wide-IMG_9027.jpg",
    "studio-vocal": "studio-vocal-IMG_9028.jpg",
}
WIDTHS = (640, 1024, 1600, 2400)


def photos():
    for slug, name in PHOTOS.items():
        im = Image.open(SRC / name).convert("RGB")
        for w in WIDTHS:
            h = round(im.height * w / im.width)
            im.resize((w, h), Image.LANCZOS).save(
                OUT_IMG / f"{slug}-{w}.webp", "WEBP", quality=72, method=6
            )
        h = round(im.height * 1600 / im.width)
        im.resize((1600, h), Image.LANCZOS).save(
            OUT_IMG / f"{slug}-1600.jpg", "JPEG", quality=78, optimize=True, progressive=True
        )
        print("photo", slug)


def logo_mask(crop_box=None):
    """Turns the black-on-white JPEG logo into an alpha mask."""
    im = Image.open(REF / "logo-oneness-records.jpg").convert("L")
    if crop_box:
        im = im.crop(crop_box)
    lo, hi = 40, 215
    return im.point(lambda v: 255 if v <= lo else 0 if v >= hi else round(255 * (hi - v) / (hi - lo)))


def tinted(mask, rgb):
    layer = Image.new("RGBA", mask.size, rgb + (0,))
    layer.putalpha(mask)
    return layer


def pad(img, p):
    out = Image.new("RGBA", (img.width + 2 * p, img.height + 2 * p), (0, 0, 0, 0))
    out.paste(img, (p, p), img)
    return out


def logos():
    # Icon box measured from the 1536 x 1024 source.
    icon_box = (410, 128, 1106, 686)

    # Only the icon is taken from the artwork: its wordmark still reads the old name.
    # The wordmark is set from identity.json by wordmark() and as live text in <Logo>.
    icon = logo_mask(icon_box)
    for name, rgb in (("white", (255, 255, 255)), ("black", (0, 0, 0))):
        tinted(icon, rgb).save(OUT_BRAND / f"logo-icon-{name}.png", optimize=True)
    for old in ("logo-lockup-white.png", "logo-stacked-white-800.png"):
        (OUT_BRAND / old).unlink(missing_ok=True)

    # Favicons: white icon on the void background.
    for size, fname in ((32, "favicon-32.png"), (180, "apple-touch-icon.png"), (512, "icon-512.png")):
        tile = Image.new("RGBA", (size, size), VOID + (255,))
        if size >= 180:
            m = Image.new("L", (size, size), 0)
            ImageDraw.Draw(m).rounded_rectangle((0, 0, size - 1, size - 1), radius=size // 5, fill=255)
            tile.putalpha(m)
        inner = round(size * 0.78)
        ic = tinted(icon, (255, 255, 255))
        ic.thumbnail((inner, inner), Image.LANCZOS)
        tile.alpha_composite(ic, ((size - ic.width) // 2, (size - ic.height) // 2))
        tile.save(ROOT / "public" / fname, optimize=True)
    print("logos")


FONTS = REF / "fonts"
FONT_BASE = "https://raw.githubusercontent.com/JulietaUla/Montserrat/master/"
FONT_FILES = {
    "bold": "Montserrat-ExtraBold.ttf",
    "italic": "Montserrat-MediumItalic.ttf",
    "regular": "Montserrat-Regular.ttf",
}


def fonts():
    """Montserrat TTFs (SIL OFL 1.1) for rendering the wordmark into images."""
    import urllib.request
    FONTS.mkdir(parents=True, exist_ok=True)
    for rel in [f"fonts/ttf/{f}" for f in FONT_FILES.values()] + ["OFL.txt"]:
        dest = FONTS / Path(rel).name
        if not dest.exists() or dest.stat().st_size == 0:
            with urllib.request.urlopen(FONT_BASE + rel, timeout=30) as r:
                dest.write_bytes(r.read())
    return {k: str(FONTS / v) for k, v in FONT_FILES.items()}


def text_line(segments, size):
    """Renders [(text, font_path, tracking_em)] on one baseline into an L mask."""
    from PIL import ImageFont
    fonts_ = [(t, ImageFont.truetype(p, size), tr) for t, p, tr in segments]
    width = sum(sum(f.getlength(c) + tr * size for c in t) for t, f, tr in fonts_)
    asc = max(f.getmetrics()[0] for _, f, _ in fonts_)
    desc = max(f.getmetrics()[1] for _, f, _ in fonts_)
    im = Image.new("L", (round(width) + 4, asc + desc), 0)
    d = ImageDraw.Draw(im)
    x = 0.0
    for t, f, tr in fonts_:
        for c in t:
            d.text((x, asc), c, font=f, fill=255, anchor="ls")
            x += f.getlength(c) + tr * size
    return im.crop(im.getbbox())


def wordmark():
    """Stacked logo: icon, then the name from identity.json, then the descriptor."""
    import json
    ident = json.loads((ROOT / "src" / "config" / "identity.json").read_text(encoding="utf-8"))
    f = fonts()
    first, _, rest = ident["name"].upper().partition(" ")
    word = text_line([(first + " ", f["bold"], 0.0), (rest, f["italic"], 0.0)], 120)
    tag = text_line([(ident["descriptor"].upper(), f["regular"], 0.32)], 44)
    tag = tag.resize((round(word.width * 0.86), round(tag.height * word.width * 0.86 / tag.width)), Image.LANCZOS)
    icon = logo_mask((410, 128, 1106, 686))
    w = max(icon.width, word.width)
    h = icon.height + 70 + word.height + 46 + tag.height
    m = Image.new("L", (w, h), 0)
    m.paste(icon, ((w - icon.width) // 2, 0))
    m.paste(word, ((w - word.width) // 2, icon.height + 70))
    m.paste(tag, ((w - tag.width) // 2, icon.height + 70 + word.height + 46))
    for name, rgb in (("white", (255, 255, 255)), ("black", (0, 0, 0))):
        pad(tinted(m, rgb), 24).save(OUT_BRAND / f"logo-stacked-{name}.png", optimize=True)
    print("wordmark", ident["name"])


def og_image():
    im = Image.open(SRC / PHOTOS["studio-hero"]).convert("RGB")
    w, h = 1200, 630
    ratio = max(w / im.width, h / im.height)
    im = im.resize((round(im.width * ratio), round(im.height * ratio)), Image.LANCZOS)
    left = (im.width - w) // 2
    im = im.crop((left, (im.height - h) // 2, left + w, (im.height - h) // 2 + h))
    im = ImageEnhance.Brightness(im).enhance(0.42).filter(ImageFilter.GaussianBlur(1.5))
    canvas = im.convert("RGBA")
    logo = Image.open(OUT_BRAND / "logo-stacked-white.png")
    logo.thumbnail((560, 380), Image.LANCZOS)
    canvas.alpha_composite(logo, ((w - logo.width) // 2, (h - logo.height) // 2))
    canvas.convert("RGB").save(ROOT / "public" / "og-image.jpg", "JPEG", quality=82, optimize=True)
    print("og")


def ff(*args):
    subprocess.run(["ffmpeg", "-v", "error", "-y", *args], check=True)


def videos():
    walk = str(SRC / "room-walkthrough-IMG_9029.mp4")
    daw = str(SRC / "daw-closeup-IMG_9030.mp4")

    # Full clips, opened on click. Audio kept.
    for src, name in ((walk, "room-walkthrough"), (daw, "daw-closeup")):
        ff("-i", src, "-vf", "scale=1280:-2", "-c:v", "libx264", "-preset", "slow", "-crf", "27",
           "-c:a", "aac", "-b:a", "96k", "-movflags", "+faststart", str(OUT_MEDIA / f"{name}.mp4"))
        ff("-ss", "0.5", "-i", src, "-frames:v", "1", "-vf", "scale=1280:-2", str(OUT_MEDIA / f"{name}.webp"))
    print("videos")


REL = SRC / "releases"
OUT_REL = ROOT / "public" / "releases"
OUT_AUDIO = ROOT / "public" / "audio"


def peaks(path, bins):
    """Loudness per bin (0 to 100) for drawing a waveform without decoding in the browser.
    RMS rather than peak, so mastered tracks show their shape instead of a flat wall."""
    raw = subprocess.run(
        ["ffmpeg", "-v", "error", "-i", str(path), "-ac", "1", "-ar", "8000", "-f", "s16le", "-"],
        check=True, capture_output=True,
    ).stdout
    import array
    import math
    s = array.array("h", raw)
    step = max(1, len(s) // bins)
    out = []
    for i in range(bins):
        chunk = s[i * step:(i + 1) * step] or array.array("h", [0])
        out.append(math.sqrt(sum(v * v for v in chunk) / len(chunk)))
    lo, hi = min(out), max(out) or 1
    # Stretch the range so quiet and loud parts read clearly; 12 is the floor.
    return [round(12 + 88 * ((v - lo) / (hi - lo or 1)) ** 1.6) for v in out]


def releases():
    import json
    OUT_REL.mkdir(parents=True, exist_ok=True)
    OUT_AUDIO.mkdir(parents=True, exist_ok=True)
    data = json.loads((ROOT / "src" / "content" / "releases.json").read_text(encoding="utf-8"))
    wave = {}
    for rel in data["releases"]:
        rid = rel["id"]
        cover = Image.open(REL / f"{rid}-cover.jpg").convert("RGB")
        for w in (320, 640):
            cover.resize((w, w), Image.LANCZOS).save(OUT_REL / f"{rid}-cover-{w}.webp", "WEBP", quality=78, method=6)
        cover.save(OUT_REL / f"{rid}-cover-640.jpg", "JPEG", quality=80, optimize=True, progressive=True)

        video = Image.open(REL / f"{rid}-video.jpg").convert("RGB")
        for w in (640, 1280):
            video.resize((w, round(w * 9 / 16)), Image.LANCZOS).save(
                OUT_REL / f"{rid}-video-{w}.webp", "WEBP", quality=74, method=6
            )

        # Spotify previews are already small 96 kbps MP3s. Strip tags, keep the audio untouched.
        ff("-i", str(REL / f"{rid}-preview.mp3"), "-map_metadata", "-1", "-c:a", "copy",
           str(OUT_AUDIO / f"{rid}-preview.mp3"))
        wave[rid] = peaks(REL / f"{rid}-preview.mp3", 48)

    portrait = Image.open(REL / "artist-portrait.jpg").convert("RGB")
    for w in (480, 960):
        portrait.resize((w, w), Image.LANCZOS).save(OUT_IMG / f"artist-portrait-{w}.webp", "WEBP", quality=76, method=6)
    portrait.resize((960, 960), Image.LANCZOS).save(OUT_IMG / "artist-portrait-960.jpg", "JPEG", quality=80, optimize=True)

    wave.update(beats())
    (ROOT / "src" / "content" / "waveforms.json").write_text(json.dumps(wave), encoding="utf-8")
    print("releases and audio")


def beats():
    """Every beat in src/content/beats.json: 128 kbps MP3 without tags, plus 96 waveform peaks."""
    import json
    OUT_AUDIO.mkdir(parents=True, exist_ok=True)
    data = json.loads((ROOT / "src" / "content" / "beats.json").read_text(encoding="utf-8"))
    wave = {}
    for b in data["beats"]:
        src = SRC / b["file"]
        ff("-i", str(src), "-map_metadata", "-1", "-ac", "2", "-ar", "44100", "-c:a", "libmp3lame", "-b:a", "128k",
           str(OUT_AUDIO / f"{b['id']}.mp3"))
        wave[b["id"]] = peaks(src, 96)
        print("beat", b["id"])
    return wave


if __name__ == "__main__":
    import sys
    if "--releases" in sys.argv:
        releases()
    elif "--brand" in sys.argv:
        logos()
        wordmark()
        og_image()
    else:
        photos()
        logos()
        wordmark()
        og_image()
        videos()
        releases()
