#!/usr/bin/env python3
"""Verify v2 site integrity: check all local href/src references resolve to real files."""
import html.parser
import os
import sys
from pathlib import Path

ROOT = Path.home() / "twamus.github.io" / "v2"

class LinkParser(html.parser.HTMLParser):
    def __init__(self):
        super().__init__()
        self.refs = []  # (src_file, ref)
    def handle_starttag(self, tag, attrs):
        d = dict(attrs)
        for attr in ("href", "src"):
            if attr in d:
                self.refs.append((tag, d[attr]))

errors = []
checked_files = 0

for html_file in ROOT.rglob("*.html"):
    # skip the standalone nonogram game — it's self-contained
    parser = LinkParser()
    parser.feed(html_file.read_text(errors="replace"))
    checked_files += 1
    base = html_file.parent
    for tag, ref in parser.refs:
        if ref.startswith(("http://", "https://", "mailto:", "#", "data:", "javascript:")):
            continue
        # strip fragment AND cache-busting query (?v=...)
        path_part = ref.split("#")[0].split("?")[0]
        if not path_part:
            continue
        target = (base / path_part).resolve()
        if not target.exists():
            errors.append(f"{html_file.relative_to(ROOT)}: {tag} -> {ref} (missing)")

print(f"Checked {checked_files} HTML file(s)")
if errors:
    print("ERRORS:")
    for e in errors:
        print(f"  ✗ {e}")
    sys.exit(1)
print("All internal links and images resolve. ✓")
