"""Downloads the source media for every release in src/content/releases.json.

Run from the project root:  python scripts/fetch_releases.py
Files land in assets/client/releases/ as originals. build_media.py turns them
into web assets. Re-run when a release is added to releases.json.
"""
import json
import urllib.request
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
DATA = json.loads((ROOT / "src" / "content" / "releases.json").read_text(encoding="utf-8"))
OUT = ROOT / "assets" / "client" / "releases"
OUT.mkdir(parents=True, exist_ok=True)
UA = {"User-Agent": "Mozilla/5.0"}


def get(url, dest):
    if dest.exists() and dest.stat().st_size > 0:
        return
    req = urllib.request.Request(url, headers=UA)
    with urllib.request.urlopen(req, timeout=30) as r:
        dest.write_bytes(r.read())
    print("saved", dest.name)


for rel in DATA["releases"]:
    rid = rel["id"]
    get(rel["coverSrc"], OUT / f"{rid}-cover.jpg")
    get(rel["previewSrc"], OUT / f"{rid}-preview.mp3")
    yt = rel["youtubeId"]
    try:
        get(f"https://i.ytimg.com/vi/{yt}/maxresdefault.jpg", OUT / f"{rid}-video.jpg")
    except Exception:
        get(f"https://i.ytimg.com/vi/{yt}/hqdefault.jpg", OUT / f"{rid}-video.jpg")

get(DATA["artist"]["portrait"], OUT / "artist-portrait.jpg")
