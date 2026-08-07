#!/usr/bin/env python3
"""Copy + optimize images from old site into v2/assets/img."""
import os
from PIL import Image

SRC = os.path.expanduser("~/twamus.github.io")
DST = os.path.join(SRC, "v2", "assets", "img")

# (src, dest, max_width)
jobs = [
    ("images/me.jpg",              "me.jpg",                 900),
    ("images/linkedme.jpg",        "linkedme.jpg",           500),
    ("images/nonogram.jpg",        "projects/nonogram.jpg",  800),
    ("images/qdir64.png",          "projects/qdir64.png",    800),
    ("images/pmt.png",             "projects/pmt.png",       800),
    ("images/shippingtool.png",    "projects/shippingtool.png", 800),
    ("images/lego.jpg",            "projects/lego.jpg",      800),
    ("images/python.png",          "projects/python.png",    800),
    ("images/soundboard.jpg",      "projects/soundboard.jpg", 800),
    ("projects/qdir64-1.png",      "projects/qdir64-1.png",  800),
    ("projects/pmt-mockup.png",    "projects/pmt-mockup.png", 800),
    ("projects/shippingtool.png",  "projects/shippingtool.png", 800),
]

total_in = total_out = 0
for src_rel, dst_rel, max_w in jobs:
    src = os.path.join(SRC, src_rel)
    dst = os.path.join(DST, dst_rel)
    os.makedirs(os.path.dirname(dst), exist_ok=True)
    if not os.path.exists(src):
        print(f"  MISSING: {src_rel}")
        continue
    in_bytes = os.path.getsize(src)
    im = Image.open(src)
    w, h = im.size
    if w > max_w:
        im = im.resize((max_w, int(h * max_w / w)), Image.LANCZOS)
    if dst_rel.endswith(".jpg"):
        im = im.convert("RGB")
        im.save(dst, "JPEG", quality=82, optimize=True)
    else:
        im.save(dst, "PNG", optimize=True)
    out_bytes = os.path.getsize(dst)
    total_in += in_bytes
    total_out += out_bytes
    print(f"  {src_rel:40s} {in_bytes/1024:7.1f}K -> {out_bytes/1024:6.1f}K  ({w}x{h})")

print(f"\nTOTAL: {total_in/1024:.0f}K -> {total_out/1024:.0f}K  ({(1-total_out/total_in)*100:.0f}% saved)")
