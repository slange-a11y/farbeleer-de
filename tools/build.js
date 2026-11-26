#!/usr/bin/env node
// farbeleer.de: erzeugt Ratgeber und Modellseiten als statisches HTML.
//
//   node tools/build.js
//
// Datenquelle ist allein assets/kartuschen.js (dieselbe Datei, die der Kartuschenfinder lädt).
// Erzeugt werden:
//   ratgeber/farbe-leer-was-tun/index.html
//   postbase-*/index.html (7 Modellseiten)
//   in index.html die Übersichtstabelle und die Modell-Links (zwischen den build:-Markern)
// Die erzeugten Dateien werden eingecheckt; GitHub Pages braucht keinen Build-Schritt.
// Am Ende listet das Skript alle Stellen, die im Text mit „[bitte prüfen]“ markiert sind.
'use strict';
const fs = require('fs');
const path = require('path');
const vm = require('vm');

const ROOT = path.join(__dirname, '..');
const BASE = 'https://www.farbeleer.de';
const TODAY = '2026-11-26';
const PHONE = '06204 / 9622-0';
const TEL = 'tel:+49620496220';

// ── Daten laden ─────────────────────────────────────────────────────────
const D = {};
vm.createContext(D);
vm.runInContext(fs.readFileSync(path.join(ROOT, 'assets/kartuschen.js'), 'utf8'), D);
const { SHOP, MACHINES, VOLUMES, MAX_MONTHS, pickIndex, fmt, months } = D;
const byId = id => MACHINES.find(m => m.id === id);
const one = byId('one');
const oneCart = one.choice[0].m, oneTank = one.choice[1].m;

// Bildmaße (für width/height, gegen Springen beim Laden)
const IMG = { mini: [340, 337], m2: [421, 336], one: [448, 177], classic: [448, 265], vision: [643, 355], fusion: [447, 242], insight: [448, 282] };

// ── Helfer ──────────────────────────────────────────────────────────────
const esc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const nb = s => esc(s).replace(/ /g, '&nbsp;');
const CHECKS = [];
let currentPage = '';
function chk(what) {
  CHECKS.push(currentPage + ': ' + what);
  return ' <span class="check" title="' + esc(what) + '">[bitte prüfen]</span>';
}
function shop(p, campaign, content) {
  return SHOP + p + '?utm_source=farbeleer&amp;utm_medium=landingpage&amp;utm_campaign=' + campaign + '&amp;utm_content=' + content;
}
const sizeSlug = s => s.toLowerCase().replace(/\s+/g, '').replace(/[^a-z0-9-]/g, '');
const imgSrc = m => '/' + m.img;
const reachTxt = r => 'bis zu ' + nb(fmt(r)) + ' Frankierungen';
function list(arr) { return arr.length < 2 ? arr.join('') : arr.slice(0, -1).join(', ') + ' und ' + arr[arr.length - 1]; }

// ── Seitenrahmen (Kopf, Navigation, Anrufleiste, Fußzeile wie die Startseite) ──
function layout(o) {
  const url = BASE + o.path;
  const crumbs = [{ name: 'Startseite', path: '/' }].concat(o.crumbs);
  const graph = [
    { '@type': 'Organization', '@id': BASE + '/#org', name: 'TE Printline GmbH', url: 'https://www.te-printline.de', logo: BASE + '/logo.png', telephone: '+49 6204 9622-0',
      address: { '@type': 'PostalAddress', streetAddress: 'Ladenburger Straße 7', postalCode: '68519', addressLocality: 'Viernheim', addressRegion: 'Hessen', addressCountry: 'DE' } },
    { '@type': 'WebSite', '@id': BASE + '/#website', url: BASE + '/', name: 'farbeleer.de', inLanguage: 'de-DE', publisher: { '@id': BASE + '/#org' } },
    Object.assign({ '@type': 'WebPage', '@id': url + '#webpage', url, name: o.h1plain, description: o.desc, isPartOf: { '@id': BASE + '/#website' },
      breadcrumb: { '@id': url + '#breadcrumb' }, inLanguage: 'de-DE', dateModified: TODAY, publisher: { '@id': BASE + '/#org' } },
      o.image ? { primaryImageOfPage: { '@type': 'ImageObject', url: BASE + o.image } } : {}),
    { '@type': 'BreadcrumbList', '@id': url + '#breadcrumb', itemListElement: crumbs.map((c, i) => ({ '@type': 'ListItem', position: i + 1, name: c.name, item: BASE + c.path })) }
  ];
  if (o.faq && o.faq.length) graph.push({ '@type': 'FAQPage', '@id': url + '#faq', mainEntity: o.faq.map(f => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })) });
  const ld = JSON.stringify({ '@context': 'https://schema.org', '@graph': graph }, null, 1);
  const navShop = shop('/', o.campaign, o.slug + '-nav');
  const footShop = shop('/', o.campaign, o.slug + '-footer');
  const on = k => (o.nav === k ? ' class="on"' : '');
  return `<!DOCTYPE html>
<html lang="de">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<!-- Erzeugt von tools/build.js aus assets/kartuschen.js. Änderungen bitte dort machen, nicht hier. -->
<title>${esc(o.title)}</title>
<meta name="description" content="${esc(o.desc)}">
<meta name="robots" content="index, follow, max-snippet:-1, max-image-preview:large">
<link rel="canonical" href="${url}">
<meta name="author" content="TE Printline GmbH">
<meta property="og:type" content="website">
<meta property="og:locale" content="de_DE">
<meta property="og:site_name" content="farbeleer.de">
<meta property="og:url" content="${url}">
<meta property="og:title" content="${esc(o.h1plain)}">
<meta property="og:description" content="${esc(o.desc)}">
<meta property="og:image" content="${BASE}${o.ogImage || '/img/og-farbeleer.jpg'}">
<meta name="twitter:card" content="summary_large_image">
<link rel="icon" href="/favicon.png" type="image/png">
<link rel="stylesheet" href="/assets/site.css">
<script type="application/ld+json">
${ld}
</script>
</head>
<body>

<div class="topbar">TE Printline GmbH · autorisierte Generalvertretung von Francotyp-Postalia</div>
<div class="usp"><ul>
  <li><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2"><path d="M3 14v-2a9 9 0 0118 0v2"/><rect x="2" y="14" width="5" height="7" rx="2"/><rect x="17" y="14" width="5" height="7" rx="2"/></svg>Beratung: <span class="nw">${PHONE}</span></li>
  <li><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2"><path d="M21 8l-9-5-9 5v8l9 5 9-5z"/><path d="M3 8l9 5 9-5M12 13v8"/></svg>Bis 13&nbsp;Uhr bestellt, heute versendet</li>
  <li><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2"><circle cx="12" cy="8" r="4"/><path d="M4 21c0-4 4-6 8-6s8 2 8 6"/></svg>Für Gewerbe, Behörden, Vereine</li>
  <li><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2"><path d="M12 2.7s6 6.6 6 11a6 6 0 01-12 0c0-4.4 6-11 6-11z"/></svg>Original von Francotyp-Postalia</li>
</ul></div>
<div class="head">
  <a href="/" title="Zur Startseite von farbeleer.de"><img src="/logo.png" alt="TE Printline GmbH" width="380" height="47"></a>
  <a class="btn" href="${TEL}">&#128222; <span class="nw">${PHONE}</span></a>
</div>
<nav class="nav" aria-label="Hauptnavigation"><ul>
  <li><a href="/#finder">Kartuschenfinder</a></li>
  <li><a${on('modelle')} href="/#modelle">Modelle</a></li>
  <li><a${on('ratgeber')} href="/ratgeber/farbe-leer-was-tun/">Ratgeber</a></li>
  <li><a href="/#beratung">Persönliche Beratung</a></li>
  <li><a href="/#faq">Häufige Fragen</a></li>
  <li><a href="${navShop}">Zum Shop</a></li>
</ul></nav>

<main class="wrap">
  <nav class="crumbs" aria-label="Brotkrumen"><ol>
${crumbs.map((c, i) => i < crumbs.length - 1 ? `    <li><a href="${c.path}">${esc(c.name)}</a></li>` : `    <li aria-current="page">${esc(c.name)}</li>`).join('\n')}
  </ol></nav>
${o.body}
</main>

<div class="sticky-call">
  <p>Lieber persönlich bestellen? Wir beraten Sie gerne.</p>
  <a class="btn white sm" href="${TEL}">&#128222; Jetzt anrufen: <span class="nw">${PHONE}</span></a>
  <small>Mo–Fr 8–16&nbsp;Uhr</small>
</div>

<footer>
  <div class="wrap">
    <span>TE Printline GmbH · Ladenburger Straße&nbsp;7 · 68519&nbsp;Viernheim · <a href="${TEL}"><span class="nw">${PHONE}</span></a></span>
    <span><a href="/impressum.html">Impressum</a><a href="/datenschutz.html">Datenschutz</a><a href="${footShop}">Shop&nbsp;frankierfarbe.de</a></span>
  </div>
</footer>
</body>
</html>
`;
}

function faqHtml(faq) {
  return `  <section class="block faq" id="faq">
    <h2>Häufige Fragen</h2>
${faq.map(f => `    <details><summary>${esc(f.q)}</summary><p>${esc(f.a)}</p></details>`).join('\n')}
  </section>`;
}

function waysHtml(o) {
  return `  <section class="block" id="bestellen">
    <h2>So kommen Sie zu Ihrer neuen Kartusche</h2>
    <div class="ways">
      <div class="way"><h3>Kartuschenfinder</h3><p>${o.finderText}</p><a class="btn" href="${o.finderHref}">Zum Kartuschenfinder</a></div>
      <div class="way"><h3>Im Shop bestellen</h3><p>${o.shopText}</p><a class="btn" href="${o.shopHref}">Zum Shop frankierfarbe.de</a></div>
      <div class="way call"><h3>Lieber anrufen</h3><p>Montag bis Freitag von 8 bis 16&nbsp;Uhr erreichen Sie unser Team in Viernheim. Wir beraten Sie und nehmen Ihre Bestellung direkt auf.</p><a class="btn white" href="${TEL}">&#128222; <span class="nw">${PHONE}</span></a></div>
    </div>
  </section>`;
}

const SHIP_FAQ = {
  q: 'Wie schnell kommt die neue Kartusche?',
  a: 'Was Sie werktags bis 13 Uhr bestellen, verschicken wir am selben Tag. In der Regel ist die Kartusche am nächsten Werktag bei Ihnen. Wir liefern an Gewerbetreibende, Behörden und Vereine, bezahlt wird per Rechnung oder Bankeinzug.'
};

// ── Modellseiten ────────────────────────────────────────────────────────
// Texte je Modell. „recognize“ beschreibt nur, was auf dem FP-Foto zu sehen ist.
const MODELS = [
  { id: 'mini', slug: 'postbase-mini', name: 'PostBase mini', h1: 'PostBase mini', short: 'PostBase mini',
    intro: 'Die PostBase mini ist die kleinste PostBase von Francotyp-Postalia. Hier sehen Sie alle Original-Kartuschen dafür und welche Größe zu Ihrer Briefmenge passt.',
    recognize: 'Ein kompaktes Tischgerät mit kleinem Display oben und dem FP-Logo vorn am Gehäuse.',
    extraFaq: [{ q: 'Passen die Kartuschen der PostBase mini auch in die Vision M2?',
      a: 'Bitte bestellen Sie immer die Kartusche, die für Ihr Modell angegeben ist. Für die PostBase mini und die PostBase Vision M2 gibt es eigene Artikel mit unterschiedlichen Artikelnummern, auch wenn Füllmengen und Reichweiten gleich sind. Wenn Sie nicht sicher sind, welches Modell bei Ihnen steht, rufen Sie uns an.' }] },
  { id: 'm2', slug: 'postbase-vision-m2', name: 'PostBase Vision M2', h1: 'PostBase Vision M2', short: 'Vision M2',
    intro: 'Die PostBase Vision M2 hat eigene Original-Kartuschen in drei Größen. Hier sehen Sie alle mit Reichweite und Artikelnummer und welche Größe zu Ihrer Briefmenge passt.',
    recognize: 'Ein hellgraues, kastenförmiges Tischgerät mit großem Farbdisplay oben rechts und dem FP-Logo vorn.',
    extraFaq: [{ q: 'Passen die Kartuschen der Vision M2 auch in die PostBase mini?',
      a: 'Bitte bestellen Sie immer die Kartusche, die für Ihr Modell angegeben ist. Für die PostBase Vision M2 und die PostBase mini gibt es eigene Artikel mit unterschiedlichen Artikelnummern, auch wenn Füllmengen und Reichweiten gleich sind. Wenn Sie nicht sicher sind, welches Modell bei Ihnen steht, rufen Sie uns an.' }] },
  { id: 'one', slug: 'postbase-one', name: 'PostBase One', h1: 'PostBase One', short: 'PostBase One',
    intro: 'Die PostBase One 120 und One 150 gibt es mit Kartuschen oder mit Tanksystem. Hier finden Sie die Original-Tinte für beide Ausführungen.',
    recognize: 'Eine lange, flache Maschine mit Briefzuführung auf der einen und Ablage auf der anderen Seite, das Display sitzt in der Mitte.' },
  { id: 'classic', slug: 'postbase-classic', name: 'PostBase 30 bis 100', h1: 'PostBase 30, 45, 65 und 100', short: 'PostBase 30 bis 100',
    intro: 'Die PostBase 30, 45, 65 und 100 nutzen dieselben Original-Kartuschen-Sets. Hier sehen Sie alle vier Größen und welche zu Ihrer Briefmenge passt.',
    recognize: 'Ein helles Gehäuse mit Display und flacher Auflage obenauf, darunter eine dunkle Briefbahn mit Ablage.',
    extraFaq: [{ q: 'Gelten die Kartuschen für alle Modelle von PostBase 30 bis 100?',
      a: 'Ja. Die PostBase 30, 45, 65 und 100 nutzen dieselben Kartuschen-Sets XS, SMALL, MEDIUM und XL. Auch die PostBase Insight nutzt diese Sets.' },
      { q: 'Was bedeutet die Angabe „2 × 10 ml“?',
        a: 'Ein Set enthält zwei Kartuschen. „2 × 10 ml“ heißt also: zwei Kartuschen mit je 10 ml Tinte.' }] },
  { id: 'vision', slug: 'postbase-vision', name: 'PostBase Vision', h1: 'PostBase Vision 35, 50 und 70', short: 'PostBase Vision',
    intro: 'Für die PostBase Vision 35, 50 und 70 gibt es die Original-Kartusche nur noch in einer Größe: LARGE. Hier sehen Sie, wie lange sie bei Ihrer Briefmenge reicht.',
    recognize: 'Das große Farbdisplay sitzt vorn im hellen Gehäuse, darunter läuft eine lange, dunkle Briefbahn.',
    extraFaq: [{ q: 'Gibt es die Kartusche für die Vision auch kleiner?',
        a: 'Nein. Für die PostBase Vision 35 bis 70 gibt es die Original-Kartusche nur noch in Größe LARGE. Wechseln Sie sie mindestens einmal im Jahr, damit die Tinte nicht eintrocknet.' }] },
  { id: 'fusion', slug: 'postbase-fusion', name: 'PostBase Fusion', h1: 'PostBase Fusion', short: 'PostBase Fusion',
    intro: 'Die PostBase Fusion 35, 50, 70 und 120 hat eigene Original-Kartuschen-Sets in vier Größen. Hier sehen Sie alle mit Reichweite und welche zu Ihrer Briefmenge passt.',
    recognize: 'Ein hellgraues Gehäuse mit Display obenauf, darunter eine lange, dunkle Briefbahn mit Ablage.',
    extraFaq: [{ q: 'Passen die Kartuschen der PostBase 30 bis 100 auch in die Fusion?',
      a: 'Bitte bestellen Sie die Sets, die für die PostBase Fusion angegeben sind. Sie haben eigene Artikelnummern, auch wenn die Füllmengen denen der PostBase 30 bis 100 entsprechen. Im Zweifel rufen Sie uns kurz an.' }] },
  { id: 'insight', slug: 'postbase-insight', name: 'PostBase Insight', h1: 'PostBase Insight', short: 'PostBase Insight',
    intro: 'Die PostBase Insight nutzt dieselben Original-Kartuschen-Sets wie die PostBase 30 bis 100. Hier sehen Sie alle vier Größen und welche zu Ihrer Briefmenge passt.',
    recognize: 'Das Display sitzt erhöht auf einem Standfuß über dem hellen Gehäuse, darunter liegt eine lange, dunkle Briefbahn.',
    extraFaq: [{ q: 'Warum stehen im Shop Kartuschen „für PostBase 30 bis 100“?',
      a: 'Weil die PostBase Insight dieselben Kartuschen-Sets nutzt wie die PostBase 30 bis 100. Im Shop sind sie dort eingeordnet. Für Ihre Insight bestellen Sie genau diese Sets.' }] }
];

function sizesTable(m, slug, opts) {
  opts = opts || {};
  const rows = m.sizes.map(s => `      <tr><td><b>${esc(s.size)}</b>${s.ml !== s.size ? '<br><small>' + nb(s.ml) + '</small>' : ''}<small class="m-sku">Art.-Nr. ${s.sku}</small></td><td>${reachTxt(s.reach)}</td><td class="num sku">${s.sku}</td><td><a href="${shop(s.path, 'modellseite', slug + '-' + (opts.prefix || '') + sizeSlug(s.size))}">ansehen&nbsp;&rarr;</a></td></tr>`);
  if (m.addon) rows.push(`      <tr><td><b>Druckkopf-Set</b><br><small>für das Tanksystem</small><small class="m-sku">Art.-Nr. ${m.addon.sku}</small></td><td>${reachTxt(m.addon.reach)}</td><td class="num sku">${m.addon.sku}</td><td><a href="${shop(m.addon.path, 'modellseite', slug + '-druckkopf')}">ansehen&nbsp;&rarr;</a></td></tr>`);
  if (opts.extraRow) rows.push(opts.extraRow);
  return `    <div class="scroll"><table class="tbl">
      <thead><tr><th>${opts.unit || 'Kartusche'}</th><th>Reichweite</th><th class="sku">Artikel-Nr.</th><th>Shop</th></tr></thead>
      <tbody>
${rows.join('\n')}
      </tbody>
    </table></div>`;
}

function recTable(m) {
  const rows = VOLUMES.map(v => {
    const k = m.sizes[pickIndex(m.sizes, v.n)];
    return `      <tr><td>${esc(v.label)} <small>(${esc(v.hint)})</small></td><td><b>${esc(k.size)}</b></td><td>${months(k.reach, v.n)}</td></tr>`;
  });
  return `    <div class="scroll"><table class="tbl">
      <thead><tr><th>Briefe pro Monat</th><th>Unsere Empfehlung</th><th>reicht etwa</th></tr></thead>
      <tbody>
${rows.join('\n')}
      </tbody>
    </table></div>`;
}

function recSentence(m) {
  // gleiche Logik wie im Finder, als Satz für die FAQ
  const parts = VOLUMES.map(v => {
    const k = m.sizes[pickIndex(m.sizes, v.n)];
    return 'bei ' + v.label + ' Briefen im Monat ' + k.size;
  });
  return 'Das hängt davon ab, wie viel Sie verschicken. Wir empfehlen die Größe, die innerhalb eines Jahres aufgebraucht ist, damit die Tinte nicht eintrocknet: ' + list(parts) + '.';
}

function sizesSentence(m) {
  return m.sizes.map(s => s.size + ' (' + s.ml + ', bis zu ' + fmt(s.reach) + ' Frankierungen)').join(', ').replace(/, ([^,]*)$/, ' und $1');
}

function howto(mm, name, isSet) {
  const steps = [
    'Lassen Sie die Maschine eingeschaltet. Die PostBase zeigt im Display an, wenn die Kartusche getauscht werden muss, und führt Sie durch den Wechsel.' + chk('Wechselanleitung: Maschine bleibt eingeschaltet, Display führt durch den Wechsel'),
    'Öffnen Sie die Abdeckung, unter der die Kartusche sitzt.' + chk('Wechselanleitung ' + name + ': Lage der Abdeckung / des Kartuschenfachs'),
    'Nehmen Sie die leere Kartusche heraus.' + chk('Wechselanleitung ' + name + ': muss die Kartusche entriegelt werden?'),
    'Packen Sie die neue Kartusche erst jetzt aus und ziehen Sie die Schutzfolie ab. Die Düsen bitte nicht mit den Fingern berühren.' + chk('Wechselanleitung: Schutzfolie über den Düsen vorhanden'),
    'Setzen Sie die neue Kartusche ein, bis sie fest sitzt, und schließen Sie die Abdeckung. Die Maschine erkennt die neue Kartusche.' + chk('Wechselanleitung: Kartusche rastet ein, Maschine erkennt sie selbst'),
    'Schauen Sie beim nächsten Brief auf den Abdruck. Ist er sauber und vollständig, ist alles erledigt. Ist er blass oder streifig, rufen Sie uns an.'
  ];
  if (isSet) steps.splice(3, 0, 'Im Set stecken zwei Kartuschen. Tauschen Sie beide zusammen aus.' + chk('Wechselanleitung ' + name + ': werden beide Kartuschen des Sets gemeinsam getauscht?'));
  return `    <ol class="howto">
${steps.map(s => '      <li>' + s + '</li>').join('\n')}
    </ol>`;
}

function buildModel(p) {
  currentPage = '/' + p.slug + '/';
  const m = byId(p.id);
  const slug = p.slug;
  const finderHref = '/?modell=' + p.id + '#finder';
  const catHref = shop(m.cat, 'modellseite', slug + '-kategorie');
  const [w, h] = IMG[p.id];
  const isSet = m.sizes.length ? /2 ×/.test(m.sizes[0].ml) : false;
  let tables, rec, special = '', guide, faq;

  if (p.id === 'one') {
    tables = `    <h3>Mit Kartuschen</h3>
${sizesTable(oneCart, slug, { prefix: 'kartusche-' })}
    <h3 style="margin-top:22px">Mit Tanksystem</h3>
${sizesTable(oneTank, slug, { unit: 'Tintentank', prefix: 'tank-' })}`;
    rec = `    <p>${esc(oneCart.only)}</p>
    <p>Beim Tanksystem gilt dieselbe Regel wie bei den Kartuschen: Der Tank sollte innerhalb eines Jahres leer sein. Bei Ihrer Briefmenge empfehlen wir:</p>
${recTable(oneTank)}`;
    special = `    <div class="note"><b>Kartusche oder Tank?</b> ${esc(one.questionSub)} Für das Tanksystem braucht die Maschine außerdem das Druckkopf-Set (Artikel-Nr. ${oneTank.addon.sku}, reicht für bis zu ${fmt(oneTank.addon.reach)}&nbsp;Frankierungen).</div>`;
    guide = `    <h3>Mit Kartuschen</h3>
${howto(oneCart, 'PostBase One', true)}
    <h3 style="margin-top:18px">Mit Tanksystem</h3>
    <ol class="howto">
      <li>Der Tintentank steht neben der Maschine und ist über einen Schlauch mit dem Druckkopf verbunden.</li>
      <li>Wie Sie den Tank tauschen, zeigt Ihnen das Display der Maschine.${chk('Wechselanleitung PostBase One Tanksystem: Ablauf des Tankwechsels')}</li>
      <li>Das Druckkopf-Set brauchen Sie nur beim Umstieg auf das Tanksystem und wenn es nach seiner Reichweite getauscht werden muss.${chk('PostBase One Tanksystem: wann wird das Druckkopf-Set gebraucht, baut der Kunde es selbst ein?')}</li>
    </ol>`;
    faq = [
      { q: 'Welche Tinte passt in die PostBase One?',
        a: 'Für die PostBase One 120 und One 150 mit Kartuschen gibt es das Original-Kartuschen-Set XL (2 × 42 ml, bis zu 22.000 Frankierungen). Für die Ausführung mit Tanksystem gibt es Tintentanks mit 175 ml (bis zu 50.000 Frankierungen) und 350 ml (bis zu 100.000 Frankierungen).' },
      { q: 'Wie erkenne ich, ob meine PostBase One Kartuschen oder ein Tanksystem hat?',
        a: one.questionSub + ' Steckt die Tinte dagegen in der Maschine, arbeitet Ihre One mit Kartuschen.' },
      { q: 'Brauche ich für den Tintentank das Druckkopf-Set?',
        a: 'Ja. Für das Tanksystem braucht die PostBase One außerdem das Druckkopf-Set für das Tanksystem (Artikel-Nr. ' + oneTank.addon.sku + ', reicht für bis zu ' + fmt(oneTank.addon.reach) + ' Frankierungen).' },
      SHIP_FAQ
    ];
  } else {
    let extraRow = '';
    tables = sizesTable(m, slug, { extraRow });
    if (m.sizes.length > 1) {
      rec = `    <p>Größer ist nicht automatisch besser. Steckt eine Kartusche zu lange in der Maschine, kann die Tinte eintrocknen. Wir empfehlen deshalb die größte Kartusche, die bei Ihrer Briefmenge innerhalb von ${MAX_MONTHS}&nbsp;Monaten aufgebraucht ist. Reicht schon die kleinste länger, nehmen Sie die kleinste und wechseln sie trotzdem einmal im Jahr.</p>
${recTable(m)}`;
    } else {
      rec = `    <p>${esc(m.only)}</p>
${recTable(m)}`;
    }
    if (p.id === 'insight') special = `    <div class="note"><b>Gut zu wissen:</b> ${esc(m.extra)} Im Shop finden Sie die Sets deshalb unter „PostBase 30 bis 100“.</div>`;
    guide = howto(m, p.name, isSet);
    faq = [
      { q: 'Welche Kartuschen passen in die ' + p.name + '?',
        a: (m.sizes.length > 1 ? 'Für die ' + p.name + ' gibt es ' + m.sizes.length + ' Original-' + (isSet ? 'Kartuschen-Sets' : 'Kartuschen') + ' von Francotyp-Postalia: ' : 'Für die ' + p.name + ' gibt es die Original-Kartusche ') + sizesSentence(m) + '.' + (p.id === 'insight' ? ' Es sind dieselben Sets wie für die PostBase 30 bis 100.' : '') }
    ];
    if (m.sizes.length > 1) faq.push({ q: 'Welche Kartuschengröße ist für meine ' + p.name + ' die richtige?', a: recSentence(m) });
    faq = faq.concat(p.extraFaq || []).concat([SHIP_FAQ]);
  }

  const body = `
  <section class="page-hero">
    <div>
      <h1>Tintenkartusche für die <span>${esc(p.h1)}</span></h1>
      <p class="lead">${esc(p.intro)}</p>
    </div>
    <img class="shot" src="${imgSrc(m)}" alt="${esc(m.name)} von Francotyp-Postalia" width="${w}" height="${h}">
  </section>
  <p class="answer"><b>So erkennen Sie die ${esc(p.name)}:</b> ${esc(p.recognize)}${chk('Erkennungsmerkmal ' + p.name + ' (nur nach FP-Foto beschrieben)')}</p>

  <section class="block" id="kartuschen">
    <h2>Diese Original-Kartuschen passen</h2>
    <p class="sub">Reichweiten laut Francotyp-Postalia. Wie weit eine Kartusche tatsächlich reicht, hängt vom Abdruck ab, zum Beispiel ob Sie ein Werbeklischee mitdrucken.</p>
${tables}
${special}
  </section>

  <section class="block" id="empfehlung">
    <h2>Welche Größe passt zu Ihrer Briefmenge?</h2>
    <div class="prose">
${rec}
    </div>
    <p style="margin-top:14px"><a class="btn wrap" href="${finderHref}">Kartuschenfinder für die ${esc(p.short)} öffnen &rarr;</a></p>
  </section>

  <section class="block" id="wechsel">
    <h2>Kartusche wechseln: so geht es</h2>
    <p class="sub">Eine kurze Übersicht in unseren Worten. Wenn Sie lieber jemanden dabeihaben: Rufen Sie uns an, wir gehen den Wechsel am Telefon mit Ihnen durch.</p>
${guide}
  </section>

${faqHtml(faq)}

${waysHtml({
    finderText: 'Ihre ' + esc(p.short) + ' ist schon ausgewählt. ' + (m.noQty ? 'Sie sehen sofort unsere Empfehlung.' : m.choice ? 'Sie wählen noch Kartusche oder Tanksystem, geben Ihre Briefmenge an und sehen unsere Empfehlung.' : 'Sie geben nur noch Ihre Briefmenge an und sehen unsere Empfehlung.'),
    finderHref,
    shopText: 'Alle Original-Kartuschen für die ' + esc(p.short) + ' im Shop frankierfarbe.de, mit Bestellung auf Rechnung oder per Bankeinzug.',
    shopHref: catHref })}

  <p class="fine">Mehr Hilfe: <a href="/ratgeber/farbe-leer-was-tun/">Farbe leer: was tun?</a> · <a href="/#uebersicht">Übersicht aller Kartuschen</a></p>`;

  const sizesShort = (p.id === 'one' ? ['XL-Set', 'Tintentank 175 ml', 'Tintentank 350 ml'] : m.sizes.map(s => s.size));
  const html = layout({
    path: '/' + slug + '/', slug, campaign: 'modellseite', nav: 'modelle',
    title: 'Tintenkartusche ' + p.h1 + ': Größen, Reichweite, Wechsel | farbeleer.de',
    desc: 'Original-Tinte für die ' + p.h1 + ': ' + list(sizesShort) + ' mit Reichweite und Artikelnummer. Welche Größe passt zu Ihrer Menge? Beratung unter ' + PHONE + '.',
    h1plain: 'Tintenkartusche für die ' + p.h1,
    crumbs: [{ name: p.name, path: '/' + slug + '/' }],
    image: '/' + m.img.replace(/\?.*$/, ''),
    faq, body
  });
  write(slug + '/index.html', html);
}

// ── Ratgeber ────────────────────────────────────────────────────────────
function buildRatgeber() {
  currentPage = '/ratgeber/farbe-leer-was-tun/';
  const slug = 'farbe-leer-was-tun';
  // Rechenbeispiel aus den echten Daten (PostBase 30 bis 100, rund 600 Briefe)
  const cl = byId('classic'), n = 600, i = pickIndex(cl.sizes, n), k = cl.sizes[i], bigger = cl.sizes[i + 1];
  const tiles = MODELS.map(p => {
    const m = byId(p.id), [w, h] = IMG[p.id];
    return `      <a class="mtile" href="/${p.slug}/"><span class="pic"><img src="${imgSrc(m)}" alt="${esc(m.name)}" width="${w}" height="${h}" loading="lazy"></span><strong>${esc(m.name).replace(/ (\S+)$/, '&nbsp;$1')}</strong>${m.models ? `<small>${esc(m.models).replace(/ · /g, '&nbsp;· ')}</small>` : ''}</a>`;
  }).join('\n');
  const chips = MODELS.map(p => `<a href="/${p.slug}/#wechsel">${esc(p.name)}</a>`).join('');
  const faq = [
    { q: 'Was bedeutet „Farbe leer“ bei der Frankiermaschine?',
      a: 'Die Maschine meldet, dass die Tinte in der Kartusche zur Neige geht oder aufgebraucht ist. Damit der Frankierabdruck lesbar bleibt, setzen Sie eine neue Original-Kartusche ein.' },
    { q: 'Welche Kartusche passt in meine Frankiermaschine?',
      a: 'Das hängt vom Modell ab. Jede PostBase von Francotyp-Postalia hat eigene Kartuschen. Auf farbeleer.de gibt es für jedes Modell eine eigene Seite mit allen passenden Kartuschen. Wenn Sie nicht sicher sind, welches Modell bei Ihnen steht, rufen Sie uns an.' },
    { q: 'Sollte ich gleich die größte Kartusche nehmen?',
      a: 'Nicht unbedingt. Tinte kann eintrocknen, wenn eine Kartusche zu lange in der Maschine steckt. Wir empfehlen die Größe, die bei Ihrer Menge innerhalb eines Jahres aufgebraucht ist, und raten, die Kartusche mindestens einmal im Jahr zu wechseln.' },
    { q: 'Wie lange kann ich eine Ersatzkartusche lagern?',
      a: 'Eine Ersatzkartusche bereitzuhalten ist sinnvoll. Lagern Sie sie aber nicht länger als etwa 12 Monate, bevor Sie sie einsetzen.' },
    SHIP_FAQ,
    { q: 'Kann ich auch telefonisch bestellen?',
      a: 'Ja, gern. Unter 06204 / 9622-0 erreichen Sie Montag bis Freitag von 8 bis 16 Uhr unser Team in Viernheim. Am Telefon sprechen Sie mit Menschen, nicht mit einer Bandansage oder einer KI.' }
  ];
  const body = `
  <section class="page-hero">
    <div>
      <h1>Frankiermaschine meldet „Farbe leer“: <span>was tun?</span></h1>
      <p class="answer">Die Meldung bedeutet, dass die Tinte in Ihrer Kartusche zur Neige geht oder aufgebraucht ist. In drei Schritten kommen Sie zur neuen Kartusche: Modell erkennen, passende Größe bestellen, Kartusche einsetzen.</p>
    </div>
    <img class="shot" src="/farbe-leer-oval.webp" alt="Farbe leer?" width="420" height="250">
  </section>

  <section class="block" id="modell">
    <h2><span class="stepno">1</span>Modell erkennen</h2>
    <p class="sub">Tippen Sie auf das Gerät, das so aussieht wie Ihres. Auf der Seite dazu sehen Sie alle passenden Kartuschen. Den genauen Namen finden Sie meist auf dem Gehäuse der Maschine.${chk('Ratgeber: Modellname steht auf dem Gehäuse (Typenschild/Aufdruck)?')}</p>
    <div class="mtiles">
${tiles}
    </div>
    <p class="help">Ihre Maschine ist nicht dabei oder Sie sind unsicher? <a href="${TEL}">Rufen Sie uns an: <span class="nw">${PHONE}</span></a> (Mo–Fr 8–16&nbsp;Uhr)</p>
  </section>

  <section class="block" id="groesse">
    <h2><span class="stepno">2</span>Passende Größe wählen und bestellen</h2>
    <div class="prose">
      <p>Für die meisten Modelle gibt es mehrere Kartuschengrößen. Größer ist dabei nicht automatisch besser: Steckt eine Kartusche zu lange in der Maschine, kann die Tinte eintrocknen. Wir empfehlen deshalb die Größe, die bei Ihrer Briefmenge innerhalb von ${MAX_MONTHS}&nbsp;Monaten aufgebraucht ist. Im Zweifel lieber eine Nummer kleiner.</p>
      <p><b>Ein Beispiel:</b> Sie haben eine PostBase&nbsp;65 und verschicken rund ${fmt(n)} Briefe im Monat. Das Set ${k.size} reicht für bis zu ${fmt(k.reach)}&nbsp;Frankierungen, also ${months(k.reach, n)}. Das Set ${bigger.size} mit bis zu ${fmt(bigger.reach)}&nbsp;Frankierungen würde länger als ein Jahr in der Maschine stecken. Unsere Empfehlung ist deshalb ${k.size}.</p>
      <p>Der Kartuschenfinder rechnet das für jedes Modell aus. Bestellen können Sie im Shop frankierfarbe.de oder am Telefon. Wir liefern an Gewerbetreibende, Behörden und Vereine, bezahlt wird per Rechnung oder Bankeinzug. Was Sie werktags bis 13&nbsp;Uhr bestellen, verschicken wir am selben Tag. In der Regel ist die Kartusche am nächsten Werktag bei Ihnen.</p>
    </div>
    <div class="actions" style="margin-top:14px"><a class="btn" href="/#finder">Zum Kartuschenfinder &rarr;</a><a class="btn ghost" href="${shop('/c/postverarbeitung/francotyp-postalia', 'ratgeber', slug + '-kategorie')}">Kartuschen im Shop</a></div>
  </section>

  <section class="block" id="einsetzen">
    <h2><span class="stepno">3</span>Kartusche einsetzen</h2>
    <p class="sub">Wie der Wechsel geht, steht kurz auf der Seite Ihres Modells. Wenn Sie lieber jemanden dabeihaben: Rufen Sie uns an, wir gehen den Wechsel am Telefon mit Ihnen durch.</p>
    <div class="chips">${chips}</div>
  </section>

  <section class="block split">
    <div>
      <h2>Abdruck nach dem Wechsel blass oder streifig?</h2>
      <p class="sub">Bevor Sie lange selbst probieren oder gleich die nächste Kartusche einsetzen: Rufen Sie uns an. Wir schauen gemeinsam, woran es liegt, und sagen Ihnen ehrlich, ob die Kartusche die Ursache ist.</p>
      <p><a class="btn ghost" href="${TEL}">&#128222; <span class="nw">${PHONE}</span></a></p>
    </div>
    <div class="note"><b>Tipp: Ersatzkartusche bereithalten.</b> Damit die Meldung Sie nicht mitten im Versand überrascht, legen Sie eine Ersatzkartusche bereit. Lagern Sie sie aber nicht länger als etwa 12&nbsp;Monate. Wer viel verschickt, bestellt am besten gleich zwei Stück.</div>
  </section>

${faqHtml(faq)}

${waysHtml({
    finderText: 'Maschine antippen, Briefmenge angeben und sehen, welche Kartuschengröße zu Ihnen passt.',
    finderHref: '/#finder',
    shopText: 'Alle Original-Kartuschen von Francotyp-Postalia im Shop frankierfarbe.de, mit Bestellung auf Rechnung oder per Bankeinzug.',
    shopHref: shop('/c/postverarbeitung/francotyp-postalia', 'ratgeber', slug + '-kategorie-unten') })}`;

  write('ratgeber/farbe-leer-was-tun/index.html', layout({
    path: '/ratgeber/farbe-leer-was-tun/', slug, campaign: 'ratgeber', nav: 'ratgeber',
    title: 'Frankiermaschine meldet „Farbe leer“: was tun? | farbeleer.de',
    desc: 'Ihre PostBase meldet „Farbe leer“? In drei Schritten zur passenden Original-Kartusche von Francotyp-Postalia: Modell erkennen, Größe wählen, einsetzen. Beratung aus Viernheim.',
    h1plain: 'Frankiermaschine meldet „Farbe leer“: was tun?',
    crumbs: [{ name: 'Farbe leer: was tun?', path: '/ratgeber/farbe-leer-was-tun/' }],
    ogImage: '/img/og-farbeleer.jpg',
    faq, body
  }));
}

// ── Startseite: Übersichtstabelle und Modell-Links ───────────────────────
function buildIndexParts() {
  const ov = (p, c) => SHOP + p + '?utm_source=farbeleer&amp;utm_medium=landingpage&amp;utm_campaign=uebersicht&amp;utm_content=' + c;
  const nbsp = s => s.replace(/ /g, '&nbsp;');
  const rows = [];
  const group = (th, items) => items.forEach((it, i) => rows.push('<tr>' + (i === 0 ? `<th scope="rowgroup" rowspan="${items.length}">${th}</th>` : '') +
    `<td><a href="${ov(it.path, it.c)}">${it.label}</a></td><td>${nbsp(it.ml)}</td><td>${it.reach}</td><td>${it.sku}</td></tr>`));
  const std = m => m.sizes.map(s => ({ path: s.path, c: m.id + '-' + s.size.toLowerCase(), label: s.size, ml: s.ml, reach: nbsp(fmt(s.reach)) + '&nbsp;Briefe', sku: s.sku }));
  const th = m => m.name + (m.models ? '<small>' + m.models + '</small>' : '');
  MACHINES.forEach(m => {
    if (m.id === 'one') {
      const c = oneCart.sizes[0], t1 = oneTank.sizes[0], t2 = oneTank.sizes[1], a = oneTank.addon;
      group(th(m), [
        { path: c.path, c: 'one-xl', label: 'XL-Set (Kartuschen)', ml: c.ml, reach: nbsp(fmt(c.reach)) + '&nbsp;Briefe', sku: c.sku },
        { path: t1.path, c: 'one-tank-175', label: 'Tintentank (Tanksystem)', ml: t1.ml, reach: nbsp(fmt(t1.reach)) + '&nbsp;Briefe', sku: t1.sku },
        { path: t2.path, c: 'one-tank-350', label: 'Tintentank XL (Tanksystem)', ml: t2.ml, reach: nbsp(fmt(t2.reach)) + '&nbsp;Briefe', sku: t2.sku },
        { path: a.path, c: 'one-druckkopf', label: 'Druckkopf-Set (Tanksystem)', ml: '–', reach: nbsp(fmt(a.reach)) + '&nbsp;Briefe', sku: a.sku }]);
    } else group(th(m), std(m));
  });
  const chips = '    <div class="chips">' + MODELS.map(p => `<a href="/${p.slug}/">${esc(p.name)}</a>`).join('') + '</div>';
  let s = fs.readFileSync(path.join(ROOT, 'index.html'), 'utf8');
  s = replaceBetween(s, 'uebersicht', rows.join('\n'));
  s = replaceBetween(s, 'modelle', chips);
  fs.writeFileSync(path.join(ROOT, 'index.html'), s);
}
function replaceBetween(s, name, content) {
  const a = `<!-- build:${name} -->`, b = `<!-- /build:${name} -->`;
  const i = s.indexOf(a), j = s.indexOf(b);
  if (i < 0 || j < 0) throw new Error('Marker fehlt in index.html: ' + name);
  return s.slice(0, i + a.length) + '\n' + content + '\n' + s.slice(j);
}

function write(rel, html) {
  const f = path.join(ROOT, rel);
  fs.mkdirSync(path.dirname(f), { recursive: true });
  fs.writeFileSync(f, html);
  console.log('geschrieben:', rel);
}

buildRatgeber();
MODELS.forEach(buildModel);
buildIndexParts();
const uniq = [...new Set(CHECKS)];
console.log('\n[bitte prüfen]-Stellen (' + uniq.length + '):\n' + uniq.map(c => '- ' + c).join('\n'));
