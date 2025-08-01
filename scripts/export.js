/* scripts/export.js
 * Estrae le 8 tabelle da Airtable e le salva in /data in formato JSON.
 */
const fs = require('fs');
const path = require('path');
const Airtable = require('airtable');

const { AIRTABLE_TOKEN, AIRTABLE_BASE_ID } = process.env;
if (!AIRTABLE_TOKEN || !AIRTABLE_BASE_ID) {
  console.error('❌  Manca AIRTABLE_TOKEN o AIRTABLE_BASE_ID');
  process.exit(1);
}

const TABLES = [
  'Progetti',
  'Milestone',
  'Task',
  'Risorse',
  'Timelog',
  'Imprevisti',
  'Varianti',
  'DecisionLog'
];

const base = new Airtable({ apiKey: AIRTABLE_TOKEN }).base(AIRTABLE_BASE_ID);
const OUT_DIR = 'data';

if (!fs.existsSync(OUT_DIR)) fs.mkdirSync(OUT_DIR);

;(async () => {
  try {
    await Promise.all(
      tables.map(t => exportTable(t.name, t.view))   // o come l'hai chiamato
    )
    console.log('✅ Export completato senza errori')
  } catch (err) {
    console.error('❌ Errore durante l’export:\n', err)
    process.exit(1)         // fa fallire il job ma con messaggio chiaro
  }
})()
();
