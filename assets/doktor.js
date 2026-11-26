// farbeleer.de: Druckbild-Doktor. Logik und Texte stehen in assets/wartung.js (DIAGNOSE, BEFUNDE).
(function () {
  var root = document.getElementById('doktor');
  if (!root) return;
  document.documentElement.classList.add('js');
  var TEL = 'tel:+49620496220', PHONE = '06204 / 9622-0';
  var st = { view: 'symptom', symptom: null, modell: null, ans: {}, befund: null, hist: [] };
  var params = new URLSearchParams(location.search);
  if (WARTUNG[params.get('modell')]) st.preModell = params.get('modell');

  function sym(id) { for (var i = 0; i < SYMPTOME.length; i++) if (SYMPTOME[i].id === id) return SYMPTOME[i]; }
  function esc(s) { return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;'); }
  function fill(t) { return markChecks(wFill(t, st.modell)); }
  function queue() { return st.symptom ? ['modell'].concat(sym(st.symptom).ask) : []; }

  function crumbs() {
    var items = [['symptom', 'Abdruck']].concat(queue().map(function (q) { return [q, q === 'modell' ? 'Modell' : q === 'wechsel' ? 'Kartusche' : 'Standzeit']; })).concat([['befund', 'Befund']]);
    var cur = st.view, seen = true;
    return '<ol class="app-steps">' + items.map(function (it, i) {
      var on = it[0] === cur; if (on) seen = false;
      var cls = on ? 'on' : (seen ? 'done' : '');
      var inner = '<b>' + (i + 1) + '</b>' + it[1];
      return '<li class="' + cls + '">' + (seen && !on ? '<button type="button" data-go="' + it[0] + '">' + inner + '</button>' : inner) + '</li>';
    }).join('') + '</ol>';
  }

  function viewSymptom() {
    return '<h2 tabindex="-1">Wie sieht Ihr Abdruck aus?</h2><p class="sub">Legen Sie einen frankierten Brief neben den Bildschirm und tippen Sie auf das Bild, das am ehesten passt.</p>' +
      '<div class="abdrucke">' + SYMPTOME.map(function (s) {
        return '<button type="button" class="atile" data-sym="' + s.id + '">' + abdruckBild(s.id, 'Beispiel: ' + s.label) + '<strong>' + esc(s.label) + '</strong><small>' + esc(s.sub) + '</small></button>';
      }).join('') + '</div>' +
      '<p class="smoke">Riecht die Maschine verschmort? <button type="button" data-sym="rauch">Dann bitte hier tippen.</button></p>';
  }

  function viewModell() {
    var s = sym(st.symptom);
    var ids = WARTUNG_ORDER.filter(function (id) { return !s.two || WARTUNG[id].carts === 2; });
    return '<h2 tabindex="-1">Welche Maschine haben Sie?</h2><p class="sub">' + (s.two ? 'Verschobene Hälften gibt es nur bei Maschinen mit zwei Kartuschen. Diese hier kommen in Frage:' : 'Tippen Sie auf das Gerät, das so aussieht wie Ihres.') + '</p>' +
      '<div class="mgrid">' + ids.map(function (id) {
        var m = finderMachine(id);
        return '<button type="button" class="tile" data-mod="' + id + '"><span class="pic"><img src="/' + m.img + '" alt="" loading="lazy"></span><strong>' + esc(WARTUNG[id].name) + '</strong>' + (MACHINES.filter(function (x) { return x.id === id; })[0].models ? '<span class="models">' + esc(MACHINES.filter(function (x) { return x.id === id; })[0].models) + '</span>' : '') + '</button>';
      }).join('') + '</div>' +
      '<p class="help">Ihre Maschine ist nicht dabei? <a href="' + TEL + '">Rufen Sie uns an: <span class="nw">' + PHONE + '</span></a></p>';
  }

  function viewFrage(k) {
    var f = FRAGEN[k];
    return '<h2 tabindex="-1">' + esc(f.q) + '</h2><p class="sub">Eine ungefähre Antwort reicht.</p><div class="answers">' +
      f.a.map(function (a) { return '<button type="button" class="qtile" data-ans="' + k + ':' + a.v + '"><strong>' + esc(a.label) + '</strong>' + (a.sub ? '<small>' + esc(a.sub) + '</small>' : '') + '</button>'; }).join('') + '</div>';
  }

  function recBox() {
    var m = finderMachine(st.modell);
    var head = '<div class="rec" id="rec"><h4>Passende Original-Kartusche</h4>';
    if (st.modell === 'one') return head + '<p>Für die PostBase One gibt es Kartuschen und ein Tanksystem. Im Kartuschenfinder wählen Sie die Ausführung und sehen unsere Empfehlung.</p><a class="btn sm" href="/?modell=one#finder">Kartuschenfinder für die PostBase One</a></div>';
    if (m.sizes.length === 1 || st.vol) {
      var k = m.sizes[st.vol ? pickIndex(m.sizes, st.vol) : 0];
      return head + '<p><b>' + esc(m.name) + ': ' + esc(k.size) + '</b> (' + esc(k.ml) + ', bis zu ' + fmt(k.reach) + ' Frankierungen, Art.-Nr. ' + k.sku + ')' +
        (st.vol ? '. Bei Ihrer Menge reicht sie ' + months(k.reach, st.vol) + '.' : '.') + '</p>' +
        '<div class="actions"><a class="btn sm" href="' + shopLink(k.path, 'druckbild-doktor', st.modell + '-' + sizeSlug(k.size)) + '">Im Shop ansehen</a><a class="btn ghost sm" href="' + m.page + '">Alle Größen</a>' +
        (st.vol ? '<button type="button" class="linkbtn" data-vol="0">Menge ändern</button>' : '') + '</div></div>';
    }
    return head + '<p>Wie viele Briefe frankieren Sie ungefähr im Monat? Dann sagen wir Ihnen, welche Größe in rund einem Jahr aufgebraucht ist.</p><div class="answers">' +
      VOLUMES.map(function (v) { return '<button type="button" class="qtile" data-vol="' + v.n + '"><small>' + esc(v.hint) + '</small><strong>' + esc(v.label) + '</strong></button>'; }).join('') + '</div></div>';
  }

  function viewBefund() {
    var b = BEFUNDE[st.befund], w = st.modell ? WARTUNG[st.modell] : null, s = sym(st.symptom);
    var lamp = { gruen: 'g', gelb: 'y', rot: 'r' }[b.ampel];
    var tag = { gruen: 'Selbst beheben', gelb: 'Neue Kartusche', rot: 'Bitte anrufen' }[b.ampel];
    var html = '<div class="befund"><div class="ampel" role="img" aria-label="Ampel: ' + tag + '"><i class="r' + (lamp === 'r' ? ' on' : '') + '"></i><i class="y' + (lamp === 'y' ? ' on' : '') + '"></i><i class="g' + (lamp === 'g' ? ' on' : '') + '"></i></div><div>' +
      '<span class="tag ' + b.ampel + '">Befund: ' + tag + '</span><h2 tabindex="-1">' + esc(b.titel) + '</h2>' +
      (w ? '<p class="fault">' + esc(w.name) + (s && s.fault !== '–' ? ' · im Handbuch heißt das: „' + esc(s.fault) + '“' : '') + '</p>' : '') +
      '<p>' + (w ? fill(b.text) : markChecks(b.text.replace(/\{\w+\}/g, 'Reinigen'))) + '</p>' +
      (b.schritte.length ? '<ol>' + b.schritte.map(function (t) { return '<li>' + fill(t) + '</li>'; }).join('') + '</ol>' : '') +
      (b.kartusche ? recBox() : '') +
      (w && w.power && st.befund !== 'rauch' ? '<p class="note"><b>Gut zu wissen:</b> ' + esc(w.power) + '</p>' : '') +
      '<div class="actions">' +
      (b.weiter ? '<button type="button" class="btn ghost" data-weiter="' + b.weiter + '">Das hat nicht geholfen</button>' : '') +
      (b.ampel === 'rot' ? '<a class="btn" href="' + TEL + '">&#128222; <span class="nw">' + PHONE + '</span></a>' : '<a class="btn" href="/ratgeber/kartusche-wechseln/' + (st.modell ? '?modell=' + st.modell : '') + '">Kartuschenwechsel ansehen</a>') +
      '<button type="button" class="linkbtn" data-go="symptom">Neu starten</button></div></div></div>';
    if (b.nachher && st.symptom && st.symptom !== 'sauber') {
      html += '<div class="vn"><h3>So sollte Ihr Abdruck danach aussehen</h3><p class="sub">Ziehen Sie den Regler: links Ihr Abdruck jetzt, rechts so, wie er sein soll.</p>' +
        '<div class="vn-box" id="vnbox">' + abdruckBild(st.symptom, 'Vorher: ' + s.label) + '<div class="vn-after">' + abdruckBild('sauber', 'Nachher: sauberer Abdruck') + '</div><span class="vn-line"></span></div>' +
        '<div class="vn-lbl"><span>vorher</span><span>nachher</span></div>' +
        '<input type="range" min="0" max="100" value="50" aria-label="Vorher-nachher-Regler" id="vn"></div>';
    }
    return html;
  }

  function render(focus) {
    var v = st.view, html = v === 'symptom' ? viewSymptom() : v === 'modell' ? viewModell() : v === 'befund' ? viewBefund() : viewFrage(v);
    root.innerHTML = (v !== 'befund' || st.symptom ? crumbs() : '') + html;
    var r = document.getElementById('vn'), box = document.getElementById('vnbox');
    if (r && box) {
      var set = function (p) { box.style.setProperty('--cut', p + '%'); };
      r.addEventListener('input', function () { set(r.value); });
      // Ziehen direkt im Bild (Maus und Finger)
      var drag = false;
      var move = function (e) { if (!drag) return; var rc = box.getBoundingClientRect(), x = (e.touches ? e.touches[0].clientX : e.clientX) - rc.left; var p = Math.max(0, Math.min(100, x / rc.width * 100)); r.value = p; set(p); };
      box.addEventListener('pointerdown', function (e) { drag = true; move(e); });
      window.addEventListener('pointermove', move);
      window.addEventListener('pointerup', function () { drag = false; });
      // kleine Vorführung, wenn Bewegung erlaubt ist
      if (!matchMedia('(prefers-reduced-motion: reduce)').matches) {
        var t0 = null; var demo = function (ts) { if (drag) return; t0 = t0 || ts; var k = (ts - t0) / 1600; if (k > 1) { set(50); r.value = 50; return; } var p = 50 + 35 * Math.sin(k * Math.PI * 2); set(p); r.value = p; requestAnimationFrame(demo); };
        setTimeout(function () { requestAnimationFrame(demo); }, 500);
      }
    }
    if (focus !== false) { var h = root.querySelector('h2'); if (h) h.focus({ preventScroll: true }); if (root.getBoundingClientRect().top < 0) root.scrollIntoView({ behavior: 'smooth' }); }
  }

  function next() {
    var q = queue(), i = q.indexOf(st.view);
    if (st.view === 'symptom') i = -1;
    for (var j = i + 1; j < q.length; j++) {
      if (q[j] === 'modell' && st.modell) continue;
      st.view = q[j]; return render();
    }
    st.befund = wDiagnose(st.symptom, st.ans); st.view = 'befund'; render();
  }

  root.addEventListener('click', function (e) {
    var t = e.target.closest('button'); if (!t) return;
    var d = t.dataset;
    if (d.sym) {
      if (d.sym === 'rauch') { st.symptom = null; st.befund = 'rauch'; st.view = 'befund'; return render(); }
      st.symptom = d.sym; st.ans = {}; st.vol = 0;
      st.modell = st.preModell && !(sym(d.sym).two && WARTUNG[st.preModell].carts !== 2) ? st.preModell : null;
      st.view = 'symptom'; return next();
    }
    if (d.mod) { st.modell = d.mod; st.preModell = null; return next(); }
    if (d.ans) { var p = d.ans.split(':'); st.ans[p[0]] = p[1]; return next(); }
    if (d.weiter) { st.befund = d.weiter; return render(); }
    if (d.vol !== undefined) { st.vol = +d.vol; render(false); var rec = document.getElementById('rec'); if (rec) rec.scrollIntoView({ block: 'nearest' }); return; }
    if (d.go) {
      if (d.go === 'symptom') { st.symptom = null; st.modell = null; st.ans = {}; }
      if (d.go === 'modell') st.modell = null;
      st.view = d.go; return render();
    }
  });
  render(false);
})();
