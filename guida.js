/* Assistente Banco — guide pratiche (1.14.0):
   schemi di collegamento, punti per stanza (CEI 64-8 cap. 37), lampadine, equivalenze serie civili.
   Fonti: riepilogo CEI 64-8 di edilizia.com; schede prodotto Vimar, BTicino, Gewiss (cataloghi online). */
'use strict';

const Guida = (() => {
  const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const n = s => String(s || '').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');
  const $g = s => document.querySelector(s);

  /* ---------- Punti per stanza (CEI 64-8, capitolo 37: livelli 1, 2, 3) ---------- */
  // Locali generici (camera, soggiorno, studio…): per superficie. [prese, luci, TV]
  const GENERICO = [
    { max: 8, nome: 'fino a 8 m²', l: [[1, 1, 0], [1, 1, 0], [1, 1, 0]] },
    { max: 12, nome: 'da 8 a 12 m²', l: [[4, 1, 1], [5, 2, 1], [5, 2, 1]] },
    { max: 20, nome: 'da 12 a 20 m²', l: [[5, 1, 1], [7, 2, 1], [8, 3, 1]] },
    { max: Infinity, nome: 'oltre 20 m²', l: [[6, 2, 1], [8, 3, 1], [10, 4, 1]] }
  ];
  const STANZE = [
    { id: 'camera', nome: 'Camera da letto', generico: true },
    { id: 'soggiorno', nome: 'Soggiorno / salone', generico: true },
    { id: 'studio', nome: 'Studio / cameretta', generico: true },
    { id: 'cucina', nome: 'Cucina separata', l: [[5, 1, 1], [6, 2, 1], [7, 2, 1]], nota: ['2 prese sul piano di lavoro', '2 prese sul piano di lavoro', '3 prese sul piano di lavoro'], extra: 'Forno, piano a induzione e lavastoviglie: meglio linee dedicate. Per l\'induzione serve almeno un tubo da 20 mm dal quadro.' },
    { id: 'angolo', nome: 'Angolo cottura (in soggiorno)', l: [[2, 0, 0], [2, 0, 0], [3, 1, 0]], nota: ['1 presa sul piano', '1 presa sul piano', '2 prese sul piano'], extra: 'Si somma ai punti del soggiorno in cui si trova.' },
    { id: 'bagno', nome: 'Bagno', l: [[2, 2, 0], [2, 2, 0], [2, 2, 0]], extra: 'Basta 1 presa se non c\'è l\'attacco della lavatrice. Rispetta le zone di sicurezza vicino a vasca e doccia.' },
    { id: 'wc', nome: 'WC separato', l: [[1, 1, 0], [1, 1, 0], [1, 1, 0]] },
    { id: 'ingresso', nome: 'Ingresso', l: [[1, 1, 0], [1, 1, 0], [1, 1, 0]], extra: 'Il comando della luce va vicino alla porta.' },
    { id: 'corridoio', nome: 'Corridoio fino a 5 m', l: [[1, 1, 0], [1, 1, 0], [1, 1, 0]] },
    { id: 'corridoio5', nome: 'Corridoio oltre 5 m', l: [[2, 2, 0], [2, 2, 0], [2, 2, 0]] },
    { id: 'lavanderia', nome: 'Lavanderia', l: [[3, 1, 0], [4, 1, 0], [4, 1, 0]], extra: 'Lavatrice e asciugatrice: meglio circuiti dedicati.' },
    { id: 'balcone', nome: 'Balcone / terrazzo', l: [[1, 1, 0], [1, 1, 0], [1, 1, 0]], extra: 'Materiale da esterno (almeno IP44, presa con coperchio).' },
    { id: 'ripostiglio', nome: 'Ripostiglio', l: [[0, 1, 0], [0, 1, 0], [0, 1, 0]] },
    { id: 'cantina', nome: 'Cantina / soffitta', l: [[1, 1, 0], [1, 1, 0], [1, 1, 0]] },
    { id: 'box', nome: 'Box auto', l: [[1, 1, 0], [1, 1, 0], [1, 1, 0]], extra: 'Per la ricarica dell\'auto serve una linea dedicata.' },
    { id: 'giardino', nome: 'Giardino', l: [[1, 1, 0], [1, 1, 0], [1, 1, 0]], extra: 'Materiale da esterno (IP55), cavi interrati in cavidotto.' }
  ];
  const CIRCUITI = [[50, [2, 3, 3]], [75, [3, 3, 4]], [100, [4, 5, 5]], [125, [4, 5, 5]], [Infinity, [5, 6, 7]]];
  const lv = l => Math.min(3, Math.max(1, l || 1)) - 1;

  function puntiStanza(id, mq, livello) {
    const s = STANZE.find(x => x.id === id); if (!s) return null;
    const L = lv(livello);
    if (s.generico) {
      const g = GENERICO.find(x => (mq || 14) <= x.max);
      const [prese, luci, tv] = g.l[L];
      return { nome: s.nome, fascia: g.nome, prese, luci, tv, nota: '', extra: L === 0 && /camera|studio/.test(id) ? 'Al livello 1 la norma permette di spostare qualche presa tra le stanze, purché il totale della casa non scenda.' : '' };
    }
    const [prese, luci, tv] = s.l[L];
    return { nome: s.nome, fascia: '', prese, luci, tv, nota: s.nota ? s.nota[L] : '', extra: s.extra || '' };
  }
  const circuiti = (mqCasa, livello) => CIRCUITI.find(c => mqCasa <= c[0])[1][lv(livello)];

  /* ---------- Lampadine ---------- */
  const ATTACCHI = [
    ['E27', 'Vite grande (27 mm)', '230 V', 'Lampadari, plafoniere, lampade da tavolo'],
    ['E14', 'Vite piccola (14 mm)', '230 V', 'Abat-jour, applique, lampadari a candela'],
    ['B22', 'Baionetta grande', '230 V', 'Impianti vecchi e lampade inglesi'],
    ['GU10', 'Due perni con testa, si gira e si blocca', '230 V', 'Faretti da incasso e binari (senza trasformatore)'],
    ['GU5.3', 'Due perni dritti sottili (MR16)', '12 V', 'Faretti con trasformatore: serve un LED a 12 V'],
    ['G9', 'Capsula con due anelli', '230 V', 'Piccoli lampadari e applique'],
    ['G4', 'Capsula piccola, due perni', '12 V', 'Lampade da cappa, piccole luci a 12 V'],
    ['R7s', 'Lineare, contatti alle due punte', '230 V', 'Fari alogeni e piantane: misura 78 o 118 mm'],
    ['GX53', 'Disco piatto, due perni', '230 V', 'Faretti sottili da incasso'],
    ['G13', 'Tubo T8, due perni per lato', '230 V', 'Neon: 60, 120 o 150 cm; col tubo LED togli lo starter']
  ];
  // Vecchia lampadina a incandescenza (W) → lumen di riferimento UE
  const EQUIV = [[25, 250], [40, 470], [60, 806], [75, 1055], [100, 1521], [150, 2452]];
  const COLORI = [
    ['2700 K', 'luce calda', 'Camera da letto, soggiorno, ingresso'],
    ['3000 K', 'calda-naturale', 'Soggiorno, sala da pranzo, corridoio'],
    ['4000 K', 'naturale (neutra)', 'Cucina, bagno, studio, ufficio'],
    ['6500 K', 'fredda', 'Garage, laboratorio, cantina']
  ];
  const ledW = lm => Math.round(lm / 100); // un LED di qualità fa circa 100 lumen per watt
  const tabColori = () => `<table class="tab-risp">${COLORI.map(c => `<tr><td><strong>${c[0]}</strong> ${c[1]}</td><td class="small testo-a-capo">${c[2]}</td></tr>`).join('')}</table>`;

  /* ---------- Equivalenze serie civili (codici dalle schede dei produttori) ---------- */
  const FUNZIONI = ['Interruttore 1P', 'Deviatore 1P', 'Invertitore 1P', 'Pulsante 1P NO'];
  const BREVI = ['Interr.', 'Deviat.', 'Invert.', 'Pulsante'];
  const SERIE = [
    { marca: 'Vimar', serie: 'Arké', cod: ['19001', '19005', '19013', '19008'], nota: 'grigio; bianco con .B (es. 19005.B)' },
    { marca: 'Vimar', serie: 'Eikon', cod: ['20001', '20005', '20013', '20008'], nota: 'grigio; bianco con .B' },
    { marca: 'Vimar', serie: 'Plana', cod: ['14001', '14005', '14013', '14008'], nota: 'bianco' },
    { marca: 'Vimar', serie: 'Idea', cod: ['16001', '16005', '16013', '16008'], nota: 'grigio; bianco con .B' },
    { marca: 'BTicino', serie: 'Living Now', cod: ['K4001', 'K4003', 'K4004', 'K4005'], nota: 'da completare con la cover (KW01 bianca, KG01 nera, KM01 sabbia)' },
    { marca: 'BTicino', serie: 'Living Light', cod: ['N4001N', 'N4003N', 'N4004N', 'N4005N'], nota: 'finale N = bianco, L = antracite, NT = tech' },
    { marca: 'BTicino', serie: 'Matix', cod: ['AM5001', 'AM5003', 'AM5004', 'AM5005'], nota: 'bianco' },
    { marca: 'Gewiss', serie: 'Chorus', cod: ['GW10001', 'GW10051', 'GW10091', 'GW10131'], nota: 'bianco lucido; nero GW12…, titanio GW14…' }
  ];

  /* ---------- Schemi di collegamento (disegni SVG) ---------- */
  const COL = { L: '#a0522d', N: '#2f7de1', PE: '#7cb342', R: '#9e9e9e' };
  const filo = (d, c, tratt) => `<path d="${d}" fill="none" stroke="${COL[c]}" stroke-width="3"${tratt ? ' stroke-dasharray="7 4"' : ''} stroke-linecap="round" stroke-linejoin="round"/>`;
  const scat = (x, y, w, h, testo) => `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="6" fill="none" stroke="currentColor" stroke-opacity=".6"/><text x="${x + w / 2}" y="${y + h / 2 + 4}" text-anchor="middle" font-size="11" fill="currentColor">${testo}</text>`;
  const lamp = (x, y) => `<circle cx="${x}" cy="${y}" r="15" fill="none" stroke="currentColor" stroke-width="2"/><path d="M${x - 10} ${y - 10} L${x + 10} ${y + 10} M${x + 10} ${y - 10} L${x - 10} ${y + 10}" stroke="currentColor" stroke-width="2"/>`;
  const et = (x, y, t, c) => `<text x="${x}" y="${y}" font-size="11" font-weight="600" fill="${c ? COL[c] : 'currentColor'}">${t}</text>`;
  const svg = (h, corpo) => `<svg viewBox="0 0 340 ${h}" class="schema" role="img" xmlns="http://www.w3.org/2000/svg">${corpo}</svg>`;
  const LEGENDA = '<p class="small legenda"><span style="color:#a0522d">■</span> fase (marrone, nero o grigio) · <span style="color:#2f7de1">■</span> neutro (blu) · <span style="color:#7cb342">■</span> terra (giallo-verde) · <span style="color:#9e9e9e">■</span> fili tra i comandi</p>';
  const SCHEMI = [
    { id: 'interrotto', nome: 'Luce da un punto (interruttore)', mat: 'Interruttore 1P, cavo 1,5 mm² (fase, neutro, terra)',
      testo: 'La fase entra nell\'interruttore ed esce verso la lampada. Il neutro e la terra vanno direttamente alla lampada.',
      disegno: svg(150, et(6, 28, 'L', 'L') + et(6, 98, 'N', 'N') + et(6, 128, 'PE', 'PE') + filo('M24 24 H120', 'L') + scat(120, 8, 70, 32, 'Interruttore') + filo('M190 24 H290 V60', 'L') + lamp(290, 75) + filo('M24 94 H275 V80', 'N') + filo('M24 124 H305 V80', 'PE', 1)) },
    { id: 'deviato', nome: 'Luce da due punti (deviatori)', mat: '2 deviatori 1P, cavo 1,5 mm²',
      testo: 'La fase va al morsetto comune (C o L) del primo deviatore. I due morsetti di uscita (1 e 2) si collegano con due fili ai morsetti 1 e 2 del secondo deviatore. Dal comune del secondo deviatore parte il filo verso la lampada.',
      disegno: svg(170, et(6, 28, 'L', 'L') + et(6, 128, 'N', 'N') + et(6, 158, 'PE', 'PE') + filo('M24 33 H60', 'L') + scat(60, 8, 70, 50, 'Deviatore 1') + filo('M130 22 H190', 'R') + filo('M130 44 H190', 'R') + scat(190, 8, 70, 50, 'Deviatore 2') + et(155, 18, '1') + et(155, 58, '2') + filo('M260 33 H300 V80', 'L') + lamp(300, 95) + filo('M24 124 H285 V100', 'N') + filo('M24 154 H315 V100', 'PE', 1)) },
    { id: 'invertito', nome: 'Luce da tre o più punti (invertitori)', mat: '2 deviatori + 1 invertitore per ogni punto in più',
      testo: 'Come per due punti, ma i due fili tra i deviatori passano dall\'invertitore: entrano in una coppia di morsetti ed escono dall\'altra. Per ogni punto di comando in più si aggiunge un invertitore. Con più di 3 punti conviene il relè passo-passo.',
      disegno: svg(150, et(6, 28, 'L', 'L') + et(6, 128, 'N', 'N') + filo('M24 33 H40', 'L') + scat(40, 8, 64, 50, 'Deviatore') + filo('M104 22 H138', 'R') + filo('M104 44 H138', 'R') + scat(138, 8, 64, 50, 'Invertitore') + filo('M202 22 H236', 'R') + filo('M202 44 H236', 'R') + scat(236, 8, 64, 50, 'Deviatore') + filo('M300 33 H318 V80', 'L') + lamp(318, 95) + filo('M24 124 H303 V100', 'N')) },
    { id: 'passo', nome: 'Luce da tanti punti (relè passo-passo)', mat: 'Relè passo-passo 230 V, pulsanti 1P NO (quanti ne vuoi)',
      testo: 'I pulsanti sono tutti in parallelo: ognuno, quando lo premi, porta la fase alla bobina del relè (A1); l\'altro capo della bobina (A2) va al neutro. A ogni pressione il contatto del relè accende o spegne la lampada. Si possono aggiungere pulsanti senza limiti.',
      disegno: svg(190, et(6, 28, 'L', 'L') + et(6, 182, 'N', 'N') + filo('M24 24 H301', 'L') + filo('M60 24 V46', 'L') + filo('M140 24 V46', 'L') + scat(36, 46, 48, 26, 'P1') + scat(116, 46, 48, 26, 'P2') + filo('M60 72 V95 H180', 'R') + filo('M140 72 V95', 'R') + scat(180, 80, 80, 30, 'Bobina A1-A2') + filo('M260 95 H272 V178', 'N') + filo('M301 24 V58', 'L') + scat(284, 58, 34, 22, 'Relè') + filo('M301 80 V112', 'L') + lamp(301, 128) + filo('M24 178 H301 V143', 'N')) }
  ];
  const schedaSchema = x => LEGENDA + x.disegno + `<p>${esc(x.testo)}</p><p class="small"><strong>Serve:</strong> ${esc(x.mat)}</p>`;

  /* ---------- Viste in Strumenti ---------- */
  const cella = v => v ? `<strong>${v}</strong>` : '–';
  function vistaStanze() {
    return `<div class="grid2">
      <label>Stanza<select id="gsStanza">${STANZE.map(s => `<option value="${s.id}">${esc(s.nome)}</option>`).join('')}</select></label>
      <label>Superficie (m²)<input id="gsMq" type="number" min="1" value="14" inputmode="decimal"></label>
      <label>Livello impianto<select id="gsLiv"><option value="1">1 – base (minimo a norma)</option><option value="2">2 – più comodo</option><option value="3">3 – domotico</option></select></label>
    </div>
    <div id="gsOut"></div>
    <details class="card"><summary>Quanti circuiti per tutta la casa</summary>
      <table class="tab-risp"><tr><th>Casa</th><th>Liv. 1</th><th>Liv. 2</th><th>Liv. 3</th></tr>
      ${[['fino a 50 m²', 50], ['50–75 m²', 75], ['75–100 m²', 100], ['100–125 m²', 125], ['oltre 125 m²', 200]].map(([t, m]) => `<tr><td>${t}</td>${[1, 2, 3].map(l => `<td>${circuiti(m, l)}</td>`).join('')}</tr>`).join('')}</table>
      <p class="small">Le linee dedicate sopra 1000 W (forno, induzione, clima) si aggiungono. Livello 1: almeno 2 differenziali su circuiti separati, nel quadro posto libero pari al 30% (minimo 2 moduli), montante per 6 kW, 1 lampada di emergenza fino a 100 m² (2 oltre), prese dati: 1 fino a 50 m², 2 fino a 100 m², 3 oltre.</p>
    </details>
    <p class="small">Riferimento: CEI 64-8, capitolo 37 (ambienti residenziali). Riepilogo indicativo: il progetto lo fa l'elettricista.</p>`;
  }
  const leggiStanza = () => puntiStanza($g('#gsStanza').value, +$g('#gsMq').value, +$g('#gsLiv').value);
  function disegnaStanza() {
    const r = leggiStanza();
    $g('#gsMq').closest('label').hidden = !STANZE.find(s => s.id === $g('#gsStanza').value).generico;
    $g('#gsOut').innerHTML = `<div class="risposta ok"><span class="msr" aria-hidden="true">meeting_room</span><div class="risp"><strong>${esc(r.nome)}${r.fascia ? ' · ' + r.fascia : ''}</strong>
      <div class="risp-corpo"><table class="tab-risp"><tr><td>Punti presa</td><td>${cella(r.prese)}</td></tr><tr><td>Punti luce</td><td>${cella(r.luci)}</td></tr><tr><td>Prese TV</td><td>${cella(r.tv)}</td></tr></table>
      ${r.nota ? `<p class="small">Di cui ${esc(r.nota)}.</p>` : ''}${r.extra ? `<p class="small">${esc(r.extra)}</p>` : ''}</div>
      <div class="risp-azioni"><button class="chip-btn" data-gs-add>Aggiungi al preventivo</button></div></div></div>`;
  }
  function righeStanza() {
    const r = leggiStanza(); const out = [];
    if (r.prese) out.push({ desc: `Presa bipasso 10/16 A (${r.nome})`, qta: r.prese, um: 'pz' });
    if (r.luci) out.push({ desc: `Interruttore 1P 16 A (${r.nome})`, qta: r.luci, um: 'pz' });
    if (r.tv) out.push({ desc: `Presa TV (${r.nome})`, qta: r.tv, um: 'pz' });
    const tot = r.prese + r.luci + r.tv;
    if (tot) out.push({ desc: 'Scatola da incasso 503', qta: tot, um: 'pz' }, { desc: 'Placca 3 moduli', qta: tot, um: 'pz' });
    return out;
  }
  function vistaLampade() {
    return `<label>Vecchia lampadina da<select id="glW">${EQUIV.map(([w]) => `<option value="${w}"${w === 60 ? ' selected' : ''}>${w} W</option>`).join('')}</select></label>
    <div id="glOut"></div>
    <h2 class="sezione">Attacchi</h2>
    <div class="lista-marche">${ATTACCHI.map(a => `<div class="lm-voce"><div class="lm-art"><strong>${a[0]}</strong> · ${esc(a[1])} · <strong>${a[2]}</strong></div><div class="small">${esc(a[3])}</div></div>`).join('')}</div>
    <h2 class="sezione">Colore della luce</h2>${tabColori()}
    <p class="small">Per sostituire una lampadina: stesso attacco, stessa tensione (230 V o 12 V) e lumen simili. Se va su un dimmer, prendila «dimmerabile».</p>`;
  }
  function disegnaLampada() {
    const w = +$g('#glW').value; const lm = EQUIV.find(e => e[0] === w)[1];
    $g('#glOut').innerHTML = `<div class="risposta ok"><span class="msr" aria-hidden="true">lightbulb</span><div class="risp"><strong>Vecchia da ${w} W = circa ${lm} lumen</strong><div class="risp-corpo"><p>LED equivalente: circa <strong>${ledW(lm)} W</strong>, con almeno <strong>${lm} lm</strong> scritti sulla scatola. Conta i lumen, non i watt.</p></div></div></div>`;
  }
  function vistaSerie() {
    return `<p class="hint">Stessa funzione in marche e serie diverse. Frutti e placche di serie diverse non si montano insieme: se cambi serie, cambia anche la placca.</p>
    <div class="tab-scroll"><table class="tab-risp tab-serie"><tr><th>Serie</th>${BREVI.map(f => `<th>${f}</th>`).join('')}</tr>
    ${SERIE.map(s => `<tr><td><strong>${s.marca}</strong><br>${s.serie}</td>${s.cod.map(c => `<td>${c}</td>`).join('')}</tr>`).join('')}</table></div>
    <ul class="ref small">${SERIE.map(s => `<li><strong>${s.marca} ${s.serie}</strong>: ${esc(s.nota)}</li>`).join('')}</ul>
    <p class="small">Codici dalle schede dei produttori (16 AX per Vimar e Gewiss, 10 AX per BTicino).</p>`;
  }
  const vistaSchemi = () => LEGENDA + SCHEMI.map(s => `<details class="card schema-card"><summary>${esc(s.nome)}</summary>${s.disegno}<p>${esc(s.testo)}</p><p class="small"><strong>Serve:</strong> ${esc(s.mat)}</p></details>`).join('') +
    '<p class="small">Prima di lavorare stacca il generale e verifica che non ci sia tensione. Gli impianti fissi vanno fatti da un elettricista abilitato (DM 37/08).</p>';

  /* ---------- Risposte alle domande scritte ---------- */
  const box = (titolo, corpo, tool) => `<div class="risposta ok"><span class="msr" aria-hidden="true">forum</span><div class="risp"><strong>${titolo}</strong><div class="risp-corpo">${corpo}</div>${tool ? `<div class="risp-azioni"><button class="chip-btn" data-goto-tool="${tool[0]}">${esc(tool[1])}</button></div>` : ''}</div></div>`;
  function rispondi(q) {
    const t = n(q);
    // Schemi di collegamento
    if (/colleg|schema|cablagg|come (si )?(mett|fa|monta)/.test(t) || /\bda (due|2|tre|3|piu) punti\b/.test(t)) {
      let s = null;
      if (/passo|rele|pulsant/.test(t)) s = 'passo';
      else if (/invertitor|tre punti|3 punti|piu punti/.test(t)) s = 'invertito';
      else if (/deviator|due punti|2 punti/.test(t)) s = 'deviato';
      else if (/interruttor|un punto|1 punto|lampad|luce|plafonier|lampadar/.test(t)) s = 'interrotto';
      if (s) { const x = SCHEMI.find(y => y.id === s); return box(x.nome, schedaSchema(x), ['schemi', 'Tutti gli schemi']); }
    }
    // Punti per stanza
    if (/quant\w* (prese|punti|luci|interruttor)|punti (luce|presa)|livello (1|2|3|uno|due|tre|base)|64-?8/.test(t)) {
      const st = (/salone|sala\b/.test(t) && STANZE.find(s => s.id === 'soggiorno')) || (/cameret|studio/.test(t) && STANZE.find(s => s.id === 'studio')) ||
        (/angolo cottura/.test(t) && STANZE.find(s => s.id === 'angolo')) || STANZE.find(s => t.includes(n(s.nome.split(/[ /(]/)[0])));
      const mq = (t.match(/(\d+(?:[.,]\d+)?)\s*(?:mq|m2|metri quadr)/) || [])[1];
      const liv = /livello (2|due)/.test(t) ? 2 : /livello (3|tre)/.test(t) ? 3 : 1;
      if (st) {
        const r = puntiStanza(st.id, mq ? parseFloat(mq.replace(',', '.')) : 14, liv);
        return box(`${esc(r.nome)}${r.fascia ? ' ' + r.fascia : ''}: livello ${liv}`, `<p>Almeno <strong>${r.prese}</strong> ${r.prese === 1 ? 'presa' : 'prese'} e <strong>${r.luci}</strong> ${r.luci === 1 ? 'punto luce' : 'punti luce'}${r.tv ? `, più <strong>${r.tv}</strong> presa TV` : ''}.${r.nota ? ' Di cui ' + esc(r.nota) + '.' : ''}</p>${r.extra ? `<p class="small">${esc(r.extra)}</p>` : ''}${st.generico && !mq ? '<p class="small">Calcolato per 14 m²: scrivi i metri quadri per il numero esatto.</p>' : ''}`, ['stanze', 'Apri punti per stanza']);
      }
    }
    // Attacchi delle lampadine
    const att = ATTACCHI.find(a => new RegExp('\\b' + n(a[0]).replace('.', '\\.') + '\\b').test(t));
    if (!att && /\bneon\b|tubo (a )?led|\bt8\b|plafoniera stagna/.test(t)) return box('Neon e tubi LED (attacco G13)', '<p>Misure: <strong>60, 120 o 150 cm</strong> (T8, attacco G13). Un tubo LED da 120 cm fa circa <strong>1800–2200 lm</strong> con 18 W e sostituisce il neon da 36 W.</p><p class="small">Montaggio: togli lo starter (o mettine uno «finto» se il tubo lo richiede) e, nelle plafoniere con reattore, segui lo schema sul tubo. Se la plafoniera è vecchia conviene la plafoniera stagna LED completa.</p>', ['lampade', 'Guida lampadine']);
    if (!att && /cappa/.test(t) && /lampad|luce|led/.test(t)) return box('Lampadina della cappa', '<p>Le cappe usano di solito <strong>E14</strong> (vite piccola, 230 V), <strong>G4</strong> (capsula 12 V) o faretti <strong>GU10</strong>/<strong>GU5.3</strong>. Smonta la vecchia e guarda attacco e tensione stampati sopra: porta la vecchia al banco se non è leggibile.</p>', ['lampade', 'Guida lampadine']);
    if (!att && /faret/.test(t) && /incass|cartongess|controsoffitt/.test(t)) return box('Faretto da incasso', '<p>Il più usato è il faretto con attacco <strong>GU10</strong> (230 V, niente trasformatore). Per controsoffitti bassi c\'è il <strong>GX53</strong>, molto sottile. Misura il <strong>foro</strong> (di solito 60–80 mm) e la profondità disponibile.</p><p class="small">Nel cartongesso servono le molle di fissaggio del faretto; con isolante sopra scegli un faretto adatto al contatto con materiali isolanti.</p>', ['lampade', 'Guida lampadine']);
    if (att) return box(`Attacco ${att[0]}`, `<p>${esc(att[1])}, <strong>${att[2]}</strong>. Si usa per: ${esc(att[3])}.</p>${att[2] === '12 V' ? '<p class="small">Funziona con trasformatore: prendi un LED a 12 V, non a 230 V.</p>' : ''}`, ['lampade', 'Guida lampadine']);
    const wv = t.match(/(\d{2,3})\s*(?:w|watt)\b/);
    if (wv && /lampad|equivalent|corrispond|\bled\b/.test(t) && !/strisc/.test(t)) {
      const w = +wv[1]; const e = EQUIV.reduce((a, b) => Math.abs(b[0] - w) < Math.abs(a[0] - w) ? b : a);
      return box(`Lampadina da ${w} W`, `<p>Una vecchia lampadina da ${e[0]} W fa circa <strong>${e[1]} lumen</strong>: il LED equivalente è da circa <strong>${ledW(e[1])} W</strong>. Guarda i lumen sulla scatola.</p>`, ['lampade', 'Guida lampadine']);
    }
    if (/luce (calda|fredda|naturale)|kelvin|\b\d{4}\s*k\b|che (luce|lampadin)|che lampad/.test(t)) {
      const c = COLORI.find(x => n(x[2]).split(/, /).some(st => t.includes(st.split(' ')[0])));
      return box(c ? `Per ${esc(t.match(/cucina|bagno|camera|soggiorno|studio|ufficio|garage|cantina|corridoio|ingresso|laboratorio/)?.[0] || 'questa stanza')}: ${c[0]}, ${c[1]}` : 'Che luce scegliere', tabColori(), ['lampade', 'Guida lampadine']);
    }
    // Equivalenze tra serie civili
    const qn = t.replace(/\s+/g, '').toUpperCase();
    for (const s of SERIE) for (let i = 0; i < 4; i++) if (new RegExp(s.cod[i] + '(?![0-9])').test(qn)) {
      return box(`${s.marca} ${s.serie} ${s.cod[i]}: ${FUNZIONI[i].toLowerCase()}`, `<p>Lo stesso nelle altre serie:</p><div class="lista-marche">${SERIE.filter(x => x !== s).map(x => `<div class="lm-art">${x.marca} ${x.serie}: <strong>${x.cod[i]}</strong></div>`).join('')}</div>`, ['serie', 'Tabella equivalenze']);
    }
    return '';
  }

  /* ---------- Avvio ---------- */
  function init(log) {
    const metti = (id, html) => { const el = $g('#' + id); if (el) el.innerHTML = html; };
    metti('guidaSchemi', vistaSchemi()); metti('guidaStanze', vistaStanze()); metti('guidaLampade', vistaLampade()); metti('guidaSerie', vistaSerie());
    if ($g('#gsStanza')) { ['#gsStanza', '#gsMq', '#gsLiv'].forEach(s => $g(s).addEventListener('input', disegnaStanza)); disegnaStanza(); }
    if ($g('#glW')) { $g('#glW').addEventListener('input', disegnaLampada); disegnaLampada(); }
    document.addEventListener('click', e => {
      if (!e.target.closest('[data-gs-add]') || typeof Banco === 'undefined') return;
      Banco.aggiungi(righeStanza(), 'stanza'); Banco.snack && Banco.snack('Aggiunto al preventivo', null);
      log && log('stanza-preventivo', { stanza: $g('#gsStanza').value, livello: +$g('#gsLiv').value });
    });
  }

  return { init, rispondi, puntiStanza, circuiti, SERIE, FUNZIONI, ATTACCHI, SCHEMI, STANZE };
})();
