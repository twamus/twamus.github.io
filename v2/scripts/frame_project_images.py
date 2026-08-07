#!/usr/bin/env python3
"""Wrap the four legacy project screenshots in the plain style: dark background
plus the artwork, NO terminal window chrome (matching original tradebot.svg).

Each output SVG embeds the raster screenshot as a base64 data URI (self-
contained, renders in every browser).
"""
import base64
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
IMG = ROOT / "assets" / "img" / "projects"

# (source raster, output svg)
JOBS = [
    ("nonogram.jpg",     "nonogram.svg"),
    ("qdir64.png",       "qdir64.svg"),
    ("pmt.png",          "pmt.svg"),
    ("shippingtool.png", "shiptool.svg"),
]

TEMPLATE = """<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 500 300" role="img" aria-label="{name}">
  <rect width="500" height="300" fill="#161c26"/>
  <image href="data:{mime};base64,{b64}" x="0" y="0" width="500" height="300" preserveAspectRatio="xMidYMid meet"/>
</svg>
"""

for src, out in JOBS:
    data = (IMG / src).read_bytes()
    mime = "image/png" if src.endswith(".png") else "image/jpeg"
    b64 = base64.b64encode(data).decode()
    name = out[:-4]
    svg = TEMPLATE.format(name=name, mime=mime, b64=b64)
    (IMG / out).write_text(svg)
    print(f"  {src:18s} -> {out:16s} ({(IMG / out).stat().st_size // 1024} KB)")
