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

(async () => {
  for (const tbl of TABLES) {
    const rows = [];
    await base(tbl)
      .select({ view: 'Grid view' })
      .eachPage(
        (page, next) => {
          rows.push(
            ...page.map(r => ({
              id: r.id,
              ...r.fields
            }))
          );
          next();
        },
        err => {
          if (err) throw err;
        }
      );
    const file = path.join(OUT_DIR, `${tbl.toLowerCase()}.json`);
    fs.writeFileSync(file, JSON.stringify(rows, null, 2));
    console.log(`✔  ${tbl} salvata in ${file}`);
  }
})();
