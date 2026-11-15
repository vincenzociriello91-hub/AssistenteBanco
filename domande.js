/* Assistente Banco — risponde alle domande scritte in parole normali, senza internet.
   Esempi: "corrugato per cavo 50 mm", "che cavo per forno 3 kW a 20 metri",
   "condizionatore per 30 mq", "quanti ampere sono 3 kW", "cos'è un deviatore". */
'use strict';

const Domande = (() => {
  const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const n = s => String(s || '').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[’`]/g, "'");
  const f = (x, d = 1) => Number(x).toLocaleString('it-IT', { maximumFractionDigits: d });
  const num = s => parseFloat(String(s).replace(',', '.'));
  const NUM = '(\\d+(?:[.,]\\d+)?)';

  // Legge numeri e unità dalla frase
  function leggi(q) {
    const t = n(q).replace(/mm\s*quadr\w*/g, 'mm2').replace(/metri\s*quadr\w*/g, 'mq').replace(/²/g, '2');
    const m = re => { const r = t.match(new RegExp(re)); return r ? num(r[1]) : null; };
    const d = { t };
    // "4x6", "3g2,5" = numero di conduttori x sezione
    const xs = t.match(/\b(\d{1,2})\s*[xg]\s*(\d+(?:[.,]\d+)?)\b/);
    if (xs) { d.nCavi = +xs[1]; d.S = num(xs[2]); }
    d.S ??= m(NUM + '\\s*(?:mm2|mmq)\\b');
    d.S ??= m('sezione\\s*(?:da\\s*|di\\s*)?' + NUM);
    d.Dcavo = m('(?:diametro|diam\\.?|ø)\\s*(?:esterno\\s*)?(?:da\\s*|di\\s*)?' + NUM) ?? m(NUM + '\\s*mm\\s*di\\s*diametro');
    d.vite = m('\\b(?:m|vite\\s*m?|foro\\s*(?:da\\s*)?m?)\\s?(\\d{1,2})\\b(?!\\s*(?:mm2|mmq|x|g))');
    // "cavo/cavi/filo (da) 50 mm" = sezione; "corrugato/tubo (da) 25 (mm)" = diametro del tubo
    const vicino = (parole, dopo) => { const r = t.match(new RegExp('\\b(?:' + parole + ')\\w*\\s+(?:da\\s+|di\\s+|per\\s+)?' + NUM + dopo)); return r ? num(r[1]) : null; };
    const sCavo = vicino('cav|fil|condutt', '(?:\\s*mm)?\\b(?!\\s*(?:kw|w\\b|a\\b|metri|m\\b|mq))');
    if (d.S == null && sCavo != null && Calc.SEZIONI.includes(sCavo)) d.S = sCavo;
    d.Dtubo = vicino('corrugat|tub|guain|rk|cavidott', '(?:\\s*mm)?\\b');
    if (d.Dtubo != null && d.Dtubo === d.S) d.Dtubo = null;
    d.nCavi ??= m('\\b(\\d{1,2})\\s*(?:cavi|fili|conduttori|cavetti)\\b');
    const w = m(NUM + '\\s*(?:w|watt)\\b');
    d.kW = m(NUM + '\\s*kw\\b') ?? (w != null ? w / 1000 : null);
    d.A = m(NUM + '\\s*(?:a|amp|ampere|amper)\\b');
    d.mq = m(NUM + '\\s*(?:mq|m2)\\b');
    d.L = m(NUM + '\\s*(?:m|mt|mtr|metri|metro)\\b');
    d.Wm = m(NUM + '\\s*w\\s*(?:\\/|al|a|per)\\s*(?:m|metro)\\b');
    if (/unipolar/.test(t) && !d.nCavi) d.unip = true;
    d.tri = /trifase|400\s*v|380\s*v|\btri\b/.test(t);
    return d;
  }

  const CARICHI = [
    [/induzion|piano cottura|fornell/, 'resistivo', 7.4, 'piano a induzione'],
    [/forno/, 'resistivo', 3, 'forno'],
    [/lavatric|lavastovigl|asciugatric/, 'inverter', 2.2, 'lavatrice'],
    [/condizionator|climatizz|split/, 'inverter', 1.5, 'condizionatore'],
    [/pompa di calore/, 'inverter', 4, 'pompa di calore'],
    [/scaldabagn|boiler/, 'resistivo', 1.5, 'scaldabagno'],
    [/\bauto\b|wallbox|colonnin|ricarica/, 'wallbox', 7.4, 'auto elettrica'],
    [/\bluc|lampad|illumin/, 'luce', 1, 'luci'],
    [/pres[ae]\b/, 'prese', 3, 'prese']
  ];
  const carico = t => CARICHI.find(c => c[0].test(t));

  const box = (titolo, corpo, azioni = '') =>
    `<div class="risposta ok"><span class="msr" aria-hidden="true">forum</span><div class="risp"><strong>${titolo}</strong><div class="risp-corpo">${corpo}</div>${azioni ? `<div class="risp-azioni">${azioni}</div>` : ''}</div></div>`;
  const vai = (tool, testo) => `<button class="chip-btn" data-goto-tool="${tool}">${esc(testo)}</button>`;
  const vaiRep = (id, testo) => `<button class="chip-btn" data-goto-rep="${id}">${esc(testo)}</button>`;
  const tubo = (S, nC) => Calc.fascio([{ S, n: nC }])?.tubo;

  const TIPO_TUBO = '<p class="small">Nel muro: corrugato (es. 3321). A pavimento o nel massetto: corrugato pesante. Interrato: cavidotto doppia parete. A vista: tubo rigido RK.</p>';

  function rTubo(d) {
    const az = vai('tubo', 'Apri calcolo tubo') + vaiRep('tubi', 'Reparto corrugati');
    if (d.S == null) {
      if (d.Dtubo) return box(`Corrugato da ${f(d.Dtubo, 0)} mm`, '<p>Dimmi anche la sezione dei cavi, per esempio: <em>corrugato 25 quanti cavi da 2,5</em>.</p>' + TIPO_TUBO, az);
      return box('Che corrugato serve?', '<p>Scrivi la sezione e quanti cavi, per esempio: <em>corrugato per 3 cavi da 2,5</em> o <em>tubo per 5x6</em>.</p>' + TIPO_TUBO, az);
    }
    if ((/fg16|multipolar|\b\d{1,2}\s*g\s*\d/.test(d.t)) && d.nCavi) {
      const c = Schede.diametroCavo(d.nCavi, d.S);
      if (c) { const tb = Calc.TUBI.find(x => x.int >= 1.3 * c.d[1]);
        return box(`Corrugato per un cavo ${c.sigla.replace(/\./g, ',')}`, `<p>Cavo Ø ${f(c.d[0])}–${f(c.d[1])} mm: serve un corrugato da <strong>${tb ? 'Ø ' + tb.est + ' mm' : 'oltre Ø 63'}</strong> (diametro interno almeno 1,3 volte il cavo).</p>${TIPO_TUBO}`, vai('tubo', 'Apri calcolo tubo') + vaiRep('tubi', 'Reparto corrugati')); }
    }
    if (!Calc.DIAM_CAVO[d.S]) return box(`Cavo da ${f(d.S)} mm²`, '<p>Per questa sezione misura il diametro esterno del cavo: il tubo deve avere un diametro interno almeno 1,3 volte più grande.</p>', vaiRep('tubi', 'Reparto corrugati'));
    if (d.Dtubo && !d.nCavi) {
      let max = 0;
      for (let k = 1; k <= 20; k++) { const tb = tubo(d.S, k); if (tb && tb.est <= d.Dtubo) max = k; else break; }
      return box(`Corrugato Ø ${f(d.Dtubo, 0)} con cavi da ${f(d.S)} mm²`, max ? `<p>Ci stanno al massimo <strong>${max} cavi</strong> unipolari da ${f(d.S)} mm².</p>` : `<p>Neanche un cavo da ${f(d.S)} mm² ci sta comodo: serve un tubo più grande.</p>`, az);
    }
    if (d.nCavi) {
      const tb = tubo(d.S, d.nCavi);
      return box(`${d.nCavi} cavi da ${f(d.S)} mm²`, tb ? `<p>Serve un corrugato da <strong>Ø ${tb.est} mm</strong>.</p>${TIPO_TUBO}` : '<p>Oltre Ø 63: meglio dividere su più tubi o usare un canale.</p>', az);
    }
    const righe = [[1, '1 cavo'], [3, '3 cavi (fase, neutro, terra)'], [4, '4 cavi'], [5, '5 cavi (trifase con neutro e terra)']]
      .map(([k, l]) => { const tb = tubo(d.S, k); return `<tr><td>${l}</td><td><strong>${tb ? 'Ø ' + tb.est + ' mm' : 'oltre Ø 63'}</strong></td></tr>`; }).join('');
    return box(`Corrugato per cavi da ${f(d.S)} mm²`, `<p>Dipende da quanti cavi ci passano dentro (cavi unipolari tipo FS17):</p><table class="tab-risp">${righe}</table>${TIPO_TUBO}<p class="small">Se è un solo cavo multipolare (es. FG16OR16), misura il diametro esterno: il tubo deve essere almeno 1,3 volte più grande.</p>`, az);
  }


  function rPressacavo(d) {
    if (d.S == null && !d.Dcavo) { const r = d.t.match(/(?:^|\s)(\d+(?:[.,]\d+)?)(?!\s*(?:mm\b|m\b|kw|a\b|x|g))(?:\s|$)/); if (r && Calc.SEZIONI.includes(num(r[1]))) d.S = num(r[1]); }
    const az = vaiRep('raccordi', 'Reparto pressacavi');
    const lista = (dMin, dMax) => {
      const l = Schede.pressacaviPer(dMin, dMax);
      if (!l.length) return '<p>Nessun pressacavo standard lo stringe bene: serve una misura più grande (M75 o oltre) o un pressacavo speciale.</p>';
      const tip = Schede.misuraTipica(l);
      const per = {}; l.forEach(x => { (per[x.marca + ' · ' + x.serie] ||= []).push(x); });
      return `<p>Pressacavo <strong>${tip}</strong>.</p><table class="tab-risp">${Object.entries(per).map(([k, v]) => `<tr><td>${esc(k)}</td><td><strong>${v.map(x => esc(x.mis + (x.cod ? ' ' + x.cod : '')) + ` <span class="small">(${f(x.a)}–${f(x.b)})</span>`).join('<br>')}</strong></td></tr>`).join('')}</table>`;
    };
    if (d.Dcavo) return box(`Pressacavo per cavo Ø ${f(d.Dcavo)} mm`, lista(d.Dcavo, d.Dcavo), az);
    if (d.S != null) {
      const cand = d.unip ? [Schede.diametroCavo(1, d.S)] : d.nCavi ? [Schede.diametroCavo(d.nCavi, d.S)] : [5, 4, 3, 2].map(k => Schede.diametroCavo(k, d.S)).filter(Boolean);
      const ok = cand.filter(Boolean);
      if (!ok.length) return box(`Pressacavo per cavo da ${f(d.S)} mm²`, '<p>Non ho il diametro di questo cavo: misuralo con il calibro e scrivimi per esempio <em>pressacavo diametro 30</em>.</p>', az);
      const corpo = ok.map(c => `<h3 class="tab-tit">${c.sigla.startsWith('1X') ? 'FG16R16' : 'FG16OR16'} ${c.sigla.replace(/\./g, ',')} · Ø ${c.d[0] === c.d[1] ? f(c.d[0]) : f(c.d[0]) + '–' + f(c.d[1])} mm</h3>${lista(c.d[0], c.d[1])}`).join('');
      return box(`Pressacavo per cavo da ${f(d.S)} mm²`, corpo + '<p class="small">Diametri dal catalogo Prysmian (nominale–massimo): altre marche possono cambiare di 1–3 mm. Nel dubbio misura il cavo.</p>', az);
    }
    return box('Che pressacavo serve?', '<p>Dimmi il cavo (es. <em>pressacavo per 5G16</em>) o il suo diametro (es. <em>pressacavo diametro 22</em>).</p>', az);
  }

  function rCapocorda(d) {
    if (d.S == null) { const r = d.t.match(/\b(?:per|da|di)\s+(\d+(?:[.,]\d+)?)\b(?!\s*(?:mm\b|m\b|kw|a\b))/); if (r && Calc.SEZIONI.concat([150, 185, 240, 300]).includes(num(r[1]))) d.S = num(r[1]); }
    const az = vaiRep('morsetti', 'Reparto capicorda');
    if (d.S == null) return box('Che capocorda serve?', '<p>Dimmi la sezione del cavo e la vite, per esempio: <em>capocorda 50 mm² foro M8</em>.</p>', az);
    if (d.S < 6) return box(`Capocorda per ${f(d.S)} mm²`, `<p>Usa un capocorda <strong>preisolato ${d.S <= 1.5 ? 'rosso (0,5–1,5 mm²)' : d.S <= 2.5 ? 'blu (1,5–2,5 mm²)' : 'giallo (4–6 mm²)'}</strong>, a occhiello o a forcella secondo il morsetto.</p>`, az);
    const c = Schede.capocorda(d.S);
    if (!c) return box(`Capocorda per ${f(d.S)} mm²`, '<p>Sezione non standard: scegli la sezione commerciale superiore.</p>', az);
    const cod = d.vite ? `${c[1]}-M${d.vite}` : `${c[1]}-M…`;
    return box(`Capocorda per ${f(d.S)} mm²`, `<p>Cembre <strong>${cod}</strong> (tubolare in rame${d.vite ? '' : `, fori da ${c[2]}`}).</p><p class="small">Il numero dopo la M è il diametro della vite. Si pressa con la matrice per ${c[0]} mm².</p>`, az);
  }

  function rCavo(d) {
    const c = carico(d.t);
    const kW = d.kW ?? (d.A ? null : c?.[2]);
    if (kW == null && d.A == null) return null;
    const sistema = d.tri ? 'tri' : 'mono';
    const L = d.L ?? 20;
    const p = { sistema, cosphi: 1, L, isolante: 'PVC', posa: 'B1', conduttori: sistema === 'tri' ? 3 : 2, temp: 30, circuiti: 1, limiteCdt: 4, potenzaW: (kW || 0) * 1000, sezioneMin: c?.[1] === 'luce' ? 1.5 : 2.5 };
    if (d.A) p.Ib = d.A;
    const r = Calc.dimensiona(p);
    const diff = Calc.differenzialeConsigliato(c?.[1], sistema);
    const cosa = c ? c[3] : 'il carico';
    const ipotesi = [d.kW == null && !d.A && c ? `${f(kW)} kW tipici per ${cosa}` : null, d.L == null ? 'distanza 20 m' : null, sistema === 'mono' ? 'casa 230 V' : 'trifase 400 V'].filter(Boolean).join(', ');
    if (!r.scelta) return box(`Linea per ${esc(cosa)}`, '<p>Con questi dati serve un cavo oltre 120 mm²: meglio far fare il calcolo a un tecnico.</p>', vai('linea', 'Apri calcolo completo'));
    return box(`Linea per ${esc(cosa)}`,
      `<p>Cavo da <strong>${f(r.scelta.S)} mm²</strong>, magnetotermico da <strong>${r.In} A</strong>, salvavita tipo <strong>${esc(diff.tipo)}</strong> ${esc(diff.idn)}.</p>
       <p class="small">Corrente ${f(r.Ib)} A · perdita di tensione ${f(r.scelta.cdt.perc)}% · ho considerato: ${esc(ipotesi)}, cavo in tubo nel muro.</p>`,
      vai('linea', 'Apri calcolo completo'));
  }

  function rInterruttore(d) {
    const c = carico(d.t);
    const sistema = d.tri ? 'tri' : 'mono';
    const kW = d.kW ?? (d.A ? null : c?.[2]);
    const Ib = d.A ?? (kW != null ? Calc.conv.kwToA(kW, sistema, null, 1) : null);
    if (Ib == null) return null;
    const In = Calc.interruttoreMinimo(Ib);
    const curva = Calc.curvaConsigliata(c?.[1] || 'prese');
    const diff = Calc.differenzialeConsigliato(c?.[1], sistema);
    return box('Che interruttore serve',
      `<p>Magnetotermico da <strong>${In ?? 'oltre 125'} A</strong> curva <strong>${esc(curva.curva)}</strong>, ${sistema === 'tri' ? '4 poli' : '1P+N'}. Salvavita tipo <strong>${esc(diff.tipo)}</strong> ${esc(diff.idn)}.</p>
       <p class="small">Corrente assorbita circa ${f(Ib)} A. Il cavo deve reggere almeno ${In ?? '-'} A: controlla con il calcolo della linea.</p>`,
      vai('linea', 'Calcola anche il cavo') + vaiRep('protezioni', 'Reparto protezioni'));
  }

  function rConv(d) {
    const sistema = d.tri ? 'tri' : 'mono';
    const dove = sistema === 'tri' ? 'in trifase 400 V' : 'in casa (230 V)';
    if (/quant\w*\s+(amp|a\b)/.test(d.t) && d.kW != null) return box(`${f(d.kW)} kW in ampere`, `<p>Circa <strong>${f(Calc.conv.kwToA(d.kW, sistema, null, 1))} A</strong> ${dove}.</p>`, vai('conv', 'Apri convertitore'));
    if (/quant\w*\s+(kw|kilowatt|watt|w\b)/.test(d.t) && d.A != null) return box(`${f(d.A)} A in kW`, `<p>Circa <strong>${f(Calc.conv.aToKw(d.A, sistema, null, 1), 2)} kW</strong> ${dove}.</p>`, vai('conv', 'Apri convertitore'));
    return null;
  }

  function rBtu(d) {
    const az = vai('clima', 'Apri calcolo BTU') + vaiRep('clima', 'Reparto condizionatori');
    if (d.mq == null) return box('Che condizionatore serve', '<p>Dimmi quanti metri quadri è la stanza, per esempio: <em>condizionatore per 25 mq</em>.</p>', az);
    const btu = d.mq * 340;
    const taglia = [7000, 9000, 12000, 15000, 18000, 24000].find(x => x >= btu * 0.95);
    return box(`Condizionatore per ${f(d.mq, 0)} m²`, `<p>${taglia ? `Un <strong>${f(taglia, 0)} BTU</strong>` : 'Oltre 24.000 BTU: meglio più split o un multisplit'}.</p><p class="small">Stima per una stanza normale alta circa 2,7 m. Stanze molto al sole o all'ultimo piano: una taglia in più.</p>`, az);
  }

  function rStriscia(d) {
    const az = vaiRep('illuminazione', 'Reparto illuminazione');
    if (d.L == null || d.Wm == null) return box('Alimentatore per striscia LED', '<p>Dimmi metri e watt al metro, per esempio: <em>striscia 5 metri 14 W/m</em>.</p>', az);
    const W = d.L * d.Wm * 1.2;
    const tg = [30, 60, 100, 150, 200, 240, 320, 480].find(x => x >= W);
    return box(`Striscia ${f(d.L)} m da ${f(d.Wm)} W/m`, `<p>Alimentatore da almeno <strong>${tg ? tg + ' W' : f(W, 0) + ' W (dividi su più alimentatori)'}</strong>, stessa tensione della striscia (12 o 24 V).</p><p class="small">Consumo ${f(d.L * d.Wm, 0)} W + 20% di margine.</p>`, az);
  }

  function rContatore(d) {
    if (d.kW == null) return null;
    const c = Calc.contatore(d.kW);
    return box(`Contatore da ${f(d.kW)} kW`, `<p>Puoi usare insieme circa <strong>${f(c.continuo)} kW</strong> senza che stacchi.</p><p class="small">${esc(c.nota)}</p>`, vai('contatore', 'Apri strumento contatore'));
  }

  const STANZE = { soggiorno: /soggiorn|salott|\bsala\b/, cucina: /cucin/, bagno: /bagn/, camera: /camer|letto/, studio: /studio|scrivan/, corridoio: /corridoi|ingress/, garage: /garage|\bbox\b|cantin/, negozio: /negozi/, ufficio: /uffic/ };
  function rLumen(d) {
    if (d.mq == null) return null;
    const st = Object.keys(STANZE).find(k => STANZE[k].test(d.t));
    const lm = Calc.lumen(st || 'x', d.mq);
    return box(`Luce per ${st ? st + ' di ' : ''}${f(d.mq, 0)} m²`, `<p>Servono circa <strong>${f(lm, 0)} lumen</strong> in tutto (es. ${Math.max(1, Math.ceil(lm / 800))} lampadine da 800 lumen, cioè LED da circa 8–9 W).</p>`, vai('luce', 'Apri calcolo luce') + vaiRep('illuminazione', 'Reparto illuminazione'));
  }

  const GLOSSARIO = [
    [/magnetotermic|interruttore automatic/, 'Magnetotermico', 'Stacca la corrente se la linea assorbe troppo o c\'è un cortocircuito. Protegge il cavo. Si sceglie in ampere (A).'],
    [/salvavit|differenzial/, 'Salvavita (differenziale)', 'Stacca se la corrente scappa verso terra, per esempio se qualcuno tocca un filo. Protegge le persone. In casa 30 mA.'],
    [/deviator/, 'Deviatore', 'Comanda la stessa luce da 2 punti diversi (es. inizio e fine corridoio). Servono 2 deviatori.'],
    [/invertitor/, 'Invertitore', 'Serve per comandare una luce da 3 o più punti: si mette tra due deviatori.'],
    [/rele passo|passo passo|passo-passo/, 'Relè passo-passo', 'Accende e spegne una luce a ogni pressione di un pulsante. Comodo con tanti punti di comando.'],
    [/contattor/, 'Contattore', 'Interruttore comandato a distanza che accende carichi grossi (scaldabagno, pompe) con un comando piccolo.'],
    [/corrugat/, 'Corrugato', 'Il tubo flessibile dentro il muro o il pavimento dove passano i fili.'],
    [/\bbtu\b/, 'BTU', 'La potenza di un condizionatore. 9000 BTU ≈ una stanza di 25 m².'],
    [/lumen/, 'Lumen', 'Quanta luce fa una lampadina. Contano i lumen, non i watt.'],
    [/kelvin|temperatura colore|luce calda|luce fredda/, 'Temperatura colore', '2700–3000 K luce calda (casa), 4000 K neutra (cucina, ufficio), 6500 K fredda (garage).'],
    [/\bcurva\b/, 'Curva del magnetotermico', 'B per linee lunghe e LED, C per la casa, D per motori e trasformatori con forte spunto.'],
    [/fs17/, 'FS17', 'Cavo unipolare in PVC da mettere nel tubo, per impianti in casa.'],
    [/fg16/, 'FG16OR16', 'Cavo multipolare in gomma EPR con guaina, per esterno e interrato.'],
    [/schuko/, 'Presa Schuko', 'Presa tedesca con contatti laterali di terra. La "universale" accetta Schuko e spine italiane.'],
    [/bipass/, 'Presa bipasso', 'Presa che accetta spine italiane da 10 A e da 16 A.'],
    [/\bip\b|grado ip|\bip\s?\d\d/, 'Grado IP', 'Dice quanto resiste a polvere (prima cifra) e acqua (seconda cifra). Esterno: almeno IP44, meglio IP55/IP65.'],
    [/\b503\b/, 'Scatola 503', 'La scatola da incasso rettangolare da 3 moduli, la più usata per prese e interruttori.'],
    [/sezion/, 'Sezione del cavo', 'Quanto è grosso il filo di rame, in mm². Più corrente o più distanza = filo più grosso.']
  ];
  function rGlossario(d) {
    if (!/\bcos[' ]?e\b|cosa (e|significa|vuol dire)|che cos|a cosa serve|a che serve|significa|differenza tra/.test(d.t)) return null;
    const g = GLOSSARIO.find(x => x[0].test(d.t));
    return g ? box(g[1], `<p>${esc(g[2])}</p>`) : null;
  }

  // Parole → reparto (per mostrare la guida giusta)
  const MAPPA = [
    [/corrugat|\btub[oi]\b|guain|cavidott|\brk\b/, 'tubi'], [/magnetoterm|differenz|salvavit|contattor|salvamotor|\bquadr[oi]\b|centralin|crepuscol|temporizz|\brele\b/, 'protezioni'],
    [/cancell|basculant|automazion/, 'cancelli'], [/aspirator|ventilat|ventol|\bvmc\b/, 'ventilazione'], [/antifurt|allarm|incend|rivelator/, 'sicurezza'],
    [/canal[ei]|passerell|battiscop/, 'canali'], [/nastr|giunt|tassell|fascett/, 'consumo'], [/capicord|capocord|morsett|wago|connettor/, 'morsetti'],
    [/pressacav|raccord|cassett|scatol|derivazion/, 'raccordi'], [/citofon|telecamer|videosorv|\bdvr\b|\bnvr\b/, 'citofonia'],
    [/condizionat|climatizz|\bsplit\b|\bbtu\b/, 'clima'], [/lampad|\bled\b|\bfar[oi]\b|plafon|strisc|lumen|illumin/, 'illuminazione'],
    [/fotovolt|pannell|solare|accumul/, 'fotovoltaico'], [/domotic|\bsmart\b|alexa|google home|\bknx\b/, 'domotica'],
    [/pres[ae]\b|interruttor|placc|deviator|frutt|serie civil/, 'civile'], [/\bcav[oi]\b|\bfil[oi]\b/, 'cavi']
  ];
  function reparto(t) {
    const m = MAPPA.find(x => x[0].test(t));
    return m && typeof REPARTI !== 'undefined' ? REPARTI.find(r => r.id === m[1]) : null;
  }

  function rispondi(q) {
    if (!q || q.trim().length < 3) return '';
    const d = leggi(q);
    const t = d.t;
    let r = rGlossario(d);
    if (!r && /pressacav|passacav/.test(t)) r = rPressacavo(d);
    if (!r && /capocord|capicord|terminal[ei] ad occhiello/.test(t)) r = rCapocorda(d);
    if (!r && /strisc|led strip/.test(t)) r = rStriscia(d);
    if (!r && /corrugat|\btub[oi]\b|guain|cavidott|\brk\b|quanti cavi/.test(t)) r = rTubo(d);
    if (!r && /condizionat|climatizz|\bsplit\b|\bbtu\b/.test(t) && !/\bcav|interrutt|magnetot|\blinea\b/.test(t)) r = rBtu(d);
    if (!r && /contatore/.test(t)) r = rContatore(d);
    if (!r && /lumen|quanta luce|quante lampad/.test(t)) r = rLumen(d);
    if (!r && /quant\w*\s+(amp|a\b|kw|kilowatt|watt|w\b)/.test(t)) r = rConv(d);
    if (!r && /magnetotermic|interruttore (automatic|per)|\bautomatico\b|salvavit|differenzial/.test(t) && (d.kW != null || d.A != null || carico(t))) r = rInterruttore(d);
    if (!r && /\bcav[oi]\b|\bfil[oi]\b|sezione|\blinea\b/.test(t) && (d.kW != null || d.A != null || carico(t))) r = rCavo(d);
    if (!r && (d.kW != null || d.A != null) && carico(t)) r = rCavo(d);
    const rep = reparto(t);
    const guida = rep ? `<details class="risp-guida"${r ? '' : ' open'}><summary>Guida rapida: ${esc(rep.nome)}</summary>${rep.guida}<div class="risp-azioni">${vaiRep(rep.id, 'Apri reparto ' + rep.nome)}</div></details>` : '';
    if (!r && !guida) return '';
    return `<h2 class="sezione">Risposta</h2>${r || ''}${guida}`;
  }

  return { rispondi, leggi };
})();
