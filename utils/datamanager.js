import { fetchData } from './data.js';

// Usiamo una cache per evitare di ricaricare i dati se navighiamo tra le pagine
let cachedDataManager = null;

/**
 * Carica tutti i dataset principali, crea mappe per lookup veloci 
 * e restituisce un oggetto "manager" per un facile accesso ai dati.
 * @returns {Promise<Object>} Un oggetto contenente i dati grezzi e le mappe di lookup.
 */
export async function getDataManager() {
  // Se abbiamo già caricato i dati, restituiamo la versione in cache
  if (cachedDataManager) {
    return cachedDataManager;
  }

  try {
    // 1. CARICAMENTO IN PARALLELO
    // Carichiamo tutti i file JSON di cui abbiamo bisogno in tutta l'applicazione.
    const [
      progetti,
      risorse,
      task,
      milestone,
      imprevisti,
      varianti,
      decisioni,
      timelog
    ] = await Promise.all([
      fetchData('progetti'),
      fetchData('risorse'),
      fetchData('task'),
      fetchData('milestone'),
      fetchData('imprevisti'),
      fetchData('varianti'),
      fetchData('decisionlog'),
      fetchData('timelog')
    ]);

    // 2. CREAZIONE DELLE MAPPE DI LOOKUP
    // Trasformiamo gli array in Mappe per un accesso istantaneo tramite ID.
    // Esempio: `progettiMap.get('recQfUWcES81PFvJ8')` restituirà subito l'oggetto del progetto Snam.
    const progettiMap = new Map(progetti.map(p => [p.id, p]));
    const risorseMap = new Map(risorse.map(r => [r.id, r]));
    const taskMap = new Map(task.map(t => [t.id, t]));

    // 3. ASSEMBLAGGIO DEL DATA MANAGER
    // Creiamo l'oggetto che conterrà tutto ciò che serve alle nostre dashboard.
    const dataManager = {
      // Dati grezzi (gli array originali)
      progetti,
      risorse,
      task,
      milestone,
      imprevisti,
      varianti,
      decisioni,
      timelog,
      // Mappe per relazioni veloci
      progettiMap,
      risorseMap,
      taskMap
    };
    
    // Mettiamo il risultato in cache per le prossime volte
    cachedDataManager = dataManager;
    
    return dataManager;

  } catch (error) {
    console.error("Errore critico durante il caricamento dei dati:", error);
    // Rilanciamo l'errore per bloccare l'esecuzione della pagina e mostrare il problema in console
    throw error;
  }
}
