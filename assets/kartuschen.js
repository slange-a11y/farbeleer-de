// farbeleer.de: einzige Datenquelle für Kartuschen, Artikelnummern und Reichweiten.
// Genutzt vom Kartuschenfinder (index.html, im Browser) und von tools/build.js,
// das daraus die Modellseiten, den Ratgeber und die Übersichtstabelle der Startseite erzeugt.
// Nach jeder Änderung hier: `node tools/build.js` ausführen und das Ergebnis mit einchecken.
//
// Quelle: Produktseiten auf frankierfarbe.de, abgerufen am 24.11.2026.
// reach = Frankierungen laut Francotyp-Postalia (Tabelle "Reichweiten Tintensysteme"); XS/X-Small und
// PostBase Fusion laut frankierfarbe.de. img = Maschinenfotos von Francotyp-Postalia (Nutzung freigegeben).
// page = Modellseite auf farbeleer.de, cat = Kategorie im Shop.
var SHOP='https://www.frankierfarbe.de';
var CLASSIC_SETS;
var MACHINES=[
  {id:'mini', name:'PostBase mini', models:'', img:'img/mini.png', page:'/postbase-mini/', cat:'/c/postverarbeitung/francotyp-postalia/postbase-mini', sizes:[
    {size:'X-SMALL', sku:'580053305600', ml:'4 ml',  reach:700, path:'/p/tintenkartuschen-set-x-small-fuer-frankiermaschine-postbase-mini-francotyp-postalia'},
    {size:'SMALL',   sku:'580053303600', ml:'10 ml', reach:2000, path:'/p/tintenkartuschen-set-small-fuer-frankiermaschine-postbase-mini-francotyp-postalia'},
    {size:'MEDIUM',  sku:'580053304600', ml:'20 ml', reach:4000, path:'/p/tintenkartuschen-set-medium-fuer-frankiermaschine-postbase-mini-francotyp-postalia'}]},
  {id:'m2', name:'PostBase Vision M2', models:'', img:'img/m2.png', page:'/postbase-vision-m2/', cat:'/c/postverarbeitung/francotyp-postalia/postbase-vision-m2', sizes:[
    {size:'X-SMALL', sku:'580074895600', ml:'4 ml',  reach:700,  path:'/p/tintenkartusche-x-small-fuer-frankiermaschine-postbase-vision-m2-francotyp-postalia'},
    {size:'SMALL',   sku:'580074893600', ml:'10 ml', reach:2000, path:'/p/tintenkartusche-small-fuer-frankiermaschine-postbase-vision-m2-francotyp-postalia'},
    {size:'MEDIUM',  sku:'580074894600', ml:'20 ml', reach:4000, path:'/p/tintenkartusche-medium-fuer-frankiermaschine-postbase-vision-m2-francotyp-postalia'}]},
  {id:'one', name:'PostBase One', models:'One 120 · One 150', img:'img/one.png', page:'/postbase-one/', cat:'/c/postverarbeitung/francotyp-postalia/postbase-one-120-150', sizes:[],
    question:'Arbeitet Ihre PostBase One mit Kartuschen oder mit Tanksystem?',
    questionSub:'Beim Tanksystem steht ein großer Tintentank neben der Maschine und ist über einen Schlauch mit dem Druckkopf verbunden.', choice:[
    {label:'Mit Kartuschen', hint:'Kartusche steckt in der Maschine', m:{id:'one', name:'PostBase One', models:'One 120 · One 150', img:'img/one.png', page:'/postbase-one/', sizes:[
      {size:'XL', sku:'580055318800', ml:'2 × 42 ml', reach:22000, path:'/p/tintenkartuschen-set-xl-fuer-frankiermaschine-postbase-one'}],
      only:'Für die PostBase One mit Kartuschen gibt es das Original-Kartuschen-Set XL. Wechseln Sie es mindestens einmal im Jahr, damit die Tinte nicht eintrocknet.'}},
    {label:'Mit Tanksystem', hint:'Tintentank neben der Maschine', m:{id:'one-tank', name:'PostBase One mit Tanksystem', models:'One 120 · One 150', img:'img/one.png', page:'/postbase-one/', unit:'Tintentank', sizes:[
      {size:'175 ml', sku:'580055314700', ml:'175 ml', reach:50000,  path:'/p/tintentank-175ml-fuer-frankiermaschine-postbase-one-120-und-150'},
      {size:'350 ml', sku:'580055314800', ml:'350 ml', reach:100000, path:'/p/tintentank-350-ml-fuer-frankiermaschine-postbase-one-120-und-150'}],
      addon:{name:'Druckkopf-Set für das Tanksystem', sku:'580055330900', reach:300000, path:'/p/druckkopf-set-fuer-frankiermaschine-postbase-one-zum-anschluss-an-das-tanksystem'}}}
  ]},
  {id:'classic', name:'PostBase Classic', models:'PostBase 30 · 45 · 65 · 100', img:'img/classic.png', page:'/postbase-classic/', cat:'/c/postverarbeitung/francotyp-postalia/postbase-30-100', sizes:CLASSIC_SETS=[
    {size:'XS',     sku:'580052305600', ml:'2 × 4 ml',  reach:1500,  path:'/p/tintenkartuschen-set-xs-fuer-frankiermaschine-postbase-30-bis-100-francotyp-postalia'},
    {size:'SMALL',  sku:'580052303600', ml:'2 × 10 ml', reach:4000,  path:'/p/tintenkartuschen-set-small-fuer-frankiermaschine-postbase-30-bis-100-francotyp-postalia'},
    {size:'MEDIUM', sku:'580052304600', ml:'2 × 20 ml', reach:8000,  path:'/p/tintenkartuschen-set-medium-fuer-frankiermaschine-postbase-30-bis-100-francotyp-postalia'},
    {size:'XL',     sku:'580052302600', ml:'2 × 42 ml', reach:18000, path:'/p/tintenkartuschen-set-xl-fuer-frankiermaschine-postbase-30-bis-100-francotyp-postalia'}]},
  {id:'vision', name:'PostBase Vision', models:'Vision 35 · 50 · 70 · A120', img:'img/vision.png?v=2', page:'/postbase-vision/', cat:'/c/postverarbeitung/francotyp-postalia/postbase-vision-35-70', noQty:true, sizes:[
    {size:'LARGE', sku:'580059772400', ml:'40 ml', reach:11400, path:'/p/tintenkartusche-large-fuer-frankiermaschine-postbase-vision-35-bis-70-francotyp-postalia'}],
    only:'Für die PostBase Vision 35 bis 70 und die Vision A120 gibt es die Original-Kartusche nur noch in Größe LARGE. Wechseln Sie sie mindestens einmal im Jahr, damit die Tinte nicht eintrocknet.'},
  {id:'fusion', name:'PostBase Fusion', models:'Fusion 35 · 50 · 70 · 120', img:'img/fusion.png', page:'/postbase-fusion/', cat:'/c/postverarbeitung/francotyp-postalia/postbase-fusion-35-120', sizes:[
    {size:'XS', sku:'580059895600', ml:'2 × 4 ml',  reach:1500,  path:'/p/tintenkartuschen-set-xs-fuer-frankiermaschine-postbase-fusion-35-bis-120-francotyp-postalia'},
    {size:'S',  sku:'580059893600', ml:'2 × 10 ml', reach:4000,  path:'/p/tintenkartuschen-set-s-fuer-frankiermaschine-postbase-fusion-35-bis-120-francotyp-postalia'},
    {size:'M',  sku:'580059894600', ml:'2 × 20 ml', reach:8000,  path:'/p/tintenkartuschen-set-m-fuer-frankiermaschine-postbase-fusion-35-bis-120-francotyp-postalia'},
    {size:'XL', sku:'580059892600', ml:'2 × 42 ml', reach:17000, path:'/p/tintenkartuschen-set-xl-fuer-frankiermaschine-postbase-fusion-35-bis-120-francotyp-postalia'}]},
  {id:'insight', name:'PostBase Insight', models:'', img:'img/insight.png', page:'/postbase-insight/', cat:'/c/postverarbeitung/francotyp-postalia/postbase-30-100', sizes:CLASSIC_SETS,
    extra:'Die PostBase Insight nutzt dieselben Original-Kartuschen wie die PostBase 30 bis 100.'}
];
var VOLUMES=[
  {label:'bis 200',         hint:'gelegentlich', n:150},
  {label:'200 bis 1.000',   hint:'regelmäßig',   n:600},
  {label:'1.000 bis 3.000', hint:'täglich viel', n:2000},
  {label:'über 3.000',      hint:'Poststelle',   n:5000}
];
var MAX_MONTHS=12;    // Kartusche soll spätestens nach 12 Monaten leer sein (sonst trocknet die Tinte ein)

// Empfehlung: größte Kartusche, die bei der angegebenen Menge in höchstens 12 Monaten leer ist.
// Reicht schon die kleinste länger, wird die kleinste empfohlen.
function pickIndex(sizes,perMonth){
  var idx=0;
  if(perMonth){ for(var i=0;i<sizes.length;i++){ if(sizes[i].reach<=perMonth*MAX_MONTHS) idx=i; } }
  return idx;
}
function fmt(n){return n.toLocaleString('de-DE')}
function months(reach,perMonth){
  var m=reach/perMonth;
  if(m<1) return 'weniger als 1 Monat';
  if(m<1.5) return 'etwa 1 Monat';
  if(m>=12) return 'über 1 Jahr';
  return 'etwa '+Math.round(m)+' Monate';
}
