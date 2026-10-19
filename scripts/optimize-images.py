"""Write web-sized WebP copies of assets/images into public/images.

The originals in assets/ are read only and never modified. assets/found/ holds
open-licence pictures found for the site, with their credits in credits.json.
Each source becomes <name>-<width>.webp for each width listed below, the
image capped at the source width; src/data/images.json records real sizes.
"""
import json
from pathlib import Path

from PIL import Image

ROOT = Path(__file__).resolve().parent.parent
SRC = ROOT / "assets" / "images"
OUT = ROOT / "public" / "images"
FOUND = ROOT / "assets" / "found"

# Never published: cream_oud_roses shows another brand's name on its label.
EXCLUDE = {"cream_oud_roses"}

WIDTHS = {
    "hero": (800, 1376),
    "angles": (640,),
    "logo": (96, 192, 384),
    "default": (480, 960),
}


def widths_for(path: Path) -> tuple[int, ...]:
    if path.parent.name == "angles":
        return WIDTHS["angles"]
    if path.stem.startswith("hero"):
        return WIDTHS["hero"]
    if path.stem == "atyab_logo":
        return WIDTHS["logo"]
    return WIDTHS["default"]


def main() -> None:
    sources = [*SRC.glob("*.jpg"), *SRC.glob("angles/*.jpg"), SRC / "atyab_logo.png", *FOUND.glob("*.jpg")]
    manifest: dict[str, dict] = {}
    for src in sorted(s for s in sources if s.stem not in EXCLUDE):
        rel = (Path("found") / src.stem) if src.parent == FOUND else src.relative_to(SRC).with_suffix("")
        with Image.open(src) as im:
            im = im.convert("RGBA" if im.mode in ("RGBA", "LA", "P") else "RGB")
            manifest[rel.as_posix()] = {"w": im.width, "h": im.height, "sizes": {}}
            for label in widths_for(src):
                w = min(label, im.width)
                h = round(im.height * w / im.width)
                dest = OUT / f"{rel}-{label}.webp"
                manifest[rel.as_posix()]["sizes"][label] = w
                dest.parent.mkdir(parents=True, exist_ok=True)
                im.resize((w, h), Image.LANCZOS).save(dest, "WEBP", quality=80, method=6)
                print(f"{dest.relative_to(ROOT)}  {w}x{h}  {dest.stat().st_size // 1024} KB")
    (ROOT / "src" / "data").mkdir(parents=True, exist_ok=True)
    (ROOT / "src" / "data" / "images.json").write_text(json.dumps(manifest, indent=1) + "\n")


if __name__ == "__main__":
    main()
