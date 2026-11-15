/* Assistente Banco — interfaccia */
'use strict';

const VERSION = '1.0.1';
const CHANGELOG = [
  { v: '1.0.1', data: '15/11/2026', voci: ['Testo e pulsanti più grandi sul telefono.', 'Nuovo pulsante Aa in alto: cambia la dimensione del testo (4 livelli), la scelta resta salvata.'] },
  { v: '1.0.0', data: '15/11/2026', voci: [
    'Prima versione: dimensionamento linea (sezione, interruttore, curva, differenziale, caduta di tensione).',
    'Catalogo importabile da Excel/CSV, ricerca per codice, EAN o descrizione.',
    'Equivalenze automatiche tra marche (stesse caratteristiche: ampere, poli, curva, mA, kA, tipo).',
    'Scanner codice a barre con la fotocamera.',
    'Strumenti: conversioni, contatore, tubi/corrugati, illuminazione, promemoria.',
    'Funziona offline, si installa su telefono e PC, rapporti cifrati.'
  ] }
];

// Endpoint di invio rapporti: vuoto finché non viene attivato. I rapporti restano in coda.
const REPORT_URL = '';
const REPORT_PUBKEY = {"kty":"RSA","n":"oCNcABFJ7_E4lAKCBgC2JztOZE1gOaf4dJe2VbTomIEixSa3l4v7pqoy_cOu-PuCaAUv9vdbTp1liSa2_QyB_VHulyVQiQsd3BbmSnYiUP7rFoGx69KmjLT1ko91PtRvQsN4vPRv9xZzXs3uf7ED1-6eRoM1GiNDHPB8UM9xK-TKpPWDlMyktQdBemPp00vYZexgQvt3pMHfYif0z_jvA7WfZLDxfaCzZ0RlAHtDKUsKKhZs-mvwakgLKGDZYbV7qSaDV5urtxswUHO749SidqjHJoQkIs6wZLf8RSyc6OxAMFuena7LGELwDk5B8kcqpqxx_PEbcgvNVBaNqsaBYrEhR-X6xd0kT517Dv2vBY1Yns5EplfpPa88TSw53ISMsfLxi2mS5fogax64e-yHtfh9ePsNTGNl8fCx6xblDjw3eDeNhsMmSXCPmNgqj564kLRup5XT-O3esSY8Qp1fkzNr6w72qSEp2gI8LDVbcNPqg9UJOijU0bqN60NjvxWh","e":"AQAB","alg":"RSA-OAEP-256","ext":true};

const $ = (s, el = document) => el.querySelector(s);
const $$ = (s, el = document) => [...el.querySelectorAll(s)];
const fmt = (n, d = 1) => Number.isFinite(n) ? n.toLocaleString('it-IT', { maximumFractionDigits: d, minimumFractionDigits: 0 }) : '—';
const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

/* ============ RAPPORTI ============ */
const Report = {
  sessione: { id: Math.random().toString(36).slice(2, 10), inizio: new Date().toISOString(), versione: VERSION,
    ua: navigator.userAgent, schermo: `${screen.width}x${screen.height}`, installata: matchMedia('(display-mode: standalone)').matches },
  eventi: [],
  log(tipo, dati) {
    this.eventi.push({ t: new Date().toISOString(), tipo, dati });
    if (this.eventi.length > 400) this.eventi.splice(0, this.eventi.length - 400);
  },
  async cifra(obj) {
    const testo = new TextEncoder().encode(JSON.stringify(obj));
    const aes = await crypto.subtle.generateKey({ name: 'AES-GCM', length: 256 }, true, ['encrypt']);
    const iv = crypto.getRandomValues(new Uint8Array(12));
    const dati = await crypto.subtle.encrypt({ name: 'AES-GCM', iv }, aes, testo);
    const pub = await crypto.subtle.importKey('jwk', REPORT_PUBKEY, { name: 'RSA-OAEP', hash: 'SHA-256' }, false, ['encrypt']);
    const chiave = await crypto.subtle.encrypt({ name: 'RSA-OAEP' }, pub, await crypto.subtle.exportKey('raw', aes));
    const b64 = b => { const u = new Uint8Array(b); let s = ''; for (let i = 0; i < u.length; i += 8192) s += String.fromCharCode(...u.subarray(i, i + 8192)); return btoa(s); };
    return { app: 'AssistenteBanco', v: VERSION, alg: 'RSA-OAEP-256+A256GCM', key: b64(chiave), iv: b64(iv), data: b64(dati) };
  },
  async chiudi(motivo) {
    this.log('fine', { motivo });
    const rapporto = { sessione: this.sessione, fine: new Date().toISOString(), motivo, eventi: this.eventi };
    try {
      const pacchetto = await this.cifra(rapporto);
      const coda = JSON.parse(localStorage.getItem('ab_rapporti') || '[]');
      coda.push(pacchetto);
      while (coda.length > 30) coda.shift();
      localStorage.setItem('ab_rapporti', JSON.stringify(coda));
      this.invia();
    } catch (e) { console.warn('rapporto', e); }
  },
  invia() {
    if (!REPORT_URL || !navigator.onLine) return;
    const coda = JSON.parse(localStorage.getItem('ab_rapporti') || '[]');
    if (!coda.length) return;
    const ok = navigator.sendBeacon(REPORT_URL, new Blob([JSON.stringify(coda)], { type: 'application/json' }));
    if (ok) localStorage.setItem('ab_rapporti', '[]');
  },
  async salvaFile() {
    await this.chiudi('salvataggio manuale');
    const coda = localStorage.getItem('ab_rapporti') || '[]';
    scarica(`rapporto-assistentebanco-${Date.now()}.json`, coda, 'application/json');
    this.eventi = []; this.log('ripresa', {});
  }
};
window.addEventListener('error', e => Report.log('errore', { msg: e.message, file: e.filename, riga: e.lineno, col: e.colno, stack: e.error?.stack }));
window.addEventListener('unhandledrejection', e => Report.log('errore-promise', { msg: String(e.reason?.message || e.reason), stack: e.reason?.stack }));
document.addEventListener('visibilitychange', () => {
  if (document.visibilityState === 'hidden') { Report.chiudi('app chiusa o in background'); Report.eventi = []; }
  if (document.visibilityState === 'visible') Report.log('ripresa', {});
});
window.addEventListener('online', () => { Report.invia(); $('#netstate').hidden = true; });
window.addEventListener('offline', () => { $('#netstate').hidden = false; });

function scarica(nome, contenuto, tipo) {
  const url = URL.createObjectURL(new Blob([contenuto], { type: tipo }));
  const a = Object.assign(document.createElement('a'), { href: url, download: nome });
  document.body.append(a); a.click(); a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 2000);
}

/* ============ NAVIGAZIONE ============ */
function apriTab(nome) {
  $$('.tab').forEach(t => t.classList.toggle('active', t.id === 'tab-' + nome));
  $$('.bottombar button').forEach(b => b.classList.toggle('active', b.dataset.tab === nome));
  Report.log('tab', { nome });
  if (nome === 'catalogo') setTimeout(() => $('#q').focus(), 50);
}
$$('.bottombar button').forEach(b => b.addEventListener('click', () => apriTab(b.dataset.tab)));

/* ============ CAVI ============ */
const fCavi = $('#formCavi');
Object.entries(Calc.POSE).forEach(([k, v]) => fCavi.posa.add(new Option(`${k} — ${v}`, k)));
fCavi.posa.value = 'A1';
fCavi.sistema.addEventListener('change', () => { fCavi.conduttori.value = fCavi.sistema.value === 'tri' ? '3' : '2'; });
fCavi.carico.addEventListener('change', () => {
  fCavi.cosphi.value = { prese: 0.95, luce: 0.95, resistivo: 1, inverter: 0.95, motore: 0.85, wallbox: 1 }[fCavi.carico.value];
});

function calcolaCavi() {
  const v = Object.fromEntries(new FormData(fCavi));
  const sistema = v.sistema;
  const amp = parseFloat(v.amp);
  const p = {
    sistema, cosphi: parseFloat(v.cosphi) || 1, L: parseFloat(v.L) || 1,
    isolante: v.isolante, posa: v.posa, conduttori: Number(v.conduttori), temp: Number(v.temp),
    circuiti: Number(v.circuiti) || 1, limiteCdt: parseFloat(v.cdt) || 4,
    potenzaW: (parseFloat(v.kw) || 0) * 1000,
    sezioneMin: v.carico === 'luce' ? 1.5 : 2.5
  };
  if (amp > 0) p.Ib = amp;
  const out = $('#outCavi');
  if (!(p.Ib > 0) && !(p.potenzaW > 0)) { out.innerHTML = '<p class="hint">Inserisci potenza o corrente.</p>'; return; }
  const r = Calc.dimensiona(p);
  const curva = Calc.curvaConsigliata(v.carico);
  const diff = Calc.differenzialeConsigliato(v.carico, sistema);
  const s = r.scelta;
  const poli = sistema === 'tri' ? '4P (3P+N)' : '2P (1P+N)';
  let html = '<div class="hero">';
  html += kpi('Corrente d\'impiego', fmt(r.Ib) + ' A');
  html += kpi('Interruttore', r.In ? `${r.In} A curva ${curva.curva}` : 'oltre 125 A', !r.In);
  html += kpi('Sezione consigliata', s ? `${fmt(s.S)} mm²` : 'nessuna', !s);
  html += kpi('Caduta di tensione', s ? `${fmt(s.cdt.perc, 2)} % (${fmt(s.cdt.dV)} V)` : '—', !s);
  html += kpi('Portata cavo Iz', s ? fmt(s.Iz) + ' A' : '—');
  html += kpi('Differenziale', `Tipo ${diff.tipo}, ${diff.idn}`);
  html += '</div>';
  html += `<p class="small">Magnetotermico ${poli}. ${esc(curva.nota)} ${esc(diff.nota)}</p>`;
  if (!s) html += '<div class="warnbox">Nessuna sezione fino a 120 mm² rispetta portata e caduta di tensione: riduci la lunghezza, alza il limite o dividi il carico.</div>';
  if (v.carico === 'wallbox') html += '<div class="warnbox">Wallbox: carico continuo per ore, meglio una sezione in più.</div>';
  html += '<table><thead><tr><th>mm²</th><th>Iz (A)</th><th>Caduta</th><th>Portata</th></tr></thead><tbody>';
  for (const row of r.righe.slice(0, 7)) {
    html += `<tr class="${s && row.S === s.S ? 'sel' : ''}"><td>${fmt(row.S)}</td><td>${fmt(row.Iz)}</td><td class="${row.okCdt ? 'ok' : 'no'}">${fmt(row.cdt, 2)} %</td><td class="${row.okPortata ? 'ok' : 'no'}">${row.okPortata ? 'OK' : 'no'}</td></tr>`;
  }
  html += '</tbody></table>';
  out.innerHTML = html;
  Report.log('calcolo-linea', { input: p, esito: s ? { S: s.S, In: r.In, cdt: +s.cdt.perc.toFixed(2) } : null });
}
function kpi(l, v, bad) { return `<div class="kpi${bad ? ' bad' : ''}"><div class="l">${esc(l)}</div><div class="v">${esc(v)}</div></div>`; }
let tCavi; fCavi.addEventListener('input', () => { clearTimeout(tCavi); tCavi = setTimeout(calcolaCavi, 120); });
fCavi.addEventListener('change', calcolaCavi);
calcolaCavi();

/* ============ STRUMENTI ============ */
function calcolaConv() {
  const val = parseFloat($('#cvVal').value) || 0, t = $('#cvType').value, sis = $('#cvSis').value, cos = parseFloat($('#cvCos').value) || 1;
  const r = { kwA: () => fmt(Calc.conv.kwToA(val, sis, null, cos), 2) + ' A',
    aKw: () => fmt(Calc.conv.aToKw(val, sis, null, cos), 2) + ' kW',
    hpKw: () => fmt(Calc.conv.hpToKw(val), 2) + ' kW',
    kvaKw: () => fmt(Calc.conv.kvaToKw(val, cos), 2) + ' kW' }[t]();
  $('#cvOut').textContent = r;
}
['#cvVal', '#cvType', '#cvSis', '#cvCos'].forEach(s => $(s).addEventListener('input', calcolaConv));
calcolaConv();

function calcolaContatore() {
  const kw = parseFloat($('#ctKw').value), c = Calc.contatore(kw);
  $('#ctOut').innerHTML = `<div class="big">Fino a ${fmt(c.continuo, 1)} kW senza staccare</div><p class="small">${esc(c.nota)}</p>`;
}
$('#ctKw').addEventListener('change', calcolaContatore); calcolaContatore();

const tuboSez = [1.5, 2.5, 4, 6, 10, 16];
$('#tuboRows').innerHTML = tuboSez.map(s => `<label>N° cavi ${fmt(s)} mm²<input type="number" inputmode="numeric" min="0" data-s="${s}" value="${s <= 2.5 ? 3 : 0}"></label>`).join('');
function calcolaTubo() {
  const cavi = $$('#tuboRows input').map(i => ({ S: Number(i.dataset.s), n: Number(i.value) || 0 }));
  const r = Calc.fascio(cavi);
  $('#tuboOut').innerHTML = !r ? '<span class="hint">Inserisci i cavi.</span>'
    : r.tubo ? `Corrugato Ø ${r.tubo.est} mm <span class="small">(interno ≥ ${fmt(r.minInt)} mm)</span>`
    : `<span style="color:var(--bad)">Serve più di Ø 63 mm: dividi su più tubi</span>`;
}
$('#tuboRows').addEventListener('input', calcolaTubo); calcolaTubo();

Object.keys(Calc.LUX).forEach(k => $('#luxRoom').add(new Option(`${k[0].toUpperCase() + k.slice(1)} (${Calc.LUX[k]} lux)`, k)));
function calcolaLux() {
  const lm = Calc.lumen($('#luxRoom').value, parseFloat($('#luxMq').value) || 0);
  const w = lm / (parseFloat($('#luxEff').value) || 100);
  $('#luxOut').innerHTML = `${fmt(lm, 0)} lumen <span class="small">≈ ${fmt(w, 0)} W di LED totali</span>`;
}
['#luxRoom', '#luxMq', '#luxEff'].forEach(s => $(s).addEventListener('input', calcolaLux)); calcolaLux();

$('#promemoria').innerHTML = `
<ul class="ref">
<li><strong>Colori:</strong> fase marrone/nero/grigio, neutro blu, terra giallo-verde.</li>
<li><strong>Sezioni tipiche (rame, casa):</strong> luce 1,5 mm²; prese 10 A 1,5 mm²; prese 16 A/Schuko 2,5 mm²; forno e piano a induzione 4–6 mm² su linea dedicata; montante 6–10 mm².</li>
<li><strong>Cavi:</strong> FS17 = PVC, unipolare per tubo; FG16OR16 = EPR, multipolare per esterno/interrato; FG17 = EPR unipolare; H07RN-F = gomma per cantiere e prolunghe.</li>
<li><strong>Grado IP:</strong> 1ª cifra = solidi (5 polvere limitata, 6 polvere totale); 2ª = acqua (4 spruzzi, 5 getti, 7 immersione temporanea). Esterno: almeno IP44, meglio IP55/IP65.</li>
<li><strong>Bagno (CEI 64-8/7):</strong> nelle zone 0–2 solo apparecchi con IP adeguato; prese fuori dalla zona 2 (oltre 60 cm da vasca/doccia), con differenziale 30 mA.</li>
<li><strong>Potere di interruzione:</strong> casa 4,5 kA; dove la corrente di cortocircuito è più alta 6 kA o 10 kA.</li>
</ul>`;

/* ============ CATALOGO (IndexedDB) ============ */
const DB = {
  db: null,
  open() {
    return this.db ? Promise.resolve(this.db) : new Promise((res, rej) => {
      const r = indexedDB.open('assistentebanco', 1);
      r.onupgradeneeded = () => r.result.createObjectStore('articoli', { keyPath: 'id' });
      r.onsuccess = () => res(this.db = r.result);
      r.onerror = () => rej(r.error);
    });
  },
  async tutti() { const db = await this.open(); return new Promise((res, rej) => { const q = db.transaction('articoli').objectStore('articoli').getAll(); q.onsuccess = () => res(q.result); q.onerror = () => rej(q.error); }); },
  async metti(lista) { const db = await this.open(); return new Promise((res, rej) => { const tx = db.transaction('articoli', 'readwrite'); const st = tx.objectStore('articoli'); lista.forEach(a => st.put(a)); tx.oncomplete = res; tx.onerror = () => rej(tx.error); }); },
  async svuota() { const db = await this.open(); return new Promise((res, rej) => { const tx = db.transaction('articoli', 'readwrite'); tx.objectStore('articoli').clear(); tx.oncomplete = res; tx.onerror = () => rej(tx.error); }); }
};
let CATALOGO = [];

const norm = s => String(s ?? '').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');
// Estrae caratteristiche tecniche dalla descrizione per le equivalenze tra marche
function caratteristiche(desc) {
  const d = norm(desc).replace(/(\d),(\d)/g, '$1.$2');
  const f = {};
  const m = (re, k, tf = x => x) => { const r = d.match(re); if (r) f[k] = tf(r[1]); };
  m(/(\d+(?:\.\d+)?)\s*ma\b/, 'mA', Number);
  m(/(?:^|[\s(xc])(\d{1,3})\s*a\b/, 'A', Number);
  m(/\b(1p\+n|3p\+n)\b/, 'polin');
  if (!f.polin) m(/\b([1-4])\s*p(?:\b|olare|oli)/, 'poli', Number);
  m(/(\d+(?:\.\d+)?)\s*ka\b/, 'kA', Number);
  m(/curva\s*([bcdk])\b/, 'curva');
  if (!f.curva) { const r = d.match(/\b([bcd])\s?(\d{1,3})\b/); if (r) { f.curva = r[1]; f.A ??= Number(r[2]); } }
  m(/tipo\s*(ac|a|f|b)\b/, 'tipo');
  m(/(\d+(?:\.\d+)?)\s*(?:mm2|mm²|mmq)/, 'mm2', Number);
  m(/(\d+(?:\.\d+)?)\s*w\b/, 'W', Number);
  m(/\bip\s?(\d{2})\b/, 'IP');
  const famiglie = [
    ['magnetotermico differenziale', /(magnetotermico\s+differenziale|differenziale\s+magnetotermico|\brcbo\b)/],
    ['differenziale', /(differenziale|salvavita|\brcd\b|\brccb\b)/],
    ['magnetotermico', /(magnetotermico|\bmcb\b|interruttore automatico)/],
    ['cavo', /(cavo|\bfs17\b|\bfg16|\bfg17\b|h07)/],
    ['presa', /(presa|schuko|bipasso)/],
    ['interruttore civile', /(interruttore|deviatore|invertitore|pulsante)/],
    ['lampada', /(lampada|faretto|plafoniera|tubo led|lampadina)/],
    ['corrugato', /(corrugato|guaina|tubo rigido)/]
  ];
  for (const [nome, re] of famiglie) if (re.test(d)) { f.famiglia = nome; break; }
  return f;
}
const CHIAVI_FAMIGLIA = { magnetotermico: ['A', 'poli', 'polin', 'curva', 'kA'], differenziale: ['A', 'mA', 'poli', 'polin', 'tipo'],
  'magnetotermico differenziale': ['A', 'mA', 'curva', 'tipo', 'polin', 'poli'], cavo: ['mm2'], lampada: ['W'] };
function firma(a) {
  if (a.gruppo) return 'g:' + norm(a.gruppo);
  const f = a._f || (a._f = caratteristiche(a.descrizione));
  const chiavi = CHIAVI_FAMIGLIA[f.famiglia];
  if (!chiavi) return null;
  const parti = chiavi.filter(k => f[k] != null).map(k => `${k}=${f[k]}`);
  if (parti.length < Math.min(2, chiavi.length)) return null;
  return f.famiglia + '|' + parti.join('|');
}
function equivalenti(a) {
  const fa = firma(a);
  if (!fa) return [];
  return CATALOGO.filter(b => b.id !== a.id && norm(b.marca) !== norm(a.marca) && firma(b) === fa);
}

async function caricaCatalogo() {
  CATALOGO = await DB.tutti();
  const marche = new Set(CATALOGO.map(a => a.marca).filter(Boolean));
  $('#catStats').textContent = CATALOGO.length
    ? `${CATALOGO.length.toLocaleString('it-IT')} articoli · ${marche.size} marche · salvati solo su questo dispositivo`
    : 'Catalogo vuoto: importa un listino qui sotto. Intanto la ricerca online funziona lo stesso.';
}

function cerca(q) {
  const out = $('#results');
  q = q.trim();
  if (!q) { out.innerHTML = ''; return; }
  const parole = norm(q).split(/\s+/).filter(Boolean);
  const esatto = CATALOGO.filter(a => norm(a.codice) === norm(q) || String(a.ean) === q);
  const altri = CATALOGO.filter(a => !esatto.includes(a)).filter(a => {
    const testo = norm(`${a.codice} ${a.descrizione} ${a.marca} ${a.categoria} ${a.ean}`);
    return parole.every(p => testo.includes(p));
  });
  const lista = [...esatto, ...altri].slice(0, 40);
  const web = `<div class="item"><div class="t">Cerca “${esc(q)}” online</div><div class="m">
    <a href="https://www.google.com/search?q=${encodeURIComponent(q + ' scheda tecnica')}" target="_blank" rel="noopener">Scheda tecnica</a> ·
    <a href="https://www.google.com/search?q=${encodeURIComponent(q + ' equivalente')}" target="_blank" rel="noopener">Equivalenti</a> ·
    <a href="https://www.google.com/search?tbm=isch&q=${encodeURIComponent(q)}" target="_blank" rel="noopener">Foto</a></div></div>`;
  if (!lista.length) { out.innerHTML = (CATALOGO.length ? '<p class="hint">Nessun articolo nel catalogo.</p>' : '') + web; return; }
  const etichetta = (k, v) => ({ curva: 'curva ' + String(v).toUpperCase(), tipo: 'tipo ' + String(v).toUpperCase(), poli: v + 'P', polin: String(v).toUpperCase(), IP: 'IP' + v }[k] ?? `${v} ${k}`);
  out.innerHTML = lista.map(a => {
    const eq = equivalenti(a).slice(0, 6);
    const f = a._f || caratteristiche(a.descrizione);
    const tag = ['A', 'poli', 'polin', 'curva', 'mA', 'tipo', 'kA', 'mm2', 'W', 'IP'].filter(k => f[k] != null).map(k => `<span class="chip">${esc(etichetta(k, f[k]))}</span>`).join(' ');
    return `<div class="item"><div class="t">${esc(a.descrizione || a.codice)}</div>
      <div class="m">${esc(a.marca || '')} · cod. <strong>${esc(a.codice)}</strong>${a.ean ? ' · EAN ' + esc(a.ean) : ''}${a.prezzo ? ' · € ' + esc(a.prezzo) : ''}</div>
      ${tag ? `<div class="m">${tag}</div>` : ''}
      ${eq.length ? `<div class="eq"><strong>Equivalenti:</strong><br>${eq.map(b => `${esc(b.marca)} <strong>${esc(b.codice)}</strong> — ${esc(b.descrizione)}${b.prezzo ? ' · € ' + esc(b.prezzo) : ''}`).join('<br>')}</div>` : ''}
    </div>`;
  }).join('') + web;
  Report.log('ricerca', { lunghezza: q.length, risultati: lista.length });
}
let tQ; $('#q').addEventListener('input', e => { clearTimeout(tQ); tQ = setTimeout(() => cerca(e.target.value), 150); });

// Import
const ALIAS = {
  codice: ['codice', 'cod', 'cod.', 'codice articolo', 'cod. articolo', 'articolo', 'code', 'sku', 'riferimento', 'codice prodotto'],
  descrizione: ['descrizione', 'desc', 'description', 'descrizione articolo', 'denominazione', 'prodotto'],
  marca: ['marca', 'produttore', 'brand', 'fornitore', 'costruttore'],
  ean: ['ean', 'barcode', 'codice a barre', 'ean13', 'gtin'],
  categoria: ['categoria', 'famiglia', 'gruppo merceologico', 'category', 'classe'],
  prezzo: ['prezzo', 'listino', 'prezzo listino', 'price', 'prezzo netto', 'pubblico'],
  gruppo: ['gruppo', 'equivalenza', 'gruppo equivalenza', 'gruppo_equivalenza']
};
function mappaColonne(header) {
  const map = {};
  header.forEach((h, i) => { const n = norm(h).trim(); for (const [k, al] of Object.entries(ALIAS)) if (map[k] == null && al.includes(n)) map[k] = i; });
  return map;
}
function parseCSV(testo) {
  const prima = testo.split('\n')[0];
  const sep = (prima.match(/;/g) || []).length >= (prima.match(/,/g) || []).length ? ';' : ',';
  const righe = []; let riga = [], campo = '', q = false;
  for (let i = 0; i < testo.length; i++) {
    const c = testo[i];
    if (q) { if (c === '"' && testo[i + 1] === '"') { campo += '"'; i++; } else if (c === '"') q = false; else campo += c; }
    else if (c === '"') q = true;
    else if (c === sep) { riga.push(campo); campo = ''; }
    else if (c === '\n' || c === '\r') { if (c === '\r' && testo[i + 1] === '\n') i++; riga.push(campo); righe.push(riga); riga = []; campo = ''; }
    else campo += c;
  }
  if (campo || riga.length) { riga.push(campo); righe.push(riga); }
  return righe.filter(r => r.some(x => x.trim()));
}
function caricaScript(src) {
  return new Promise((res, rej) => { const s = document.createElement('script'); s.src = src; s.onload = res; s.onerror = () => rej(new Error('Impossibile caricare ' + src)); document.head.append(s); });
}
$('#fileImport').addEventListener('change', async e => {
  const file = e.target.files[0]; if (!file) return;
  const msg = $('#importMsg'); msg.textContent = 'Importazione in corso…';
  try {
    let righe;
    if (/\.xlsx?$/i.test(file.name)) {
      if (!window.XLSX) await caricaScript('https://cdn.jsdelivr.net/npm/xlsx@0.18.5/dist/xlsx.full.min.js');
      const wb = XLSX.read(await file.arrayBuffer());
      righe = XLSX.utils.sheet_to_json(wb.Sheets[wb.SheetNames[0]], { header: 1, raw: false, defval: '' });
    } else righe = parseCSV(await file.text());
    const hi = righe.findIndex(r => { const m = mappaColonne(r); return m.codice != null || m.descrizione != null; });
    if (hi < 0) throw new Error('Non trovo le colonne "codice" o "descrizione". Usa il modello CSV.');
    const map = mappaColonne(righe[hi]);
    const marcaFile = file.name.replace(/\.[^.]+$/, '');
    const lista = righe.slice(hi + 1).map(r => {
      const g = k => map[k] != null ? String(r[map[k]] ?? '').trim() : '';
      const marca = g('marca') || marcaFile;
      const codice = g('codice') || g('ean');
      if (!codice && !g('descrizione')) return null;
      return { id: norm(marca) + '|' + (codice || g('descrizione')), codice, descrizione: g('descrizione'), marca, ean: g('ean'), categoria: g('categoria'), prezzo: g('prezzo'), gruppo: g('gruppo') };
    }).filter(Boolean);
    await DB.metti(lista);
    await caricaCatalogo();
    msg.textContent = `Importati ${lista.length.toLocaleString('it-IT')} articoli da ${file.name}.`;
    Report.log('import', { righe: lista.length, colonne: Object.keys(map), tipo: file.name.split('.').pop() });
  } catch (err) { msg.textContent = 'Errore: ' + err.message; Report.log('errore-import', { msg: err.message }); }
  e.target.value = '';
});
$('#btnTemplate').addEventListener('click', () => scarica('modello-listino.csv',
  'codice;descrizione;marca;ean;categoria;prezzo;gruppo\nESEMPIO1;Magnetotermico 1P+N 16A curva C 4,5kA;MarcaX;;protezioni;12,50;\nESEMPIO2;Differenziale puro 2P 40A 30mA tipo A;MarcaY;;protezioni;45,00;\n', 'text/csv'));
$('#btnClearCat').addEventListener('click', async () => {
  if (!confirm('Cancellare tutto il catalogo da questo dispositivo?')) return;
  await DB.svuota(); await caricaCatalogo(); cerca($('#q').value); Report.log('catalogo-svuotato', {});
});

$('#serieCivili').innerHTML = `
<p class="small">I frutti non sono intercambiabili tra marche diverse. Le scatole da incasso 503 (3 moduli) vanno bene per tutte; le placche no.</p>
<table><thead><tr><th>Marca</th><th>Serie</th></tr></thead><tbody>
<tr><td>BTicino</td><td>Living Now, Matix, Matix GO, Axolute</td></tr>
<tr><td>Vimar</td><td>Plana, Arké, Eikon, Linea, Neve Up</td></tr>
<tr><td>Gewiss</td><td>Chorus</td></tr>
<tr><td>Schneider Electric</td><td>Unica</td></tr>
</tbody></table>`;

/* ============ SCANNER ============ */
let stream = null, scanAttivo = false, zxReader = null;
async function avviaScanner() {
  $('#scanner').hidden = false; $('#scanMsg').textContent = 'Avvio fotocamera…';
  Report.log('scanner-avvio', { nativo: 'BarcodeDetector' in window });
  try {
    if ('BarcodeDetector' in window) {
      stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
      const video = $('#video'); video.srcObject = stream; await video.play();
      const det = new BarcodeDetector({ formats: ['ean_13', 'ean_8', 'code_128', 'code_39', 'upc_a', 'upc_e', 'qr_code', 'itf', 'data_matrix'] });
      scanAttivo = true; $('#scanMsg').textContent = 'Inquadra il codice a barre';
      const loop = async () => {
        if (!scanAttivo) return;
        try { const c = await det.detect(video); if (c.length) return trovato(c[0].rawValue); } catch {}
        requestAnimationFrame(loop);
      };
      loop();
    } else {
      if (!window.ZXing) await caricaScript('https://unpkg.com/@zxing/library@0.21.3/umd/index.min.js');
      zxReader = new ZXing.BrowserMultiFormatReader();
      scanAttivo = true; $('#scanMsg').textContent = 'Inquadra il codice a barre';
      zxReader.decodeFromConstraints({ video: { facingMode: 'environment' } }, 'video', res => { if (res && scanAttivo) trovato(res.getText()); });
    }
  } catch (err) { $('#scanMsg').textContent = 'Fotocamera non disponibile: ' + err.message; Report.log('errore-scanner', { msg: err.message }); }
}
function fermaScanner() {
  scanAttivo = false;
  stream?.getTracks().forEach(t => t.stop()); stream = null;
  zxReader?.reset(); zxReader = null;
  $('#scanner').hidden = true;
}
function trovato(codice) {
  navigator.vibrate?.(80);
  fermaScanner();
  $('#q').value = codice; cerca(codice);
  Report.log('scanner-letto', { lunghezza: codice.length });
}
$('#btnScan').addEventListener('click', avviaScanner);
$('#btnStopScan').addEventListener('click', fermaScanner);

/* ============ INFO, INSTALLAZIONE, AGGIORNAMENTI ============ */
$('#ver').textContent = VERSION;
$('#changelog').innerHTML = CHANGELOG.map(c => `<p><strong>${c.v}</strong> <span class="small">${c.data}</span></p><ul class="ref">${c.voci.map(v => `<li>${esc(v)}</li>`).join('')}</ul>`).join('');
$('#btnReport').addEventListener('click', () => Report.salvaFile());
const aggiornaRepInfo = () => { const n = JSON.parse(localStorage.getItem('ab_rapporti') || '[]').length; $('#repInfo').textContent = n ? `${n} in coda` : ''; };
aggiornaRepInfo(); setInterval(aggiornaRepInfo, 10000);

let promptInstall = null;
window.addEventListener('beforeinstallprompt', e => { e.preventDefault(); promptInstall = e; $('#btnInstall').hidden = false; });
$('#btnInstall').addEventListener('click', async () => { if (!promptInstall) return; promptInstall.prompt(); const r = await promptInstall.userChoice; Report.log('installazione', { esito: r.outcome }); promptInstall = null; $('#btnInstall').hidden = true; });

if ('serviceWorker' in navigator && location.protocol !== 'file:') {
  navigator.serviceWorker.register('sw.js').then(reg => {
    const mostra = w => {
      $('#updatebar').hidden = false;
      fetch('version.json', { cache: 'no-store' }).then(r => r.json()).then(j => { $('#updatenotes').textContent = (j.novita || []).join(' · '); }).catch(() => {});
      $('#btnUpdate').onclick = () => { Report.log('aggiornamento', { da: VERSION }); w.postMessage('skipWaiting'); };
    };
    if (reg.waiting) mostra(reg.waiting);
    reg.addEventListener('updatefound', () => {
      const w = reg.installing;
      w.addEventListener('statechange', () => { if (w.state === 'installed' && navigator.serviceWorker.controller) mostra(w); });
    });
    $('#btnCheck').onclick = () => { reg.update(); $('#btnCheck').textContent = 'Controllo…'; setTimeout(() => $('#btnCheck').textContent = 'Cerca aggiornamenti', 2500); };
    setInterval(() => reg.update(), 60 * 60 * 1000);
  });
  let ricaricato = false;
  navigator.serviceWorker.addEventListener('controllerchange', () => { if (!ricaricato) { ricaricato = true; location.reload(); } });
}

const SCALE = [1, 1.15, 1.3, 1.45];
let scala = 0; try { scala = Number(localStorage.getItem('ab_scala')) || 0; } catch {}
const applicaScala = () => document.documentElement.style.setProperty('--scala', SCALE[scala]);
applicaScala();
$('#btnAa').addEventListener('click', () => { scala = (scala + 1) % SCALE.length; applicaScala(); try { localStorage.setItem('ab_scala', scala); } catch {} Report.log('scala-testo', { scala: SCALE[scala] }); });
$('#netstate').hidden = navigator.onLine;
Report.log('avvio', { versione: VERSION });
caricaCatalogo();
