#!/usr/bin/env python3
"""Wrap the four legacy project screenshots in the bordered-box style:
dark page, rounded black window with a border, screenshot art inside.
NO terminal stoplights, NO command text (matching original tradebot.svg).
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
  <rect x="60" y="50" width="380" height="200" rx="10" fill="#0d1117" stroke="#232c3a" stroke-width="2"/>
  <image href="data:{mime};base64,{b64}" x="60" y="50" width="380" height="200" preserveAspectRatio="xMidYMid meet"/>
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
