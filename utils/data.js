
// utils/data.js
// Helper to fetch JSON data for dashboards.
// Usage: fetchData('progetti').then(data => { ... });
export async function fetchData(dataset) {
    const response = await fetch(`./data/${dataset}.json`, {cache: "no-store"});
    if (!response.ok) {
        throw new Error(`Errore nel recupero di ${dataset}: ${response.statusText}`);
    }
    return await response.json();
}
