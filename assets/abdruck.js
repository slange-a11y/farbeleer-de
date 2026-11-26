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
