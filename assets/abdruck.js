// farbeleer.de: gezeichnete Beispielabdrucke (SVG) und kleine Helfer für die Erlebnis-Seiten.
// Platzhalter, bis die Bilder aus dem ChatGPT-Bogen da sind (siehe bildprompts/).
// Alle Abdrucke sind frei erfunden und tragen nur das Wort „MUSTER“:
// kein echter Frankiervermerk, kein Datamatrix-Code, keine Portowerte.
var ABDRUCK_N = 0;
function abdruckSvg(art, label) {
  var n = 'a' + (++ABDRUCK_N), ink = '#2a2a2a';
  // Grundmotiv: Rahmen, Kreis-Stempel, Wort MUSTER, Zierlinien, Kästchen-Ornament
  var motiv =
    '<rect x="14" y="14" width="212" height="92" rx="6" fill="none" stroke="' + ink + '" stroke-width="3"/>' +
    '<g fill="none" stroke="' + ink + '" stroke-width="3"><rect x="26" y="30" width="44" height="44"/><rect x="35" y="39" width="26" height="26"/><path d="M26 30l44 44M70 30l-44 44"/></g>' +
    '<text x="148" y="66" text-anchor="middle" font-family="Arial,Helvetica,sans-serif" font-size="28" font-weight="700" letter-spacing="2" fill="' + ink + '">MUSTER</text>' +
    '<g fill="' + ink + '"><rect x="88" y="78" width="120" height="5"/><rect x="88" y="88" width="84" height="5"/><rect x="88" y="34" width="56" height="5"/></g>' +
    '<circle cx="200" cy="36" r="13" fill="none" stroke="' + ink + '" stroke-width="3"/>';
  var defs = '', body = '';
  switch (art) {
    case 'blass': body = '<g opacity=".28">' + motiv + '</g>'; break;
    case 'streifen':
      body = '<g>' + motiv + '</g><g fill="#fff">' + [24, 41, 57, 74, 90].map(function (y) { return '<rect x="0" y="' + y + '" width="240" height="4"/>'; }).join('') + '</g>'; break;
    case 'fehlt':
      body = '<g>' + motiv + '</g><g fill="#fff"><path d="M120 10h70l-6 40h-50z"/><rect x="20" y="66" width="70" height="40"/><path d="M190 70l40 4v40h-44z"/></g>'; break;
    case 'verschmiert':
      defs = '<filter id="f' + n + '" x="-10%" y="-10%" width="120%" height="120%"><feGaussianBlur stdDeviation="2.2"/></filter>';
      body = '<g filter="url(#f' + n + ')"><g opacity=".45" transform="translate(4 2)">' + motiv + '</g>' + motiv + '</g>'; break;
    case 'versatz':
      defs = '<clipPath id="t' + n + '"><rect x="0" y="0" width="240" height="60"/></clipPath><clipPath id="b' + n + '"><rect x="0" y="60" width="240" height="60"/></clipPath>';
      body = '<g clip-path="url(#t' + n + ')">' + motiv + '</g><g clip-path="url(#b' + n + ')"><g transform="translate(9 0)">' + motiv + '</g></g>'; break;
    case 'gestaucht': body = '<g transform="translate(14 0) scale(.55 1)">' + motiv + '</g>'; break;
    case 'leer': body = ''; break;
    default: body = motiv;
  }
  return '<svg class="abdruck" viewBox="0 0 240 120" role="img" aria-label="' + (label || 'Beispielabdruck') + '">' +
    (defs ? '<defs>' + defs + '</defs>' : '') +
    '<rect width="240" height="120" fill="#fbfaf7"/>' + body + '</svg>';
}
// [[?…]] → gelbes „[bitte prüfen]“
function markChecks(t) {
  return String(t).replace(/\[\[\?(.+?)\]\]/g, function (a, w) {
    return ' <span class="check" title="' + w.replace(/"/g, '&quot;') + '">[bitte prüfen]</span>';
  });
}
function stripChecks(t) { return String(t).replace(/\[\[\?(.+?)\]\]/g, ''); }
function shopLink(path, campaign, content) {
  return SHOP + path + '?utm_source=farbeleer&utm_medium=landingpage&utm_campaign=' + campaign + '&utm_content=' + content;
}
function sizeSlug(s) { return String(s).toLowerCase().replace(/\s+/g, '').replace(/[^a-z0-9-]/g, ''); }
// Maschine aus dem Kartuschenfinder holen (bei der One die Ausführung mit Kartuschen oder Tank)
function finderMachine(id, tank) {
  for (var i = 0; i < MACHINES.length; i++) if (MACHINES[i].id === id) {
    var m = MACHINES[i];
    return m.choice ? m.choice[tank ? 1 : 0].m : m;
  }
  return null;
}
