#!/usr/bin/env python3
"""Baut die Maschinenbilder für die Kacheln in einem gemeinsamen Maßstab.

    python3 tools/kachel-bilder.py

Quelle: img/<id>.png (freigestellt, transparenter Hintergrund). Liegt ein größeres
Herstellerfoto als img/quelle/<id>.png vor, wird dieses genommen.
Ergebnis: img/kachel/<id>.webp (4:3) und img/kachel/one-breit.webp (8:3, für die breite Kachel).
Alle Maschinen stehen auf derselben Bodenlinie. Die Breite im Bild folgt grob der echten
Größe: mini und M2 klein, One am größten. So bleiben die Unterschiede erkennbar.
Braucht Pillow (pip install pillow).
"""
from pathlib import Path
from PIL import Image

ROOT = Path(__file__).resolve().parent.parent
OUT = ROOT / 'img' / 'kachel'
W, H = 800, 600          # 4:3-Kachel in doppelter Auflösung
BODEN = 0.94             # Bodenlinie: Anteil der Kachelhöhe
MAX_H = 0.86             # höchstens so viel der Höhe darf eine Maschine einnehmen
# Breite der Maschine als Anteil einer 4:3-Kachel (ungefährer Größenvergleich, kein Maßstab in mm)
BREITE = {'mini': 0.46, 'm2': 0.52, 'classic': 0.82, 'insight': 0.82, 'vision': 0.92, 'fusion': 0.92, 'one': 0.96}
ONE_BREIT = 1.84         # One in der breiten Kachel: knapp doppelt so breit wie Vision/Fusion
HOCH = 3.2               # höchstens so viel größer als die Quelle (eine Kachel zeigt das Bild etwa 3-fach verkleinert)


def quelle(mid):
    q = ROOT / 'img' / 'quelle' / (mid + '.png')
    return q if q.exists() else ROOT / 'img' / (mid + '.png')


def freistellen(im):
    """Auf den sichtbaren Teil zuschneiden (fast durchsichtige Ränder ignorieren)."""
    a = im.getchannel('A').point(lambda v: 255 if v > 24 else 0)
    return im.crop(a.getbbox())


def setzen(im, cw, ch, breite, name):
    w = round(cw * breite)
    h = round(im.height * w / im.width)
    if h > ch * MAX_H:
        h = round(ch * MAX_H)
        w = round(im.width * h / im.height)
    if w > im.width * HOCH:  # nicht stärker hochrechnen, sonst wird es unscharf
        print('  Hinweis: Quelle zu klein für %s (%d px breit, gebraucht %d px)' % (name, im.width, w))
        w, h = round(im.width * HOCH), round(im.height * HOCH)
    im = im.resize((w, h), Image.LANCZOS)
    c = Image.new('RGBA', (cw, ch), (0, 0, 0, 0))
    c.alpha_composite(im, ((cw - w) // 2, round(ch * BODEN) - h))
    return c


def speichern(c, name):
    c.save(OUT / (name + '.webp'), 'WEBP', quality=88, method=6)
    print('geschrieben: img/kachel/%s.webp' % name)


def main():
    OUT.mkdir(parents=True, exist_ok=True)
    for mid, b in BREITE.items():
        im = freistellen(Image.open(quelle(mid)).convert('RGBA'))
        speichern(setzen(im, W, H, b, mid), mid)
        if mid == 'one':
            speichern(setzen(im, W * 2, H, ONE_BREIT / 2, 'one-breit'), 'one-breit')


if __name__ == '__main__':
    main()
