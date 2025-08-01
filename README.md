
# Engineering KPI Dashboard

Questa repository contiene un MVP di dashboard basato su file HTML statici e
dati JSON sincronizzati da Airtable tramite GitHub Actions.

## Struttura

```
.
├── index.html
├── progetti.html
├── timelog.html
├── data/
│   └── *.json
├── utils/
│   └── data.js
├── .github/
│   ├── scripts/
│   │   └── export.js
│   └── workflows/
│       └── airtable-sync.yml
├── package.json
└── README.md
```

- **HTML**: dashboard e pagine KPI (da completare).
- **data/**: JSON generati automaticamente.
- **utils/data.js**: helper per caricare i dataset.
- **GitHub Action** (`airtable-sync.yml`): esegue lo script `export.js` ogni giorno
  e aggiorna i JSON.

## Prerequisiti

- Node.js ≥ 20
- Impostare nei *Repository Secrets*:
  - `AIRTABLE_TOKEN`
  - `AIRTABLE_BASE_ID`

## Setup locale

```bash
npm ci
npm run export   # esporta i dati in data/*.json
```

Poi apri `index.html` in un browser (o usa Live Server) per la preview.
