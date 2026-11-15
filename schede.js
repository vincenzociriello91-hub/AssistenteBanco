/* Assistente Banco — tabelle tecniche dei prodotti (dati dai cataloghi dei costruttori).
   Pressacavi: campo di serraggio per marca e misura. Cavi: diametro esterno. Capicorda Cembre A-M.
   Usate da domande.js e aggiunte alle guide dei reparti. */
'use strict';

const Schede = (() => {
  // Pressacavi in nylon, passo metrico, IP68. min–max = diametro del cavo che stringono (mm).
  const PRESSACAVI = [
    { marca: 'Gewiss', serie: 'GW FIT (IP68, grigio RAL 7035)', righe: [
      ['M12', 3, 6.5, 'GW52042'], ['M16', 5, 10, 'GW52043'], ['M20', 10, 14, 'GW52044'], ['M25', 13, 18, 'GW52045'], ['M32', 18, 25, 'GW52046'], ['M40', 22, 32, 'GW52047'], ['M50', 30, 38, 'GW52048'], ['M63', 35, 44, 'GW52049']] },
    { marca: 'Gewiss', serie: 'GW FIT passo PG (IP68)', righe: [
      ['PG9', 4, 8, 'GW52072'], ['PG11', 5, 10, 'GW52073'], ['PG16', 10, 14, 'GW52075'], ['PG29', 18, 25, 'GW52077'], ['PG42', 30, 38, 'GW52079'], ['PG48', 34, 44, 'GW52080']] },
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
      ['M12', 3, 6.5, '4912'], ['M16', 4, 8, '4917'], ['M20', 6, 12, '4920'], ['M25', 13, 18, '4925'], ['M32', 16, 21, '4932'], ['M40', 20, 26, '4940'], ['M50', 32, 38, '4950'], ['M63', 37, 44, '4963']] }
  ];

  // Diametro esterno cavi FG16OR16 (mm): [nominale Prysmian G16 TOP, massimo indicativo (dai cataloghi o +10%)].
  const FG16OR16 = {
    '1X1.5': [7.4, 8.1], '1X2.5': [7.9, 8.7], '1X4': [8.4, 9.2], '1X6': [8.7, 9.6], '1X10': [8.5, 9.4], '1X16': [9.6, 10.6], '1X25': [11.6, 12.8], '1X35': [12.7, 14], '1X50': [14.9, 16.4], '1X70': [17, 18.7], '1X95': [18.6, 20.5], '1X120': [20.7, 22.8], '1X150': [22.4, 24.6], '1X185': [25, 27.5], '1X240': [28.4, 31.2], '1X300': [31.3, 34.4], '2X1.5': [9.4, 12], '2X2.5': [10.2, 13], '2X4': [11.3, 14.2], '2X6': [12.4, 13.6], '2X10': [14.3, 15.7], '2X16': [16.4, 18], '2X25': [20.3, 22.3], '2X35': [22.5, 24.8], '2X50': [26.2, 28.8], '3G1.5': [9.8, 12.5], '3G2.5': [10.7, 13.6], '3G4': [11.9, 14.9], '3G6': [13.1, 16.2], '3G10': [15.1, 18.2], '3G16': [17.4, 20.6], '3G35': [24, 26.4], '3X50': [28, 30.8], '3X70': [32.7, 36], '4G1.5': [10.6, 11.7], '4G2.5': [11.6, 12.8], '4G4': [12.9, 14.2], '4G6': [14.2, 15.6], '4G10': [16.5, 18.2], '4G16': [19, 20.9], '4G25': [23.8, 26.2], '4G35': [29.2, 32.1], '3X35+1G25': [25.9, 28.5], '3X50+1G25': [29.4, 32.3], '3X70+1G35': [34.2, 37.6], '3X95+1G50': [38.2, 42], '3X120+1G70': [43.4, 47.7], '5G1.5': [11.8, 13], '5G2.5': [12.9, 15.6], '5G4': [14.4, 17.3], '5G6': [15.9, 17.5], '5G10': [18.4, 21.5], '5G16': [21.3, 24.4], '5G25': [26.6, 29.3], '5G35': [29.6, 32.8], '5G50': [35, 38.2], '7G1.5': [14.3, 15.7], '7G2.5': [15.6, 17.2], '10G1.5': [17.2, 18.9], '10G2.5': [18.9, 20.8], '12G1.5': [17.6, 19.4], '12G2.5': [19.4, 21.3], '16G1.5': [19.2, 21.1], '16G2.5': [21.2, 23.3], '19G1.5': [20.1, 22.1], '19G2.5': [22.2, 24.4], '24G1.5': [23, 25.3], '24G2.5': [25.5, 28.1]
  };

  // Capicorda Cembre A-M (rame, tubolari): sezione mm² → sigla, fori disponibili
  const CEMBRE_AM = [
    [6, 'A1', 'M4–M10'], [10, 'A2', 'M4–M12'], [16, 'A3', 'M4–M12'], [25, 'A5', 'M4–M12'], [35, 'A7', 'M5–M12'], [50, 'A10', 'M6–M16'],
    [70, 'A14', 'M6–M16'], [95, 'A19', 'M6–M20'], [120, 'A24', 'M8–M20'], [150, 'A30', 'M8–M12'], [185, 'A37', 'M10–M16'], [240, 'A48', 'M10–M16'], [300, 'A60', 'M10–M12']
  ];

  // Aspiratori elicoidali Vortice: [modello, Ø foro mm, portata max m³/h, codice base, codice con timer]
  const ASPIRATORI = [
    ['Punto M 90/3,5"', 90, 70, '', ''],
    ['Punto Evo ME 100/4" LL', 100, 95, '11260', '11264'],
    ['Punto M 100/4"', 100, 90, '11201', '11211'],
    ['Punto Evo ME 120/5" LL', 120, 175, '11270', '11274'],
    ['Punto M 120/5"', 120, 175, '11301', '11311'],
    ['Punto M 150/6"', 150, 335, '11401', '11411']
  ];

  const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const f = x => Number(x).toLocaleString('it-IT', { maximumFractionDigits: 1 });

  // Pressacavi adatti a un cavo di diametro dMin–dMax
  function pressacaviPer(dMin, dMax = dMin) {
    const out = [];
    for (const p of PRESSACAVI) for (const [mis, a, b, cod] of p.righe) {
      if (a == null) continue;
      // va bene se stringe il diametro nominale; se il massimo del cavo supera il campo, lo segnalo
      if (a <= dMin && b >= dMin) out.push({ marca: p.marca, serie: p.serie, mis, a, b, cod, limite: b < dMax });
    }
    const k = m => (m.startsWith('PG') ? 1000 : 0) + parseFloat(m.replace(/[^\d.]/g, ''));
    return out.sort((x, y) => k(x.mis) - k(y.mis));
  }
  function misuraTipica(lista) {
    const c = {}; lista.filter(x => x.mis.startsWith('M') && !x.limite).forEach(x => { c[x.mis] = (c[x.mis] || 0) + 1; });
    const mis = Object.keys(c).sort((a, b) => +a.slice(1) - +b.slice(1));
    return mis.find(m => c[m] >= 2) || mis[0] || lista.find(x => x.mis.startsWith('M'))?.mis;
  }
  function diametroCavo(nCond, S) {
    const keys = nCond ? [`${nCond}G${S}`, `${nCond}X${S}`] : [`5G${S}`, `4G${S}`, `3G${S}`, `3X${S}`, `2X${S}`, `1X${S}`];
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
    return `<h3 class="tab-tit">Diametro esterno cavi FG16OR16 / FG16R16</h3><table class="tab-risp"><tr><th>Cavo</th><th>Ø esterno</th></tr>${Object.entries(FG16OR16).map(([k, [a, b]]) => `<tr><td>${k.replace(/\./g, ',')}</td><td>${a === b ? f(a) : f(a) + '–' + f(b)} mm</td></tr>`).join('')}</table><p class="small">Primo valore: nominale Prysmian G16 TOP; secondo: massimo indicativo. Altre marche possono variare di 1–3 mm: nel dubbio misura il cavo.</p>`;
  }
  function tabCapicorda() {
    return `<h3 class="tab-tit">Capicorda Cembre A-M (rame)</h3><table class="tab-risp"><tr><th>Sezione</th><th>Sigla</th><th>Fori</th></tr>${CEMBRE_AM.map(([s, a, fo]) => `<tr><td>${s} mm²</td><td>${a}-M…</td><td>${fo}</td></tr>`).join('')}</table><p class="small">Codice completo = sigla + vite: es. 50 mm² con vite M8 = <strong>A10-M8</strong>.</p>`;
  }

  if (typeof REPARTI !== 'undefined') {
    const r = REPARTI.find(x => x.id === 'raccordi'); if (r) r.guida += tabPressacavi() + tabCavi();
    const m = REPARTI.find(x => x.id === 'morsetti'); if (m) m.guida += tabCapicorda();
  }

  return { ASPIRATORI, PRESSACAVI, FG16OR16, CEMBRE_AM, pressacaviPer, misuraTipica, diametroCavo, capocorda };
})();
