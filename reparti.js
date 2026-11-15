/* Assistente Banco — reparti del negozio: marche, modelli e guida rapida.
   Le marche aggiunte dall'utente restano sul dispositivo (localStorage "ab_reparti_utente"). */
'use strict';

const REPARTI = [
  {
    id: 'civile', nome: 'Elettrico civile', icona: '🔌',
    marche: [
      { marca: 'BTicino', modelli: 'Living Now, Matix, Matix GO, Axolute' },
      { marca: 'Vimar', modelli: 'Plana, Arké, Eikon, Linea, Neve Up' },
      { marca: 'Gewiss', modelli: 'Chorus' },
      { marca: 'Schneider Electric', modelli: 'Unica' },
      { marca: 'Master', modelli: 'Modo' },
      { marca: 'Simon Urmet', modelli: 'Nea (estetiche Kàdra, Expì, Flexa)' }
    ],
    guida: `<ul class="ref">
      <li>I frutti non sono intercambiabili tra marche diverse; le scatole da incasso 503 (3 moduli) vanno bene per tutte, le placche no.</li>
      <li>Prese: 10 A (bipolare piccola), 16 A (bipolare grande), bipasso 10/16 A, Schuko (con bipasso = "universale").</li>
      <li>Comandi: interruttore (1 punto), deviatore (2 punti), invertitore (da 3 punti in su, tra due deviatori), pulsante (relè o luci scale).</li>
      <li>Sezioni: luce 1,5 mm², prese 16 A 2,5 mm²; differenziale 30 mA a monte delle prese.</li>
    </ul>`
  },
  {
    id: 'illuminazione', nome: 'Illuminazione', icona: '💡',
    marche: [],
    guida: `<ul class="ref">
      <li><strong>Temperatura colore:</strong> 2700–3000 K luce calda (casa), 4000 K neutra (cucina, bagno, ufficio), 5000–6500 K fredda (garage, magazzino).</li>
      <li><strong>Resa cromatica:</strong> CRI ≥ 80 uso generale, ≥ 90 negozi, cucine, trucco.</li>
      <li><strong>Attacchi:</strong> E27 e E14 a vite; GU10 a 230 V; GU5.3 (MR16) a 12 V con trasformatore/driver; G9 piccola a 230 V.</li>
      <li><strong>Dimmerabile:</strong> lampada e dimmer devono essere compatibili (con i LED di solito dimmer a taglio di fase discendente, "trailing edge").</li>
      <li><strong>Strisce LED:</strong> 12 o 24 V con alimentatore a tensione costante; potenza alimentatore ≥ W/m × metri + 20%.</li>
      <li><strong>IP:</strong> esterno almeno IP44, a terra o esposto IP65; bagno secondo la zona.</li>
      <li>Lumen necessari: strumento <em>Illuminazione</em> in Strumenti.</li>
    </ul>`
  },
  {
    id: 'clima', nome: 'Condizionatori', icona: '❄️',
    marche: [
      { marca: 'Daikin', modelli: 'Ururu Sarara (FTXZ), Emura (FTXJ), Stylish (FTXA), Perfera (FTXM), Comfora (FTXP), Sensira (FTXF)', note: 'Esterne mono RXZ, RXJ, RXA, RXM, RXP; multisplit 2MXM–5MXM; pompe di calore Altherma' },
      { marca: 'Mitsubishi Electric', modelli: 'Kirigamine Style (MSZ-LN), Kirigamine Zen (MSZ-EF), Linea Plus (MSZ-AP), Linea Smart (MSZ-HR, MSZ-DW)', note: 'Esterne mono MUZ; multisplit MXZ; pompe di calore Ecodan' },
      { marca: 'Samsung', modelli: 'WindFree Elite S2, WindFree Comfort S2, Luzon S2, AR30 Malibu', note: 'Pompe di calore EHS (Mono, Split, TDM Plus, ClimateHub)' },
      { marca: 'Haier', modelli: 'Expert, Flexis / Flexis Plus, Pearl Premium, Revive Plus, Serene', note: 'Multisplit fino a 5 interne; app hOn' },
      { marca: 'Clivet', modelli: 'Cervino (monosplit R290)', note: 'Pompe di calore Sphera EVO 2.0, Edge / Edge Pro, Hydro-Split' },
      { marca: 'Aermec', modelli: 'Climatizzatori split', note: 'VRF MVA, pompe di calore, ventilconvettori' }
    ],
    guida: `<ul class="ref">
      <li>Interna ed esterna vanno abbinate come dice il costruttore (es. Daikin Stylish con RXA, Emura con RXJ, Perfera con RXM).</li>
      <li>Multisplit: controlla che ogni interna sia compatibile con quell'esterna.</li>
      <li>Linea dedicata con magnetotermico; taglia e sezione dalla corrente massima scritta sulla targa dell'esterna.</li>
      <li>Taglia in BTU: strumento <em>Climatizzatore</em> in Strumenti. 1 kW ≈ 3412 BTU/h.</li>
    </ul>`
  },
  {
    id: 'cavi', nome: 'Cavi', icona: '🧵',
    marche: [],
    guida: `<ul class="ref">
      <li><strong>FS17</strong> 450/750 V, PVC, unipolare: dentro tubi e canaline (ha sostituito N07V-K).</li>
      <li><strong>FG16OR16</strong> 0,6/1 kV, multipolare con guaina: esterno, interrato in tubo, linee di alimentazione.</li>
      <li><strong>FG17</strong> 450/750 V unipolare in gomma EPR: quadri e dove serve più temperatura.</li>
      <li><strong>H07RN-F</strong> gomma: cantiere, prolunghe, apparecchi mobili all'aperto.</li>
      <li><strong>H05VV-F</strong> (cordone) per apparecchi domestici; <strong>H03VH-H</strong> piattina per lampade.</li>
      <li><strong>H1Z2Z2-K</strong> solare per fotovoltaico (lato corrente continua), 4 o 6 mm².</li>
      <li><strong>Classe CPR</strong> stampata sul cavo (es. Cca-s3,d1,a3; Eca): nei locali pubblici o affollati servono classi più alte, decide il progettista.</li>
      <li>Colori: marrone/nero/grigio fase, blu neutro, giallo-verde terra.</li>
      <li>Sezione giusta: tab <em>Cavi</em> (dimensiona linea).</li>
    </ul>`
  },
  {
    id: 'fotovoltaico', nome: 'Impianto fotovoltaico', icona: '☀️',
    marche: [],
    guida: `<ul class="ref">
      <li><strong>Componenti:</strong> moduli, inverter (di stringa o ibrido con batteria), eventuali ottimizzatori, batteria di accumulo, quadro lato DC, quadro lato AC.</li>
      <li><strong>Lato DC:</strong> cavo solare H1Z2Z2-K 4/6 mm², connettori MC4 (maschio e femmina della stessa marca e modello), sezionatore DC, scaricatore SPD per corrente continua, fusibili di stringa se richiesti.</li>
      <li><strong>Lato AC:</strong> magnetotermico dedicato; il differenziale (tipo A, F o B) lo indica il manuale dell'inverter.</li>
      <li>Potenza: kWp dei moduli; con batteria guarda kWh utili e potenza di scarica.</li>
      <li>Connessione alla rete: pratica con il distributore; l'impianto lo dichiara l'installatore.</li>
    </ul>`
  },
  {
    id: 'domotica', nome: 'Domotica', icona: '🏠',
    marche: [
      { marca: 'BTicino', modelli: 'Living Now with Netatmo (radio), MyHome (filare)' },
      { marca: 'Vimar', modelli: 'View Wireless (radio), By-me Plus (filare)' }
    ],
    guida: `<ul class="ref">
      <li><strong>Filare (bus):</strong> cavo dedicato, più affidabile, va previsto in fase di impianto. KNX è lo standard aperto multi-marca; MyHome e By-me sono sistemi delle singole marche.</li>
      <li><strong>Radio:</strong> Zigbee, Wi-Fi, Bluetooth, Matter. Ideale in ristrutturazione: si cambiano i frutti senza rompere muri.</li>
      <li>Serve quasi sempre un gateway/hub e il Wi-Fi di casa; controlla che il cliente abbia copertura nei punti giusti.</li>
      <li>Assistenti vocali: verifica la compatibilità (Google, Alexa, Apple) sulla scheda del prodotto.</li>
    </ul>`
  },
  {
    id: 'tubi', nome: 'Corrugati, cassette e tubi RK', icona: '🧰',
    marche: [
      { marca: 'Gewiss', modelli: 'Tubi rigidi RK9 (leggero), RK15 (medio), RKB (pesante), RK9 HF e RKHF (halogen free)', note: 'Diametri 16–63 mm, verghe da 2 e 3 m' }
    ],
    guida: `<ul class="ref">
      <li><strong>Classificazione CEI EN 61386</strong> (le cifre sul tubo): 1ª cifra compressione 2 = leggero 320 N, 3 = medio 750 N, 4 = pesante 1250 N; 2ª cifra urto (2 J medio, 6 J pesante).</li>
      <li><strong>Corrugato leggero</strong> (320 N): in parete, sotto intonaco. <strong>Corrugato pesante</strong>: a pavimento e nel massetto, dove si cammina o si getta il calcestruzzo.</li>
      <li><strong>Cavidotto</strong> doppia parete 450 N o 750 N (CEI EN 61386-24): interrato.</li>
      <li><strong>Tubo rigido RK:</strong> posa a vista su parete, controsoffitti, pavimenti flottanti; si raccorda a scatole e guaine con gli accessori della serie (l'IP dipende dagli accessori).</li>
      <li><strong>Halogen free</strong> (HF): locali pubblici, gallerie, dove i fumi devono essere poco tossici.</li>
      <li><strong>Cassette di derivazione/ispezione:</strong> da incasso o da parete; scegli misura dal numero di tubi e morsetti, IP44 interno umido, IP55/IP56 esterno, IP65 dove arriva acqua a getto. Non chiudere giunzioni fuori dalle cassette.</li>
      <li>Diametro del corrugato giusto: strumento <em>Tubo / corrugato</em> in Strumenti.</li>
    </ul>`
  },
  {
    id: 'citofonia', nome: 'Citofonia e videosorveglianza', icona: '📹',
    marche: [
      { marca: 'Urmet', modelli: 'Sistemi 2Voice, IPerCom; monitor Aiko, Folio, Signo; pulsantiere Sinthesi, Sinthesi S2, Sinthesi Steel, Alpha', note: 'Aiko con Nea Expì, Folio con Nea Kàdra, Signo con Nea Flexa' },
      { marca: 'Comelit', modelli: 'Sistemi Simplebus 1, Simplebus 2 (2 fili), ViP (IP); monitor Maxi 7", Icona 4,3", Mini, Mini Handsfree, Mini Wi-Fi; pulsantiere Ultra, 3One6, Switch, Vandalcom', note: 'Mini Wi-Fi sostituisce un vecchio monitor Simplebus 2 senza modifiche' },
      { marca: 'Hikvision', modelli: 'Turbo HD (analogico, DVR), IP (NVR), AcuSense, ColorVu, linee ProExpert e HiWatch; antintrusione AX PRO' }
    ],
    guida: `<ul class="ref">
      <li>Monitor e pulsantiera devono essere dello stesso sistema.</li>
      <li>Telecamere Turbo HD su DVR, telecamere IP su NVR: non si mischiano, salvo DVR ibridi.</li>
    </ul>`
  }
];

const RepartiUI = {
  utente() { try { return JSON.parse(localStorage.getItem('ab_reparti_utente') || '{}'); } catch { return {}; } },
  salva(dati) { try { localStorage.setItem('ab_reparti_utente', JSON.stringify(dati)); } catch {} },
  esc: s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c])),
  render() {
    const box = document.getElementById('repartiLista');
    if (!box) return;
    const mie = this.utente();
    const q = (document.getElementById('repQ')?.value || '').toLowerCase().trim();
    box.innerHTML = REPARTI.map(r => {
      const tutte = [...r.marche.map(m => ({ ...m })), ...(mie[r.id] || []).map((m, i) => ({ ...m, mia: i }))];
      const filtrate = q ? tutte.filter(m => `${m.marca} ${m.modelli} ${m.note || ''}`.toLowerCase().includes(q)) : tutte;
      if (q && !filtrate.length && !r.nome.toLowerCase().includes(q)) return '';
      const righe = filtrate.length ? `<table><thead><tr><th>Marca</th><th>Modelli / serie</th></tr></thead><tbody>${filtrate.map(m => `<tr><td><strong>${this.esc(m.marca)}</strong>${m.mia != null ? ` <button class="btn-mini" data-del="${r.id}:${m.mia}" aria-label="Elimina">✕</button>` : ''}</td><td>${this.esc(m.modelli)}${m.note ? `<div class="small">${this.esc(m.note)}</div>` : ''}</td></tr>`).join('')}</tbody></table>`
        : '<p class="hint">Nessuna marca ancora: aggiungi quelle che vendete.</p>';
      return `<details class="card" ${q ? 'open' : ''}><summary>${r.icona} ${this.esc(r.nome)} <span class="small">· ${tutte.length} marche</span></summary>
        ${righe}
        <form class="grid addmarca" data-rep="${r.id}" style="margin-top:12px">
          <label>Marca<input name="marca" required></label>
          <label class="wide">Modelli / serie<input name="modelli" placeholder="separati da virgola"></label>
          <label class="wide">Note<input name="note" placeholder="facoltativo"></label>
          <button class="btn tonal" type="submit">Aggiungi marca</button>
        </form>
        <details style="margin-top:12px"><summary>Guida rapida</summary>${r.guida}</details>
      </details>`;
    }).join('') || '<p class="hint">Nessun risultato.</p>';
  },
  init(log) {
    const box = document.getElementById('repartiLista');
    if (!box) return;
    box.addEventListener('submit', e => {
      const f = e.target.closest('form.addmarca'); if (!f) return;
      e.preventDefault();
      const d = Object.fromEntries(new FormData(f));
      if (!d.marca.trim()) return;
      const mie = this.utente(); (mie[f.dataset.rep] ||= []).push({ marca: d.marca.trim(), modelli: d.modelli.trim(), note: d.note.trim() });
      this.salva(mie); log?.('reparto-aggiunta', { reparto: f.dataset.rep });
      this.render();
      box.querySelector(`form[data-rep="${f.dataset.rep}"]`)?.closest('details.card')?.setAttribute('open', '');
    });
    box.addEventListener('click', e => {
      const b = e.target.closest('[data-del]'); if (!b) return;
      const [rep, i] = b.dataset.del.split(':');
      const mie = this.utente(); mie[rep]?.splice(Number(i), 1); this.salva(mie);
      log?.('reparto-eliminazione', { reparto: rep });
      this.render();
      box.querySelector(`form[data-rep="${rep}"]`)?.closest('details.card')?.setAttribute('open', '');
    });
    document.getElementById('repQ')?.addEventListener('input', () => this.render());
    this.render();
  }
};
