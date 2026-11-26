// farbeleer.de: Daten für den Druckbild-Doktor und den Kartuschenwechsel zum Durchklicken.
// Genutzt von /ratgeber/druckbild-pruefen/ und /ratgeber/kartusche-wechseln/ (im Browser)
// und von tools/build.js (Textfassung ohne JavaScript, HowTo- und FAQ-Schema).
// Nach jeder Änderung hier: `node tools/build.js` ausführen und das Ergebnis mit einchecken.
//
// Schreibregeln für Texte in dieser Datei:
//   [[?Was geprüft werden soll]]  → erscheint auf der Seite als gelbes „[bitte prüfen]“
//                                   und landet in der Prüfliste, die tools/build.js ausgibt.
//   {REINIGEN}, {INTENSIV}, {AUSRICHTEN}, {TESTDRUCK}, {INFO}, {WECHSELN}
//                                 → werden durch den Menünamen des gewählten Modells ersetzt.
// Quellen stehen bei jedem Modell (src). Nichts wörtlich aus den Handbüchern übernehmen.

// ── 1. Drucksystem je Modell ─────────────────────────────────────────────
// carts = Anzahl Kartuschen in der Maschine. menu = Menünamen wie im Display.
// steps = Schritte beim Kartuschenwechsel. anim = welche Animation dazu läuft:
//   menu (Display), open (Klappe auf), lift (Bedienfeld/Wiegeteil hoch), lever (Hebel hoch),
//   out (alte Kartusche raus), prep (neue vorbereiten), shake (schütteln), in (neue rein),
//   close (Klappe zu), wait (Maschine arbeitet), align (Ausrichten), test (Testabdruck)
var WARTUNG = {
  classic: {
    name: 'PostBase 30 bis 100', carts: 2,
    src: 'FP-Broschüre „PostBase Wartung & Pflege – Tipps zur Selbsthilfe“ (koelliker.ch); PostBase Operator Manual (FP, englisch, manualslib 1044163), S. 90–98, 116–117; Betriebsanleitung PostBase, deutsch, Stand 11/2014 (fp-francotyp.de), S. 41–42',
    menu: { WECHSELN: '„MENÜ › DRUCKSYSTEM › WECHSELN“', REINIGEN: '„REINIGEN“', INTENSIV: '„INTENSIV REINIGEN“', AUSRICHTEN: '„AUSRICHTEN“', INFO: '„INFO DRUCKSYSTEM“',
      TESTDRUCK: '„TESTABDRUCK“ (unter „PRODUKT“, am Ende der Liste der Zusatzleistungen)' },
    steps: [
      { anim: 'menu', t: 'Wählen Sie im Display {WECHSELN}. Die Klappe öffnet sich dann von selbst. Bitte stützen Sie sich nicht auf die offene Klappe.' },
      { anim: 'out', t: 'Drücken Sie die alte Kartusche an den geriffelten Griffflächen nach unten und etwas nach vorn. Dann können Sie sie nach oben herausnehmen. Machen Sie das mit beiden Kartuschen.', tip: 'Säubern Sie bei jedem Wechsel die Kontakte in der Halterung. Dafür gibt es von FP das Set „clean & renew“.' },
      { anim: 'prep', t: 'Die neuen Kartuschen sollten Raumtemperatur haben, also nicht direkt aus dem kalten Auto kommen. Ziehen Sie den Düsenschutz ab und fassen Sie die Düsen nicht an.' },
      { anim: 'in', t: 'Setzen Sie die Kartuschen mit den Kontakten nach hinten ein und drücken Sie sie nach unten, bis sie spürbar einrasten.', tip: 'Immer beide Kartuschen zusammen wechseln, und immer zwei neue.' },
      { anim: 'close', t: 'Schließen Sie die Klappe vorne rechts. Die Maschine kalibriert und reinigt jetzt von selbst. Das dauert einen Moment.' },
      { anim: 'align', t: 'Zum Schluss ausrichten: Die Maschine bittet um einen Testabdruck auf einem leeren Umschlag. Tippen Sie die passenden Linienmuster an und bestätigen Sie mit „FERTIG“.' }
    ]
  },
  insight: {
    name: 'PostBase Insight', carts: 2, like: 'classic',
    src: 'PostBase Insight Operating Manual, Abschnitt Ink Replacement (FP, englisch, bei Loffler), S. 90–95; Reinigung und Störungen: PostBase Operator Manual (FP, englisch), S. 96–98, 117. Die Kartuschen-Sets sind laut FP-Shop dieselben wie für die PostBase 30 bis 100.',
    note: 'Die Insight wird beim Wechsel genauso bedient wie die PostBase 30 bis 100.[[?PostBase Insight: deutsche Menünamen wie bei der PostBase 30 bis 100? (nur englische Insight-Ausgabe gelesen)]]'
  },
  vision: {
    name: 'PostBase Vision', carts: 1,
    src: 'PostBase Vision Referenzhandbuch, deutsche Ausgabe 09/2019 (te-postline.de; manualslib.de 588745), S. 146–155, 175, 180, 205; Operator Maintenance & Care (Loffler, US), S. 130–138',
    menu: { WECHSELN: '„MENÜ › DRUCKSYSTEM › WECHSELN“', REINIGEN: '„REINIGEN“', INTENSIV: '„INTENSIV REINIGEN“', AUSRICHTEN: '', INFO: '„INFO DRUCKSYSTEM“', TESTDRUCK: '„TESTDRUCK“' },
    note: 'Gilt genauso für die Vision A120. Die Kartusche LARGE passt auch dort.',
    steps: [
      { anim: 'menu', t: 'Wählen Sie im Display {WECHSELN}. Die Maschine öffnet die Klappe selbst. Ziehen Sie sie nicht von Hand auf.' },
      { anim: 'out', t: 'Drücken Sie auf die Markierung „Push here“. Die Kartusche kippt nach vorn und die grüne LED blinkt. Nehmen Sie die Kartusche an der grünen Nase nach oben heraus.' },
      { anim: 'prep', t: 'Nehmen Sie den Transportclip von der neuen Kartusche ab und setzen Sie ihn nicht wieder auf. Ziehen Sie dann den Schutzstreifen von den Düsen ab.' },
      { anim: 'in', t: 'Kontakte nach hinten, der grüne Pfeil zeigt zur grünen Nase. Drücken Sie die Kartusche nach unten und nach hinten, bis sie einrastet. Leuchtet die grüne LED dauerhaft, sitzt sie richtig.' },
      { anim: 'close', t: 'Schließen Sie die Klappe am Vision-Schriftzug. Die Maschine bereitet die Kartusche jetzt vor. Das dauert einen Moment.' },
      { anim: 'test', t: 'Machen Sie danach einen {TESTDRUCK} und schauen Sie, ob der Abdruck scharf und vollständig ist.' }
    ]
  },
  fusion: {
    name: 'PostBase Fusion', carts: 2,
    src: 'PostBase Fusion Referenzhandbuch, deutsche Ausgabe (FP, cdn.shopify.com), S. 30–32, 40–41, 144–152, 173, 178, 184, 192–194',
    menu: { WECHSELN: '„MENÜ › DRUCKSYSTEM › WECHSELN“', REINIGEN: '„REINIGEN“', INTENSIV: '„INTENSIV REINIGEN“', AUSRICHTEN: '', INFO: '„FÜLLSTAND KARTUSCHE“', TESTDRUCK: '„TESTDRUCK“' },
    steps: [
      { anim: 'menu', t: 'Wählen Sie im Display {WECHSELN}. Die Maschine fährt das Drucksystem in die Wechselposition und öffnet die Klappe selbst. Halten Sie die Klappe dabei nicht fest.' },
      { anim: 'out', t: 'Drücken Sie die alte Kartusche an den geriffelten Griffflächen nach unten und etwas nach vorn und nehmen Sie sie heraus. Danach die zweite.' },
      { anim: 'shake', t: 'Bewegen Sie jede neue Kartusche sechsmal auf und ab. Ziehen Sie dann den Düsenschutz ab. Der Transportclip ist nur für den Versand gedacht.' },
      { anim: 'in', t: 'Kontakte nach hinten, Kartusche einsetzen und nach unten drücken, bis sie einrastet. Dann die zweite.', tip: 'Immer beide Kartuschen zusammen wechseln.' },
      { anim: 'close', t: 'Schließen Sie die Klappe am Fusion-Schriftzug. Die Maschine kalibriert und reinigt jetzt von selbst. Das dauert einen Moment.' },
      { anim: 'test', t: 'Machen Sie danach einen {TESTDRUCK} und prüfen Sie den Abdruck.' }
    ],
    power: 'Halten Sie die Taste drei Sekunden gedrückt und ziehen Sie den Stecker erst, wenn die Maschine in der Verschlussposition ist. Sonst trocknet die Kartusche ein.'
  },
  one: {
    name: 'PostBase One', carts: 2,
    src: 'PostBase One Betriebsanleitung, deutsche Ausgabe (FP; manualslib.de 132953), Kapitel 13 Drucksystem, S. 115–135, 146, 196; Betriebsanleitung Stand 01-2018 (fp-francotyp.de), S. 14; Operator Manual 51-0055-3071-00 (US), S. 96–126',
    menu: { WECHSELN: '„MENÜ › DRUCKSYSTEM › WECHSELN“', REINIGEN: '„REINIGEN“', INTENSIV: '„INTENSIVREINIGEN“', AUSRICHTEN: '„AUSRICHTEN“', INFO: '„INFO“', TESTDRUCK: 'Testabdruck' },
    steps: [
      { anim: 'menu', t: 'Bestätigen Sie die Meldung und wählen Sie im Display {WECHSELN}. Die Kartuschen fahren in die Wechselposition und die Klappe öffnet sich von selbst. Bitte nicht mit Gewalt öffnen.' },
      { anim: 'lever', t: 'Drehen Sie die beiden blaugrünen Hebel nach hinten, ziehen Sie die blaugrünen Ausheber hoch und heben Sie die Kartuschen heraus.', tip: 'Säubern Sie bei jedem Wechsel die Kontakte mit dem FP-Set „clean & renew“.' },
      { anim: 'shake', t: 'Die neuen Kartuschen sollten Raumtemperatur haben. Schütteln Sie jede sechsmal kräftig und ziehen Sie die Schutzstreifen erst kurz vor dem Einsetzen ab.' },
      { anim: 'in', t: 'Kontakte nach hinten: Kartusche einsetzen, bis zum Anschlag nach unten drücken und dann leicht nach hinten, bis sie in der Halterung sitzt. Dann die zweite. Zum Schluss die Hebel wieder nach vorn drehen.', tip: 'Immer beide Kartuschen zusammen wechseln, und immer zwei neue.' },
      { anim: 'close', t: 'Schließen Sie die Klappe. Die Maschine bereitet die Kartuschen vor. Das dauert einen Moment.' },
      { anim: 'align', t: 'Danach startet das Ausrichten von selbst: Legen Sie einen leeren Umschlag ein und lesen Sie auf dem Testabdruck ab, wo die Linien am besten übereinanderliegen.' }
    ],
    tank: {
      name: 'PostBase One mit Tanksystem',
      steps: [
        { anim: 'menu', t: 'Bestätigen Sie die Meldung und wählen Sie im Display „MENÜ › DRUCKSYSTEM › TANK WECHSELN“. Die Klappe öffnet sich von selbst, ziehen Sie sie nicht auf.' },
        { anim: 'out', t: 'Drücken Sie auf die Mulde des alten Tanks, schieben Sie ihn nach unten und ziehen Sie ihn gleichzeitig nach vorn. Dann heben Sie ihn aus der Halterung.' },
        { anim: 'shake', t: 'Packen Sie den neuen Tank aus und schütteln Sie ihn sechsmal kräftig.' },
        { anim: 'in', t: 'Setzen Sie den Tank ein und drücken Sie ihn nach unten, bis er in der Halterung einrastet.' },
        { anim: 'test', t: 'Schließen Sie die Klappe und prüfen Sie den Abdruck. Wann die Druckköpfe getauscht werden müssen, meldet die Maschine selbst. Getauscht werden sie immer paarweise.' }
      ]
    },
    power: 'Schalten Sie die Maschine immer aus, indem Sie den Wipptaster drei Sekunden drücken, bevor Sie den Stecker ziehen. Sonst kann der Druckkopf eintrocknen.'
  },
  mini: {
    name: 'PostBase mini', carts: 1,
    note: 'Gilt genauso für die PostBase Mini Insight: Sie nutzt dieselbe Kartusche und denselben Ablauf.',
    src: 'PostBase Mini Betriebsanleitung, deutsche Ausgabe (FP; manualslib.de 12448), S. 18, 21, 66–74, 78–79; PostBase mini Operator Manual (US), S. 64–76',
    menu: { WECHSELN: '„MENÜ › DRUCKSYSTEM › WECHSELN“', REINIGEN: '„REINIGEN“', INTENSIV: '„INTENSIVREINIGEN“', AUSRICHTEN: '„AUSRICHTEN“', INFO: '„INFO“', TESTDRUCK: 'Testabdruck' },
    steps: [
      { anim: 'menu', t: 'Bestätigen Sie die Meldung und wählen Sie im Display {WECHSELN}. Die Maschine fährt die Kartusche in die Wechselposition.' },
      { anim: 'lift', t: 'Klappen Sie das Bedienfeld bis zum Anschlag hoch. Es rastet hörbar ein.' },
      { anim: 'out', t: 'Drücken Sie die grüne Entriegelungstaste und nehmen Sie die alte Kartusche nach oben aus dem Halter.' },
      { anim: 'prep', t: 'Die neue Kartusche sollte Raumtemperatur haben. Ziehen Sie den Düsenschutz ab und fassen Sie die Düsen nicht an.' },
      { anim: 'in', t: 'Achtung, anders als bei den großen PostBase: Die Kontakte zeigen nach vorn. Drücken Sie die Kartusche gegen den Federdruck nach unten, bis der grüne Riegel hörbar einrastet.' },
      { anim: 'close', t: 'Klappen Sie das Bedienfeld wieder herunter. Die Maschine kalibriert die Kartusche und reinigt das Drucksystem. Das dauert einen Moment.' },
      { anim: 'align', t: 'Zum Schluss {AUSRICHTEN}: Schieben Sie einen leeren Umschlag ein. Auf dem Testabdruck sollen sich die Linien bei der Nummer 5 treffen.' }
    ],
    power: 'Schalten Sie die mini immer über die Taste aus (drei Sekunden drücken), bevor Sie den Stecker ziehen. Sonst kann die Kartusche eintrocknen.'
  },
  m2: {
    name: 'PostBase Vision M2', carts: 1,
    src: 'PostBase Vision M2 Betriebsanleitung, deutsche Ausgabe 2026-01 (fp-francotyp.de), S. 9, 15, 20–28, 47–48, und Kurzanleitung 2026-01; PostBase Vision M2 Reference Guide (englisch, 51-0074-3393-00, 10/2023), S. 88–100',
    menu: { WECHSELN: '„Menü“ › „Tintenkartusche wechseln“[[?Vision M2: genauer Menüweg zum Kartuschenwechsel (Handbuch Kap. 16.5, Text nicht lesbar)]]',
      REINIGEN: 'Drucksystem reinigen[[?Vision M2: Menüweg „Drucksystem reinigen“ (Kap. 16.2)]]', INTENSIV: '', AUSRICHTEN: '', INFO: 'die Füllstandsanzeige oben in der Menüleiste',
      TESTDRUCK: '„Testabdruck“ (Portowert-Taste, ganz unten in der Liste)' },
    steps: [
      { anim: 'menu', t: 'Starten Sie den Wechsel im Display über {WECHSELN}. Die Maschine fährt das Drucksystem in die Wechselposition und entriegelt die Waage.' },
      { anim: 'lift', t: 'Wenn das Display dazu auffordert: Fassen Sie die Waage am Griff und klappen Sie sie bis zum Anschlag hoch.' },
      { anim: 'out', t: 'Nehmen Sie die alte Kartusche nach oben heraus.[[?Vision M2: Entriegelung der alten Kartusche (Handbuch Kap. 16.5, Text nicht lesbar)]]' },
      { anim: 'prep', t: 'Ist an der neuen Kartusche ein Clip, nehmen Sie ihn ab und setzen ihn nicht wieder auf. Ziehen Sie den Düsenschutz ab.' },
      { anim: 'in', t: 'Halten Sie die Kartusche mit den Kontakten nach vorn, zur Vorderseite der Maschine. Setzen Sie sie in den Halter und drücken Sie sie nach unten, bis sie spürbar einrastet.' },
      { anim: 'close', t: 'Klappen Sie die Waage zurück, sie rastet wieder ein. Oben im Display erscheint das Symbol für eine volle Kartusche.' },
      { anim: 'align', t: 'Zum Ausrichten schieben Sie einen leeren Umschlag bis zum Anschlag ein. Auf dem Testmuster sollen sich die Linien bei der Nummer 5 treffen. Bestätigen Sie mit „Fertig“, danach reinigt die Maschine die Kartusche.[[?Vision M2: Ausrichten und Reinigen auch beim späteren Wechsel wie bei der Erstinstallation (S. 23–25)?]]' }
    ],
    power: 'Schalten Sie die Maschine immer über die Taste „EIN / AUS“ aus (drei Sekunden drücken) und ziehen Sie den Stecker erst, wenn das Licht aus ist. Dann steht das Drucksystem in der Dichtposition und trocknet nicht ein.'
  }
};
WARTUNG.insight.menu = WARTUNG.classic.menu;
WARTUNG.insight.steps = WARTUNG.classic.steps;

// Reihenfolge der Modelle auf den Seiten (wie im Kartuschenfinder)
var WARTUNG_ORDER = ['mini', 'm2', 'one', 'classic', 'vision', 'fusion', 'insight'];

// ── 2. Druckbild-Doktor: Symptome ───────────────────────────────────────
// fault = Fehlerbild, wie es in den Handbüchern heißt. two = nur bei Modellen mit zwei Kartuschen.
// ask = welche Rückfragen nach dem Modell kommen (wechsel, stand).
var SYMPTOME = [
  { id: 'sauber',     label: 'Sauber',                 sub: 'alles gut lesbar',       fault: '–',               ask: [] },
  { id: 'blass',      label: 'Insgesamt blass',        sub: 'wie ausgewaschen',       fault: 'Fehlstellen',     ask: ['wechsel', 'stand'] },
  { id: 'streifen',   label: 'Weiße Streifen',         sub: 'Linien quer durch',      fault: 'Fehlstellen',     ask: ['wechsel', 'stand'] },
  { id: 'fehlt',      label: 'Teile fehlen',           sub: 'Lücken im Abdruck',      fault: 'Fehlstellen',     ask: ['wechsel', 'stand'] },
  { id: 'verschmiert',label: 'Unscharf, verschmiert',  sub: 'Ränder verlaufen',       fault: 'Unschärfen',      ask: [] },
  { id: 'versatz',    label: 'Hälften verschoben',     sub: 'oben und unten versetzt',fault: 'Versatz',         ask: [], two: true },
  { id: 'gestaucht',  label: 'Gestaucht',              sub: 'zusammengeschoben',      fault: 'gestauchte Abdrucke', ask: [] },
  { id: 'leer',       label: 'Gar kein Abdruck',       sub: 'Umschlag bleibt weiß',   fault: 'Kartusche nicht erkannt', ask: [] }
];

// Rückfragen (Modell kommt immer zuerst)
var FRAGEN = {
  wechsel: { q: 'Wann kam die Kartusche zuletzt neu in die Maschine?', a: [
    { v: 'neu',  label: 'Gerade eben',          sub: 'Abdruck ist schon mit der neuen Kartusche so' },
    { v: 'jung', label: 'Vor weniger als 12 Monaten' },
    { v: 'alt',  label: 'Vor mehr als 12 Monaten' },
    { v: 'weiss-nicht', label: 'Weiß ich nicht' }] },
  stand: { q: 'Stand die Maschine länger als ein paar Wochen ungenutzt?', a: [
    { v: 'ja',   label: 'Ja',   sub: 'zum Beispiel über Urlaub oder Feiertage' },
    { v: 'nein', label: 'Nein', sub: 'sie läuft regelmäßig' }] }
};

// ── 3. Diagnose-Tabelle ─────────────────────────────────────────────────
// Von oben nach unten gelesen, die erste passende Zeile gilt.
// symptom: id oder Liste. wenn: Antworten, die passen müssen (leer = immer).
// Die Ampelgrenzen sind eine Vorgabe von TE Printline (von Silvio bestätigt, 26.11.2026), keine Handbuchaussage.
var DIAGNOSE = [
  // Symptom                              wenn                      Befund
  { symptom: 'sauber',                    wenn: {},                 befund: 'alles-gut' },
  { symptom: 'gestaucht',                 wenn: {},                 befund: 'transport' },
  { symptom: 'versatz',                   wenn: {},                 befund: 'ausrichten' },
  { symptom: 'verschmiert',               wenn: {},                 befund: 'unscharf' },
  { symptom: 'leer',                      wenn: {},                 befund: 'nicht-erkannt' },
  { symptom: ['blass', 'streifen', 'fehlt'], wenn: { wechsel: 'neu' },  befund: 'reinigen-neu' },
  { symptom: ['blass', 'streifen', 'fehlt'], wenn: { wechsel: 'alt' },  befund: 'kartusche' },
  { symptom: ['blass', 'streifen', 'fehlt'], wenn: { stand: 'ja' },     befund: 'kartusche' },
  { symptom: ['blass', 'streifen', 'fehlt'], wenn: {},                  befund: 'reinigen' }
];

// ── 4. Befunde ──────────────────────────────────────────────────────────
// ampel: gruen = selbst beheben, gelb = Kartusche vermutlich leer/eingetrocknet, rot = anrufen.
// weiter = Befund, wenn der Kunde „Hat nicht geholfen“ tippt.
var BEFUNDE = {
  'alles-gut': { ampel: 'gruen', titel: 'Ihr Abdruck ist in Ordnung',
    text: 'Gut so. Damit es so bleibt: Kartusche spätestens nach etwa 12 Monaten tauschen, auch wenn noch Tinte drin ist, und die Maschine richtig ausschalten.',
    schritte: [], nachher: 'sauber' },
  'reinigen': { ampel: 'gruen', titel: 'Das können Sie meist selbst beheben',
    text: 'Fehlstellen im Abdruck kommen oft von eingetrockneten Düsen. Gehen Sie diese Schritte der Reihe nach durch und machen Sie nach jedem Schritt einen Testabdruck.',
    schritte: ['Machen Sie einen {TESTDRUCK} auf einem leeren Umschlag.', 'Ist er nicht sauber: Starten Sie im Menü {REINIGEN}.', 'Hilft das nicht: {INTENSIV}.', 'Hilft auch das nicht: Reinigen Sie die Düsen von Hand mit einem weichen, fusselfreien Tuch und entmineralisiertem Wasser. Düsen nach unten, sanft in eine Richtung wischen, keine Reinigungsmittel.'],
    weiter: 'kartusche', nachher: 'sauber' },
  'reinigen-neu': { ampel: 'gruen', titel: 'Erst reinigen, dann weitersehen',
    text: 'Auch mit einer frischen Kartusche kann der Abdruck zuerst Lücken haben. Gehen Sie diese Schritte durch und machen Sie nach jedem Schritt einen Testabdruck.',
    schritte: ['Prüfen Sie, ob der Düsenschutz ganz abgezogen ist.', 'Starten Sie im Menü {REINIGEN}.', 'Hilft das nicht: {INTENSIV}.', 'Hilft auch das nicht: Reinigen Sie die Düsen von Hand mit einem weichen, fusselfreien Tuch und entmineralisiertem Wasser.'],
    weiter: 'techniker', nachher: 'sauber' },
  'kartusche': { ampel: 'gelb', titel: 'Die Kartusche ist vermutlich leer oder eingetrocknet',
    text: 'Eine Kartusche, die älter als etwa 12 Monate ist oder lange ungenutzt in der Maschine steckte, trocknet gern ein. Versuchen Sie zuerst {REINIGEN} und {INTENSIV}. Wird der Abdruck nicht besser oder ist der Füllstand niedrig, setzen Sie eine neue Original-Kartusche ein.',
    schritte: ['Füllstand ansehen: {INFO}.', '{REINIGEN}, danach bei Bedarf {INTENSIV}.', 'Bleibt der Abdruck schlecht: neue Kartusche einsetzen.'],
    kartusche: true, weiter: 'techniker', nachher: 'sauber' },
  'ausrichten': { ampel: 'gruen', titel: 'Die beiden Kartuschen müssen neu ausgerichtet werden',
    text: 'Sind die zwei Hälften des Abdrucks gegeneinander verschoben, drucken die beiden Kartuschen nicht ganz deckungsgleich. Das richten Sie im Menü selbst.',
    schritte: ['Starten Sie im Menü {AUSRICHTEN}.', 'Legen Sie einen leeren Umschlag ein und folgen Sie dem Display.'],
    weiter: 'techniker', nachher: 'sauber' },
  'unscharf': { ampel: 'gruen', titel: 'Erst Umschlag prüfen, dann reinigen',
    text: 'Unscharfe oder verlaufene Abdrucke haben oft mit dem Umschlag zu tun. Dunkle, glänzende oder stark faserige Umschläge nehmen die Tinte schlecht an.',
    schritte: ['Machen Sie einen {TESTDRUCK} auf einem hellen, matten Umschlag.', 'Ist er auch dort unscharf: {REINIGEN}.', 'Hilft das nicht: {INTENSIV}.'],
    weiter: 'techniker', nachher: 'sauber' },
  'nicht-erkannt': { ampel: 'gruen', titel: 'Kartusche neu einsetzen',
    text: 'Kommt gar nichts aufs Papier, sitzt die Kartusche oft nicht richtig oder die Kontakte sind verschmutzt.',
    schritte: ['Nehmen Sie die Kartusche über {WECHSELN} heraus und setzen Sie sie wieder ein, bis sie einrastet.', 'Säubern Sie die Kontakte. Dafür gibt es das FP-Set „clean & renew“.', 'Prüfen Sie, ob es die richtige Kartusche für Ihr Modell ist.'],
    weiter: 'techniker', nachher: 'sauber' },
  'transport': { ampel: 'rot', titel: 'Bitte rufen Sie uns an',
    text: 'Ein gestauchter Abdruck heißt meist, dass der Brief nicht gleichmäßig durch die Maschine läuft. Die Ursache sitzt dann im Transport, nicht in der Kartusche. Ein Techniker schaut sich das an.[[?Druckbild-Doktor: dürfen Kunden die Transportbürste selbst prüfen oder tauschen?]]',
    schritte: [], nachher: 'sauber' },
  'techniker': { ampel: 'rot', titel: 'Jetzt sollte ein Techniker draufschauen',
    text: 'Sie haben alles versucht, was Sie selbst machen können. Rufen Sie uns an, wir finden gemeinsam die Ursache und sagen Ihnen ehrlich, ob eine neue Kartusche hilft oder ob ein Techniker kommen sollte.',
    schritte: [], nachher: 'sauber' },
  'rauch': { ampel: 'rot', titel: 'Stecker ziehen und anrufen',
    text: 'Riecht die Maschine verschmort, ziehen Sie sofort den Netzstecker und benutzen Sie die Maschine nicht weiter. Rufen Sie uns an.',
    schritte: [], nachher: null }
};

// ── 5. Helfer (Browser und Build) ───────────────────────────────────────
function wMenu(id) { var w = WARTUNG[id]; return w.menu || WARTUNG[w.like].menu; }
function wSteps(id, tank) { var w = WARTUNG[id]; return tank && w.tank ? w.tank.steps : (w.steps || WARTUNG[w.like].steps); }
// Platzhalter {REINIGEN} usw. durch Menünamen ersetzen. Unbekannter Name → allgemeiner Text mit Prüfhinweis.
function wFill(text, id) {
  var m = wMenu(id), name = WARTUNG[id].name;
  var plain = { REINIGEN: 'Reinigen', INTENSIV: 'Intensivreinigung', AUSRICHTEN: 'Ausrichten', INFO: 'Füllstand', TESTDRUCK: 'Testabdruck', WECHSELN: 'Kartusche wechseln' };
  return text.replace(/\{(\w+)\}/g, function (all, k) {
    return m[k] || (plain[k] + '[[?' + name + ': Menüname für „' + plain[k] + '“ nicht belegt]]');
  });
}
function wDiagnose(symptom, ans) {
  for (var i = 0; i < DIAGNOSE.length; i++) {
    var r = DIAGNOSE[i], s = [].concat(r.symptom), ok = s.indexOf(symptom) >= 0;
    for (var k in r.wenn) if (ans[k] !== r.wenn[k]) ok = false;
    if (ok) return r.befund;
  }
  return 'techniker';
}
