// Assistente Banco — motore di calcolo (valori indicativi).
// Fonti: IEC 60364-5-52 / CEI-UNEL 35024/1 (portate rame), CEI 64-8 (coordinamento, caduta di tensione).
(function (root) {
  'use strict';

  const SEZIONI = [1.5, 2.5, 4, 6, 10, 16, 25, 35, 50, 70, 95, 120];

  // Portate (A) a 30 °C, rame. [isolante][posa][conduttori caricati] -> valori per SEZIONI
  const PORTATE = {
    PVC: {
      A1: { 2: [14.5, 19.5, 26, 34, 46, 61, 80, 99, 119, 151, 182, 210],
            3: [13.5, 18, 24, 31, 42, 56, 73, 89, 108, 136, 164, 188] },
      B1: { 2: [17.5, 24, 32, 41, 57, 76, 101, 125, 151, 192, 232, 269],
            3: [15.5, 21, 28, 36, 50, 68, 89, 110, 134, 171, 207, 239] },
      B2: { 2: [16.5, 23, 30, 38, 52, 69, 90, 111, 133, 168, 201, 232],
            3: [15, 20, 27, 34, 46, 62, 80, 99, 118, 149, 179, 206] },
      C:  { 2: [19.5, 27, 36, 46, 63, 85, 112, 138, 168, 213, 258, 299],
            3: [17.5, 24, 32, 41, 57, 76, 96, 119, 144, 184, 223, 259] },
      E:  { 2: [22, 30, 40, 51, 70, 94, 119, 148, 180, 232, 282, 328],
            3: [18.5, 25, 34, 43, 60, 80, 101, 126, 153, 196, 238, 276] }
    },
    EPR: {
      A1: { 2: [19, 26, 35, 45, 61, 81, 106, 131, 158, 200, 241, 278],
            3: [17, 23, 31, 40, 54, 73, 95, 117, 141, 179, 216, 249] },
      B1: { 2: [23, 31, 42, 54, 75, 100, 133, 164, 198, 253, 306, 354],
            3: [20, 28, 37, 48, 66, 88, 117, 144, 175, 222, 269, 312] },
      B2: { 2: [22, 30, 40, 51, 69, 91, 119, 146, 175, 221, 265, 305],
            3: [19.5, 26, 35, 44, 60, 80, 105, 128, 154, 194, 233, 268] },
      C:  { 2: [24, 33, 45, 58, 80, 107, 138, 171, 209, 269, 328, 382],
            3: [22, 30, 40, 52, 71, 96, 119, 147, 179, 229, 278, 322] },
      E:  { 2: [26, 36, 49, 63, 86, 115, 149, 185, 225, 289, 352, 410],
            3: [23, 32, 42, 54, 75, 100, 127, 158, 192, 246, 298, 346] }
    }
  };

  const POSE = {
    A1: 'Unipolari in tubo incassato in parete isolante',
    B1: 'Unipolari in tubo/canala su parete o in muratura',
    B2: 'Multipolare in tubo/canala su parete',
    C:  'Cavo fissato direttamente su parete',
    E:  'Multipolare su passerella forata / in aria'
  };

  const K_TEMP = {
    PVC: { 10: 1.22, 15: 1.17, 20: 1.12, 25: 1.06, 30: 1, 35: 0.94, 40: 0.87, 45: 0.79, 50: 0.71 },
    EPR: { 10: 1.15, 15: 1.12, 20: 1.08, 25: 1.04, 30: 1, 35: 0.96, 40: 0.91, 45: 0.87, 50: 0.82 }
  };
  // Circuiti raggruppati (fascio su parete / in tubo)
  const K_GRUPPO = { 1: 1, 2: 0.8, 3: 0.7, 4: 0.65, 5: 0.6, 6: 0.57, 7: 0.54, 8: 0.52, 9: 0.5, 12: 0.45, 16: 0.41, 20: 0.38 };

  const IN_STD = [6, 10, 13, 16, 20, 25, 32, 40, 50, 63, 80, 100, 125];

  // Resistività rame a temperatura di esercizio (Ω·mm²/m)
  const RHO = { PVC: 0.017241 * (1 + 0.00393 * 50), EPR: 0.017241 * (1 + 0.00393 * 70) };
  const X_KM = 0.08; // reattanza tipica Ω/km

  function kGruppo(n) {
    n = Math.max(1, Math.round(n));
    const keys = Object.keys(K_GRUPPO).map(Number).sort((a, b) => a - b);
    let k = 1;
    for (const key of keys) if (n >= key) k = K_GRUPPO[key];
    return k;
  }

  function correnteImpiego({ potenzaW, sistema, tensione, cosphi }) {
    const V = tensione || (sistema === 'tri' ? 400 : 230);
    const c = cosphi || 1;
    return sistema === 'tri' ? potenzaW / (Math.sqrt(3) * V * c) : potenzaW / (V * c);
  }

  function cadutaTensione({ Ib, L, S, sistema, tensione, cosphi, isolante }) {
    const V = tensione || (sistema === 'tri' ? 400 : 230);
    const c = cosphi || 1;
    const s = Math.sqrt(Math.max(0, 1 - c * c));
    const R = 1000 * RHO[isolante || 'PVC'] / S; // Ω/km
    const k = sistema === 'tri' ? Math.sqrt(3) : 2;
    const dV = k * (L / 1000) * Ib * (R * c + X_KM * s);
    return { dV, perc: 100 * dV / V };
  }

  function portata({ S, isolante, posa, conduttori, temp, circuiti }) {
    const i = SEZIONI.indexOf(S);
    if (i < 0) return null;
    const base = PORTATE[isolante][posa][conduttori][i];
    const kt = K_TEMP[isolante][temp] ?? 1;
    const kg = kGruppo(circuiti || 1);
    return { base, kt, kg, Iz: base * kt * kg };
  }

  function interruttoreMinimo(Ib) {
    return IN_STD.find(x => x >= Ib) ?? null;
  }

  // Dimensionamento: sezione minima che rispetta Ib ≤ In ≤ Iz e caduta ≤ limite
  function dimensiona(p) {
    const Ib = p.Ib ?? correnteImpiego(p);
    const In = p.In || interruttoreMinimo(Ib);
    const righe = [];
    let scelta = null;
    for (const S of SEZIONI) {
      if (p.sezioneMin && S < p.sezioneMin) continue;
      const pt = portata({ ...p, S });
      const cdt = cadutaTensione({ ...p, Ib, S });
      const okPortata = In != null && In <= pt.Iz && Ib <= In;
      const okCdt = cdt.perc <= (p.limiteCdt ?? 4);
      righe.push({ S, Iz: pt.Iz, cdt: cdt.perc, okPortata, okCdt });
      if (!scelta && okPortata && okCdt) scelta = { S, Iz: pt.Iz, cdt };
    }
    return { Ib, In, scelta, righe };
  }

  function curvaConsigliata(tipo) {
    return ({
      luce: { curva: 'B o C', nota: 'Illuminazione: C va bene; B per linee lunghe o LED con poca corrente di cortocircuito.' },
      prese: { curva: 'C', nota: 'Prese e uso generale.' },
      motore: { curva: 'C o D', nota: 'D per motori con spunto forte, trasformatori, saldatrici.' },
      resistivo: { curva: 'B o C', nota: 'Forni, piani cottura, scaldabagni: carichi resistivi.' },
      inverter: { curva: 'C', nota: 'Pompe di calore, condizionatori inverter, lavatrici.' },
      wallbox: { curva: 'C', nota: 'Ricarica auto: linea dedicata.' }
    })[tipo] || { curva: 'C', nota: '' };
  }

  function differenzialeConsigliato(tipo, sistema) {
    switch (tipo) {
      case 'inverter': return sistema === 'tri'
        ? { tipo: 'B (o F/B secondo costruttore)', idn: '30 mA o 300 mA secondo impianto', nota: 'Inverter trifase: possibili correnti di guasto continue.' }
        : { tipo: 'F', idn: '30 mA', nota: 'Inverter monofase (lavatrice, PdC, climatizzatore).' };
      case 'wallbox': return { tipo: 'A + rilevamento 6 mA DC (RDC-DD) oppure B', idn: '30 mA', nota: 'Verifica cosa integra già la wallbox.' };
      case 'luce': return { tipo: 'A', idn: '30 mA', nota: 'Tipo AC sconsigliato con carichi elettronici (LED, alimentatori).' };
      default: return { tipo: 'A', idn: '30 mA', nota: 'Protezione addizionale per prese e locali da bagno.' };
    }
  }

  // Tubi / corrugati: diametro interno ≥ 1,3 × diametro del fascio (CEI 64-8)
  const DIAM_CAVO = { 1.5: 3.0, 2.5: 3.6, 4: 4.2, 6: 4.8, 10: 6.2, 16: 7.3, 25: 9.2, 35: 10.5, 50: 12.5 }; // H07V-K / FS17, mm
  const TUBI = [ { est: 16, int: 10.7 }, { est: 20, int: 14.1 }, { est: 25, int: 18.3 }, { est: 32, int: 24.3 }, { est: 40, int: 31.2 }, { est: 50, int: 39.6 }, { est: 63, int: 50.6 } ];
  const PACKING = [0, 1, 2, 2.155, 2.414, 2.701, 3, 3, 3.305, 3.613, 3.813, 3.923, 4.029, 4.236, 4.328, 4.521, 4.615, 4.792, 4.863, 4.863, 5.122];

  function fascio(cavi) { // cavi: [{S, n}]
    const lista = cavi.filter(c => c.n > 0 && DIAM_CAVO[c.S]);
    if (!lista.length) return null;
    const dMax = Math.max(...lista.map(c => DIAM_CAVO[c.S]));
    const area = lista.reduce((a, c) => a + c.n * DIAM_CAVO[c.S] ** 2, 0);
    const nEq = Math.ceil(area / dMax ** 2 - 1e-9);
    const ratio = nEq < PACKING.length ? PACKING[nEq] : 1.1 * Math.sqrt(nEq);
    const dFascio = dMax * ratio;
    const minInt = 1.3 * dFascio;
    const tubo = TUBI.find(t => t.int >= minInt) || null;
    return { dFascio, minInt, tubo };
  }

  // Conversioni
  const conv = {
    kwToA: (kW, sistema, V, c) => correnteImpiego({ potenzaW: kW * 1000, sistema, tensione: V, cosphi: c }),
    aToKw: (A, sistema, V, c) => (sistema === 'tri' ? Math.sqrt(3) : 1) * (V || (sistema === 'tri' ? 400 : 230)) * A * (c || 1) / 1000,
    hpToKw: hp => hp * 0.7355,
    kvaToKw: (kva, c) => kva * (c || 1)
  };

  // Potenza contatore: limite prelevabile continuativo +10%
  function contatore(kW) { return { continuo: kW * 1.1, nota: 'Oltre il +10% per ~2 ore il contatore può staccare; oltre il +27% stacca in pochi minuti.' }; }

  // Illuminazione: lumen necessari
  const LUX = { soggiorno: 150, cucina: 300, bagno: 200, camera: 100, studio: 500, corridoio: 100, garage: 100, negozio: 500, ufficio: 500 };
  function lumen(stanza, mq) { return (LUX[stanza] || 200) * mq; }

  const api = { SEZIONI, PORTATE, POSE, K_TEMP, IN_STD, DIAM_CAVO, TUBI, LUX, correnteImpiego, cadutaTensione, portata, interruttoreMinimo, dimensiona, curvaConsigliata, differenzialeConsigliato, fascio, conv, contatore, lumen, kGruppo };
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  root.Calc = api;
})(typeof globalThis !== 'undefined' ? globalThis : this);
