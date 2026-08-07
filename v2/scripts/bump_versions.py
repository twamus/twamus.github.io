#!/usr/bin/env python3
"""Cache-busting build step for v2.

Rewrites the ?v= query on stylesheet/script references in index.html based on
the content hash of each asset, so browsers refetch CSS/JS when they change
(GitHub Pages serves assets with Cache-Control: max-age=600, so a plain F5
otherwise reuses the old stylesheet).

Usage:  python3 scripts/bump_versions.py
"""
import hashlib
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
INDEX = ROOT / "index.html"

ASSETS = [
    "assets/css/style.css",
    "assets/js/main.js",
    "assets/img/projects/hermes.svg",
    "assets/img/projects/tradebot.svg",
    "assets/img/projects/nonogram.svg",
    "assets/img/projects/qdir64.svg",
    "assets/img/projects/pmt.svg",
    "assets/img/projects/shiptool.svg",
]

def short_hash(path: Path) -> str:
    return hashlib.sha1(path.read_bytes()).hexdigest()[:10]

def bump() -> None:
    html = INDEX.read_text()
    changes = []

    for rel in ASSETS:
        asset = ROOT / rel
        if not asset.exists():
            print(f"  MISSING {rel}")
            continue
        h = short_hash(asset)
        # match href/src for this asset, with or without an existing ?v=
        pattern = re.compile(
            rf'((?:href|src)="{re.escape(rel)})(?:\?v=[a-f0-9]+)?"'
        )
        new = f'\\1?v={h}"'
        updated, n = pattern.subn(new, html)
        if n:
            changes.append((rel, h))
            html = updated
        else:
            print(f"  WARN: no reference found for {rel}")

    INDEX.write_text(html)
    if changes:
        for rel, h in changes:
            print(f"  ✓ {rel}  ->  ?v={h}")
    else:
        print("  no changes")

if __name__ == "__main__":
    bump()
