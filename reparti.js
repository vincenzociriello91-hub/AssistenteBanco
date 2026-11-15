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
    marche: [
      { marca: 'Philips (Signify)', modelli: 'Lampade e apparecchi LED professionali, Philips Hue (smart), Interact (illuminazione connessa)' },
      { marca: 'Ledvance (Osram)', modelli: 'Lampadine LED, proiettori LED Performance, strisce LED, alimentatori e controlli' },
      { marca: 'Beghelli', modelli: 'Illuminazione di emergenza, lampade Saving LED ed Eco LED, apparecchi tecnici' },
      { marca: 'Disano', modelli: 'Apparecchi tecnici per interni ed esterni, industriali, urbani e stradali' },
      { marca: 'Fosnova (gruppo Disano)', modelli: 'Apparecchi per interni di pregio e di design' },
      { marca: '3F Filippi', modelli: 'Illuminazione tecnica professionale e industriale' },
      { marca: 'Performance in Lighting', modelli: 'Illuminazione LED per interni ed esterni' },
      { marca: 'iGuzzini', modelli: 'Illuminazione architetturale' }
    ],
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
    marche: [
      { marca: 'Prysmian', modelli: 'FS17, FG16OR16 (G16 TOP), FG17, FG16OM16 e gamma CPR completa' },
      { marca: 'La Triveneta Cavi (gruppo Nexans)', modelli: 'FS17, FG16OR16/M16 (gamma Klaro con marcatura colorata), FG18(O)M16, cavo solare NPE SUN H1Z2Z2-K' },
      { marca: 'Baldassari Cavi', modelli: 'Cavi BT per impianti civili e industriali (FS17, FG17, FG16OR16)' },
      { marca: 'Icel', modelli: 'Cavi BT per impianti civili e industriali (FS17, FG17, FG16OR16)' }
    ],
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
    marche: [
      { marca: 'Huawei', modelli: 'Inverter SUN2000 (monofase ibrido L1 2–6 kW, trifase), batterie LUNA2000' },
      { marca: 'SMA', modelli: 'Sunny Boy 3.0–6.0 (monofase), Sunny Boy Smart Energy (ibrido), Sunny Tripower (trifase)' },
      { marca: 'Fronius', modelli: 'Primo GEN24 / GEN24 Plus (monofase 3–6 kW, ibrido con backup), Symo GEN24 (trifase)' },
      { marca: 'SolarEdge', modelli: 'Inverter HD-Wave con ottimizzatori per modulo, Home Hub, batterie' },
      { marca: 'ZCS Azzurro', modelli: 'Inverter ibridi HYD monofase e trifase, batterie, wallbox (marchio italiano)' },
      { marca: 'Sungrow', modelli: 'Inverter residenziali e commerciali, batterie' },
      { marca: 'Kostal / GoodWe', modelli: 'Inverter residenziali, ibridi e retrofit' },
      { marca: 'BYD', modelli: 'Batterie di accumulo' },
      { marca: 'Moduli', modelli: 'Jinko Solar, JA Solar, Trina Solar, Peimar, Sunerg', note: 'Controlla che i moduli siano compatibili con tensione e corrente dell\'inverter' }
    ],
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
      { marca: 'Vimar', modelli: 'View Wireless (radio), By-me Plus (filare)' },
      { marca: 'Gewiss', modelli: 'ChoruSmart: Connected Smart Home (Wi-Fi/Zigbee) e Home & Building PRO (KNX); app Home Gateway' },
      { marca: 'ABB', modelli: 'free@home (bus filare e wireless, senza software di programmazione), KNX' },
      { marca: 'Schneider Electric', modelli: 'Wiser, KNX' }
    ],
    guida: `<ul class="ref">
      <li><strong>Filare (bus):</strong> cavo dedicato, più affidabile, va previsto in fase di impianto. KNX è lo standard aperto multi-marca; MyHome e By-me sono sistemi delle singole marche.</li>
      <li><strong>Radio:</strong> Zigbee, Wi-Fi, Bluetooth, Matter. Ideale in ristrutturazione: si cambiano i frutti senza rompere muri.</li>
      <li>Serve quasi sempre un gateway/hub e il Wi-Fi di casa; controlla che il cliente abbia copertura nei punti giusti.</li>
      <li>Assistenti vocali: verifica la compatibilità (Google, Alexa, Apple) sulla scheda del prodotto.</li>
    </ul>`
  },
  {
    id: 'tubi', nome: 'Corrugati e tubi RK', icona: '🧰',
    marche: [
      { marca: 'Gewiss', modelli: 'Tubi rigidi RK9 (leggero), RK15 (medio), RKB (pesante), RK9 HF e RKHF (halogen free)', note: 'Diametri 16–63 mm, verghe da 2 e 3 m' },
      { marca: 'Tubifor', modelli: 'Corrugati PVC classe 3321 (con o senza tirafilo, vari colori), corrugati ICTA in polipropilene 3422 halogen free, tubi precablati, tubi rigidi PVC, cavidotti interrati, guaine spiralate, canali portacavi', note: 'Codice corrugato es. TF01032AT025 = Ø32, azzurro (A), con tirafilo (T), rotolo 25 m; TF01025NT050 = Ø25 nero 50 m' },
      { marca: 'Inset (Hager Bocchiotti)', modelli: 'Corrugati pieghevoli FMP 3321 (Ø16–50): FMP nero, FMPA azzurro, FMPB bianco, FMPL lilla, FMPM marrone, FMPV verde; tubi rigidi GRI 3321 e RFG 4321; guaine GHF halogen free', note: 'Accessori: manicotto MFL IP64, raccordo tubo-scatola PREG IP64-67, raccordo rigido-scatola RSTN IP67, sonde tirafili STC. Ora nella stessa gamma Pmflex' }
    ],
    guida: `<ul class="ref">
      <li><strong>Classificazione CEI EN 61386</strong> (le cifre sul tubo): 1ª cifra compressione 2 = leggero 320 N, 3 = medio 750 N, 4 = pesante 1250 N; 2ª cifra urto (2 J medio, 6 J pesante).</li>
      <li><strong>Corrugato leggero</strong> (320 N): in parete, sotto intonaco. <strong>Corrugato pesante</strong>: a pavimento e nel massetto, dove si cammina o si getta il calcestruzzo.</li>
      <li><strong>Cavidotto</strong> doppia parete 450 N o 750 N (CEI EN 61386-24): interrato.</li>
      <li><strong>Tubo rigido RK:</strong> posa a vista su parete, controsoffitti, pavimenti flottanti; si raccorda a scatole e guaine con gli accessori della serie (l'IP dipende dagli accessori).</li>
      <li><strong>Halogen free</strong> (HF): locali pubblici, gallerie, dove i fumi devono essere poco tossici.</li>
      <li>Raccordi, pressacavi e cassette: reparto <em>Raccordi, pressacavi e cassette</em>.</li>
      <li><strong>Equivalenze tra marche:</strong> stesso diametro + stessa classificazione = stesso tubo (es. Inset FMP 3321 Ø25 ≈ Tubifor corrugato 3321 Ø25 ≈ corrugato medio 750 N Gewiss Ø25). Il colore serve solo a distinguere gli impianti (energia, dati, citofono…).</li>
      <li>Diametro del corrugato giusto: strumento <em>Tubo / corrugato</em> in Strumenti.</li>
    </ul>`
  },
  {
    id: 'morsetti', nome: 'Morsetti, capicorda e connessioni', icona: '🔩',
    marche: [
      { marca: 'Cembre', modelli: 'Capicorda preisolati ANE (PA 6.6), gamme F (PVC) e P (PC); non isolati AM, AP, AU, DIN 46234; giunti LM e LP; tubetti terminali PK; morsetti DIN a vite e push-in; pressacavi; siglatura', note: 'Utensili: pinze Crimpstar (es. HN1 0,25–10 mm²), oleodinamici manuali e a batteria da 15 a 130 kN (es. B500 63 kN)' },
      { marca: 'BM Group (gruppo Beta)', modelli: 'Capicorda ad aggraffatura preisolati e non isolati, capicorda e giunti a compressione, morsettiere, pressacavi, raccordi, nastri isolanti', note: 'Pinze per aggraffatura e presse idrauliche manuali ed elettriche; BM Work Line (utensili e sicurezza)' },
      { marca: 'Weidmüller', modelli: 'Klippon Connect serie A PUSH IN (A2C, A3C, A4C, PE, sezionabili ADT, A2T per KNX), serie W a vite, morsetti di alimentazione ALO', note: 'Anche alimentatori, relè Klippon, siglatura M-Print' },
      { marca: 'Cabur', modelli: 'Morsetti su guida DIN a vite (es. serie CBC), a molla (HMM), push-in serie EFC', note: 'Siglatura con stampanti SmartPrint e SmartRoll' }
    ],
    guida: `<ul class="ref">
      <li><strong>Vite, molla o push-in:</strong> a vite il classico (stringere alla coppia giusta); a molla resiste alle vibrazioni; push-in il filo rigido o con puntale si infila e basta, il più veloce.</li>
      <li><strong>Capicorda preisolati, colore = sezione:</strong> rosso 0,5–1,5 mm², blu 1,5–2,5 mm², giallo 4–6 mm². Il foro (M4, M5, M6…) va scelto sulla vite del morsetto.</li>
      <li><strong>Puntali (tubetti terminali):</strong> per cavi flessibili nei morsetti; sezione del puntale = sezione del cavo.</li>
      <li><strong>Grandi sezioni:</strong> capicorda a compressione con la matrice giusta per sezione; serve pinza o pressa oleodinamica adeguata (kN).</li>
      <li><strong>Morsetti su guida DIN 35:</strong> sezione del morsetto ≥ sezione del cavo; verde-giallo per la terra (PE), blu per il neutro; testate di chiusura e fermi a fine fila.</li>
      <li><strong>Equivalenze:</strong> tra marche si confrontano tipo di connessione, sezione, numero di connessioni e tensione/corrente nominale.</li>
    </ul>`
  },
  {
    id: 'raccordi', nome: 'Raccordi, pressacavi e cassette', icona: '🧩',
    marche: [
      { marca: 'Gewiss — raccordi e pressacavi', modelli: 'Serie RK: manicotti, curve, raccordi tubo-scatola Morbidx IP67 (DX43216–DX43250), tubo-guaina IP65 (DX433..), accessorio universale tubo-tubo; guaine DF con raccordi IP54 diritti o girevoli (passo GAS/PG, DX54..); GW FIT: pressacavi metrici e PG IP68 (GW52..), pressacavi con alloggiamento tubo rigido IP66, raccordi tubo/cassetta IP66 e IP44, passacavi IP55; collari e fissaggi (DX51..)' },
      { marca: 'Gewiss — cassette', modelli: 'Parete: 44 CE in tecnopolimero IP44/IP55/IP56 (es. GW44024 100×100×70 IP55, GW44206 150×110×70 IP56, GW44209 300×220×120), GW Connect in metallo. Incasso: serie 48 (GW48001 92×92×45, GW48002 118×96×50, fino a 479×154×70), scatole 24 SC per serie civili (GW24203 3 moduli, GW24403/24404/24406), Green Wall per cartongesso (scatole, cassette 48 PTDIN con guida DIN, cassette prese interbloccate 44IB/67IB), torrette a pavimento' },
      { marca: 'BTicino — scatole incasso', modelli: '500 tonda, 502E (2 moduli), 503E (3 moduli, 108×74×53,5), 504E (4 moduli), 506E (3+3), 506L (6/7 moduli), 510L/510N; accessori 503CG paramalta, 503ED affiancamento, 503EV separatore, 506ESE prolunga +1 cm', note: 'Supporti: 503SA e 504SA (Matix), K4703 (Living Now); placche IP55 per 503E/504E' },
      { marca: 'Vimar — Isobox', modelli: 'Incasso muratura: V71001 tonda, V71303 (3M), V71304 (4M), V71305 (5M), V71306 (6-7M), versioni .AU nere GWT 960 °C; pareti leggere: V71601, V71613, V71703, V71720 (12-14M); derivazione da incasso fino a V70009 479×154×70', note: 'Accessori: paramalta V71323/V71324/V71326, separatore V71550, giunto V71563, griffe V71540, staffa per cappotto V71543, coperchio filo muro V71633/V71634' },
      { marca: 'Bocchiotti / Inset (Hager)', modelli: 'Cassette parete Pico IP55 e IP56 (chiusura ¼ di giro o viti inox, GWT 650/960 °C), centralini Pablo IP65, Pablo Style da incasso (scatole per muratura arancioni e per cartongesso bianche), quadri IP40 da incasso 4–72 moduli', note: 'Raccordi Inset: manicotto MFL IP64, raccordo tubo-scatola PREG IP64-67, raccordo rigido-scatola RSTN IP67' },
      { marca: 'Cembre — pressacavi', modelli: 'Serie 1900 in poliammide (PG e metrico, es. 1900.16 PG16 cavo Ø10–14), 2900 in ottone nichelato IP68, MAXIblock 1940.M e MAXIbrass 2940.M a serraggio esteso (M25–M63, IP68), dadi e controdadi in ottone' },
      { marca: 'BM Group — pressacavi', modelli: 'Pressacavi in nylon e ottone, filetto metrico, PG e GAS, con o senza controdado, IP68, grigio RAL 7035 e nero' },
      { marca: 'Palazzoli', modelli: 'Cassette TAIS e TAISBOX in termoindurente (IP66/67/69, IK10, GWT 960 °C), UNIBOX e ALUPRES in alluminio, PRIMA, FIREBOX resistenti al fuoco (E30/E60/E90), ATEX TAIS-EX e ALUCASE-EX; pressacavi', note: 'FIREBOX: obbligatorie dove si riuniscono molte persone (scuole, ospedali, centri commerciali)' },
      { marca: 'Scame', modelli: 'Cassette Scabox IP56 halogen free, IK08' }
    ],
    guida: `<ul class="ref">
      <li><strong>Pressacavo:</strong> scegli il <em>filetto</em> (metrico M16, M20, M25… = diametro del foro; PG è il vecchio passo) e il <em>campo di serraggio</em> sul diametro esterno del cavo. Per esterno IP68; ottone nichelato dove serve robustezza o schermatura.</li>
      <li><strong>Raccordo tubo-scatola:</strong> stesso diametro del tubo (16, 20, 25, 32…) e IP adatto (IP65–IP67 per esterno); tubo-guaina per passare da tubo rigido a guaina flessibile.</li>
      <li><strong>Raccordi per tubo rigido:</strong> manicotti, curve, raccordi a T e scatole a più ingressi della stessa serie del tubo.</li>
      <li><strong>Cassette da parete:</strong> IP44 interno umido, IP55/IP56 esterno, IP65+ con getti d'acqua; misura dal numero di tubi e morsetti.</li>
      <li><strong>Cassette e scatole da incasso:</strong> per muratura (con paramalta durante l'intonaco) o per cartongesso (con alette, GWT 850 °C). Scatola 503 = 3 moduli, standard per tutte le serie civili.</li>
      <li>Le giunzioni si fanno solo dentro le cassette, mai nei tubi.</li>
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
  aperto: null,
  n: s => String(s ?? '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, ''),
  utente() { try { return JSON.parse(localStorage.getItem('ab_reparti_utente') || '{}'); } catch { return {}; } },
  salva(dati) { try { localStorage.setItem('ab_reparti_utente', JSON.stringify(dati)); } catch {} },
  esc: s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c])),
  marche(r) { const mie = this.utente(); return [...r.marche.map(m => ({ ...m })), ...(mie[r.id] || []).map((m, i) => ({ ...m, mia: i }))]; },
  // Ricerca usata anche dalla scheda Cerca
  cerca(q) {
    q = this.n(q).trim(); if (q.length < 2) return [];
    const out = [];
    for (const r of REPARTI) for (const m of this.marche(r)) {
      if (this.n(`${m.marca} ${m.modelli} ${m.note || ''}`).includes(q)) out.push({ reparto: r, marca: m });
    }
    return out;
  },
  render() {
    const box = document.getElementById('repartiLista');
    if (!box) return;
    const q = this.n(document.getElementById('repQ')?.value || '').trim();
    const tiles = REPARTI.map(r => {
      const tutte = this.marche(r);
      const trovate = q ? tutte.filter(m => this.n(`${m.marca} ${m.modelli} ${m.note || ''}`).includes(q)) : [];
      if (q && !trovate.length && !this.n(r.nome).includes(q)) return '';
      const sotto = q && trovate.length ? trovate.map(m => m.marca).join(', ') : `${tutte.length} marche`;
      return `<button class="tile" data-rep="${r.id}"><span class="tile-ico">${r.icona}</span><span class="tile-t">${this.esc(r.nome)}</span><span class="tile-s">${this.esc(sotto)}</span></button>`;
    }).join('');
    box.innerHTML = tiles || '<p class="hint">Nessun reparto trovato.</p>';
  },
  apri(id) {
    const r = REPARTI.find(x => x.id === id); if (!r) return;
    this.aperto = id;
    document.getElementById('repTitolo').textContent = `${r.icona} ${r.nome}`;
    const tutte = this.marche(r);
    const tri = m => (typeof Codici !== 'undefined' && Codici.tripla(m.marca)) ? ` <span class="codice">${this.esc(Codici.tripla(m.marca))}</span>` : '';
    const lista = tutte.length ? tutte.map(m => `<div class="item"><div class="t">${this.esc(m.marca)}${tri(m)}${m.mia != null ? ` <span class="chip">aggiunta da te</span> <button class="btn-mini" data-del="${r.id}:${m.mia}" aria-label="Elimina ${this.esc(m.marca)}">✕</button>` : ''}</div>${m.modelli ? `<div class="m">${this.esc(m.modelli)}</div>` : ''}${m.note ? `<div class="m">${this.esc(m.note)}</div>` : ''}</div>`).join('')
      : '<p class="hint">Nessuna marca ancora: aggiungi quelle che vendete.</p>';
    document.getElementById('repDettaglio').innerHTML = `
      <h2 class="sezione">Marche e serie</h2>${lista}
      <h2 class="sezione">Guida rapida</h2><div class="card">${r.guida}</div>
      <details class="card"><summary>Aggiungi una marca</summary>
        <form class="grid addmarca" data-rep="${r.id}" style="margin-top:.5rem">
          <label class="wide">Marca<input name="marca" required></label>
          <label class="wide">Modelli / serie<input name="modelli" placeholder="separati da virgola"></label>
          <label class="wide">Note<input name="note" placeholder="facoltativo"></label>
          <button class="btn filled wide" type="submit">Aggiungi</button>
        </form>
      </details>`;
  },
  init(log, apriVista) {
    const box = document.getElementById('repartiLista');
    const det = document.getElementById('repDettaglio');
    if (!box || !det) return;
    this.apriVista = apriVista;
    box.addEventListener('click', e => {
      const t = e.target.closest('[data-rep]'); if (!t) return;
      this.apri(t.dataset.rep); apriVista('reparti', 'reparto'); log?.('reparto-aperto', { reparto: t.dataset.rep });
    });
    det.addEventListener('submit', e => {
      const f = e.target.closest('form.addmarca'); if (!f) return;
      e.preventDefault();
      const d = Object.fromEntries(new FormData(f));
      if (!d.marca.trim()) return;
      const mie = this.utente(); (mie[f.dataset.rep] ||= []).push({ marca: d.marca.trim(), modelli: d.modelli.trim(), note: d.note.trim() });
      this.salva(mie); log?.('reparto-aggiunta', { reparto: f.dataset.rep });
      this.apri(f.dataset.rep); this.render();
    });
    det.addEventListener('click', e => {
      const b = e.target.closest('[data-del]'); if (!b) return;
      const [rep, i] = b.dataset.del.split(':');
      const mie = this.utente(); mie[rep]?.splice(Number(i), 1); this.salva(mie);
      log?.('reparto-eliminazione', { reparto: rep });
      this.apri(rep); this.render();
    });
    document.getElementById('repQ')?.addEventListener('input', () => this.render());
    this.render();
  }
};
