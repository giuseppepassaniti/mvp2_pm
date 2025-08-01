/* scripts/export.js */
const fs = require('fs');
const path = require('path');
const Airtable = require('airtable');

const { AIRTABLE_TOKEN, AIRTABLE_BASE_ID } = process.env;
if (!AIRTABLE_TOKEN || !AIRTABLE_BASE_ID) {
  console.error('❌  Manca AIRTABLE_TOKEN o AIRTABLE_BASE_ID');
  process.exit(1);
}

const base = new Airtable({ apiKey: AIRTABLE_TOKEN }).base(AIRTABLE_BASE_ID);
const OUT_DIR = 'data';
if (!fs.existsSync(OUT_DIR)) fs.mkdirSync(OUT_DIR);

// Tabelle da esportare (modifica nomi/viste se servono)
const tables = [
  { name: 'Progetti',      view: 'Grid view', file: 'progetti.json' },
  { name: 'Milestone',     view: 'Grid view', file: 'milestone.json' },
  { name: 'Task',          view: 'Grid view', file: 'task.json' },
  { name: 'Risorse',       view: 'Grid view', file: 'risorse.json' },
  { name: 'Time Log',      view: 'Grid view', file: 'timelog.json' },
  { name: 'Imprevisti',    view: 'Grid view', file: 'imprevisti.json' },
  { name: 'Varianti',      view: 'Grid view', file: 'varianti.json' },
  { name: 'Decision Log',  view: 'Grid view', file: 'decisionlog.json' },
];

// -------- helper --------
async function exportTable({ name, view, file }) {
  const records = [];
  await base(name)
    .select({ view })
    .eachPage((page, fetchNext) => {
      records.push(...page.map(r => ({ id: r.id, ...r.fields })));
      fetchNext();
    });

  fs.writeFileSync(
    path.join(OUT_DIR, file),
    JSON.stringify(records, null, 2)
  );
  console.log(`✔ ${name} salvata in data/${file}`);
}

// -------- run --------
(async () => {
  try {
    await Promise.all(tables.map(exportTable));
    console.log('✅ Export completato senza errori');
  } catch (err) {
    console.error('❌ Errore durante l’export:\n', err);
    process.exit(1);
  }
})();
