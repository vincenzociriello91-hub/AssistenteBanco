/* Assistente Banco — strumenti per il banco:
   preventivo, kit pronti, suggerimenti, ascolto della richiesta, ricerca vocale,
   foto del pezzo (Gemini), storico/preferiti, modalità banco.
   L'audio non viene mai salvato: dalla trascrizione si tengono solo materiali e quantità.
   Dati sul dispositivo (localStorage): ab_preventivo, ab_storico, ab_preferiti, ab_gemini, ab_banco. */
'use strict';

const Banco = (() => {
  const LS = {
    get: (k, d) => { try { return JSON.parse(localStorage.getItem(k)) ?? d; } catch { return d; } },
    set: (k, v) => { try { localStorage.setItem(k, JSON.stringify(v)); } catch {} }
  };
  const n = s => String(s || '').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');
  const f = (x, d = 1) => Number(x).toLocaleString('it-IT', { maximumFractionDigits: d });
  const num = s => parseFloat(String(s).replace(',', '.'));
  const uid = () => Math.random().toString(36).slice(2, 9);
  const qtaTxt = q => String(q).replace('.', ',');

  /* ---------- Riconoscimento materiali dal testo (ascolto e righe libere) ---------- */
  const PAROLE_NUM = { un: 1, uno: 1, una: 1, due: 2, tre: 3, quattro: 4, cinque: 5, sei: 6, sette: 7, otto: 8, nove: 9, dieci: 10, undici: 11, dodici: 12, quindici: 15, venti: 20, venticinque: 25, trenta: 30, quaranta: 40, cinquanta: 50, sessanta: 60, settanta: 70, ottanta: 80, novanta: 90, cento: 100, duecento: 200 };
  const prepara = t => n(t)
    .replace(/due e mezzo/g, '2,5').replace(/uno e mezzo/g, '1,5')
    .replace(/\b(un|uno|una|due|tre|quattro|cinque|sei|sette|otto|nove|dieci|undici|dodici|quindici|venti|venticinque|trenta|quaranta|cinquanta|sessanta|settanta|ottanta|novanta|cento|duecento)\b/g, w => PAROLE_NUM[w])
    .replace(/(\d)\s*virgola\s*(\d)/g, '$1,$2').replace(/millimetri quadr\w*|mm quadr\w*|mmq/g, 'mm2');

  const colore = t => /giallo|verde|terra/.test(t) ? ' giallo-verde' : /\bblu\b/.test(t) ? ' blu' : /marron/.test(t) ? ' marrone' : /\bner[oi]\b/.test(t) ? ' nero' : /grigi/.test(t) ? ' grigio' : '';
  // [regex, funzione(segmento) → {desc, um}]
  const MATERIALI = [
    [/\b(cav[oi]|fil[oi]|cordin[ae])\b/, t => {
      const fx = t.match(/\b(\d{1,2})\s*[xg]\s*(\d+(?:[.,]\d+)?)\b/);
      if (fx) return { desc: `Cavo FG16OR16 ${fx[1]}G${fx[2]}`, um: 'm' };
      const s = (t.match(/(\d+(?:[.,]\d+)?)\s*mm2/) || t.match(/\b(?:da|di)\s+(\d+(?:[.,]\d+)?)\b(?!\s*(?:metri|metro|m\b|mt))/) || [])[1];
      const esterno = /fg16|esterno|interrat|guaina|multipolar/.test(t);
      return { desc: `Cavo ${esterno ? 'FG16OR16' : 'FS17'}${s ? ' ' + s + ' mm²' : ''}${colore(t)}`, um: 'm' };
    }],
    [/corrugat|\btub[oi]\b|guaina/, t => { const d = (t.match(/(?:da|ø|diametro)\s*(\d{2})\b/) || t.match(/\b(16|20|25|32|40|50|63)\b/) || [])[1]; return { desc: `${/rigid|\brk\b/.test(t) ? 'Tubo rigido RK' : 'Corrugato'}${d ? ' Ø' + d : ''}${/pesante|pavimento/.test(t) ? ' pesante' : ''}`, um: 'm' }; }],
    [/cavidott/, t => { const d = (t.match(/\b(40|50|63|75|90|110|125|160)\b/) || [])[1]; return { desc: `Cavidotto doppia parete${d ? ' Ø' + d : ''}`, um: 'm' }; }],
    [/schuko|universal/, () => ({ desc: 'Presa universale (Schuko + bipasso)', um: 'pz' })],
    [/\bpres[ae]\b/, t => ({ desc: /usb/.test(t) ? 'Presa USB' : /\btv\b|antenna/.test(t) ? 'Presa TV' : /rj ?45|dati|rete/.test(t) ? 'Presa dati RJ45' : /telefon/.test(t) ? 'Presa telefono' : /\b16\b/.test(t) && !/10/.test(t) ? 'Presa 16 A' : /\b10\b/.test(t) && !/16/.test(t) ? 'Presa 10 A' : 'Presa bipasso 10/16 A', um: 'pz' })],
    [/deviator/, () => ({ desc: 'Deviatore 1P 16AX', um: 'pz' })],
    [/invertitor/, () => ({ desc: 'Invertitore 1P 16AX', um: 'pz' })],
    [/rele passo|passo passo/, () => ({ desc: 'Relè passo-passo', um: 'pz' })],
    [/pulsant/, t => ({ desc: `Pulsante${/campanel/.test(t) ? ' campanello' : ''} 1P NA`, um: 'pz' })],
    [/magnetotermic|\bautomatic/, t => { const a = (t.match(/(\d{1,3})\s*(?:a\b|amp)/) || [])[1]; const dif = /differenz/.test(t); return { desc: `${dif ? 'Magnetotermico differenziale' : 'Magnetotermico'} 1P+N${a ? ' ' + a + ' A' : ''} curva C${dif ? ' 30 mA tipo ' + (/tipo f\b/.test(t) ? 'F' : 'A') : ''}`, um: 'pz' }; }],
    [/differenzial|salvavit/, t => { const a = (t.match(/(\d{2,3})\s*(?:a\b|amp)/) || [])[1]; const tipo = /tipo f\b/.test(t) ? 'F' : /tipo b\b/.test(t) ? 'B' : 'A'; return { desc: `Differenziale puro 2P ${a || 40} A 30 mA tipo ${tipo}`, um: 'pz' }; }],
    [/centralin|quadrett/, t => { const m = (t.match(/(\d{1,2})\s*modul/) || [])[1]; return { desc: `Centralino da ${/esterno|parete/.test(t) ? 'parete' : 'incasso'}${m ? ' ' + m + ' moduli' : ''}`, um: 'pz' }; }],
    [/interruttor/, t => ({ desc: /bipolar/.test(t) ? 'Interruttore bipolare 16AX' : 'Interruttore 1P 16AX', um: 'pz' })],
    [/placc/, t => { const m = (t.match(/(\d)\s*(?:modul|posti|post)/) || [])[1]; return { desc: `Placca${m ? ' ' + m + ' moduli' : ''}`, um: 'pz' }; }],
    [/support|telai/, t => { const m = (t.match(/(\d)\s*(?:modul|posti)/) || [])[1]; return { desc: `Supporto${m ? ' ' + m + ' moduli' : ''}`, um: 'pz' }; }],
    [/scatol|cassett/, t => { const mis = (t.match(/(\d{2,3})\s*[x×]\s*(\d{2,3})/) || [])[0]; return { desc: /deriva|ispezion/.test(t) ? `Cassetta di derivazione${mis ? ' ' + mis.replace(/\s/g, '') : ''}` : /504/.test(t) ? 'Scatola da incasso 504' : /506/.test(t) ? 'Scatola da incasso 506' : /tond/.test(t) ? 'Scatola tonda da incasso' : /cartongess/.test(t) ? 'Scatola per cartongesso 503' : /esterno|stagn|parete/.test(t) ? 'Cassetta stagna da parete' : 'Scatola da incasso 503', um: 'pz' }; }],
    [/strisc/, t => { const v = (t.match(/(12|24)\s*v/) || [])[1]; return { desc: `Striscia LED${v ? ' ' + v + ' V' : ''}`, um: 'm' }; }],
    [/alimentator|trasformator|driver/, t => { const w = (t.match(/(\d{2,3})\s*(?:w\b|watt)/) || [])[1]; return { desc: `Alimentatore LED${w ? ' ' + w + ' W' : ''}`, um: 'pz' }; }],
    [/lampad/, t => { const at = (t.match(/\b(e27|e14|gu10|gu5\.?3|g9|r7s)\b/) || [])[1]; const w = (t.match(/(\d{1,3})\s*(?:w\b|watt)/) || [])[1]; return { desc: `Lampada LED${at ? ' ' + at.toUpperCase() : ''}${w ? ' ' + w + ' W' : ''}${/calda/.test(t) ? ' luce calda' : /fredda/.test(t) ? ' luce fredda' : /natural|neutr/.test(t) ? ' luce naturale' : ''}`, um: 'pz' }; }],
    [/\bfar[oi]\b|proiettor/, t => { const w = (t.match(/(\d{2,3})\s*(?:w\b|watt)/) || [])[1]; return { desc: `Proiettore LED${w ? ' ' + w + ' W' : ''}${/sensor/.test(t) ? ' con sensore' : ''}`, um: 'pz' }; }],
    [/plafonier|pannell?i? led|farett/, t => ({ desc: /farett/.test(t) ? 'Faretto LED da incasso' : /pannell/.test(t) ? 'Pannello LED' : 'Plafoniera LED', um: 'pz' })],
    [/pressacav/, t => { const m = (t.match(/\bm\s?(12|16|20|25|32|40|50|63)\b/) || [])[1]; return { desc: `Pressacavo${m ? ' M' + m : ''} IP68`, um: 'pz' }; }],
    [/capocord|capicord/, t => { const s = (t.match(/(\d+(?:[.,]\d+)?)\s*mm2/) || [])[1]; return { desc: `Capocorda${s ? ' ' + s + ' mm²' : ''}`, um: 'pz' }; }],
    [/morsett|wago/, () => ({ desc: 'Morsetti a leva (tipo Wago)', um: 'pz' })],
    [/nastr/, () => ({ desc: 'Nastro isolante', um: 'pz' })],
    [/fascett/, () => ({ desc: 'Fascette', um: 'conf' })],
    [/tassell/, () => ({ desc: 'Tasselli', um: 'conf' })],
    [/canalin|minicanal/, () => ({ desc: 'Minicanale', um: 'm' })],
    [/citofon/, t => ({ desc: /video/.test(t) ? 'Videocitofono (kit)' : 'Citofono (kit)', um: 'pz' })],
    [/telecamer/, () => ({ desc: 'Telecamera', um: 'pz' })],
    [/aspirator/, t => { const d = (t.match(/\b(90|100|120|150)\b/) || [])[1]; return { desc: `Aspiratore${d ? ' Ø' + d : ''}${/timer/.test(t) ? ' con timer' : ''}`, um: 'pz' }; }],
    [/condizionator|climatizz|\bsplit\b/, t => { const b = (t.match(/(\d{1,2})\s?(?:000|mila)\b/) || [])[1]; return { desc: `Condizionatore${b ? ' ' + b + '.000 BTU' : ''}`, um: 'pz' }; }],
    [/crepuscolar/, () => ({ desc: 'Interruttore crepuscolare', um: 'pz' })],
    [/sensor|rilevator/, () => ({ desc: 'Sensore di movimento', um: 'pz' })],
    [/termostat/, t => ({ desc: /crono/.test(t) ? 'Cronotermostato' : 'Termostato', um: 'pz' })],
    [/emergenz/, () => ({ desc: 'Lampada di emergenza', um: 'pz' })],
    [/contattor/, () => ({ desc: 'Contattore modulare', um: 'pz' })]
  ];

  function quantita(seg, um) {
    const mt = seg.match(/(\d+(?:[.,]\d+)?)\s*(?:metri|metro|mt|m)\b/);
    if (um === 'm' && mt) return num(mt[1]);
    const rot = seg.match(/(\d+)\s*(?:rotol|matass|bobin)/);
    if (rot) return um === 'm' ? num(rot[1]) * 100 : num(rot[1]);
    const testa = seg.match(/^\s*(?:(?:e|poi|anche|mi servono|mi serve|vorrei|dammi|mi da|metti)\s+)*(\d+(?:[.,]\d+)?)\b(?!\s*(?:mm2|a\b|amp|w\b|v\b|modul|posti|[xg]\s*\d))/);
    if (testa) return num(testa[1]);
    const pz = seg.match(/(\d+)\s*(?:pezzi|pz|confezion)/);
    if (pz) return num(pz[1]);
    return um === 'm' ? null : 1;
  }

  // Divide il parlato in pezzi e riconosce materiale + quantità. Restituisce solo i materiali.
  function estrai(testo) {
    const t = prepara(testo);
    const pezzi = t.split(/[.;!?]|,(?!\d)|\b(?:e poi|poi|inoltre|anche|e|piu)\b(?=\s+(?:\d|qualche|del|della|dei|delle|degli|il|la|lo|le|gli|i|un|una)\b)/);
    const out = [];
    for (const seg of pezzi) {
      const s = (seg || '').trim(); if (!s) continue;
      const m = MATERIALI.find(([re]) => re.test(s));
      if (!m) continue;
      const { desc, um } = m[1](s);
      const q = quantita(s, um);
      out.push({ desc, qta: q ?? 0, um });
    }
    const uniti = [];
    out.forEach(x => { const u = uniti.find(y => y.desc === x.desc && y.um === x.um); if (u) u.qta += x.qta; else uniti.push({ ...x }); });
    return uniti;
  }

  /* ---------- Preventivo ---------- */
  let prev = LS.get('ab_preventivo', null) || { cliente: '', righe: [], creato: new Date().toISOString() };
  const salva = () => { LS.set('ab_preventivo', prev); disegna(); };
  function aggiungi(righe, origine) {
    for (const r of righe) {
      const u = prev.righe.find(x => n(x.desc) === n(r.desc) && x.um === r.um);
      if (u) u.qta = +((+u.qta || 0) + (+r.qta || 0)).toFixed(2);
      else prev.righe.push({ id: uid(), desc: r.desc, qta: +r.qta || 0, um: r.um || 'pz', cod: r.cod || '', prezzo: r.prezzo || '' });
    }
    salva();
    if (typeof Report !== 'undefined') Report.log('preventivo-aggiungi', { origine, righe: righe.length });
  }

  let annulla = null, tAnn;
  function snack(testo, ripristina) {
    annulla = ripristina;
    const sb = $('#snackbar'); $('span', sb).textContent = testo; $('button', sb).hidden = !ripristina; sb.hidden = false;
    clearTimeout(tAnn); tAnn = setTimeout(() => { sb.hidden = true; annulla = null; }, 6000);
  }

  /* ---------- Suggerimenti e "ho dimenticato qualcosa?" ---------- */
  function suggerimenti(completo, righe = prev.righe) {
    const R = righe.map(r => ({ ...r, d: n(r.desc) }));
    const ha = re => R.some(r => re.test(r.d));
    const conta = re => R.filter(r => re.test(r.d)).reduce((a, r) => a + (+r.qta || 0), 0);
    const s = [];
    const cavi = R.filter(r => /^cavo fs17/.test(r.d));
    if (cavi.length && !ha(/corrugat|tubo|canal/)) {
      const metri = Math.max(...cavi.map(r => +r.qta || 0));
      const S = Math.max(...cavi.map(r => num((r.d.match(/(\d+(?:[.,]\d+)?) mm/) || [])[1]) || 1.5));
      const tb = Calc.DIAM_CAVO[S] ? Calc.fascio([{ S, n: 3 }])?.tubo : null;
      s.push({ testo: `Corrugato Ø${Math.max(tb ? tb.est : 20, 20)} per i cavi: ${metri ? 'circa ' + f(Math.ceil(metri / 3), 0) + ' m (3 cavi per tubo)' : 'stessa lunghezza della linea'}`, riga: { desc: `Corrugato Ø${Math.max(tb ? tb.est : 20, 20)}`, qta: metri ? Math.ceil(metri / 3) : 0, um: 'm' } });
    }
    const frutti = conta(/^(presa|interruttore|deviatore|invertitore|pulsante)/);
    if (frutti && !ha(/scatola|cassetta stagna/)) s.push({ testo: `Scatole da incasso 503 per ${frutti} ${frutti === 1 ? 'frutto' : 'frutti'}`, riga: { desc: 'Scatola da incasso 503', qta: Math.ceil(frutti / 2), um: 'pz' } });
    if (frutti && !ha(/supporto/)) s.push({ testo: 'Supporti per i frutti (stessa serie delle placche)', riga: { desc: 'Supporto 3 moduli', qta: Math.ceil(frutti / 2), um: 'pz' } });
    if (frutti && !ha(/placca/)) s.push({ testo: 'Placche (stessa serie dei frutti)', riga: { desc: 'Placca 3 moduli', qta: Math.ceil(frutti / 2), um: 'pz' } });
    if (frutti && !ha(/copriforo/)) s.push({ testo: 'Copriforo per chiudere i moduli vuoti', riga: { desc: 'Copriforo', qta: Math.ceil(frutti / 2), um: 'pz' } });
    if (ha(/^magnetotermico 1p/) && !ha(/differenzial|salvavita/)) s.push({ testo: 'Manca il salvavita: differenziale 30 mA tipo A a monte', riga: { desc: 'Differenziale puro 2P 40 A 30 mA tipo A', qta: 1, um: 'pz' } });
    if (ha(/condizionatore|lavatrice|pompa di calore/) && !ha(/tipo f/)) s.push({ testo: 'Per condizionatore o lavatrice serve il differenziale tipo F', riga: { desc: 'Magnetotermico differenziale 1P+N 16 A curva C 30 mA tipo F', qta: 1, um: 'pz' } });
    if (ha(/striscia led/) && !ha(/alimentatore/)) s.push({ testo: `Alimentatore per ${f(conta(/striscia led/))} m di striscia (W/m × metri + 20%)`, riga: { desc: 'Alimentatore LED', qta: 1, um: 'pz' } });
    if (ha(/fg16or16/) && !ha(/pressacavo/)) s.push({ testo: 'Pressacavi per far entrare il cavo nelle cassette', riga: { desc: 'Pressacavo IP68', qta: 2, um: 'pz' } });
    if ((ha(/corrugato|tubo rigido/) || cavi.length) && !ha(/cassetta di derivazione/)) s.push({ testo: 'Cassette di derivazione per le giunzioni', riga: { desc: 'Cassetta di derivazione', qta: 1, um: 'pz' } });
    if ((ha(/cassetta di derivazione/) || cavi.length) && !ha(/morsett/)) s.push({ testo: 'Morsetti per le giunzioni', riga: { desc: 'Morsetti a leva (tipo Wago)', qta: 10, um: 'pz' } });
    if (ha(/centralino/) && !ha(/magnetotermico/)) s.push({ testo: 'Il centralino va riempito: magnetotermici luce 10 A e prese 16 A', riga: { desc: 'Magnetotermico 1P+N 16 A curva C', qta: 2, um: 'pz' } });
    if (completo) {
      if (!ha(/nastro/)) s.push({ testo: 'Nastro isolante', riga: { desc: 'Nastro isolante', qta: 1, um: 'pz' } });
      if (!ha(/fascett/) && (cavi.length || ha(/fg16/))) s.push({ testo: 'Fascette', riga: { desc: 'Fascette', qta: 1, um: 'conf' } });
      if (!ha(/tassell/) && ha(/cassetta stagna|proiettore|plafoniera|minicanale|centralino da parete/)) s.push({ testo: 'Tasselli per il fissaggio a muro', riga: { desc: 'Tasselli', qta: 1, um: 'conf' } });
      if (R.some(r => !(+r.qta))) s.push({ testo: 'Alcune righe non hanno ancora la quantità', riga: null });
    }
    return s;
  }

  function disegna() {
    const box = $('#prevLista'); if (!box) return;
    if (document.activeElement !== $('#prevCliente')) $('#prevCliente').value = prev.cliente || '';
    if (!prev.righe.length) {
      box.innerHTML = '<p class="hint">Il preventivo è vuoto. Usa <strong>Ascolto</strong>, i <strong>Kit pronti</strong> o scrivi un articolo qui sopra.</p>';
    } else {
      const tot = prev.righe.reduce((a, r) => a + (num(r.prezzo) || 0) * (+r.qta || 0), 0);
      box.innerHTML = `<div class="prev-righe">${prev.righe.map(r => `
        <div class="prev-riga" data-id="${r.id}">
          <div class="prev-desc"><div class="t">${esc(r.desc)}</div>${r.cod || r.prezzo ? `<div class="small">${r.cod ? 'cod. ' + esc(r.cod) : ''}${r.prezzo ? ' · € ' + esc(r.prezzo) : ''}</div>` : ''}</div>
          <div class="prev-qta">
            <button class="btn-q" data-meno aria-label="Meno"><span class="msr" aria-hidden="true">remove</span></button>
            <input class="q" inputmode="decimal" value="${qtaTxt(r.qta)}" aria-label="Quantità">
            <span class="um">${esc(r.um)}</span>
            <button class="btn-q" data-piu aria-label="Più"><span class="msr" aria-hidden="true">add</span></button>
            <button class="btn-q del" data-del aria-label="Elimina"><span class="msr" aria-hidden="true">delete</span></button>
          </div>
        </div>`).join('')}</div>${tot ? `<p class="prev-tot">Totale indicativo: <strong>€ ${f(tot, 2)}</strong></p>` : ''}`;
    }
    const sg = suggerimenti(false);
    const ps = $('#prevSugg');
    ps.innerHTML = sg.length ? `<h2 class="sezione">Suggerimenti</h2>${sg.map((x, i) => `<div class="sugg"><span>${esc(x.testo)}</span>${x.riga ? `<button class="chip-btn" data-sugg-i="${i}">Aggiungi</button>` : ''}</div>`).join('')}` : '';
    ps._sg = sg;
    const nb = $('[data-tab="preventivo"] .badge'); if (nb) { nb.textContent = prev.righe.length || ''; nb.hidden = !prev.righe.length; }
  }

  function testoPreventivo() {
    const d = new Date().toLocaleDateString('it-IT');
    return `Preventivo materiale — ${d}${prev.cliente ? '\nCliente: ' + prev.cliente : ''}\n\n` + prev.righe.map(r => `• ${r.desc} — ${qtaTxt(r.qta)} ${r.um}${r.cod ? ' (cod. ' + r.cod + ')' : ''}`).join('\n') + '\n\nQuantità e prezzi da confermare al banco.';
  }
  function stampa() {
    const d = new Date().toLocaleDateString('it-IT');
    const tot = prev.righe.reduce((a, r) => a + (num(r.prezzo) || 0) * (+r.qta || 0), 0);
    $('#stampa').innerHTML = `<div class="st-testa"><img src="icon.svg" alt=""><div><div class="st-tit">Preventivo materiale elettrico</div><div>Data ${d}${prev.cliente ? ' · Cliente: ' + esc(prev.cliente) : ''}</div></div></div>
      <table class="st-tab"><thead><tr><th>#</th><th>Articolo</th><th>Codice</th><th>Q.tà</th><th>U.m.</th>${tot ? '<th>Prezzo</th>' : ''}</tr></thead><tbody>${prev.righe.map((r, i) => `<tr><td>${i + 1}</td><td>${esc(r.desc)}</td><td>${esc(r.cod || '')}</td><td>${qtaTxt(r.qta)}</td><td>${esc(r.um)}</td>${tot ? `<td>${r.prezzo ? '€ ' + esc(r.prezzo) : ''}</td>` : ''}</tr>`).join('')}</tbody></table>
      ${tot ? `<p class="st-tot">Totale indicativo € ${f(tot, 2)}</p>` : ''}<p class="st-nota">Quantità e prezzi indicativi, da confermare al banco.</p>`;
    Report.log('preventivo-stampa', { righe: prev.righe.length });
    window.print();
  }

  /* ---------- Kit pronti ---------- */
  // c = conduttori nel tubo: metri di cavo = distanza × conduttori
  const KIT = {
    luce1: { nome: 'Punto luce da 1 punto (interruttore)', S: 1.5, c: 4, righe: [['Scatola da incasso 503', 1], ['Supporto 3 moduli', 1], ['Interruttore 1P 16AX', 1], ['Copriforo', 2], ['Placca 3 moduli', 1]] },
    luce2: { nome: 'Punto luce da 2 punti (deviatori)', S: 1.5, c: 5, righe: [['Scatola da incasso 503', 2], ['Supporto 3 moduli', 2], ['Deviatore 1P 16AX', 2], ['Copriforo', 4], ['Placca 3 moduli', 2]] },
    luce3: { nome: 'Punto luce da 3 punti (deviatori + invertitore)', S: 1.5, c: 5, righe: [['Scatola da incasso 503', 3], ['Supporto 3 moduli', 3], ['Deviatore 1P 16AX', 2], ['Invertitore 1P 16AX', 1], ['Copriforo', 6], ['Placca 3 moduli', 3]] },
    pulsanti: { nome: 'Luce con pulsanti e relè passo-passo', S: 1.5, c: 3, righe: [['Relè passo-passo', 1], ['Pulsante 1P NA', 3], ['Scatola da incasso 503', 3], ['Supporto 3 moduli', 3], ['Copriforo', 6], ['Placca 3 moduli', 3]] },
    presa: { nome: 'Presa bipasso 10/16 A', S: 2.5, c: 3, righe: [['Scatola da incasso 503', 1], ['Supporto 3 moduli', 1], ['Presa bipasso 10/16 A', 1], ['Copriforo', 2], ['Placca 3 moduli', 1]] },
    presaDoppia: { nome: 'Doppia presa (universale + bipasso)', S: 2.5, c: 3, righe: [['Scatola da incasso 503', 1], ['Supporto 3 moduli', 1], ['Presa universale (Schuko + bipasso)', 1], ['Presa bipasso 10/16 A', 1], ['Placca 3 moduli', 1]] },
    presaUsb: { nome: 'Presa con caricatore USB', S: 2.5, c: 3, righe: [['Scatola da incasso 503', 1], ['Supporto 3 moduli', 1], ['Presa bipasso 10/16 A', 1], ['Presa USB', 1], ['Placca 3 moduli', 1]] },
    tv: { nome: 'Punto TV e dati', S: 0, c: 0, righe: [['Scatola da incasso 503', 1], ['Supporto 3 moduli', 1], ['Presa TV', 1], ['Presa dati RJ45', 1], ['Copriforo', 1], ['Placca 3 moduli', 1], ['Cavo coassiale TV', 0, 'm'], ['Cavo dati Cat.6', 0, 'm'], ['Corrugato Ø25', 0, 'm']] },
    quadretto: { nome: 'Quadretto appartamento (2 linee)', S: 0, c: 0, righe: [['Centralino da incasso 12 moduli', 1], ['Interruttore generale 2P 40 A', 1], ['Magnetotermico differenziale 1P+N 10 A curva C 30 mA tipo A', 1], ['Magnetotermico differenziale 1P+N 16 A curva C 30 mA tipo A', 1], ['Pettine di collegamento', 1]] },
    forno: { nome: 'Linea forno o piano a induzione', S: 6, c: 3, righe: [['Magnetotermico 1P+N 32 A curva C', 1], ['Differenziale puro 2P 40 A 30 mA tipo A', 1], ['Interruttore bipolare 32 A (sezionatore)', 1], ['Scatola da incasso 503', 1], ['Placca 3 moduli', 1]] },
    clima: { nome: 'Linea condizionatore', S: 2.5, c: 3, righe: [['Magnetotermico differenziale 1P+N 16 A curva C 30 mA tipo F', 1], ['Interruttore bipolare 16AX', 1], ['Scatola da incasso 503', 1], ['Supporto 3 moduli', 1], ['Copriforo', 2], ['Placca 3 moduli', 1]] },
    esterno: { nome: 'Luce esterna con sensore', S: 1.5, c: 3, righe: [['Proiettore LED con sensore', 1], ['Cassetta stagna da parete', 1], ['Pressacavo M20 IP68', 2], ['Morsetti a leva (tipo Wago)', 4], ['Tasselli', 1, 'conf']] }
  };
  function kitRighe(id, punti, dist, serie) {
    const k = KIT[id]; if (!k) return [];
    const frutto = d => /^(presa|interruttore 1p|interruttore bipolare 16|deviatore|invertitore|pulsante|placca|supporto|copriforo)/i.test(d);
    const out = k.righe.map(([desc, q, um]) => ({ desc: desc + (serie && frutto(desc) ? ` (${serie})` : ''), qta: (q || 0) * punti, um: um || 'pz' }));
    if (k.S && dist) {
      out.push({ desc: `Cavo FS17 ${qtaTxt(k.S)} mm² (colori misti)`, qta: Math.ceil(dist * punti * k.c / 5) * 5, um: 'm' });
      const tb = Calc.fascio([{ S: k.S, n: k.c }])?.tubo;
      out.push({ desc: `Corrugato Ø${Math.max(tb ? tb.est : 20, 20)}`, qta: Math.ceil(dist * punti), um: 'm' });
      out.push({ desc: 'Cassetta di derivazione', qta: Math.max(1, Math.ceil(punti / 3)), um: 'pz' });
      out.push({ desc: 'Morsetti a leva (tipo Wago)', qta: punti * 4, um: 'pz' });
    }
    if (id === 'tv' && dist) out.forEach(r => { if (r.um === 'm') r.qta = Math.ceil(dist * punti); });
    return out;
  }

  /* ---------- Riconoscimento vocale ---------- */
  const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
  let rec = null, ascoltando = false, trovati = [], trascrittoTemp = '';
  function avviaAscolto() {
    if (!SR) { $('#ascoltoBox').hidden = false; $('#ascoltoStato').textContent = 'Questo browser non supporta il riconoscimento vocale: usa Chrome.'; return; }
    trovati = []; trascrittoTemp = '';
    rec = new SR(); rec.lang = 'it-IT'; rec.continuous = true; rec.interimResults = false;
    rec.onresult = e => {
      for (let i = e.resultIndex; i < e.results.length; i++) if (e.results[i].isFinal) {
        const frase = e.results[i][0].transcript;
        trascrittoTemp += ' ' + frase; // solo in memoria, cancellato allo stop
        estrai(frase).forEach(x => { const u = trovati.find(y => y.desc === x.desc && y.um === x.um); if (u) u.qta += x.qta; else trovati.push({ ...x, ok: true }); });
      }
      disegnaAscolto();
    };
    rec.onerror = e => { if (e.error === 'not-allowed' || e.error === 'service-not-allowed') { ascoltando = false; aggiornaBtnAscolto(); $('#ascoltoStato').textContent = 'Microfono non consentito: abilitalo per questo sito nelle impostazioni di Chrome.'; } };
    rec.onend = () => { if (ascoltando) { try { rec.start(); } catch {} } };
    ascoltando = true;
    try { rec.start(); } catch {}
    $('#ascoltoBox').hidden = false; aggiornaBtnAscolto(); disegnaAscolto();
    Report.log('ascolto-avvio', {});
  }
  async function fermaAscolto() {
    ascoltando = false; try { rec && rec.stop(); } catch {}
    aggiornaBtnAscolto();
    const cfg = gemini();
    if (cfg.key && trascrittoTemp.trim().length > 10) {
      $('#ascoltoStato').textContent = 'Riordino l\'elenco…';
      try {
        const r = await chiediGemini(`Sei un banconista di materiale elettrico. Dal parlato del cliente estrai SOLO i materiali elettrici richiesti, con quantità e unità di misura (pz, m, conf). Ignora tutto il resto. Rispondi solo con JSON: [{"desc":"descrizione tecnica breve in italiano","qta":numero,"um":"pz|m|conf"}].\nParlato: """${trascrittoTemp}"""`, []);
        const lista = JSON.parse(r.match(/\[[\s\S]*\]/)[0]);
        if (Array.isArray(lista) && lista.length) trovati = lista.filter(x => x && x.desc).map(x => ({ desc: String(x.desc), qta: +x.qta || 0, um: ['pz', 'm', 'conf'].includes(x.um) ? x.um : 'pz', ok: true }));
      } catch (e) { Report.log('ascolto-gemini-errore', { msg: String(e.message || e) }); }
    }
    trascrittoTemp = '';
    $('#ascoltoStato').textContent = trovati.length ? 'Controlla l\'elenco e aggiungilo al preventivo.' : 'Non ho riconosciuto materiali. Riprova parlando vicino al telefono.';
    disegnaAscolto(true);
    Report.log('ascolto-fine', { materiali: trovati.length });
  }
  function aggiornaBtnAscolto() {
    const b = $('#btnAscolto'); if (!b) return;
    b.classList.toggle('on', ascoltando);
    $('.msr', b).textContent = ascoltando ? 'stop_circle' : 'mic';
    $('.lbl', b).textContent = ascoltando ? 'Stop' : 'Ascolto';
    if (ascoltando) $('#ascoltoStato').textContent = 'Sto ascoltando… tengo solo i materiali: niente audio e niente frasi salvate.';
  }
  function disegnaAscolto(fine) {
    $('#ascoltoLista').innerHTML = trovati.length ? trovati.map((x, i) => `<label class="asc-riga"><input type="checkbox" data-asc="${i}" ${x.ok ? 'checked' : ''}><span>${esc(x.desc)}</span><strong>${x.qta ? qtaTxt(x.qta) + ' ' + esc(x.um) : '? ' + esc(x.um)}</strong></label>`).join('') : '<p class="hint">Ancora nessun materiale.</p>';
    $('#ascoltoAggiungi').hidden = !(fine && trovati.length);
  }
  function voceUnaVolta(cb) {
    const b = $('#btnVoce');
    if (!SR) { b.title = 'Riconoscimento vocale non disponibile in questo browser'; return; }
    const r = new SR(); r.lang = 'it-IT'; r.interimResults = false; r.maxAlternatives = 1;
    b.classList.add('on');
    r.onresult = e => cb(e.results[0][0].transcript);
    r.onend = () => b.classList.remove('on');
    r.onerror = () => b.classList.remove('on');
    try { r.start(); } catch { b.classList.remove('on'); }
  }

  /* ---------- Gemini: foto del pezzo ---------- */
  const gemini = () => LS.get('ab_gemini', null) || { key: '', modello: 'gemini-flash-latest' };
  async function chiediGemini(testo, immagini) {
    const cfg = gemini();
    if (!cfg.key) throw new Error('Chiave Gemini mancante (Info → Foto del pezzo)');
    const parts = [{ text: testo }, ...immagini.map(b64 => ({ inline_data: { mime_type: 'image/jpeg', data: b64 } }))];
    const r = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(cfg.modello || 'gemini-flash-latest')}:generateContent?key=${encodeURIComponent(cfg.key)}`, {
      method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ contents: [{ parts }], generationConfig: { temperature: 0.2 } })
    });
    if (!r.ok) throw new Error('Gemini ha risposto ' + r.status + (r.status === 404 ? ' (modello non trovato: cambialo in Info)' : r.status === 400 || r.status === 403 ? ' (chiave non valida?)' : ''));
    const j = await r.json();
    return j.candidates?.[0]?.content?.parts?.map(p => p.text || '').join('') || '';
  }
  let foto = [];
  function riduci(file) {
    return new Promise((ok, ko) => {
      const img = new Image(); const url = URL.createObjectURL(file);
      img.onload = () => {
        const s = Math.min(1, 1024 / Math.max(img.width, img.height));
        const c = document.createElement('canvas'); c.width = Math.round(img.width * s); c.height = Math.round(img.height * s);
        c.getContext('2d').drawImage(img, 0, 0, c.width, c.height); URL.revokeObjectURL(url);
        ok(c.toDataURL('image/jpeg', 0.82));
      };
      img.onerror = ko; img.src = url;
    });
  }
  function disegnaFoto() {
    $('#fotoThumbs').innerHTML = foto.map((d, i) => `<div class="thumb"><img src="${d}" alt="Foto ${i + 1}"><button data-foto-del="${i}" aria-label="Togli foto"><span class="msr" aria-hidden="true">close</span></button></div>`).join('');
    $('#btnRiconosci').disabled = !foto.length;
    $('#fotoConta').textContent = foto.length ? `${foto.length} di 4 foto. Meglio se diverse: etichetta, fronte, retro, attacchi.` : 'Aggiungi una o più foto dello stesso pezzo da angolazioni diverse.';
  }
  async function riconosci() {
    const out = $('#fotoRisultato');
    if (!gemini().key) { out.innerHTML = '<p class="hint">Per riconoscere le foto serve la chiave Gemini: inseriscila in <strong>Info → Foto del pezzo</strong>.</p>'; return; }
    out.innerHTML = '<p class="hint">Riconosco il pezzo…</p>';
    try {
      const testo = await chiediGemini('Sei un esperto banconista di materiale elettrico in Italia. Le foto mostrano lo stesso articolo da angolazioni diverse. Identificalo. Rispondi solo con JSON: {"nome":"cosa è, in parole semplici","marca":"","serie":"","codice":"codice articolo se leggibile","caratteristiche":["dati tecnici letti o dedotti"],"ricerca":"testo breve da cercare nel catalogo","equivalenti":"marche o serie equivalenti, o ricambio consigliato","dubbi":"cosa non è certo"}', foto.map(d => d.split(',')[1]));
      const j = JSON.parse(testo.match(/\{[\s\S]*\}/)[0]);
      out.innerHTML = `<div class="risposta ok"><span class="msr" aria-hidden="true">auto_awesome</span><div class="risp"><strong>${esc(j.nome || 'Articolo')}</strong>
        <div class="risp-corpo"><p>${[j.marca, j.serie].filter(Boolean).map(esc).join(' · ')}${j.codice ? ` · cod. <strong>${esc(j.codice)}</strong>` : ''}</p>
        ${(j.caratteristiche || []).length ? `<ul class="ref">${j.caratteristiche.map(c => `<li>${esc(c)}</li>`).join('')}</ul>` : ''}
        ${j.equivalenti ? `<p><strong>Equivalenti:</strong> ${esc(j.equivalenti)}</p>` : ''}${j.dubbi ? `<p class="small">Da verificare: ${esc(j.dubbi)}</p>` : ''}</div>
        <div class="risp-azioni"><button class="chip-btn" data-foto-cerca="${esc(j.ricerca || j.codice || j.nome || '')}">Cerca</button><button class="chip-btn" data-foto-add="${esc([j.nome, j.marca, j.codice].filter(Boolean).join(' '))}">Aggiungi al preventivo</button></div></div></div>`;
      Report.log('foto-riconosciuta', { foto: foto.length });
    } catch (e) {
      out.innerHTML = `<p class="hint">Non sono riuscito a riconoscerlo: ${esc(e.message || e)}</p>`;
      Report.log('foto-errore', { msg: String(e.message || e) });
    }
  }

  /* ---------- Storico e preferiti ---------- */
  function registraRicerca(q) {
    q = String(q || '').trim(); if (q.length < 3) return;
    const st = LS.get('ab_storico', {});
    const k = q.toLowerCase();
    st[k] = { q, n: (st[k]?.n || 0) + 1, t: Date.now() };
    LS.set('ab_storico', Object.fromEntries(Object.entries(st).sort((a, b) => b[1].t - a[1].t).slice(0, 200)));
  }
  function homeHtml() {
    const st = Object.values(LS.get('ab_storico', {}));
    const pref = LS.get('ab_preferiti', []);
    const chip = (q, extra = '') => `<button class="chip-btn" data-sugg="${esc(q)}">${extra}${esc(q)}</button>`;
    const recenti = [...st].sort((a, b) => b.t - a.t).slice(0, 6);
    const frequenti = [...st].sort((a, b) => b.n - a.n).filter(x => x.n > 1).slice(0, 6);
    return (pref.length ? `<h2 class="sezione">Preferiti</h2><div class="chips">${pref.map(q => chip(q, '★ ')).join('')}</div>` : '') +
      (recenti.length ? `<h2 class="sezione">Ultime ricerche</h2><div class="chips">${recenti.map(x => chip(x.q)).join('')}</div>` : '') +
      (frequenti.length ? `<h2 class="sezione">Le più chieste</h2><div class="chips">${frequenti.map(x => chip(x.q, `${x.n}× `)).join('')}</div>` : '');
  }
  function prefBtn(q) {
    const on = LS.get('ab_preferiti', []).includes(q);
    return `<button class="chip-btn${on ? ' on' : ''}" data-pref="${esc(q)}"><span class="msr" aria-hidden="true">star</span> ${on ? 'Nei preferiti' : 'Salva nei preferiti'}</button>`;
  }
  const prefHtml = q => `<div class="pref-row">${prefBtn(q.trim())}</div>`;

  /* ---------- Modalità banco ---------- */
  function modalitaBanco(on) {
    document.documentElement.classList.toggle('banco', on);
    LS.set('ab_banco', on);
    const t = $('#togBanco'); if (t) t.checked = on;
    const b = $('#btnBanco'); if (b) { b.classList.toggle('on', on); b.setAttribute('aria-pressed', on); }
  }

  /* ---------- Avvio e collegamenti ---------- */
  function init() {
    modalitaBanco(LS.get('ab_banco', false));
    $('#prevCliente').addEventListener('input', e => { prev.cliente = e.target.value; LS.set('ab_preventivo', prev); });
    $('#formRiga').addEventListener('submit', e => {
      e.preventDefault();
      const desc = e.target.desc.value.trim(); if (!desc) return;
      const qta = num(e.target.qta.value) || 0;
      const ric = estrai(desc)[0];
      aggiungi([{ desc: ric ? ric.desc : desc, qta: qta || ric?.qta || 1, um: e.target.um.value || ric?.um || 'pz' }], 'manuale');
      e.target.reset(); e.target.um.value = ''; e.target.desc.focus();
    });
    $('#prevLista').addEventListener('click', e => {
      const riga = e.target.closest('.prev-riga'); if (!riga) return;
      const r = prev.righe.find(x => x.id === riga.dataset.id); if (!r) return;
      const passo = r.um === 'm' ? 5 : 1;
      if (e.target.closest('[data-piu]')) { r.qta = +((+r.qta || 0) + passo).toFixed(2); salva(); }
      else if (e.target.closest('[data-meno]')) { r.qta = Math.max(0, +((+r.qta || 0) - passo).toFixed(2)); salva(); }
      else if (e.target.closest('[data-del]')) {
        const i = prev.righe.indexOf(r); prev.righe.splice(i, 1); salva();
        snack(`Tolto: ${r.desc}`, () => { prev.righe.splice(i, 0, r); salva(); });
      }
    });
    $('#prevLista').addEventListener('change', e => {
      if (!e.target.classList.contains('q')) return;
      const r = prev.righe.find(x => x.id === e.target.closest('.prev-riga').dataset.id);
      if (r) { r.qta = Math.max(0, num(e.target.value) || 0); salva(); }
    });
    $('#prevSugg').addEventListener('click', e => {
      const b = e.target.closest('[data-sugg-i]'); if (!b) return;
      const s = $('#prevSugg')._sg[+b.dataset.suggI]; if (s?.riga) aggiungi([s.riga], 'suggerimento');
    });
    $('#btnDimenticato').addEventListener('click', () => {
      const sg = suggerimenti(true), box = $('#dimenticato');
      box.hidden = false;
      box.innerHTML = sg.length ? `<h2 class="sezione">Controlla prima di chiudere</h2>${sg.map((x, i) => `<div class="sugg"><span>${esc(x.testo)}</span>${x.riga ? `<button class="chip-btn" data-dim-i="${i}">Aggiungi</button>` : ''}</div>`).join('')}` : '<div class="risposta ok"><span class="msr" aria-hidden="true">check_circle</span><span>Sembra tutto a posto.</span></div>';
      box._sg = sg;
      Report.log('dimenticato', { voci: sg.length });
    });
    $('#dimenticato').addEventListener('click', e => { const b = e.target.closest('[data-dim-i]'); if (!b) return; const s = $('#dimenticato')._sg[+b.dataset.dimI]; if (s?.riga) { aggiungi([s.riga], 'dimenticato'); b.disabled = true; b.textContent = 'Aggiunto'; } });
    $('#btnCondividi').addEventListener('click', async () => {
      const t = testoPreventivo();
      try { if (navigator.share) await navigator.share({ title: 'Preventivo materiale', text: t }); else { await navigator.clipboard.writeText(t); snack('Preventivo copiato: incollalo dove vuoi', null); } } catch {}
      Report.log('preventivo-condividi', { righe: prev.righe.length });
    });
    $('#btnStampa').addEventListener('click', stampa);
    $('#btnSvuota').addEventListener('click', () => {
      if (!prev.righe.length) return;
      const vecchio = JSON.parse(JSON.stringify(prev));
      prev = { cliente: '', righe: [], creato: new Date().toISOString() }; salva();
      snack('Preventivo svuotato', () => { prev = vecchio; salva(); });
    });
    $('#snackbar button').addEventListener('click', () => { if (annulla) annulla(); annulla = null; $('#snackbar').hidden = true; });
    // Pannelli: uno alla volta
    const apri = id => ['ascoltoBox', 'fotoBox', 'kitBox'].forEach(x => { $('#' + x).hidden = x === id ? !$('#' + x).hidden : true; });
    $('#btnAscolto').addEventListener('click', () => { if (ascoltando) fermaAscolto(); else { ['fotoBox', 'kitBox'].forEach(x => { $('#' + x).hidden = true; }); avviaAscolto(); } });
    $('#btnFoto').addEventListener('click', () => apri('fotoBox'));
    $('#btnKit').addEventListener('click', () => apri('kitBox'));
    $('#ascoltoLista').addEventListener('change', e => { const i = e.target.dataset.asc; if (i != null) trovati[+i].ok = e.target.checked; });
    $('#ascoltoAggiungi').addEventListener('click', () => { const sel = trovati.filter(x => x.ok); aggiungi(sel, 'ascolto'); trovati = []; disegnaAscolto(); $('#ascoltoBox').hidden = true; snack(`${sel.length} materiali aggiunti al preventivo`, null); });
    // Kit
    const sk = $('#kitSel'); Object.entries(KIT).forEach(([k, v]) => sk.add(new Option(v.nome, k)));
    const ss = $('#kitSerie'); ss.add(new Option('Serie qualsiasi', ''));
    (REPARTI.find(r => r.id === 'civile')?.marche || []).forEach(m => String(m.modelli).replace(/\(.*?\)/g, '').split(/[,;:]/).map(x => x.trim()).filter(x => x && x.length < 26 && !/placch|supporto/i.test(x)).slice(0, 6).forEach(mod => ss.add(new Option(`${m.marca} ${mod}`, `${m.marca} ${mod}`))));
    const anteprima = () => { const r = kitRighe(sk.value, Math.max(1, +$('#kitPunti').value || 1), num($('#kitDist').value) || 0, ss.value); $('#kitAnteprima').innerHTML = `<table class="tab-risp">${r.map(x => `<tr><td>${esc(x.desc)}</td><td><strong>${x.qta ? qtaTxt(x.qta) : '?'} ${esc(x.um)}</strong></td></tr>`).join('')}</table>`; return r; };
    ['change', 'input'].forEach(ev => [sk, ss, $('#kitPunti'), $('#kitDist')].forEach(el => el.addEventListener(ev, anteprima)));
    anteprima();
    $('#kitAggiungi').addEventListener('click', () => { aggiungi(anteprima(), 'kit:' + sk.value); $('#kitBox').hidden = true; snack('Kit aggiunto al preventivo', null); });
    // Foto
    $('#fotoInput').addEventListener('change', async e => { for (const file of [...e.target.files].slice(0, 4 - foto.length)) { try { foto.push(await riduci(file)); } catch {} } e.target.value = ''; disegnaFoto(); });
    $('#fotoThumbs').addEventListener('click', e => { const b = e.target.closest('[data-foto-del]'); if (b) { foto.splice(+b.dataset.fotoDel, 1); disegnaFoto(); } });
    $('#btnRiconosci').addEventListener('click', riconosci);
    $('#fotoRisultato').addEventListener('click', e => {
      const c = e.target.closest('[data-foto-cerca]'); if (c) { $('#q').value = c.dataset.fotoCerca; apriTab('cerca'); cerca(c.dataset.fotoCerca); return; }
      const a = e.target.closest('[data-foto-add]'); if (a) { aggiungi([{ desc: a.dataset.fotoAdd, qta: 1, um: 'pz' }], 'foto'); snack('Aggiunto al preventivo', null); }
    });
    disegnaFoto();
    // Impostazioni (Info)
    const g = gemini(); $('#gemKey').value = g.key; $('#gemModello').value = g.modello;
    $('#formGemini').addEventListener('submit', e => { e.preventDefault(); LS.set('ab_gemini', { key: $('#gemKey').value.trim(), modello: $('#gemModello').value.trim() || 'gemini-flash-latest' }); $('#gemMsg').textContent = 'Salvato solo su questo dispositivo.'; Report.log('gemini-config', { chiave: !!$('#gemKey').value.trim() }); });
    $('#togBanco').addEventListener('change', e => modalitaBanco(e.target.checked));
    $('#btnBanco').addEventListener('click', () => modalitaBanco(!document.documentElement.classList.contains('banco')));
    // Ricerca vocale
    $('#btnVoce').addEventListener('click', () => voceUnaVolta(t => { $('#q').value = t; cerca(t); Report.log('voce-ricerca', { lunghezza: t.length }); }));
    // Preferiti
    $('#results').addEventListener('click', e => {
      const b = e.target.closest('[data-pref]'); if (!b) return;
      const q = b.dataset.pref; let pref = LS.get('ab_preferiti', []);
      pref = pref.includes(q) ? pref.filter(x => x !== q) : [q, ...pref].slice(0, 12);
      LS.set('ab_preferiti', pref); b.outerHTML = prefBtn(q);
    });
    // Aggiungi al preventivo dagli articoli del catalogo
    $('#results').addEventListener('click', e => {
      const b = e.target.closest('[data-add-prev]'); if (!b) return;
      aggiungi([{ desc: b.dataset.addPrev, cod: b.dataset.cod || '', prezzo: b.dataset.prezzo || '', qta: 1, um: 'pz' }], 'catalogo');
      snack('Aggiunto al preventivo', null);
    });
    disegna();
  }

  return { init, estrai, aggiungi, kitRighe, suggerimenti, registraRicerca, homeHtml, prefHtml, KIT, get preventivo() { return prev; } };
})();

Banco.init();
if (!$('#q').value) cerca('');
