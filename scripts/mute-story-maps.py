#!/usr/bin/env python3
"""Bake the story map's look into its two images, once, instead of on every frame.

The story used to draw each satellite image through an SVG filter (grey it
out), lay a cream sheet over it, and cut the close-up's edges with a mask
blurred by a second filter. The browser redid all of that on every frame the
map moved, which on a phone was most of why the story stuttered. The result
never changes, so it is computed here and saved as two plain images:

  public/maps/grass-valley-wide-muted.webp   grey + cream at .74
  public/maps/grass-valley-naip-muted.webp   grey + cream at .66, feathered edge

Run from the repo root after replacing either source image:
  python3 scripts/mute-story-maps.py

Needs Pillow and NumPy.
"""
from pathlib import Path

import numpy as np
from PIL import Image, ImageFilter

MAPS = Path(__file__).resolve().parent.parent / "public" / "maps"
CREAM = np.array([0xF6, 0xF3, 0xEE], dtype=np.float64) / 255


def to_linear(c):
    return np.where(c <= 0.04045, c / 12.92, ((c + 0.055) / 1.055) ** 2.4)


def to_srgb(c):
    return np.where(c <= 0.0031308, c * 12.92, 1.055 * np.power(c, 1 / 2.4) - 0.055)


def muted(path: Path, cream_opacity: float) -> np.ndarray:
    """feColorMatrix saturate(0), which SVG runs in linear RGB, then a cream
    sheet at `cream_opacity` composited over it in sRGB."""
    rgb = np.asarray(Image.open(path).convert("RGB"), dtype=np.float64) / 255
    lin = to_linear(rgb)
    lum = lin @ np.array([0.213, 0.715, 0.072])
    grey = to_srgb(np.clip(lum, 0, 1))[..., None].repeat(3, axis=2)
    return grey * (1 - cream_opacity) + CREAM * cream_opacity


def save(rgb: np.ndarray, path: Path, alpha: np.ndarray | None = None):
    out = (np.clip(rgb, 0, 1) * 255 + 0.5).astype(np.uint8)
    if alpha is not None:
        out = np.dstack([out, (np.clip(alpha, 0, 1) * 255 + 0.5).astype(np.uint8)])
    Image.fromarray(out).save(path, "WEBP", quality=82, method=6)
    print(f"wrote {path.relative_to(MAPS.parent.parent)} ({path.stat().st_size // 1024} KB)")


# The wide view: drawn 2000 units across, no mask.
save(muted(MAPS / "grass-valley-wide-s2-2016.webp", 0.74), MAPS / "grass-valley-wide-muted.webp")

# The close-up: 400 units across. The old mask was a white rect at 18..382
# blurred by stdDeviation 14 (in those units), so its edge is rebuilt the same
# way in pixels and stored as the image's alpha.
near = muted(MAPS / "grass-valley-naip.webp", 0.66)
size = near.shape[0]
px = size / 400
box = Image.new("L", (size, size), 0)
box.paste(255, (round(18 * px), round(18 * px), round(382 * px), round(382 * px)))
feather = np.asarray(box.filter(ImageFilter.GaussianBlur(14 * px)), dtype=np.float64) / 255
save(near, MAPS / "grass-valley-naip-muted.webp", feather)
