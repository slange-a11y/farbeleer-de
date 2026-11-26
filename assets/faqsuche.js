// farbeleer.de: Suche auf /haeufige-fragen/. Versteht Alltagssprache, ganze Sätze und Tippfehler.
// Kein Tracking, keine externen Skripte: alles läuft im Browser.
// Jede Frage trägt in data-k Wörter, die Kunden statt der Fachbegriffe benutzen (gepflegt in tools/build.js, FAQ_KEYS).
var FAQ_STOP = ('ich du sie er es wir ihr mein meine meinen meiner meinem meines unsere unser unseren ihre ihren ' +
  'die der das den dem des ein eine einen einem einer eines und oder aber auch noch schon mal ja nein bitte danke hallo guten tag ' +
  'gibt gib ist sind war waren bin bist hat habe haben hatte wird werden wurde kann koennen konnte muss muessen soll sollte sollen ' +
  'mit von vom zu zum zur bei beim auf in im ins an am aus fuer ueber um so wie was wann wo warum wieso weshalb wer wen wem ' +
  'welche welcher welches welchen nicht kein keine keinen sehr mehr nur da dann denn wenn dass man sich mir mich uns euch ihnen ' +
  'hier jetzt immer gerade etwa eigentlich irgendwie bzw usw ob als bis zb frage fragen hilfe brauche brauchen will moechte wuerde ' +
  'hilft geht machen mache tun').split(' ');

function faqNorm(t) {
  return String(t).toLowerCase().replace(/ä/g, 'ae').replace(/ö/g, 'oe').replace(/ü/g, 'ue').replace(/ß/g, 'ss')
    .replace(/(\d)\s*[x×]\s*(\d)/g, '$1x$2').replace(/[^a-z0-9]+/g, ' ').trim();
}
function faqStem(w) {
  if (w.length > 6 && /ungen$/.test(w)) return w.slice(0, -5);
  if (w.length > 5 && /ung$/.test(w)) return w.slice(0, -3);
  if (w.length > 5 && /(en|er|es|em)$/.test(w)) return w.slice(0, -2);
  if (w.length > 4 && /[ens]$/.test(w)) return w.slice(0, -1);
  return w;
}
function faqTokens(t, keepStop) {
  return faqNorm(t).split(' ').filter(function (w) {
    return w && (w.length > 1 || /\d/.test(w)) && (keepStop || FAQ_STOP.indexOf(w) < 0);
  }).map(faqStem);
}
function faqLev(a, b, max) {
  if (Math.abs(a.length - b.length) > max) return max + 1;
  var prev = [], cur, i, j;
  for (j = 0; j <= b.length; j++) prev[j] = j;
  for (i = 1; i <= a.length; i++) {
    cur = [i]; var best = i;
    for (j = 1; j <= b.length; j++) {
      cur[j] = Math.min(prev[j] + 1, cur[j - 1] + 1, prev[j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1));
      if (cur[j] < best) best = cur[j];
    }
    if (best > max) return max + 1;
    prev = cur;
  }
  return prev[b.length];
}
// Wie gut passt ein Suchwort zu einem Wort aus der Frage? 0 = gar nicht, 1 = genau
function faqMatch(q, d) {
  if (q === d) return 1;
  var s = Math.min(q.length, d.length);
  if (s >= 4 && (q.indexOf(d) === 0 || d.indexOf(q) === 0)) return 0.85;
  if (d.length >= 5 && q.length >= 8 && q.slice(-d.length) === d) return 0.75; // Tintenpatrone → patrone
  if (q.length >= 5 && d.length >= 8 && d.slice(-q.length) === q) return 0.6;  // patrone → farbpatrone
  if (s >= 4 && !/\d/.test(q)) {
    var max = s >= 7 ? 2 : 1;
    if (faqLev(q, d, max) <= max) return 0.65;
    if (s >= 5 && faqLev(q.slice(0, s), d.slice(0, s), 1) <= 1 && Math.abs(q.length - d.length) <= 3) return 0.5;
  }
  return 0;
}
// index: [{ q: Frage, k: Alltagswörter, a: Antwort }] → sortierte Treffer [{ i, score }]
function faqPrepare(list) {
  return list.map(function (e) {
    var parts = [[faqTokens(e.q), 3], [faqTokens(e.k || ''), 2.6], [faqTokens(e.a || ''), 1]];
    var seen = {}, toks = [];
    parts.forEach(function (p) { p[0].forEach(function (t) { if (!seen[t] || seen[t] < p[1]) { seen[t] = p[1]; } }); });
    for (var t in seen) toks.push([t, seen[t]]);
    return toks;
  });
}
function faqSearch(prepared, query) {
  var qs = faqTokens(query);
  if (!qs.length) qs = faqTokens(query, true);
  qs = qs.filter(function (t, i) { return qs.indexOf(t) === i; });
  if (!qs.length) return [];
  var res = prepared.map(function (toks, i) {
    var score = 0, hit = 0;
    qs.forEach(function (q) {
      var best = 0;
      for (var j = 0; j < toks.length; j++) { var m = faqMatch(q, toks[j][0]) * toks[j][1]; if (m > best) best = m; }
      if (best > 0) { score += best; hit++; }
    });
    return { i: i, score: score * (0.5 + 0.5 * hit / qs.length), hit: hit };
  }).filter(function (r) { return r.score >= 1; });
  res.sort(function (a, b) { return b.score - a.score; });
  if (!res.length) return [];
  var top = res[0].score;
  return res.filter(function (r) { return r.score >= top * 0.45; }).slice(0, 6);
}

if (typeof document !== 'undefined') (function () {
  var box = document.getElementById('faqsearch'); if (!box) return;
  var q = document.getElementById('faq-q'), out = document.getElementById('faq-results');
  var none = document.getElementById('faq-none'), count = document.getElementById('faq-count');
  var nav = document.querySelector('.faqnav'), tryBox = box.querySelector('.faq-try');
  var items = [].slice.call(document.querySelectorAll('section.faq details'));
  var prepared = faqPrepare(items.map(function (d) {
    var s = d.querySelector('summary');
    return { q: s.textContent, k: d.getAttribute('data-k'), a: d.textContent.slice(s.textContent.length) };
  }));
  var sections = [].slice.call(document.querySelectorAll('section.faq'));
  box.hidden = false;
  function run() {
    var v = q.value.trim(), hits = v ? faqSearch(prepared, v) : [];
    out.innerHTML = '';
    hits.forEach(function (h, n) {
      var c = items[h.i].cloneNode(true); c.removeAttribute('id'); c.hidden = false; c.open = n === 0;
      out.appendChild(c);
    });
    out.hidden = !hits.length;
    sections.forEach(function (s) { s.hidden = !!v; });
    nav.hidden = !!v; if (tryBox) tryBox.hidden = !!v;
    none.hidden = !v || hits.length > 0;
    count.textContent = v ? (hits.length ? hits.length + (hits.length === 1 ? ' passende Antwort' : ' passende Antworten') : 'Keine passende Antwort') : '';
  }
  var timer;
  q.addEventListener('input', function () { clearTimeout(timer); timer = setTimeout(run, 120); });
  box.addEventListener('click', function (e) {
    var b = e.target.closest('button[data-try]'); if (!b) return;
    q.value = b.getAttribute('data-try'); run(); q.focus();
  });
  if (q.value) run();
})();
