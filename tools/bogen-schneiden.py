#!/usr/bin/env python3
"""Schneidet die ChatGPT-Bögen in WebP-Einzelbilder.

    python3 tools/bogen-schneiden.py            # erwartet bildprompts/bogen-a.png und bogen-b.png

Zuordnung siehe bildprompts/druckbild-doktor-und-kartuschenwechsel.md. Braucht Pillow (pip install pillow).
"""
from pathlib import Path
from PIL import Image

ROOT = Path(__file__).resolve().parent.parent
OUT = ROOT / 'img' / 'erlebnis'
BOEGEN = {
    'bogen-a': (4, 2, ['abdruck-sauber', 'abdruck-blass', 'abdruck-streifen', 'abdruck-fehlt',
                       'abdruck-verschmiert', 'abdruck-versatz', 'abdruck-gestaucht', 'abdruck-leer']),
    'bogen-b': (4, 3, ['maschine', 'klappe-zu', 'klappe-auf', 'maschine-klein-offen',
                       'kartusche-alt', 'kartusche-neu-schutz', 'kartusche-neu', 'schutzstreifen',
                       'hand-tippen', 'hand-greifen', 'pfeil', 'testabdruck']),
}

def main():
    OUT.mkdir(parents=True, exist_ok=True)
    for name, (cols, rows, files) in BOEGEN.items():
        src = next((p for p in (ROOT / 'bildprompts').glob(name + '.*')), None)
        if not src:
            print('fehlt:', name); continue
        im = Image.open(src).convert('RGBA')
        w, h = im.width / cols, im.height / rows
        for i, f in enumerate(files):
            c, r = i % cols, i // cols
            cell = im.crop((round(c * w), round(r * h), round((c + 1) * w), round((r + 1) * h)))
            cell = cell.resize((512, 512), Image.LANCZOS)
            cell.save(OUT / (f + '.webp'), 'WEBP', quality=82, method=6)
            print('geschrieben:', OUT / (f + '.webp'))

if __name__ == '__main__':
    main()
