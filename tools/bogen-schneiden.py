#!/usr/bin/env python3
"""Schneidet die Bildbögen in WebP-Einzelbilder unter img/erlebnis/.

    python3 tools/bogen-schneiden.py "<Ordner mit A-Muster.png und B-*.png>"

Raster: Zellen 512 × 512 px, 4 Spalten. Bogen A = 4 × 2 Beispielabdrucke,
B-Bögen = 4 × 3 (Zeilen 1–2 Wechselschritte nach den FP-Anleitungen, Zeile 3 gemeinsame Teile).
Welche Zelle zu welchem Schritt gehört, steht in assets/wartung.js (WECHSEL_BILDER).
Braucht Pillow (pip install pillow).
"""
import sys
from pathlib import Path
from PIL import Image

ROOT = Path(__file__).resolve().parent.parent
OUT = ROOT / 'img' / 'erlebnis'
BG = (247, 247, 248)
ABDRUCKE = ['sauber', 'blass', 'streifen', 'fehlt', 'verschmiert', 'versatz', 'gestaucht', 'leer']
# Modell: Anzahl belegter Zellen in Zeile 1–2. Insight nutzt die Zeichnungen der Classic, nur das Foto ist eigen.
MODELLE = {'mini': 6, 'classic': 5, 'one': 7, 'vision': 6, 'fusion': 4, 'insight': 1}
DATEI = {'mini': 'B-Mini', 'classic': 'B-Classic', 'one': 'B-One', 'vision': 'B-Vision', 'fusion': 'B-Fusion', 'insight': 'B-Insight'}


def cell(im, i):
    c, r = i % 4, i // 4
    return im.crop((c * 512, r * 512, (c + 1) * 512, (r + 1) * 512))


def save(im, name, size):
    im = im.convert('RGB').resize(size, Image.LANCZOS)
    im.save(OUT / (name + '.webp'), 'WEBP', quality=80, method=6)
    print('geschrieben:', name + '.webp')


def main(src):
    OUT.mkdir(parents=True, exist_ok=True)
    # Beispielabdrucke: Ausschnitt um das Motiv (in allen Zellen an derselben Stelle), 2:1
    a = Image.open(src / 'A-Muster.png')
    for i, n in enumerate(ABDRUCKE):
        save(cell(a, i).crop((70, 118, 460, 313)), 'abdruck-' + n, (480, 240))
    # Wechselschritte: Zellinhalt liegt zwischen 52 und 458 px, Rand gleichmäßig stehen lassen
    for mod, n in MODELLE.items():
        b = Image.open(src / (DATEI[mod] + '.png'))
        for i in range(n):
            save(cell(b, i).crop((40, 40, 472, 472)), '%s-%d' % (mod, i + 1), (480, 480))
    save(cell(Image.open(src / 'B-Classic.png'), 11).crop((40, 40, 472, 472)), 'umschlag', (480, 480))
    # Vision M2: der Bogen zeigt Teile anderer Modelle, deshalb nur das Produktfoto der Website
    m2 = Image.open(ROOT / 'img' / 'm2.png').convert('RGBA')
    m2 = m2.resize((330, round(m2.height * 330 / m2.width)), Image.LANCZOS)
    canvas = Image.new('RGBA', (432, 432), BG + (255,))
    canvas.alpha_composite(m2, (51, (432 - m2.height) // 2))
    save(canvas, 'm2-1', (480, 480))


if __name__ == '__main__':
    if len(sys.argv) < 2:
        sys.exit(__doc__)
    main(Path(sys.argv[1]))
