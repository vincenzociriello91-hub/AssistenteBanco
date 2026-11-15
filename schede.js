/* Assistente Banco — tabelle tecniche dei prodotti (dati dai cataloghi dei costruttori).
   Pressacavi: campo di serraggio per marca e misura. Cavi: diametro esterno. Capicorda Cembre A-M.
   Usate da domande.js e aggiunte alle guide dei reparti. */
'use strict';

const Schede = (() => {
  // Pressacavi in nylon, passo metrico, IP68. min–max = diametro del cavo che stringono (mm).
  const PRESSACAVI = [
    { marca: 'Gewiss', serie: 'GW FIT (IP68, grigio RAL 7035)', righe: [
      ['M16', 5, 10, 'GW52043'], ['M20', 10, 14, 'GW52044'], ['M25', 13, 18, 'GW52045'], ['M32', 18, 25, 'GW52046'], ['M40', 22, 32, 'GW52047']] },
    { marca: 'Cembre', serie: '1900 in poliammide PA6.6 (con controdado)', righe: [
      ['M16', 5, 10, '1900.M16/X'], ['M20', 7, 13, '1900.M20/X'], ['M25', 10, 17, '1900.M25/X'], ['M32', 13, 21, '1900.M32/X'], ['M40', 19, 28, '1900.M40/X'], ['M50', 27, 35, '1900.M50/X'], ['M63', 34, 45, '1900.M63/X']] },
    { marca: 'Cembre', serie: '7900 acciaio inox (IP68)', righe: [
      ['M12', 3, 7, '7900.M12'], ['M16', 4.5, 10, '7900.M16'], ['M20', 7, 13, '7900.M20'], ['M25', 10, 17, '7900.M25'], ['M32', 11, 21, '7900.M32'], ['M40', 19, 28, '7900.M40'], ['M50', 26, 35, '7900.M50'], ['M63', 34, 45, '7900.M63']] },
    { marca: 'Legrand / BTicino', serie: 'pressacavi plastici RAL 7001', righe: [
      ['M12', 4, 6, '3 815 40'], ['M16', 4, 8, '3 815 41'], ['M20', 8, 12, '3 815 42'], ['M25', 13, 18, '3 815 43'], ['M32', 19, 25, '3 815 44'], ['M40', 22, 32, '3 815 45'], ['M50', 30, 35, '3 815 46'], ['M63', 34, 44, '3 815 47']] },
    { marca: 'HellermannTyton', serie: 'NGM nylon 66 (IP68)', righe: [
      ['M12', 3, 6.5, 'NGM12'], ['M16', 5, 10, 'NGM16'], ['M20', 10, 14, 'NGM20'], ['M25', 13, 18, 'NGM25'], ['M32', 18, 25, 'NGM32'], ['M40', 22, 32, 'NGM40'], ['M50', 30, 38, 'NGM50'], ['M63', 34, 44, 'NGM63']] },
    { marca: 'Fibox', serie: 'poliammide', righe: [
      ['M20', 8, 13, ''], ['M25', 11, 17, ''], ['M32', 15, 21, ''], ['M40', 19, 28, ''], ['M50', 27, 35, ''], ['M63', 32, 42, '']] },
    { marca: 'BM Group', serie: 'nylon IP68 serie 49.. (grigio; N = nero)', righe: [
      ['M12', 3, 6.5, '4912'], ['M16', null, null, '4917'], ['M20', null, null, '4920'], ['M25', null, null, '4925'], ['M32', null, null, '4932'], ['M40', null, null, '4940'], ['M50', null, null, '4950'], ['M63', null, null, '4963']] }
  ];

  // Diametro esterno indicativo dei cavi FG16OR16 (mm): [min, max] tra valore nominale e massimo dei cataloghi.
  const FG16OR16 = {
    '3G1.5': [12.5, 12.5], '3G2.5': [13.6, 13.6], '3G4': [14.9, 14.9], '3G6': [16.2, 16.2], '3G10': [18.2, 18.2], '3G16': [17.4, 20.6],
    '4G1.5': [13.4, 13.4], '4G2.5': [14.6, 14.6],
    '5G2.5': [15, 15.6], '5G4': [14.4, 17.3], '5G6': [15.9, 17.5], '5G10': [18.4, 21.5], '5G16': [21.3, 24.4], '5G25': [26.6, 29.3], '5G35': [29.6, 32.8], '5G50': [35, 38.2],
    '2x1.5': [12, 12], '2x2.5': [13, 13], '2x4': [14.2, 14.2]
  };

  // Capicorda Cembre A-M (rame, tubolari): sezione mm² → sigla, fori disponibili
  const CEMBRE_AM = [
    [6, 'A1', 'M4–M10'], [10, 'A2', 'M4–M12'], [16, 'A3', 'M4–M12'], [25, 'A5', 'M4–M12'], [35, 'A7', 'M5–M12'], [50, 'A10', 'M6–M16'],
    [70, 'A14', 'M6–M16'], [95, 'A19', 'M6–M20'], [120, 'A24', 'M8–M20'], [150, 'A30', 'M8–M12'], [185, 'A37', 'M10–M16'], [240, 'A48', 'M10–M16'], [300, 'A60', 'M10–M12']
  ];

  const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const f = x => Number(x).toLocaleString('it-IT', { maximumFractionDigits: 1 });

  // Pressacavi adatti a un cavo di diametro dMin–dMax
  function pressacaviPer(dMin, dMax = dMin) {
    const out = [];
    for (const p of PRESSACAVI) for (const [mis, a, b, cod] of p.righe) {
      if (a == null) continue;
      if (a <= dMin && b >= dMax) out.push({ marca: p.marca, serie: p.serie, mis, a, b, cod });
    }
    return out.sort((x, y) => +x.mis.slice(1) - +y.mis.slice(1));
  }
  function misuraTipica(lista) {
    const c = {}; lista.forEach(x => { c[x.mis] = (c[x.mis] || 0) + 1; });
    const mis = Object.keys(c).sort((a, b) => +a.slice(1) - +b.slice(1));
    return mis.find(m => c[m] >= 2) || mis[0];
  }
  function diametroCavo(nCond, S) {
    const keys = nCond ? [`${nCond}G${S}`, `${nCond}x${S}`] : [`5G${S}`, `3G${S}`, `4G${S}`, `2x${S}`];
    for (const k of keys) if (FG16OR16[k]) return { sigla: k, d: FG16OR16[k] };
    return null;
  }
  function capocorda(S) { return CEMBRE_AM.find(r => r[0] === S) || null; }

  // Tabelle in HTML per le guide dei reparti
  function tabPressacavi() {
    return '<h3 class="tab-tit">Pressacavi: diametro del cavo che stringono</h3>' + PRESSACAVI.map(p =>
      `<details class="tab-marca"><summary>${esc(p.marca)} · ${esc(p.serie)}</summary><table class="tab-risp"><tr><th>Misura</th><th>Cavo Ø</th><th>Codice</th></tr>${p.righe.map(([m, a, b, c]) => `<tr><td>${m}</td><td>${a == null ? 'vedi scheda' : f(a) + '–' + f(b) + ' mm'}</td><td>${esc(c)}</td></tr>`).join('')}</table></details>`).join('');
  }
  function tabCavi() {
    return `<h3 class="tab-tit">Diametro esterno cavi FG16OR16 (indicativo)</h3><table class="tab-risp"><tr><th>Cavo</th><th>Ø esterno</th></tr>${Object.entries(FG16OR16).map(([k, [a, b]]) => `<tr><td>${k.replace('.', ',')}</td><td>${a === b ? f(a) : f(a) + '–' + f(b)} mm</td></tr>`).join('')}</table><p class="small">Valori dai cataloghi Prysmian e di altri costruttori: cambiano un po' da marca a marca. Nel dubbio misura il cavo.</p>`;
  }
  function tabCapicorda() {
    return `<h3 class="tab-tit">Capicorda Cembre A-M (rame)</h3><table class="tab-risp"><tr><th>Sezione</th><th>Sigla</th><th>Fori</th></tr>${CEMBRE_AM.map(([s, a, fo]) => `<tr><td>${s} mm²</td><td>${a}-M…</td><td>${fo}</td></tr>`).join('')}</table><p class="small">Codice completo = sigla + vite: es. 50 mm² con vite M8 = <strong>A10-M8</strong>.</p>`;
  }

  if (typeof REPARTI !== 'undefined') {
    const r = REPARTI.find(x => x.id === 'raccordi'); if (r) r.guida += tabPressacavi() + tabCavi();
    const m = REPARTI.find(x => x.id === 'morsetti'); if (m) m.guida += tabCapicorda();
  }

  return { PRESSACAVI, FG16OR16, CEMBRE_AM, pressacaviPer, misuraTipica, diametroCavo, capocorda };
})();
