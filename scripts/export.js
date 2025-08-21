/**
 * scripts/export.js
 * Estrae le tabelle di Airtable specificate e le salva nella cartella /data in formato JSON.
 */

const fs       = require('fs');
const path     = 'path');
const Airtable = require('airtable');

/*───────────────────────────────*/
/* 1. Variabili d’ambiente       */
/*───────────────────────────────*/
const { AIRTABLE_TOKEN, AIRTABLE_BASE_ID } = process.env;

if (!AIRTABLE_TOKEN || !AIRTABLE_BASE_ID) {
  console.error('❌  Manca AIRTABLE_TOKEN o AIRTABLE_BASE_ID');
  process.exit(1);
}

const base    = new Airtable({ apiKey: AIRTABLE_TOKEN }).base(AIRTABLE_BASE_ID);
const OUT_DIR = 'data';
if (!fs.existsSync(OUT_DIR)) fs.mkdirSync(OUT_DIR);

/*───────────────────────────────*/
/* 2. Configurazione tabelle     */
/*───────────────────────────────*/
/* Usa EXACT name & view di Airtable  */
const tables = [
  { name: 'Progetti',      view: 'Grid view', file: 'progetti.json'    },
  { name: 'Milestone',     view: 'Grid view', file: 'milestone.json'   },
  { name: 'Task',          view: 'Grid view', file: 'task.json'        },
  { name: 'Risorse',       view: 'Grid view', file: 'risorse.json'     },
  { name: 'Time Log',      view: 'Grid view', file: 'timelog.json'     },
  { name: 'Imprevisti',    view: 'Grid view', file: 'imprevisti.json'  },
  { name: 'Varianti',      /* nessuna view */ file: 'varianti.json'    },
  { name: 'Decision Log',  /* nessuna view */ file: 'decisionlog.json' }
];

/*───────────────────────────────*/
/* 3. Helper per l’export        */
/*───────────────────────────────*/
async function exportTable(tableName, view, fileName) {
  const opts = view ? { view } : {};          // passa la view solo se definita

  const records = await base(tableName)
    .select(opts)
    .all()
    .catch(err => {
      // Arricchiamo l’errore con il nome tabella per debug rapido
      err.message = `[${tableName}] ${err.message}`;
      throw err;
    });

  // --- MODIFICA CHIAVE QUI ---
  // Aggiungiamo l'ID del record a fianco dei campi (fields)
  const rows = records.map(r => ({ id: r.id, ...r.fields }));
  
  const filePath = path.join(OUT_DIR, fileName);
  fs.writeFileSync(filePath, JSON.stringify(rows, null, 2));
  console.log(`✔  ${tableName} salvata in ${filePath}`);
}

/*───────────────────────────────*/
/* 4. Main                       */
/*───────────────────────────────*/
(async () => {
  try {
    await Promise.all(
      tables.map(t => exportTable(t.name, t.view, t.file))
    );
    console.log('✅  Export completato senza errori');
  } catch (err) {
    console.error('❌  Errore durante l’export:\n', err);
    process.exit(1);
  }
})();
