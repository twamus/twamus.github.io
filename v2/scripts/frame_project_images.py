#!/usr/bin/env python3
"""Wrap the four legacy project screenshots in the Hermes/TradeBot terminal
frame style so all six project cards share a uniform bordered look.

Each output SVG embeds the raster screenshot as a base64 data URI (self-
contained, renders in every browser), inside the same window chrome used by
hermes.svg and tradebot.svg.
"""
import base64
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
IMG = ROOT / "assets" / "img" / "projects"

# (source raster, output svg, command line shown in the title bar area)
JOBS = [
    ("nonogram.jpg",     "nonogram.svg",     "$ ./nonogram"),
    ("qdir64.png",       "qdir64.svg",       "$ qdir64"),
    ("pmt.png",          "pmt.svg",          "$ pmt --serve"),
    ("shippingtool.png", "shiptool.svg",     "$ ShippingTool.exe"),
]

TEMPLATE = """<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 500 300" role="img" aria-label="{name}">
  <rect width="500" height="300" fill="#161c26"/>
  <rect x="60" y="55" width="380" height="200" rx="10" fill="#0d1117" stroke="#232c3a" stroke-width="2"/>
  <rect x="60" y="55" width="380" height="34" rx="10" fill="#1c2430"/>
  <circle cx="88" cy="72" r="5" fill="#ff5f56"/>
  <circle cx="106" cy="72" r="5" fill="#ffbd2e"/>
  <circle cx="124" cy="72" r="5" fill="#27c93f"/>
  <text x="88" y="150" font-family="monospace" font-size="20" fill="#9aa7b4">{cmd}</text>
  <image href="data:{mime};base64,{b64}" x="88" y="160" width="324" height="90" preserveAspectRatio="xMidYMid meet"/>
</svg>
"""

for src, out, cmd in JOBS:
    data = (IMG / src).read_bytes()
    mime = "image/png" if src.endswith(".png") else "image/jpeg"
    b64 = base64.b64encode(data).decode()
    name = out[:-4]
    svg = TEMPLATE.format(name=name, cmd=cmd, mime=mime, b64=b64)
    (IMG / out).write_text(svg)
    print(f"  {src:18s} -> {out:16s} ({(IMG / out).stat().st_size // 1024} KB)")
