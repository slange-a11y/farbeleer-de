// farbeleer.de: Kartuschenwechsel zum Durchklicken. Schritte je Modell stehen in assets/wartung.js (WARTUNG).
(function () {
  var root = document.getElementById('wechsel');
  if (!root) return;
  document.documentElement.classList.add('js');
  var TEL = 'tel:+49620496220', PHONE = '06204 / 9622-0';
  var reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  var st = { view: 'modell', id: null, tank: false, i: 0, vol: 0 };
  var p = new URLSearchParams(location.search).get('modell');
  if (p === 'one-tank') { st.id = 'one'; st.tank = true; st.view = 'play'; }
  else if (WARTUNG[p]) { st.id = p; st.view = 'play'; }

  function esc(s) { return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;'); }
  function steps() { return wSteps(st.id, st.tank); }
  function title() { return st.tank ? WARTUNG.one.tank.name : WARTUNG[st.id].name; }

  // ── Bühne: gezeichnete Platzhalter-Ebenen (werden später durch Bilder aus dem Bogen ersetzt)
  function cart(x, cls) {
    var isNew = cls === 'new';
    return '<g transform="translate(' + x + ' 32)"><rect x="0" y="78" width="40" height="62" rx="5" fill="' + (isNew ? '#fff' : '#55565a') + '" stroke="#2a2a2a" stroke-width="2"/>' +
      '<rect x="0" y="92" width="40" height="10" fill="' + (isNew ? '#c61824' : '#77787c') + '"/>' +
      '<g stroke="' + (isNew ? '#bbb' : '#3a3a3c') + '" stroke-width="2"><path d="M8 112h24M8 118h24M8 124h24"/></g>' +
      (isNew ? '<rect class="strip" x="4" y="136" width="32" height="8" rx="2" fill="#c61824"/>' : '') + '</g>';
  }
  function stageSvg() {
    var two = WARTUNG[st.id].carts === 2 && !st.tank;
    var xs = two ? [228, 276] : [252];
    var olds = xs.map(function (x) { return cart(x, 'old'); }).join('');
    var news = xs.map(function (x) { return cart(x, 'new'); }).join('');
    var imprint = abdruckSvg('sauber', 'sauberer Testabdruck').replace('<svg class="abdruck"', '<svg x="18" y="10" width="124" height="62"');
    return '<svg viewBox="0 0 440 300" role="img" aria-label="Schematische Frankiermaschine">' +
      '<rect x="0" y="262" width="440" height="38" fill="#dcdcde"/>' +
      '<rect x="30" y="120" width="330" height="140" rx="16" fill="#d9dadc" stroke="#9a9a9e" stroke-width="2"/>' +
      '<rect x="30" y="226" width="330" height="16" fill="#3a3a3c"/>' +
      '<rect x="206" y="120" width="138" height="54" rx="4" fill="#2a2a2c"/>' +
      '<g class="old">' + olds + '</g>' +
      '<rect x="52" y="148" width="120" height="64" rx="7" fill="#26313a"/>' +
      '<text class="disp" x="112" y="184" text-anchor="middle" font-family="Arial,sans-serif" font-size="12" fill="#fff"></text>' +
      '<g class="wait"><circle cx="112" cy="196" r="8" fill="none" stroke="#fff" stroke-width="3" stroke-dasharray="30 20"/></g>' +
      '<circle class="led" cx="352" cy="190" r="6"/>' +
      '<g class="newwrap"><g class="new">' + news + '</g></g>' +
      '<g class="click"><circle cx="272" cy="140" r="34" fill="none" stroke="#2e9d4d" stroke-width="4"/></g>' +
      (st.id === 'one' && !st.tank ? '<rect class="lever" x="214" y="116" width="116" height="8" rx="4" fill="#2a8c8c"/>' : '') +
      '<rect class="flap" x="200" y="104" width="150" height="72" rx="8" fill="#c4c5c8" stroke="#9a9a9e" stroke-width="2"/>' +
      '<g class="finger"><circle cx="160" cy="214" r="13" fill="#f1c9a5" stroke="#8a6a50" stroke-width="2"/><rect x="154" y="214" width="12" height="40" rx="6" fill="#f1c9a5" stroke="#8a6a50" stroke-width="2"/></g>' +
      '<g class="env"><g transform="translate(190 196)"><rect width="160" height="80" fill="#fff" stroke="#bbb"/>' + imprint + '</g></g>' +
      '</svg>';
  }
  var DISP = { menu: function () { var m = wMenu(st.id).WECHSELN || ''; return stripChecks(m).replace(/[„“]/g, '').split('›').pop().trim() || 'WECHSELN'; },
    close: function () { return 'Bitte warten'; }, wait: function () { return 'Bitte warten'; }, align: function () { return 'Ausrichten'; }, test: function () { return 'Testdruck'; } };

  function stateAt(i) {
    var s = {}, list = steps();
    for (var j = 0; j <= i; j++) {
      var a = list[j].anim;
      if (a === 'menu' && /öffne/.test(list[j].t)) s.open = 1;
      if (a === 'open' || a === 'lift' || a === 'out') s.open = 1;
      if (a === 'lever') { s.open = 1; s.lever = 1; s.out = 1; }
      if (a === 'out') s.out = 1;
      if (a === 'prep' || a === 'shake') { s.prep = 1; s.stripped = 1; }
      if (a === 'in') { s['in'] = 1; s.stripped = 1; s.out = 1; delete s.prep; }
      if (a === 'close') { delete s.open; delete s.lever; s.wait = 1; }
      if (a === 'align' || a === 'test') { delete s.wait; s.env = 1; }
    }
    return Object.keys(s).map(function (k) { return 's-' + k; });
  }
  function animate(again) {
    var stage = root.querySelector('.stage'); if (!stage) return;
    var a = steps()[st.i].anim;
    var before = st.i > 0 ? stateAt(st.i - 1) : [];
    stage.className = 'stage no-anim ' + before.join(' ');
    void stage.offsetWidth;
    stage.className = 'stage ' + stateAt(st.i).join(' ') + ' a-' + a;
    var d = stage.querySelector('.disp'); d.textContent = DISP[a] ? DISP[a]() : (st.i === 0 ? '' : 'OK');
  }

  function viewModell() {
    var tiles = WARTUNG_ORDER.map(function (id) {
      var m = finderMachine(id), mm = MACHINES.filter(function (x) { return x.id === id; })[0];
      var t = '<button type="button" class="tile" data-mod="' + id + '"><span class="pic"><img src="/' + m.img + '" alt="" loading="lazy"></span><strong>' + esc(WARTUNG[id].name) + '</strong>' + (mm.models ? '<span class="models">' + esc(mm.models) + '</span>' : '') + '</button>';
      if (id === 'one') t = t.replace('data-mod="one"', 'data-mod="one"').replace('</strong>', ' mit Kartuschen</strong>') +
        '<button type="button" class="tile" data-mod="one-tank"><span class="pic"><img src="/' + m.img + '" alt="" loading="lazy"></span><strong>PostBase One mit Tanksystem</strong><span class="models">Tintentank neben der Maschine</span></button>';
      return t;
    }).join('');
    return '<h2 tabindex="-1">Welche Maschine haben Sie?</h2><p class="sub">Die Handgriffe sind je Modell etwas anders. Tippen Sie auf das Gerät, das so aussieht wie Ihres.</p><div class="mgrid">' + tiles + '</div>' +
      '<p class="help">Ihre Maschine ist nicht dabei? <a href="' + TEL + '">Rufen Sie uns an: <span class="nw">' + PHONE + '</span></a></p>';
  }
  function viewPlay() {
    var list = steps(), s = list[st.i], w = WARTUNG[st.id], n = list.length;
    return '<div class="nav-back"><button type="button" data-go="modell">&larr; Andere Maschine</button></div>' +
      '<h2 tabindex="-1">Kartusche wechseln: ' + esc(title()) + '</h2>' +
      (w.note && st.i === 0 ? '<p class="sub">' + markChecks(w.note) + '</p>' : '') +
      '<div class="player"><div><div class="stage">' + stageSvg() + '</div><p class="swipehint">Auf dem Handy: nach links wischen für weiter</p></div>' +
      '<div><div class="progress" aria-hidden="true"><span style="width:' + ((st.i + 1) / n * 100) + '%"></span></div>' +
      '<p class="stepcount">Schritt ' + (st.i + 1) + ' von ' + n + '</p>' +
      '<p class="steptext" aria-live="polite">' + markChecks(wFill(s.t, st.id)) + '</p>' +
      '<p class="steptip">' + (s.tip ? esc(s.tip) : '') + '</p>' +
      '<div class="ctrl"><button type="button" class="btn ghost" data-nav="-1"' + (st.i === 0 ? ' disabled' : '') + '>&larr; Zurück</button>' +
      '<button type="button" class="btn" data-nav="1">' + (st.i === n - 1 ? 'Fertig' : 'Weiter') + ' &rarr;</button>' +
      '<button type="button" class="linkbtn" data-again="1">Schritt wiederholen</button></div>' +
      '<a class="stuck" href="' + TEL + '">&#128222; Ich komme hier nicht weiter</a></div></div>';
  }
  function viewDone() {
    var w = WARTUNG[st.id], m = finderMachine(st.id, st.tank), rec;
    var unit = st.tank ? 'Tintentank' : 'Kartusche';
    if (m.sizes.length === 1 || st.vol) {
      var k = m.sizes[st.vol ? pickIndex(m.sizes, st.vol) : 0];
      rec = '<p><b>' + esc(m.name) + ': ' + esc(k.size) + '</b> (' + esc(k.ml) + ', bis zu ' + fmt(k.reach) + ' Frankierungen, Art.-Nr. ' + k.sku + ')' + (st.vol ? '. Bei Ihrer Menge reicht ' + (st.tank ? 'er ' : 'sie ') + months(k.reach, st.vol) + '.' : '.') + '</p>' +
        '<div class="actions"><a class="btn sm" href="' + shopLink(k.path, 'kartuschenwechsel', (st.tank ? 'one-tank' : st.id) + '-' + sizeSlug(k.size)) + '">Im Shop ansehen</a><a class="btn ghost sm" href="' + WARTUNG_PAGE(st.id) + '">Alle Größen</a>' +
        (st.vol ? '<button type="button" class="linkbtn" data-vol="0">Menge ändern</button>' : '') + '</div>';
    } else {
      rec = '<p>Wie viele Briefe frankieren Sie ungefähr im Monat? Dann sagen wir Ihnen, welche Größe in rund einem Jahr aufgebraucht ist.</p><div class="answers">' +
        VOLUMES.map(function (v) { return '<button type="button" class="qtile" data-vol="' + v.n + '"><small>' + esc(v.hint) + '</small><strong>' + esc(v.label) + '</strong></button>'; }).join('') + '</div>';
    }
    return '<div class="done"><svg class="tick" viewBox="0 0 84 84" aria-hidden="true"><circle cx="42" cy="42" r="42"/><path d="M24 44l12 12 24-26"/></svg>' +
      '<h2 tabindex="-1">Geschafft</h2><p class="sub">So sieht ein sauberer Abdruck aus. Ist Ihrer blass oder lückenhaft, hilft der <a class="inline-link" href="/ratgeber/druckbild-pruefen/?modell=' + st.id + '">Druckbild-Doktor</a>.</p>' + abdruckSvg('sauber', 'sauberer Testabdruck') + '</div>' +
      '<div class="rec" id="rec"><h4>Nächste ' + unit + ' gleich bereitlegen?</h4>' + rec +
      '<p class="fine">Lagern Sie die Ersatz' + unit.toLowerCase() + ' nicht länger als etwa 12&nbsp;Monate und tauschen Sie spätestens nach einem Jahr, auch wenn noch Tinte drin ist. Sonst kann sie eintrocknen.</p></div>' +
      (w.power ? '<p class="note"><b>Gut zu wissen:</b> ' + esc(w.power) + '</p>' : '') +
      '<div class="actions"><button type="button" class="btn ghost" data-go="play">Noch einmal ansehen</button><button type="button" class="linkbtn" data-go="modell">Andere Maschine</button></div>';
  }
  function WARTUNG_PAGE(id) { return finderMachine(id).page || '/'; }

  function render(focus) {
    root.innerHTML = st.view === 'modell' ? viewModell() : st.view === 'done' ? viewDone() : viewPlay();
    if (st.view === 'play') { animate(); bindSwipe(); }
    if (focus !== false) { var h = root.querySelector('h2'); if (h) h.focus({ preventScroll: true }); if (root.getBoundingClientRect().top < 0) root.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth' }); }
  }
  function go(d) {
    var n = steps().length;
    if (d > 0 && st.i === n - 1) { st.view = 'done'; return render(); }
    st.i = Math.max(0, Math.min(n - 1, st.i + d));
    render(false);
    var b = root.querySelector('[data-nav="' + (d > 0 ? 1 : -1) + '"]');
    if (b && !b.disabled) b.focus({ preventScroll: true }); else root.querySelector('[data-nav="1"]').focus({ preventScroll: true });
  }
  function bindSwipe() {
    var stage = root.querySelector('.stage'), x0 = null, y0 = null;
    stage.addEventListener('touchstart', function (e) { x0 = e.touches[0].clientX; y0 = e.touches[0].clientY; }, { passive: true });
    stage.addEventListener('touchend', function (e) {
      if (x0 === null) return;
      var dx = e.changedTouches[0].clientX - x0, dy = e.changedTouches[0].clientY - y0; x0 = null;
      if (Math.abs(dx) > 45 && Math.abs(dx) > Math.abs(dy)) go(dx < 0 ? 1 : -1);
    });
  }
  root.addEventListener('click', function (e) {
    var t = e.target.closest('button'); if (!t) return;
    var d = t.dataset;
    if (d.mod) { st.tank = d.mod === 'one-tank'; st.id = st.tank ? 'one' : d.mod; st.i = 0; st.vol = 0; st.view = 'play'; return render(); }
    if (d.nav) return go(+d.nav);
    if (d.again) return animate(true);
    if (d.vol !== undefined) { st.vol = +d.vol; render(false); var r = document.getElementById('rec'); if (r) r.scrollIntoView({ block: 'nearest' }); return; }
    if (d.go) { st.view = d.go; st.i = 0; return render(); }
  });
  root.addEventListener('keydown', function (e) {
    if (st.view !== 'play' || e.altKey || e.ctrlKey || e.metaKey) return;
    if (e.key === 'ArrowRight') { e.preventDefault(); go(1); }
    if (e.key === 'ArrowLeft') { e.preventDefault(); go(-1); }
  });
  render(false);
})();
