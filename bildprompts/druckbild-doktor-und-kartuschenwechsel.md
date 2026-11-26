# Bildprompt für ChatGPT: Druckbild-Doktor und Kartuschenwechsel

Für die Seiten `/ratgeber/druckbild-pruefen/` und `/ratgeber/kartusche-wechseln/`.
Den Text zwischen den Linien komplett in ChatGPT einfügen. ChatGPT erzeugt zwei Bögen nacheinander.
Die fertigen Bögen als `bildprompts/bogen-a.png` und `bildprompts/bogen-b.png` ins Repo legen, dann schneidet
`python3 tools/bogen-schneiden.py` sie in WebP-Einzelbilder unter `img/erlebnis/`.

---

Erzeuge bitte zwei Bilder nacheinander. Beide sind Bögen (Sprite-Sheets) mit festem Raster für eine Website. Jede Zelle ist exakt 512 × 512 Pixel groß, ohne Abstand zwischen den Zellen, ohne Rahmen, ohne Linien zwischen den Zellen. Hintergrund in allen Zellen einheitlich sehr hell (#F7F7F8), flach, ohne Verlauf und ohne Schatten am Zellenrand. Kein Text, keine Buchstaben, keine Zahlen, keine Beschriftung der Zellen. Einzige Ausnahme: das Wort „MUSTER“ auf den Abdrucken, wie unten beschrieben.

Stil für alle Zellen: klare, freundliche technische Illustration, flach bis leicht 3D, saubere Kanten, weiche, gleichmäßige Beleuchtung von links oben. Farben nur Weiß, Grautöne, Schwarz und als einziger Akzent Rot #C61824. Keine Logos, keine Markennamen, keine Firmennamen, kein Posthorn, keine echten Frankiervermerke, keine Datamatrix- oder QR-Codes, keine Briefmarken, keine Portowerte, keine Ziffern.

## Bogen A: Beispielabdrucke (4 Spalten × 2 Zeilen, Gesamtgröße 2048 × 1024 Pixel)

Jede Zelle zeigt denselben Ausschnitt: die rechte obere Ecke eines weißen Briefumschlags, frontal von vorn, gerade ausgerichtet, gleicher Maßstab in allen Zellen. Darauf ein stilisierter Frankierabdruck in schwarzer Tinte, etwa 70 Prozent der Zellenbreite: rechteckiger Rahmen mit abgerundeten Ecken, links ein Quadrat mit zwei Diagonalen (Zierornament, kein Code), rechts oben ein kleiner Kreis, in der Mitte groß das Wort „MUSTER“ in einer schlichten serifenlosen Schrift, darunter zwei waagerechte Balken. In allen acht Zellen ist der Abdruck an exakt derselben Stelle und gleich groß.

1. Zeile 1, Spalte 1: sauberer Abdruck, kräftig schwarz, scharf, vollständig.
2. Zeile 1, Spalte 2: derselbe Abdruck, insgesamt sehr blass, wie ausgewaschen, hellgrau.
3. Zeile 1, Spalte 3: derselbe Abdruck mit vier bis fünf feinen weißen waagerechten Streifen quer durch das ganze Motiv.
4. Zeile 1, Spalte 4: derselbe Abdruck, bei dem zwei bis drei größere Teilflächen fehlen (unregelmäßige Lücken, Papier scheint durch).
5. Zeile 2, Spalte 1: derselbe Abdruck, unscharf und leicht verschmiert, Ränder verlaufen, schwacher Doppelschatten nach rechts unten.
6. Zeile 2, Spalte 2: derselbe Abdruck, waagerecht in der Mitte geteilt: die untere Hälfte ist um etwa 4 Prozent der Breite nach rechts verschoben.
7. Zeile 2, Spalte 3: derselbe Abdruck, waagerecht gestaucht auf etwa 55 Prozent der Breite, linksbündig.
8. Zeile 2, Spalte 4: dieselbe Umschlagecke ganz ohne Abdruck.

## Bogen B: Ebenen für die Wechsel-Animation (4 Spalten × 3 Zeilen, Gesamtgröße 2048 × 1536 Pixel)

Alle Zellen in derselben Perspektive (leicht erhöhte Dreiviertelansicht von vorn rechts, etwa 20 Grad von oben), derselbe Maßstab, dasselbe Licht. Die Maschine ist eine vereinfachte, erkennbare Illustration einer Tisch-Frankiermaschine, keine Kopie eines bestimmten Produkts: flaches, hellgraues Gehäuse, links vorn ein dunkles, leeres Display ohne Inhalt, unten eine dunkle Briefbahn, rechts oben ein rechteckiges Kartuschenfach mit Klappe. Gegenstände, die einzeln stehen (Kartuschen, Hand, Pfeil, Umschlag), sind freigestellt mittig in der Zelle, im selben Maßstab wie die Maschine.

1. Zeile 1, Spalte 1: Maschine mit geöffnetem, leerem Kartuschenfach, ohne Klappe, ohne Kartuschen (Grundebene).
2. Zeile 1, Spalte 2: nur die Klappe des Kartuschenfachs, geschlossen, so dass sie in Zelle 1 genau passt.
3. Zeile 1, Spalte 3: nur die Klappe, nach hinten hochgeklappt (geöffnete Stellung), passend zu Zelle 1.
4. Zeile 1, Spalte 4: kleinere, kompakte Variante der Maschine mit hochgeklapptem Bedienfeld, darunter ein leeres Fach für eine einzelne Kartusche.
5. Zeile 2, Spalte 1: eine gebrauchte Tintenkartusche, senkrecht stehend, dunkelgrau, geriffelte Griffflächen an der Seite, Kontakte als kleine goldfarbene Felder hinten.
6. Zeile 2, Spalte 2: eine neue Tintenkartusche, gleiche Form, weiß mit rotem Band, an der Unterseite ein roter Schutzstreifen über den Düsen.
7. Zeile 2, Spalte 3: dieselbe neue Kartusche ohne Schutzstreifen, Düsenreihe an der Unterseite sichtbar.
8. Zeile 2, Spalte 4: nur der abgezogene rote Schutzstreifen, leicht gebogen.
9. Zeile 3, Spalte 1: eine Hand mit ausgestrecktem Zeigefinger, der nach links unten auf ein Display tippt, neutraler Hautton, Ärmel hellgrau.
10. Zeile 3, Spalte 2: eine Hand, die eine Kartusche von oben zwischen Daumen und Zeigefinger hält (ohne Kartusche gezeichnet, Griff offen).
11. Zeile 3, Spalte 3: ein kräftiger roter, leicht gebogener Pfeil, der senkrecht nach unten zeigt.
12. Zeile 3, Spalte 4: ein weißer Briefumschlag, schräg im selben Blickwinkel wie die Maschine, rechts oben der saubere Abdruck mit dem Wort „MUSTER“ aus Bogen A, Zelle 1.

---

## Zuordnung der Zellen zu Dateien (für `tools/bogen-schneiden.py`)

| Bogen | Zelle (Zeile/Spalte) | Datei | genutzt für |
|---|---|---|---|
| A | 1/1 | `img/erlebnis/abdruck-sauber.webp` | Kachel „Sauber“, Nachher-Bild, „Geschafft“ |
| A | 1/2 | `img/erlebnis/abdruck-blass.webp` | Kachel „Insgesamt blass“ |
| A | 1/3 | `img/erlebnis/abdruck-streifen.webp` | Kachel „Weiße Streifen“ |
| A | 1/4 | `img/erlebnis/abdruck-fehlt.webp` | Kachel „Teile fehlen“ |
| A | 2/1 | `img/erlebnis/abdruck-verschmiert.webp` | Kachel „Unscharf, verschmiert“ |
| A | 2/2 | `img/erlebnis/abdruck-versatz.webp` | Kachel „Hälften verschoben“ |
| A | 2/3 | `img/erlebnis/abdruck-gestaucht.webp` | Kachel „Gestaucht“ |
| A | 2/4 | `img/erlebnis/abdruck-leer.webp` | Kachel „Gar kein Abdruck“ |
| B | 1/1 | `img/erlebnis/maschine.webp` | Grundebene der Bühne |
| B | 1/2 | `img/erlebnis/klappe-zu.webp` | Klappe geschlossen |
| B | 1/3 | `img/erlebnis/klappe-auf.webp` | Klappe geöffnet |
| B | 1/4 | `img/erlebnis/maschine-klein-offen.webp` | mini und Vision M2 (Bedienfeld/Waage hoch) |
| B | 2/1 | `img/erlebnis/kartusche-alt.webp` | alte Kartusche |
| B | 2/2 | `img/erlebnis/kartusche-neu-schutz.webp` | neue Kartusche mit Schutzstreifen |
| B | 2/3 | `img/erlebnis/kartusche-neu.webp` | neue Kartusche einsatzbereit |
| B | 2/4 | `img/erlebnis/schutzstreifen.webp` | abgezogener Streifen |
| B | 3/1 | `img/erlebnis/hand-tippen.webp` | Schritt „Menü“ |
| B | 3/2 | `img/erlebnis/hand-greifen.webp` | Schritte „Herausnehmen“ und „Einsetzen“ |
| B | 3/3 | `img/erlebnis/pfeil.webp` | Richtungspfeil (per CSS gedreht) |
| B | 3/4 | `img/erlebnis/testabdruck.webp` | Schritt „Testabdruck“ |

Bis die Bögen da sind, zeichnen `assets/abdruck.js` und `assets/wechsel.js` schlichte Platzhalter in denselben Proportionen.
