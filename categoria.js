/**
 * BeddaFit - Script Unico per Categorie e Ricettario Completo
 */

// 1. Configurazione testi per l'Header (Personalizzabili)
const infoCategorie = {
    "primi": {
        subtitle: "EQUILIBRIO DINAMICO",
        desc: "Architetture di cereali e grani antichi. La base energetica per il tuo design quotidiano."
    },
    "secondi": {
        subtitle: "STRUTTURE NOBILI",
        desc: "L'essenza della materia prima. Forme ricercate e tecniche di cottura avanzate."
    },
    "contorni": {
        subtitle: "GEOMETRIE VEGETALI",
        desc: "L'estetica del mondo vegetale. Contrasti di texture per elevare ogni composizione."
    },
    "all": {
        subtitle: "L'ARCHIVIO",
        desc: "La collezione completa delle creazioni BeddaFit: l'unione tra estetica e nutrizione."
    }
};

async function loadCategory() {
    const grid = document.getElementById('recipe-grid');
    const titleEl = document.getElementById('category-title');
    const subtitleEl = document.getElementById('category-subtitle');
    const descEl = document.getElementById('category-description');

    // Recupera il parametro dall'URL (es. ?type=secondi o ?type=all)
    const params = new URLSearchParams(window.location.search);
    const categoryQuery = params.get('type');

    // Se non c'è parametro, torna alla Home
    if (!categoryQuery) {
        window.location.href = 'index.html';
        return;
    }

    const key = categoryQuery.toLowerCase();

    // --- AGGIORNAMENTO TESTI ---
    const info = infoCategorie[key] || { subtitle: "COLLECTION", desc: "Esplora il gusto fit." };

    if (titleEl) titleEl.innerText = (key === 'all') ? "IL RICETTARIO" : key.toUpperCase();
    if (subtitleEl) subtitleEl.innerText = info.subtitle;
    if (descEl) descEl.innerText = info.desc;

    try {
        // --- CARICAMENTO DATI ---
        // Se il file JSON è nella cartella superiore rispetto al JS usa './ricettario.json'
        const response = await fetch('ricettario.json');
        if (!response.ok) throw new Error('File JSON non trovato');

        const data = await response.json();
        let ricetteMostrate = data.ricettario || [];

        // --- LOGICA DI FILTRO (Il cuore del sistema) ---
        // Se la chiave è 'all', saltiamo il filtro e mostriamo tutto
        if (key !== 'all') {
            ricetteMostrate = ricetteMostrate.filter(ricetta =>
                ricetta.categoria.toLowerCase().includes(key)
            );
        }

        // --- ORDINAMENTO ---
        // Le più recenti per prime
        ricetteMostrate.sort((a, b) => parseInt(b.id) - parseInt(a.id));

        // --- RENDERING ---
        if (ricetteMostrate.length === 0) {
            grid.innerHTML = `<div class="col-12 text-center py-5"><p>Nessuna ricetta trovata.</p></div>`;
            return;
        }

        let html = "";
        ricetteMostrate.forEach(ricetta => {
            const pro = ricetta.macros_stimati?.proteine || '0g';
            const kcal = ricetta.macros_stimati?.kcal || '0';
            const carb = ricetta.macros_stimati?.carboidrati || '0g';

            html += `
            <div class="col-md-6 col-lg-4">
                <div class="bedda-luxury-card">
                    <div class="image-wrapper">
                        <img src="${ricetta.img || './img/placeholder.jpg'}" alt="${ricetta.titolo}">
                        <div class="macro-overlay">
                            <div class="d-flex justify-content-around w-100">
                                <div class="v-detail"><span>${pro}</span><small>PRO</small></div>
                                <div class="v-detail"><span>${kcal}</span><small>KCAL</small></div>
                                <div class="v-detail"><span>${carb}</span><small>CARB</small></div>
                            </div>
                        </div>
                    </div>
                    <div class="recipe-info-box">
                        <span class="recipe-number">RICETTA N. ${ricetta.id}</span>
                        <h2 class="recipe-title">${ricetta.titolo || 'Senza Titolo'}</h2>
                        <a href="ricetta.html?id=${ricetta.id}" class="read-more">SCOPRI IL DESIGN —</a>
                    </div>
                </div>
            </div>`;
        });

        grid.innerHTML = html;

    } catch (error) {
        console.error("Errore BeddaFit:", error);
        if (grid) grid.innerHTML = `<p class="text-center">Errore nel caricamento delle ricette.</p>`;
    }
}

document.addEventListener('DOMContentLoaded', loadCategory);