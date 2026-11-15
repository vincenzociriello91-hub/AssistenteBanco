/* Assistente Banco — interfaccia */
'use strict';

const VERSION = '1.8.0';
const CHANGELOG = [
  { v: '1.8.0', data: '15/11/2026', voci: ['6 nuovi reparti: Protezioni e quadri, Automazione cancelli, Ventilazione e aspiratori, Antifurto e antincendio, Canali e passerelle, Nastri giunzioni fissaggi e attrezzi.', 'Nuove marche: Siemens, ABB, Hager, Legrand, Lovato, Finder, FAAC, BFT, CAME, Nice, Vortice, Bentel, Notifier, Arnocanali, 3M, Cellpack, Etelec, Intercable, Panduit, Fischer, AVE, Beta Cavi, ITC.', 'Serie complete per Gewiss (Chorus, ChoruSmart) e Aermec (SLG, SE, multisplit MLG).'] },
  { v: '1.7.0', data: '15/11/2026', voci: ['App più semplice anche per chi non è del mestiere: risposte scritte in parole semplici.', 'Dimensiona linea: scegli l\'apparecchio (forno, piano a induzione, condizionatore, auto elettrica…) e la risposta arriva da sola.', 'Benvenuto alla prima apertura, suggerimenti di ricerca, glossario "Parole semplici".'] },
  { v: '1.6.1', data: '15/11/2026', voci: ['Animazioni tra le pagine più leggere: nessun tocco perso.', 'Alla prima apertura l\'app non si ricarica più da sola.'] },
  { v: '1.6.0', data: '15/11/2026', voci: ['Grafica modernizzata in stile Pixel (Material 3 Expressive): icone Material al posto delle emoji, colori diversi per ogni reparto e strumento.', 'Ricerca a pillola con titolo grande, barre traslucide, ombre leggere, angoli più morbidi.', 'Animazioni fluide tra le pagine, senza perdere nessun tocco.'] },
  { v: '1.5.0', data: '15/11/2026', voci: ['Nuovo reparto Raccordi, pressacavi e cassette: Gewiss, BTicino, Vimar, Bocchiotti/Inset, Cembre, BM Group, Palazzoli, Scame.', 'Cassette da parete e da incasso (muratura e cartongesso) con codici e misure principali.', 'Guida rapida per scegliere pressacavi, raccordi e cassette.'] },
  { v: '1.4.0', data: '15/11/2026', voci: ['Nuovo reparto Morsetti, capicorda e connessioni: Cembre, BM Group, Weidmüller, Cabur, con guida rapida (colori capicorda, vite/molla/push-in, puntali).', 'Triple gestionale anche per Cembre (CEM), BM Group (BMM) e Weidmüller (WEI).'] },
  { v: '1.3.2', data: '15/11/2026', voci: ['Codici gestionale Elettrocampania già inseriti nell\'app: niente da importare.'] },
  { v: '1.3.1', data: '15/11/2026', voci: ['Controllo completo dell\'app: 50 verifiche automatiche su calcoli, ricerca, reparti, codici, catalogo, rapporti e 7 risoluzioni.', 'Numeri scritti tutti allo stesso modo (es. 7.000 BTU, 1.500 lumen).'] },
  { v: '1.3.0', data: '15/11/2026', voci: ['Nuovo strumento Codici gestionale: triple dei fornitori e codici di ricerca (Siemens, Schneider, Ledvance, cavi e rame).', 'Cerca trova anche i codici (es. "salvamotore" → SIE RV, SNR GV) e nei reparti compare la tripla accanto alla marca.', 'I codici aziendali restano solo sul dispositivo: si importano da file.'] },
  { v: '1.2.0', data: '15/11/2026', voci: ['App riordinata in 4 schede: Cerca, Strumenti, Reparti, Info.', 'Strumenti e reparti come riquadri uguali: tocchi e si apre la pagina, freccia o tasto indietro per tornare.', 'Cerca trova insieme articoli del catalogo, marche nei reparti e ricerca online.', 'Dimensiona linea più semplice: opzioni avanzate nascoste finché non servono.'] },
  { v: '1.1.0', data: '15/11/2026', voci: ['Marche aggiunte: illuminazione (Philips, Ledvance, Beghelli, Disano, Fosnova, 3F Filippi, Performance in Lighting, iGuzzini).', 'Cavi (Prysmian, La Triveneta Cavi, Baldassari, Icel); fotovoltaico (Huawei, SMA, Fronius, SolarEdge, ZCS Azzurro, Sungrow, Kostal, GoodWe, BYD, moduli).', 'Domotica (Gewiss, ABB, Schneider); cassette (Gewiss 44 CE, Bocchiotti Pico, Scame Scabox).'] },
  { v: '1.0.9', data: '15/11/2026', voci: ['Reparto corrugati: aggiunte Tubifor e Inset con serie, colori, codici e accessori.', 'Equivalenze automatiche anche per corrugati e tubi rigidi (stesso diametro e stessa classificazione, es. 3321).'] },
  { v: '1.0.8', data: '15/11/2026', voci: ['Adattamento automatico a ogni schermo: telefoni, tablet, pieghevoli, monitor fino al 4K e oltre.', 'Schermi HDR e a colori ampi (P3/Rec.2020) riconosciuti: colori più ricchi, sfondo meno abbagliante.', 'Tema scuro con nero puro: meno consumo su OLED/AMOLED.', 'Mouse o touch riconosciuti; contrasto elevato e colori forzati del sistema rispettati.'] },
  { v: '1.0.7', data: '15/11/2026', voci: ['Grafica rifatta: testo, campi e pulsanti si adattano alla risoluzione dello schermo (telefono piccolo, Pixel, tablet, PC).', 'Nuovo carattere Roboto Flex in stile Pixel, funziona anche offline.', 'Telefono in orizzontale e tablet/PC con menu laterale.', 'In Info si vede lo schermo rilevato.'] },
  { v: '1.0.6', data: '15/11/2026', voci: ['Nuova sezione Reparti: elettrico civile, illuminazione, condizionatori, cavi, fotovoltaico, domotica, corrugati/cassette/tubi RK, citofonia e TVCC.', 'Ogni reparto ha le sue marche e modelli, una guida rapida e il pulsante per aggiungere le marche che vendete.'] },
  { v: '1.0.5', data: '15/11/2026', voci: ['Nuova tabella climatizzazione: Daikin, Mitsubishi Electric, Samsung, Haier, Clivet, Aermec.', 'Nuovo strumento: stima dei BTU del climatizzatore per stanza.'] },
  { v: '1.0.4', data: '15/11/2026', voci: ['Nuove tabelle: videocitofonia Urmet e Comelit (sistemi, monitor, pulsantiere).', 'Videosorveglianza e antintrusione Hikvision (Turbo HD, IP, AcuSense, AX PRO).'] },
  { v: '1.0.3', data: '15/11/2026', voci: ['Aggiornamento dall\'app riparato: l\'app controlla sempre la versione online e installa i file nuovi con un tocco.', '"Cerca aggiornamenti" ora dice se sei già all\'ultima versione.'] },
  { v: '1.0.2', data: '15/11/2026', voci: ['Aggiunte Master (serie Modo) e Simon Urmet (serie Nea) alle serie civili.', 'Promemoria videocitofonia Urmet: sistemi, monitor e pulsantiere abbinate.'] },
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
const fmt = (n, d = 1) => Number.isFinite(n) ? n.toLocaleString('it-IT', { maximumFractionDigits: d, minimumFractionDigits: 0, useGrouping: 'always' }) : '—';
const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const norm = s => String(s ?? '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');

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

/* ============ NAVIGAZIONE: 4 schede, ognuna con elenco → dettaglio ============ */
let tabCorrente = 'cerca';
// Cambio pagina immediato (l'animazione è in CSS, così nessun tocco va perso)
const transizione = fn => fn();
function mostraTab(nome) {
  tabCorrente = nome;
  $$('.tab').forEach(t => t.classList.toggle('active', t.id === 'tab-' + nome));
  $$('.bottombar button').forEach(b => b.classList.toggle('active', b.dataset.tab === nome));
}
function chiudiViste(tab) {
  const sez = $('#tab-' + tab); if (!sez) return;
  $$('.view', sez).forEach(v => v.hidden = true);
  const l = $('[data-list]', sez); if (l) l.hidden = false;
}
function apriVista(tab, id, push = true) {
  const sez = $('#tab-' + tab); if (!sez) return;
  mostraTab(tab);
  const l = $('[data-list]', sez); if (l) l.hidden = true;
  $$('.view', sez).forEach(v => v.hidden = v.dataset.view !== id);
  window.scrollTo(0, 0);
  if (push) history.pushState({ tab, vista: id }, '');
  Report.log('vista', { tab, id });
}
function apriTab(nome, push = true) {
  if (nome === tabCorrente) chiudiViste(nome);
  mostraTab(nome);
  window.scrollTo(0, 0);
  if (push) history.pushState({ tab: nome }, '');
  Report.log('tab', { nome });
  if (nome === 'cerca' && matchMedia('(pointer: fine)').matches) setTimeout(() => $('#q').focus(), 50);
}
// La cronologia si aggiorna subito; solo il cambio grafico passa dalla transizione
$$('.bottombar button').forEach(b => b.addEventListener('click', () => { history.pushState({ tab: b.dataset.tab }, ''); transizione(() => apriTab(b.dataset.tab, false)); }));
$$('[data-open]').forEach(t => t.addEventListener('click', () => { history.pushState({ tab: 'strumenti', vista: t.dataset.open }, ''); transizione(() => apriVista('strumenti', t.dataset.open, false)); }));
document.addEventListener('click', e => { if (e.target.closest('.back')) history.back(); });
// Tasto indietro di Android: chiude la vista aperta, poi torna alla scheda precedente
history.replaceState({ tab: 'cerca' }, '');
const hashIniziale = location.hash.slice(1);
if (['strumenti', 'reparti', 'info'].includes(hashIniziale)) setTimeout(() => apriTab(hashIniziale, false), 0);
else if (hashIniziale.startsWith('s-')) setTimeout(() => apriVista('strumenti', hashIniziale.slice(2), false), 0);
else if (hashIniziale.startsWith('r-')) setTimeout(() => { RepartiUI.apri(hashIniziale.slice(2)); apriVista('reparti', 'reparto', false); }, 0);
window.addEventListener('popstate', e => {
  const s = e.state || { tab: 'cerca' };
  if (s.vista) { apriVista(s.tab, s.vista, false); if (s.tab === 'reparti' && s.rep) RepartiUI.apri(s.rep); }
  else { chiudiViste(s.tab); mostraTab(s.tab); }
});

/* ============ CAVI ============ */
const fCavi = $('#formCavi');
Object.entries(Calc.POSE).forEach(([k, v]) => fCavi.posa.add(new Option(`${k} — ${v}`, k)));
fCavi.posa.value = 'A1';
fCavi.sistema.addEventListener('change', () => { fCavi.conduttori.value = fCavi.sistema.value === 'tri' ? '3' : '2'; });
fCavi.carico.addEventListener('change', () => {
  fCavi.cosphi.value = { prese: 0.95, luce: 0.95, resistivo: 1, inverter: 0.95, motore: 0.85, wallbox: 1 }[fCavi.carico.value];
});

// Scelte rapide: apparecchi comuni con potenza tipica
$('#presets')?.addEventListener('click', e => {
  const b = e.target.closest('[data-carico]'); if (!b) return;
  $$('#presets .chip-btn').forEach(x => x.classList.toggle('on', x === b));
  fCavi.carico.value = b.dataset.carico; fCavi.carico.dispatchEvent(new Event('change'));
  fCavi.kw.value = b.dataset.kw; fCavi.amp.value = '';
  calcolaCavi(); Report.log('preset', { carico: b.dataset.carico, kw: b.dataset.kw });
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
  if (!(p.Ib > 0) && !(p.potenzaW > 0)) { out.innerHTML = '<p class="hint">Scegli cosa devi alimentare qui sopra, oppure scrivi la potenza in kW.</p>'; return; }
  const r = Calc.dimensiona(p);
  const curva = Calc.curvaConsigliata(v.carico);
  const diff = Calc.differenzialeConsigliato(v.carico, sistema);
  const s = r.scelta;
  const poli = sistema === 'tri' ? '4P (3P+N)' : '2P (1P+N)';
  const nomeCarico = { prese: 'le prese', luce: 'le luci', resistivo: 'questo apparecchio', inverter: 'questo apparecchio', motore: 'il motore', wallbox: 'la ricarica dell\'auto' }[v.carico];
  const kwTxt = p.Ib ? `${fmt(p.Ib)} A` : `${fmt(p.potenzaW / 1000, 2)} kW`;
  let html = s && r.In
    ? `<div class="risposta ok"><span class="msr" aria-hidden="true">check_circle</span><div>Per ${nomeCarico} (${kwTxt}) a ${fmt(p.L, 0)} m usa <strong>cavo da ${fmt(s.S)} mm²</strong>, <strong>interruttore da ${r.In} A</strong> e <strong>salvavita ${diff.idn} tipo ${esc(diff.tipo.split(' ')[0])}</strong>.</div></div>`
    : `<div class="risposta no"><span class="msr" aria-hidden="true">error</span><div>Con questa potenza e questa lunghezza non c'è un cavo adatto fino a 120 mm². Accorcia la linea, dividi il carico o chiedi al tecnico.</div></div>`;
  html += '<div class="hero">';
  html += kpi('Cavo consigliato', s ? `${fmt(s.S)} mm²` : 'nessuno', !s);
  html += kpi('Interruttore (magnetotermico)', r.In ? `${r.In} A curva ${curva.curva}` : 'oltre 125 A', !r.In);
  html += kpi('Salvavita (differenziale)', `${diff.idn} tipo ${diff.tipo}`);
  html += kpi('Corrente assorbita', fmt(r.Ib) + ' A');
  html += kpi('Perdita di tensione sul cavo', s ? `${fmt(s.cdt.perc, 1)} %` : '—', !s);
  html += kpi('Corrente che il cavo regge', s ? fmt(s.Iz) + ' A' : '—');
  html += '</div>';
  if (v.carico === 'wallbox') html += '<div class="warnbox">Auto elettrica: carica per molte ore di fila, meglio un cavo di una misura più grande.</div>';
  html += `<details class="dettagli"><summary>Dettagli tecnici</summary><p class="small">Magnetotermico ${poli}. ${esc(curva.nota)} ${esc(diff.nota)}</p><table><thead><tr><th>mm²</th><th>Iz (A)</th><th>Caduta</th><th>Portata</th></tr></thead><tbody>`;
  for (const row of r.righe.slice(0, 7)) {
    html += `<tr class="${s && row.S === s.S ? 'sel' : ''}"><td>${fmt(row.S)}</td><td>${fmt(row.Iz)}</td><td class="${row.okCdt ? 'ok' : 'no'}">${fmt(row.cdt, 2)} %</td><td class="${row.okPortata ? 'ok' : 'no'}">${row.okPortata ? 'OK' : 'no'}</td></tr>`;
  }
  html += '</tbody></table></details>';
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

/* Climatizzatore: stima BTU */
const TAGLIE_BTU = [7000, 9000, 12000, 15000, 18000, 24000];
function calcolaBtu() {
  const mq = parseFloat($('#btuMq').value) || 0, h = parseFloat($('#btuH').value) || 2.7, k = parseFloat($('#btuEsp').value) || 1;
  const btu = mq * 340 * (h / 2.7) * k;
  const taglia = TAGLIE_BTU.find(t => t >= btu * 0.95);
  $('#btuOut').innerHTML = mq ? `${taglia ? fmt(taglia, 0) + ' BTU/h' : 'oltre 24.000 BTU: dividi su più split'} <span class="small">(stima ${fmt(btu, 0)} BTU/h ≈ ${fmt(btu / 3412, 1)} kW)</span>` : '<span class="hint">Inserisci i m².</span>';
}
['#btuMq', '#btuH', '#btuEsp'].forEach(s => $(s).addEventListener('input', calcolaBtu)); calcolaBtu();

$('#promemoria').innerHTML = `
<h2 class="sezione" style="margin-top:0">Parole semplici</h2>
<ul class="ref">
<li><strong>Magnetotermico (interruttore automatico):</strong> stacca la corrente se la linea assorbe troppo o c'è un corto. Si sceglie in ampere (A).</li>
<li><strong>Salvavita (differenziale):</strong> stacca se la corrente scappa verso terra, per esempio se qualcuno tocca un filo. Per la casa 30 mA.</li>
<li><strong>Sezione del cavo (mm²):</strong> quanto è grosso il filo di rame. Più corrente o più distanza = filo più grosso.</li>
<li><strong>kW e A:</strong> i kW dicono quanto consuma l'apparecchio, gli ampere quanta corrente passa nel filo. In casa: 1 kW ≈ 4,5 A.</li>
<li><strong>IP:</strong> quanto un oggetto resiste a polvere e acqua. Più alto il numero, più è protetto.</li>
<li><strong>BTU:</strong> la potenza di un condizionatore. 9000 BTU ≈ una stanza di 25 m².</li>
<li><strong>Lumen:</strong> quanta luce fa una lampadina (non i watt).</li>
<li><strong>Corrugato:</strong> il tubo flessibile dentro il muro dove passano i fili.</li>
</ul>
<h2 class="sezione">Per il tecnico</h2>
<ul class="ref">
<li><strong>Colori:</strong> fase marrone/nero/grigio, neutro blu, terra giallo-verde.</li>
<li><strong>Sezioni tipiche (rame, casa):</strong> luce 1,5 mm²; prese 10 A 1,5 mm²; prese 16 A/Schuko 2,5 mm²; forno e piano a induzione 4–6 mm² su linea dedicata; montante 6–10 mm².</li>
<li><strong>Cavi:</strong> FS17 = PVC, unipolare per tubo; FG16OR16 = EPR, multipolare per esterno/interrato; FG17 = EPR unipolare; H07RN-F = gomma per cantiere e prolunghe.</li>
<li><strong>Grado IP:</strong> 1ª cifra = solidi (5 polvere limitata, 6 polvere totale); 2ª = acqua (4 spruzzi, 5 getti, 7 immersione temporanea). Esterno: almeno IP44, meglio IP55/IP65.</li>
<li><strong>Bagno (CEI 64-8/7):</strong> nelle zone 0–2 solo apparecchi con IP adeguato; prese fuori dalla zona 2 (oltre 60 cm da vasca/doccia), con differenziale 30 mA.</li>
<li><strong>Potere di interruzione:</strong> casa 4,5 kA; dove la corrente di cortocircuito è più alta 6 kA o 10 kA.</li>
</ul>`;

/* ============ CODICI GESTIONALE (dati aziendali: solo sul dispositivo) ============ */
const Codici = {
  dati: null,
  carica() { try { this.dati = JSON.parse(localStorage.getItem('ab_codici') || 'null'); } catch { this.dati = null; } if (!this.dati && typeof CODICI_DEFAULT !== 'undefined') this.dati = CODICI_DEFAULT; return this.dati; },
  salva(d) { localStorage.setItem('ab_codici', JSON.stringify(d)); this.dati = d; },
  valida(d) { return d && d.tipo === 'codici-gestionale' && Array.isArray(d.fornitori); },
  // Tripla del fornitore partendo dal nome marca (con alias: Hager, Hikvision, Panduit…)
  tripla(marca) {
    if (!this.dati) return null;
    const m = norm(marca).replace(/\(.*?\)/g, '').trim();
    const f = this.dati.fornitori.find(f => { const nomi = [norm(f.nome), ...norm(f.alias).split(' ').filter(Boolean)]; return nomi.some(n => n && (m === n || m.startsWith(n + ' ') || n.startsWith(m + ' ') || m.split(' ')[0] === n.split(' ')[0])); });
    return f ? f.tripla : null;
  },
  cerca(q) {
    if (!this.dati) return { fornitori: [], famiglie: [] };
    const p = norm(q).split(/\s+/).filter(Boolean);
    if (!p.length) return { fornitori: this.dati.fornitori, famiglie: this.dati.famiglie };
    const ok = s => p.every(x => norm(s).includes(x));
    return {
      fornitori: this.dati.fornitori.filter(f => ok(`${f.nome} ${f.tripla} ${f.alias}`)),
      famiglie: this.dati.famiglie.filter(f => ok(`${f.fornitore} ${f.tripla} ${f.descrizione} ${f.codice} ${f.parole}`))
    };
  },
  html(r, limite) {
    const fam = r.famiglie.slice(0, limite || 999), forn = r.fornitori.slice(0, limite || 999);
    let s = '';
    if (fam.length) s += fam.map(f => `<div class="item"><div class="t"><span class="codice">${esc(f.codice)}</span> ${esc(f.descrizione)}</div><div class="m">${esc(f.fornitore)}</div></div>`).join('');
    if (forn.length) s += `<div class="item"><div class="codgrid">${forn.map(f => `<span><span class="codice">${esc(f.tripla)}</span> ${esc(f.nome)}</span>`).join('')}</div></div>`;
    return s;
  },
  renderVista() {
    const ok = !!this.carica();
    $('#codNoData').hidden = ok; $('#codData').hidden = !ok;
    if (!ok) return;
    const r = this.cerca($('#codQ').value);
    const fam = r.famiglie.length ? `<h2 class="sezione">Codici di ricerca</h2>${this.html({ famiglie: r.famiglie, fornitori: [] })}` : '';
    const forn = r.fornitori.length ? `<h2 class="sezione">Triple fornitori (${r.fornitori.length})</h2>${this.html({ famiglie: [], fornitori: r.fornitori })}` : '';
    $('#codLista').innerHTML = fam + forn || '<p class="hint">Nessun codice trovato.</p>';
  },
  async importa(file, msgEl) {
    try {
      const d = JSON.parse(await file.text());
      if (!this.valida(d)) throw new Error('File non valido: serve codici-elettrocampania.json');
      this.salva(d);
      if (msgEl) msgEl.textContent = `Caricati ${d.fornitori.length} fornitori e ${d.famiglie.length} codici.`;
      Report.log('codici-import', { fornitori: d.fornitori.length, famiglie: d.famiglie.length });
      this.renderVista(); RepartiUI.render();
    } catch (e) { if (msgEl) msgEl.textContent = 'Errore: ' + e.message; Report.log('errore-codici', { msg: e.message }); }
  }
};
Codici.carica();
$('#codImport').addEventListener('change', e => { const f = e.target.files[0]; if (f) Codici.importa(f, $('#codMsg')); e.target.value = ''; });
$('#codImport2').addEventListener('change', e => { const f = e.target.files[0]; if (f) Codici.importa(f, null); e.target.value = ''; });
$('#codClear').addEventListener('click', () => { localStorage.removeItem('ab_codici'); Codici.carica(); Codici.renderVista(); RepartiUI.render(); Report.log('codici-predefiniti', {}); });
$('#codQ').addEventListener('input', () => Codici.renderVista());
Codici.renderVista();

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
  m(/\b([1-5][1-5][1-5][1-5])\b/, 'classe');
  m(/(?:ø|diam\.?|d\.)\s?(\d{2})\b/, 'diam', Number);
  const famiglie = [
    ['magnetotermico differenziale', /(magnetotermico\s+differenziale|differenziale\s+magnetotermico|\brcbo\b)/],
    ['differenziale', /(differenziale|salvavita|\brcd\b|\brccb\b)/],
    ['magnetotermico', /(magnetotermico|\bmcb\b|interruttore automatico)/],
    ['cavo', /(cavo|\bfs17\b|\bfg16|\bfg17\b|h07)/],
    ['presa', /(presa|schuko|bipasso)/],
    ['interruttore civile', /(interruttore|deviatore|invertitore|pulsante)/],
    ['lampada', /(lampada|faretto|plafoniera|tubo led|lampadina)/],
    ['corrugato', /(corrugato|pieghevole)/],
    ['tubo rigido', /(tubo rigido|\brk ?(9|15|b|hf)\b|rigido medio|rigido pesante)/],
    ['guaina', /(guaina)/]
  ];
  for (const [nome, re] of famiglie) if (re.test(d)) { f.famiglia = nome; break; }
  return f;
}
const CHIAVI_FAMIGLIA = { magnetotermico: ['A', 'poli', 'polin', 'curva', 'kA'], differenziale: ['A', 'mA', 'poli', 'polin', 'tipo'],
  'magnetotermico differenziale': ['A', 'mA', 'curva', 'tipo', 'polin', 'poli'], cavo: ['mm2'], lampada: ['W'], corrugato: ['diam', 'classe'], 'tubo rigido': ['diam', 'classe'] };
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
    : 'Il listino non è ancora caricato: trovi comunque marche, reparti, codici e la ricerca online.';
}

function suggerimenti() {
  const es = ['salvavita', 'magnetotermico 16A', 'corrugato 25', 'cavo 2,5', 'Daikin', 'pressacavi', 'scatola 503'];
  return `<h2 class="sezione">Prova a cercare</h2><div class="chips">${es.map(x => `<button class="chip-btn" data-sugg="${esc(x)}">${esc(x)}</button>`).join('')}</div>`;
}
function cerca(q) {
  const out = $('#results');
  q = q.trim();
  if (!q) { out.innerHTML = suggerimenti(); return; }
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
  const cod = Codici.cerca(q);
  const codHtml = Codici.dati && (cod.famiglie.length || cod.fornitori.length) && cod.fornitori.length < Codici.dati.fornitori.length ? `<h2 class="sezione">Codici gestionale</h2>${Codici.html(cod, 6)}` : '';
  const rep = RepartiUI.cerca(q).slice(0, 6);
  const repHtml = codHtml + (rep.length ? `<h2 class="sezione">Nei reparti</h2>${rep.map(x => `<button class="item item-link" data-goto-rep="${x.reparto.id}"><div class="t">${esc(x.marca.marca)}${Codici.tripla(x.marca.marca) ? ` <span class="codice">${esc(Codici.tripla(x.marca.marca))}</span>` : ''} <span class="chip">${esc(x.reparto.nome)}</span></div><div class="m">${esc(x.marca.modelli)}</div></button>`).join('')}` : '');
  if (!lista.length) { out.innerHTML = repHtml + (CATALOGO.length ? '<h2 class="sezione">Catalogo</h2><p class="hint">Nessun articolo nel catalogo.</p>' : '') + '<h2 class="sezione">Online</h2>' + web; return; }
  const etichetta = (k, v) => ({ curva: 'curva ' + String(v).toUpperCase(), tipo: 'tipo ' + String(v).toUpperCase(), poli: v + 'P', polin: String(v).toUpperCase(), IP: 'IP' + v }[k] ?? `${v} ${k}`);
  out.innerHTML = repHtml + '<h2 class="sezione">Catalogo</h2>' + lista.map(a => {
    const eq = equivalenti(a).slice(0, 6);
    const f = a._f || caratteristiche(a.descrizione);
    const tag = ['A', 'poli', 'polin', 'curva', 'mA', 'tipo', 'kA', 'mm2', 'W', 'IP'].filter(k => f[k] != null).map(k => `<span class="chip">${esc(etichetta(k, f[k]))}</span>`).join(' ');
    return `<div class="item"><div class="t">${esc(a.descrizione || a.codice)}</div>
      <div class="m">${esc(a.marca || '')} · cod. <strong>${esc(a.codice)}</strong>${a.ean ? ' · EAN ' + esc(a.ean) : ''}${a.prezzo ? ' · € ' + esc(a.prezzo) : ''}</div>
      ${tag ? `<div class="m">${tag}</div>` : ''}
      ${eq.length ? `<div class="eq"><strong>Equivalenti:</strong><br>${eq.map(b => `${esc(b.marca)} <strong>${esc(b.codice)}</strong> — ${esc(b.descrizione)}${b.prezzo ? ' · € ' + esc(b.prezzo) : ''}`).join('<br>')}</div>` : ''}
    </div>`;
  }).join('') + '<h2 class="sezione">Online</h2>' + web;
  Report.log('ricerca', { lunghezza: q.length, risultati: lista.length });
}
$('#results').addEventListener('click', e => { const sg = e.target.closest('[data-sugg]'); if (sg) { $('#q').value = sg.dataset.sugg; cerca(sg.dataset.sugg); return; } });
$('#results').addEventListener('click', e => { const b = e.target.closest('[data-goto-rep]'); if (!b) return; RepartiUI.apri(b.dataset.gotoRep); apriVista('reparti', 'reparto'); history.replaceState({ tab: 'reparti', vista: 'reparto', rep: b.dataset.gotoRep }, ''); });
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

RepartiUI.init((t, d) => Report.log(t, d), apriVista);

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

/* Aggiornamenti: confronta version.json (sempre dalla rete) con la versione in uso */
let swReg = null;
const confrontaVersioni = (a, b) => { const x = a.split('.').map(Number), y = b.split('.').map(Number); for (let i = 0; i < 3; i++) if ((x[i] || 0) !== (y[i] || 0)) return (x[i] || 0) - (y[i] || 0); return 0; };
async function installaAggiornamento() {
  $('#btnUpdate').textContent = 'Aggiorno…';
  Report.log('aggiornamento', { da: VERSION });
  await Report.chiudi('aggiornamento');
  try { await swReg?.update(); } catch {}
  try { for (const k of await caches.keys()) await caches.delete(k); } catch {}
  location.replace(location.pathname + '?v=' + Date.now());
}
async function cercaAggiornamenti(manuale) {
  try {
    const j = await fetch('version.json?t=' + Date.now(), { cache: 'no-store' }).then(r => r.json());
    if (confrontaVersioni(j.versione, VERSION) > 0) {
      $('#updatebar').hidden = false;
      $('#updatenotes').textContent = `Versione ${j.versione}: ${(j.novita || []).join(' · ')}`;
      $('#btnUpdate').onclick = installaAggiornamento;
      if (manuale) $('#btnCheck').textContent = 'Nuova versione trovata';
    } else if (manuale) $('#btnCheck').textContent = 'Sei all\'ultima versione';
  } catch { if (manuale) $('#btnCheck').textContent = 'Nessuna connessione'; }
  if (manuale) setTimeout(() => $('#btnCheck').textContent = 'Cerca aggiornamenti', 3000);
}
$('#btnCheck').onclick = () => { $('#btnCheck').textContent = 'Controllo…'; swReg?.update().catch(() => {}); cercaAggiornamenti(true); };
document.addEventListener('visibilitychange', () => { if (document.visibilityState === 'visible') cercaAggiornamenti(false); });
setInterval(() => cercaAggiornamenti(false), 30 * 60 * 1000);
cercaAggiornamenti(false);
if (location.search.includes('v=')) history.replaceState(null, '', location.pathname);

if ('serviceWorker' in navigator && location.protocol !== 'file:') {
  navigator.serviceWorker.register('sw.js', { updateViaCache: 'none' }).then(reg => { swReg = reg; reg.update().catch(() => {}); }).catch(() => {});
  // Ricarica solo quando una versione nuova sostituisce quella in uso (non alla prima installazione)
  const avevaController = !!navigator.serviceWorker.controller;
  let ricaricato = false;
  navigator.serviceWorker.addEventListener('controllerchange', () => { if (avevaController && !ricaricato) { ricaricato = true; location.reload(); } });
}

const SCALE = [1, 1.15, 1.3, 1.45];
let scala = 0; try { scala = Number(localStorage.getItem('ab_scala')) || 0; } catch {}
const applicaScala = () => document.documentElement.style.setProperty('--scala', SCALE[scala]);
applicaScala();
$('#btnAa').addEventListener('click', () => { scala = (scala + 1) % SCALE.length; applicaScala(); try { localStorage.setItem('ab_scala', scala); } catch {} Report.log('scala-testo', { scala: SCALE[scala] }); });
/* Riconoscimento dello schermo: classe di layout Material (telefono / pieghevole-tablet / PC) */
function rilevaSchermo() {
  const w = window.innerWidth, h = window.innerHeight, dpr = window.devicePixelRatio || 1;
  const layout = w < 600 ? 'telefono' : w < 840 ? 'tablet verticale' : 'tablet orizzontale / PC';
  document.documentElement.dataset.layout = layout;
  const base = parseFloat(getComputedStyle(document.documentElement).fontSize);
  const mq = q => matchMedia(q).matches;
  const hdr = mq('(dynamic-range: high)');
  const gamma = mq('(color-gamut: rec2020)') ? 'Rec.2020' : mq('(color-gamut: p3)') ? 'P3 (ampia)' : 'sRGB';
  const input = mq('(pointer: coarse)') ? 'touch' : mq('(pointer: fine)') ? 'mouse/trackpad' : 'altro';
  const tema = mq('(prefers-color-scheme: dark)') ? 'scuro (nero puro)' : 'chiaro';
  const contrasto = mq('(prefers-contrast: more)') ? ' · contrasto elevato' : '';
  $('#schermoInfo').textContent = `Schermo rilevato: ${w}×${h} px (${Math.round(screen.width * dpr)}×${Math.round(screen.height * dpr)} reali, densità ${fmt(dpr, 2)}x) · layout ${layout} · testo ${fmt(base, 1)} px · HDR ${hdr ? 'sì' : 'no'} · colori ${gamma} · ${input} · tema ${tema}${contrasto}`;
  return { w, h, dpr, layout, base, hdr, gamma, input, tema };
}
['(prefers-color-scheme: dark)', '(dynamic-range: high)', '(prefers-contrast: more)', '(pointer: fine)'].forEach(q => matchMedia(q).addEventListener?.('change', () => rilevaSchermo()));
let tSchermo; window.addEventListener('resize', () => { clearTimeout(tSchermo); tSchermo = setTimeout(rilevaSchermo, 150); });
Report.log('schermo', rilevaSchermo());
$('#btnAa').addEventListener('click', () => setTimeout(rilevaSchermo, 50));
$('#netstate').hidden = navigator.onLine;
Report.log('avvio', { versione: VERSION });
caricaCatalogo();
$('#results').innerHTML = suggerimenti();
try { if (!localStorage.getItem('ab_benvenuto')) $('#benvenuto').hidden = false; } catch {}
$('#btnBenvenuto').addEventListener('click', () => { $('#benvenuto').hidden = true; try { localStorage.setItem('ab_benvenuto', '1'); } catch {} });
