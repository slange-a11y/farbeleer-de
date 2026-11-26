// farbeleer.de: Beispielabdrucke und kleine Helfer für die Erlebnis-Seiten.
// Die Abdrucke tragen nur das Wort „MUSTER“: kein echter Frankiervermerk, kein Code, keine Portowerte.
// Bilder: img/erlebnis/abdruck-*.webp (geschnitten mit tools/bogen-schneiden.py).
function abdruckBild(art, label) {
  return '<img class="abdruck" src="/img/erlebnis/abdruck-' + art + '.webp" alt="' + String(label || 'Beispielabdruck').replace(/"/g, '&quot;') + '" width="480" height="240" loading="lazy" decoding="async">';
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

// Textfassung: ohne JavaScript offen, mit JavaScript zugeklappt (die interaktive Fassung steht darüber).
if (typeof document !== 'undefined') {
  var closeMore = function () { [].forEach.call(document.querySelectorAll('details[data-close-js]'), function (d) { d.removeAttribute('open'); }); };
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', closeMore); else closeMore();
}
// Keine Waisen: das letzte Wort eines Absatzes oder Punkts steht nie allein in der letzten Zeile
// (dieselbe Regel, die tools/umbruch.js beim Bauen auf die festen Seiten anwendet).
function ohneWaisen(root) {
  var els = root.querySelectorAll('p,li,h2,h3,strong,small,summary');
  for (var i = 0; i < els.length; i++) {
    var el = els[i];
    if (el.querySelector('p,li,div,ul,ol,br') || el.querySelector('.satz')) continue;
    var text = el.textContent.replace(/\u00a0/g, ' ').trim();
    var w = text.split(/\s+/);
    if (w.length < 3 || w[w.length - 1].length > 20) continue;
    var tw = document.createTreeWalker(el, NodeFilter.SHOW_TEXT), n, nodes = [], full = '';
    while ((n = tw.nextNode())) { nodes.push(n); full += n.data; }
    var t = full.replace(/\s+$/, ''), j = t.lastIndexOf(' ');
    if (j <= 0 || t.slice(j + 1).indexOf('\u00a0') >= 0) continue; // schon verbunden
    for (var k = 0; k < nodes.length; k++) {
      if (j < nodes[k].data.length) { nodes[k].data = nodes[k].data.slice(0, j) + '\u00a0' + nodes[k].data.slice(j + 1); break; }
      j -= nodes[k].data.length;
    }
  }
}
