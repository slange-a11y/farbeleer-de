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

  // ── Bühne: Bilder je Schritt (WECHSEL_BILDER in assets/wartung.js). Mehrere Bilder werden nacheinander überblendet.
  var cycle = null;
  function pics() { var b = WECHSEL_BILDER[st.id]; return (st.tank ? b.tank : b.steps)[st.i]; }
  function stageHtml() {
    var list = pics(), a = steps()[st.i].anim, tap = WECHSEL_BILDER[st.id].tap;
    var h = '<div class="pics">' + list.map(function (n, k) {
      return '<img src="/img/erlebnis/' + n + '.webp" alt="" width="480" height="480" decoding="async"' + (k === 0 ? ' class="on"' : '') + '>';
    }).join('') + '</div>';
    if (a === 'menu') h += '<span class="tap" style="left:' + tap[0] + '%;top:' + tap[1] + '%"></span>';
    if (a === 'close' || a === 'wait') h += '<span class="busy"><i></i>Maschine arbeitet</span>';
    if (list.length > 1) h += '<span class="dots">' + list.map(function (n, k) { return '<i' + (k === 0 ? ' class="on"' : '') + '></i>'; }).join('') + '</span>';
    return h;
  }
  function animate() {
    var stage = root.querySelector('.stage'); if (!stage) return;
    clearInterval(cycle);
    stage.className = 'stage a-' + steps()[st.i].anim;
    stage.innerHTML = stageHtml();
    ohneWaisen(stage);
    var imgs = stage.querySelectorAll('.pics img'), dots = stage.querySelectorAll('.dots i'), k = 0;
    if (imgs.length < 2) return;
    cycle = setInterval(function () {
      if (!document.body.contains(stage)) return clearInterval(cycle);
      imgs[k].classList.remove('on'); dots[k].classList.remove('on');
      k = (k + 1) % imgs.length;
      imgs[k].classList.add('on'); dots[k].classList.add('on');
    }, reduce ? 3500 : 2200);
  }

  function viewModell() {
    var tiles = WARTUNG_ORDER.map(function (id) {
      var m = finderMachine(id), mm = MACHINES.filter(function (x) { return x.id === id; })[0];
      var t = '<button type="button" class="tile" data-mod="' + id + '"><span class="pic"><img src="' + kachelBild(id) + '" alt="" loading="lazy"></span><strong>' + esc(WARTUNG[id].name) + '</strong>' + (mm.models ? '<span class="models">' + esc(mm.models).replace(/ · /g, '&nbsp;·&nbsp;') + '</span>' : '') + '</button>';
      if (id === 'one') t = t.replace('data-mod="one"', 'data-mod="one"').replace('</strong>', ' mit&nbsp;Kartuschen</strong>') +
        '<button type="button" class="tile" data-mod="one-tank"><span class="pic"><img src="' + kachelBild(id) + '" alt="" loading="lazy"></span><strong>PostBase One mit&nbsp;Tanksystem</strong><span class="models">Tintentank neben der Maschine</span></button>';
      return t;
    }).join('');
    return '<h2 tabindex="-1">Welche Maschine haben Sie?</h2><p class="sub"><span class="satz">Die Handgriffe sind je Modell etwas anders.</span> <span class="satz">Tippen Sie auf das Gerät, das so aussieht wie\u00a0Ihres.</span></p><div class="mgrid">' + tiles + '</div>' +
      '<p class="help">Ihre Maschine ist nicht dabei? <a href="' + TEL + '">Rufen Sie uns an: <span class="nw">' + PHONE + '</span></a></p>';
  }
  function viewPlay() {
    var list = steps(), s = list[st.i], w = WARTUNG[st.id], n = list.length;
    return '<div class="nav-back"><button type="button" data-go="modell">&larr; Andere Maschine</button></div>' +
      '<h2 tabindex="-1">Kartusche wechseln: ' + esc(title()) + '</h2>' +
      (w.note && st.i === 0 ? '<p class="sub">' + markChecks(w.note) + '</p>' : '') +
      '<div class="player"><div><div class="stage" role="img" aria-label="Bild zum Schritt"></div><p class="swipehint">Auf dem Handy: nach links wischen für weiter</p></div>' +
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
      '<h2 tabindex="-1">Geschafft</h2><p class="sub"><span class="satz">So sieht ein sauberer Abdruck aus.</span> <span class="satz">Ist Ihrer blass oder lückenhaft, hilft der <a class="inline-link" href="/ratgeber/druckbild-pruefen/?modell=' + st.id + '">Druckbild-Doktor</a>.</span></p>' + abdruckBild('sauber', 'sauberer Testabdruck') + '</div>' +
      '<div class="rec" id="rec"><h4>Nächste ' + unit + ' gleich bereitlegen?</h4>' + rec +
      '<p class="fine">Lagern Sie die Ersatz' + unit.toLowerCase() + ' nicht länger als etwa 12&nbsp;Monate und tauschen Sie spätestens nach einem Jahr, auch wenn noch Tinte drin ist. Sonst kann sie eintrocknen.</p></div>' +
      (w.power ? '<p class="note"><b>Gut zu wissen:</b> ' + esc(w.power) + '</p>' : '') +
      '<div class="actions"><button type="button" class="btn ghost" data-go="play">Noch einmal ansehen</button><button type="button" class="linkbtn" data-go="modell">Andere Maschine</button></div>';
  }
  function WARTUNG_PAGE(id) { return finderMachine(id).page || '/'; }

  function render(focus) {
    root.innerHTML = st.view === 'modell' ? viewModell() : st.view === 'done' ? viewDone() : viewPlay();
    ohneWaisen(root);
    clearInterval(cycle);
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
    if (d.again) return animate();
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
