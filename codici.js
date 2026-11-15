/* Codici gestionale Elettrocampania (da codici.pdf), inseriti su richiesta di Vincenzo il 15/11/2026 */
'use strict';
const CODICI_DEFAULT = {
 "tipo": "codici-gestionale",
 "versione": 1,
 "azienda": "Elettrocampania",
 "fonte": "codici.pdf",
 "fornitori": [
  {
   "nome": "Bticino",
   "tripla": "TIC",
   "alias": ""
  },
  {
   "nome": "Vimar",
   "tripla": "VIM",
   "alias": ""
  },
  {
   "nome": "Gewiss",
   "tripla": "GEW",
   "alias": ""
  },
  {
   "nome": "Abb Sace",
   "tripla": "ABB",
   "alias": "abb"
  },
  {
   "nome": "Hagher",
   "tripla": "HAG",
   "alias": "hager"
  },
  {
   "nome": "Bocchiotti",
   "tripla": "BOC",
   "alias": ""
  },
  {
   "nome": "Ave",
   "tripla": "AVE",
   "alias": ""
  },
  {
   "nome": "Arnocanali",
   "tripla": "ARN",
   "alias": ""
  },
  {
   "nome": "Lovato",
   "tripla": "LOV",
   "alias": ""
  },
  {
   "nome": "Siemens",
   "tripla": "SIE",
   "alias": ""
  },
  {
   "nome": "Schneider",
   "tripla": "SNR",
   "alias": "schneider electric"
  },
  {
   "nome": "Master",
   "tripla": "MAS",
   "alias": ""
  },
  {
   "nome": "3M",
   "tripla": "3MI",
   "alias": ""
  },
  {
   "nome": "Cellpack",
   "tripla": "CEK",
   "alias": ""
  },
  {
   "nome": "Fischer",
   "tripla": "FIS",
   "alias": ""
  },
  {
   "nome": "Etelec",
   "tripla": "ETT",
   "alias": ""
  },
  {
   "nome": "Sati",
   "tripla": "SAT",
   "alias": ""
  },
  {
   "nome": "Legrand",
   "tripla": "LEG",
   "alias": ""
  },
  {
   "nome": "Betacavi",
   "tripla": "BTA",
   "alias": ""
  },
  {
   "nome": "ITC cavi",
   "tripla": "ICC",
   "alias": "itc"
  },
  {
   "nome": "Acome Cavi",
   "tripla": "ACO",
   "alias": "acome"
  },
  {
   "nome": "Item",
   "tripla": "ITE",
   "alias": ""
  },
  {
   "nome": "4 Power",
   "tripla": "PLN",
   "alias": ""
  },
  {
   "nome": "Finder",
   "tripla": "FIN",
   "alias": ""
  },
  {
   "nome": "Faac",
   "tripla": "FAA",
   "alias": ""
  },
  {
   "nome": "Bft",
   "tripla": "BFT",
   "alias": ""
  },
  {
   "nome": "Came",
   "tripla": "CAM",
   "alias": ""
  },
  {
   "nome": "Nice",
   "tripla": "NIE",
   "alias": ""
  },
  {
   "nome": "Vortice",
   "tripla": "VOR",
   "alias": ""
  },
  {
   "nome": "Palazzoli",
   "tripla": "FPA",
   "alias": ""
  },
  {
   "nome": "DKC",
   "tripla": "DKC",
   "alias": ""
  },
  {
   "nome": "ETA",
   "tripla": "ETA",
   "alias": ""
  },
  {
   "nome": "Cembre",
   "tripla": "CEM",
   "alias": ""
  },
  {
   "nome": "BMM",
   "tripla": "BMM",
   "alias": ""
  },
  {
   "nome": "Usag",
   "tripla": "USG",
   "alias": ""
  },
  {
   "nome": "Intercable",
   "tripla": "INC",
   "alias": ""
  },
  {
   "nome": "Urmet",
   "tripla": "URM",
   "alias": ""
  },
  {
   "nome": "Hik Vision",
   "tripla": "HIK",
   "alias": "hikvision"
  },
  {
   "nome": "Comelit",
   "tripla": "CML",
   "alias": ""
  },
  {
   "nome": "Notifire",
   "tripla": "NTF",
   "alias": ""
  },
  {
   "nome": "Bentel",
   "tripla": "BEN",
   "alias": ""
  },
  {
   "nome": "Weidmurrell",
   "tripla": "WEI",
   "alias": "weidmuller weidmüller"
  },
  {
   "nome": "Obo Bettermann",
   "tripla": "OBO",
   "alias": ""
  },
  {
   "nome": "Pannuit",
   "tripla": "PNU",
   "alias": "panduit"
  },
  {
   "nome": "Century",
   "tripla": "CEN",
   "alias": ""
  },
  {
   "nome": "Nobile",
   "tripla": "NOB",
   "alias": ""
  },
  {
   "nome": "Prisma",
   "tripla": "PRI",
   "alias": ""
  },
  {
   "nome": "Ledvance",
   "tripla": "LDV",
   "alias": ""
  },
  {
   "nome": "TecMar",
   "tripla": "TMR",
   "alias": ""
  }
 ],
 "famiglie": [
  {
   "fornitore": "Siemens",
   "tripla": "SIE",
   "descrizione": "D. Puro – DFP",
   "codice": "SIE SV",
   "parole": "differenziale puro"
  },
  {
   "fornitore": "Siemens",
   "tripla": "SIE",
   "descrizione": "S. Motore",
   "codice": "SIE RV",
   "parole": "salvamotore"
  },
  {
   "fornitore": "Siemens",
   "tripla": "SIE",
   "descrizione": "P. Fusibili",
   "codice": "SIE NW",
   "parole": "portafusibili fusibili"
  },
  {
   "fornitore": "Siemens",
   "tripla": "SIE",
   "descrizione": "Contattori Modul",
   "codice": "SIE TT",
   "parole": "contattori modulari contattore"
  },
  {
   "fornitore": "Siemens",
   "tripla": "SIE",
   "descrizione": "Teleruttori",
   "codice": "SIE RT",
   "parole": "teleruttore contattore"
  },
  {
   "fornitore": "Siemens",
   "tripla": "SIE",
   "descrizione": "Relè Termico",
   "codice": "SIE RU",
   "parole": "rele termico relè"
  },
  {
   "fornitore": "Siemens",
   "tripla": "SIE",
   "descrizione": "Sezionatori Modu",
   "codice": "SIE TL",
   "parole": "sezionatore modulare"
  },
  {
   "fornitore": "Siemens",
   "tripla": "SIE",
   "descrizione": "Luci Spia Mod",
   "codice": "SIE TE",
   "parole": "spia luminosa modulare"
  },
  {
   "fornitore": "Siemens",
   "tripla": "SIE",
   "descrizione": "Bob Lancio Mod",
   "codice": "SIE ST",
   "parole": "bobina di lancio modulare sganciatore"
  },
  {
   "fornitore": "Siemens",
   "tripla": "SIE",
   "descrizione": "Scatolati",
   "codice": "SIE VA",
   "parole": "interruttori scatolati"
  },
  {
   "fornitore": "Schneider",
   "tripla": "SNR",
   "descrizione": "Salvamotori",
   "codice": "SNR GV",
   "parole": "salvamotore"
  },
  {
   "fornitore": "Schneider",
   "tripla": "SNR",
   "descrizione": "Cont. x Salvam (frontale)",
   "codice": "SNR GVAE",
   "parole": "contatti ausiliari salvamotore frontale"
  },
  {
   "fornitore": "Schneider",
   "tripla": "SNR",
   "descrizione": "Cont. x Salvam (laterale)",
   "codice": "SNR GVAN",
   "parole": "contatti ausiliari salvamotore laterale"
  },
  {
   "fornitore": "Schneider",
   "tripla": "SNR",
   "descrizione": "Contatti Aux",
   "codice": "SNR LAD",
   "parole": "contatti ausiliari contattore"
  },
  {
   "fornitore": "Schneider",
   "tripla": "SNR",
   "descrizione": "Contattori",
   "codice": "SNR LC1",
   "parole": "contattore teleruttore"
  },
  {
   "fornitore": "Schneider",
   "tripla": "SNR",
   "descrizione": "Relè Termico per Contattori",
   "codice": "SNR LR",
   "parole": "rele termico relè"
  },
  {
   "fornitore": "Ledvance",
   "tripla": "LDV",
   "descrizione": "Proiettori LED",
   "codice": "LDV FCL",
   "parole": "proiettore faro led"
  },
  {
   "fornitore": "Ledvance",
   "tripla": "LDV",
   "descrizione": "Plaf. Stagno LED",
   "codice": "LDV DPE",
   "parole": "plafoniera stagna led"
  },
  {
   "fornitore": "Ledvance",
   "tripla": "LDV",
   "descrizione": "Faretti Incasso",
   "codice": "LDV DWL",
   "parole": "faretto incasso downlight"
  },
  {
   "fornitore": "Ledvance",
   "tripla": "LDV",
   "descrizione": "Tubi LED",
   "codice": "LDV ET8EM",
   "parole": "tubo led t8"
  },
  {
   "fornitore": "Ledvance",
   "tripla": "LDV",
   "descrizione": "Starter",
   "codice": "LDV ST111 / ST151",
   "parole": "starter"
  },
  {
   "fornitore": "Cavi generici e rame",
   "tripla": "",
   "descrizione": "Cavo Schermato",
   "codice": "ICC",
   "parole": "cavo schermato"
  },
  {
   "fornitore": "Cavi generici e rame",
   "tripla": "",
   "descrizione": "Fibra Ottica",
   "codice": "ACO",
   "parole": "fibra ottica"
  },
  {
   "fornitore": "Cavi generici e rame",
   "tripla": "",
   "descrizione": "Cavo Rosso/Nero",
   "codice": "IMC / 2RN",
   "parole": "cavo rosso nero piattina"
  },
  {
   "fornitore": "Cavi generici e rame",
   "tripla": "",
   "descrizione": "Cavo KNX",
   "codice": "ICC",
   "parole": "cavo knx bus"
  },
  {
   "fornitore": "Cavi generici e rame",
   "tripla": "",
   "descrizione": "Piatto Rame",
   "codice": "PRN",
   "parole": "piatto rame bandella"
  },
  {
   "fornitore": "Cavi generici e rame",
   "tripla": "",
   "descrizione": "Corda Rame Nuda",
   "codice": "CRN",
   "parole": "corda rame nuda terra"
  }
 ]
};
