// Saubere Zeilenumbrüche in fertigem HTML. Wird von tools/build.js auf alle Seiten angewendet.
// 1. Keine Waisen: das letzte Wort eines Absatzes, Listenpunkts oder einer Überschrift steht nie allein
//    in der letzten Zeile (geschütztes Leerzeichen vor dem letzten Wort).
// 2. Einleitungen (.lead, .sub, Startseiten-Hero) bekommen einen Satz pro Zeile: jeder Satz in <span class="satz">.
// Läuft mehrfach ohne Schaden (idempotent).

// Tabellenzellen bleiben außen vor: dort dürfen Zahl und Einheit untereinander stehen.
const BLOCK = /<(p|li|h1|h2|h3|summary|small|strong|figcaption|dt|dd|label)(\s[^>]*)?>([\s\S]*?)<\/\1>/g;
const MAX_LETZTES = 20; // längere Schlusswörter (z. B. Artikelnummern) bleiben, wie sie sind

function teile(html) { // [{tag:true|false, s}]
  const out = []; const re = /<[^>]*>/g; let i = 0, m;
  while ((m = re.exec(html))) { if (m.index > i) out.push({ tag: false, s: html.slice(i, m.index) }); out.push({ tag: true, s: m[0] }); i = re.lastIndex; }
  if (i < html.length) out.push({ tag: false, s: html.slice(i) });
  return out;
}

// Ersetzt das letzte normale Leerzeichen vor dem letzten Wort durch &nbsp;
function ohneWaise(inner) {
  if (/<(p|div|ul|ol|li|table|br|h\d|section|details)\b/i.test(inner)) return inner;
  const t = teile(inner);
  const text = t.filter(x => !x.tag).map(x => x.s).join('').replace(/&nbsp;/g, ' ');
  if (text.trim().split(/\s+/).length < 3) return inner; // zwei Wörter (Menüpunkte, Knöpfe) dürfen umbrechen
  let nachher = ''; // sichtbarer Text hinter der Stelle
  for (let k = t.length - 1; k >= 0; k--) {
    if (t[k].tag) continue;
    const s = t[k].s;
    for (let j = s.length - 1; j >= 0; j--) {
      const c = s[j];
      if (c === ' ' || c === '\n') {
        const wort = nachher.replace(/&nbsp;/g, ' ').trim();
        if (!wort) { nachher = c + nachher; continue; }
        if (/\s/.test(wort.replace(/&[a-z]+;/g, 'x')) || wort.length > MAX_LETZTES) return inner;
        // Vor der Stelle muss mindestens ein weiteres Wort stehen
        if (!s.slice(0, j).trim() && !t.slice(0, k).some(x => !x.tag && x.s.trim())) return inner;
        t[k].s = s.slice(0, j) + '&nbsp;' + s.slice(j + 1);
        return t.map(x => x.s).join('');
      }
      nachher = c + nachher;
    }
  }
  return inner;
}

// Teilt Einleitungen in Sätze. Grenze: . ? ! oder : vor einem Großbuchstaben, nicht nach Abkürzungen.
function satzweise(inner) {
  if (inner.includes('class="satz"')) return inner;
  const t = teile(inner); let tiefe = 0; const grenzen = []; let pos = 0;
  for (const x of t) {
    if (x.tag) { if (/^<\//.test(x.s)) tiefe--; else if (!/\/>$|^<(br|img|wbr)\b/i.test(x.s)) tiefe++; pos += x.s.length; continue; }
    if (tiefe === 0) {
      const re = /([.?!])( +)(?=[A-ZÄÖÜ])/g; let m;
      while ((m = re.exec(x.s))) {
        const vor = x.s.slice(0, m.index + 1);
        if (/(\bz\. ?B|\bca|\bNr|\bS|\bbzw|\busw|\bggf|\bd\. ?h|\bu\. ?a|\bMo|\bFr)\.$/.test(vor)) continue;
        grenzen.push([pos + m.index + 1, pos + m.index + 1 + m[2].length]);
      }
    }
    pos += x.s.length;
  }
  if (!grenzen.length) return inner;
  const saetze = []; let a = 0;
  for (const [e, n] of grenzen) { saetze.push(inner.slice(a, e)); a = n; }
  saetze.push(inner.slice(a));
  return saetze.map(s => '<span class="satz">' + ohneWaise(s) + '</span>').join(' ');
}

function umbrechen(html) {
  // Nur den sichtbaren Teil (ab <body>), Skripte und Styles nicht anfassen
  const b = html.indexOf('<body');
  if (b > 0) return html.slice(0, b) + umbrechen(html.slice(b));
  return html.split(/(<script\b[\s\S]*?<\/script>|<style\b[\s\S]*?<\/style>)/).map((teil, i) => i % 2 ? teil : umbrechenText(teil)).join('');
}

function umbrechenText(html) {
  // Einleitungen satzweise
  html = html.replace(/(<p class="(?:lead|sub)"(?:\s[^>]*)?>|<section class="hero">[\s\S]*?<p>)([\s\S]*?)(<\/p>)/g,
    (all, a, inner, z) => a + satzweise(inner) + z);
  // Waisen vermeiden (innerste Blöcke zuerst: zweimal laufen lassen)
  for (let n = 0; n < 2; n++) {
    html = html.replace(BLOCK, (all, tag, attr, inner) => {
      if (/class="satz"/.test(inner)) return all; // schon satzweise behandelt
      return all.replace(inner, ohneWaise(inner));
    });
  }
  // Feste Namen nie trennen
  html = html.replace(/>([^<]*)</g, (all, t) => '>' + t.replace(/Vision M2/g, 'Vision&nbsp;M2') + '<');
  // Einfache Textspannen ohne Klasse (z. B. Untertitel der Hilfekarten)
  html = html.replace(/<span>([^<]*)<\/span>/g, (all, inner) => '<span>' + ohneWaise(inner) + '</span>');
  return html;
}

module.exports = { umbrechen, ohneWaise, satzweise };
