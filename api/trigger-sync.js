// File: /api/trigger-sync.js
// Questa è una Vercel Serverless Function che agisce come un endpoint sicuro.

export default async function handler(request, response) {
  // Controlliamo che la richiesta sia di tipo POST per sicurezza
  if (request.method !== 'POST') {
    return response.status(405).json({ message: 'Metodo non consentito. Usa POST.' });
  }

  // Recuperiamo il token segreto dalle variabili d'ambiente di Vercel.
  // Questo token NON è visibile nel codice frontend.
  const githubToken = process.env.GITHUB_PAT;
  
  // Dettagli della tua repository e della GitHub Action
  const owner = 'giuseppepassaniti';
  const repo = 'mvp2_pm';
  const workflowId = 'airtable-sync.yml'; // Nome del file del workflow

  // URL dell'API di GitHub per avviare un workflow manualmente
  const apiUrl = `https://api.github.com/repos/${owner}/${repo}/actions/workflows/${workflowId}/dispatches`;

  try {
    // Chiamiamo l'API di GitHub
    const apiResponse = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        // Autenticazione sicura tramite il token
        'Authorization': `token ${githubToken}`,
        // Header richiesto dall'API di GitHub
        'Accept': 'application/vnd.github.v3+json',
        'Content-Type': 'application/json',
      },
      // Il "ref" indica su quale branch eseguire l'azione (solitamente 'main' o 'master')
      body: JSON.stringify({
        ref: 'main' 
      }),
    });

    // Se la chiamata a GitHub non va a buon fine, restituiamo un errore
    if (!apiResponse.ok) {
      const errorText = await apiResponse.text();
      console.error('Errore dalla API di GitHub:', errorText);
      throw new Error(`Errore nell'avvio del workflow. Status: ${apiResponse.status}`);
    }

    // Se tutto va bene, restituiamo una risposta di successo al frontend
    response.status(200).json({ message: 'Workflow di sincronizzazione avviato con successo.' });

  } catch (error) {
    console.error('Errore nella serverless function:', error);
    response.status(500).json({ message: 'Errore interno del server.', details: error.message });
  }
}
