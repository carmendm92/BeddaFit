const infoCategorie = {
    "antipasti": {
        title: "ANTIPASTI",
        subtitle: "L’ARCHITETTURA DELL’ACCOGLIENZA",
        desc: "Moduli di design gastronomico progettati per stimolare il palato senza appesantire."
    },
    "primi": {
        title: "PRIMI PIATTI",
        subtitle: "EQUILIBRIO DINAMICO",
        desc: "Architetture di cereali e grani antichi. La base energetica per il tuo design quotidiano."
    },
    "secondi": {
        title: "SECONDI PIATTI",
        subtitle: "STRUTTURE NOBILI",
        desc: "L'essenza della materia prima. Forme ricercate e tecniche di cottura avanzate."
    },
    "contorni": {
        title: "CONTORNI",
        subtitle: "GEOMETRIE VEGETALI",
        desc: "L'estetica del mondo vegetale. Contrasti di texture per elevare ogni composizione."
    },
    "all": {
        title: "IL RICETTARIO",
        subtitle: "L'ARCHIVIO",
        desc: "La collezione completa delle creazioni BeddaFit: l'unione tra estetica e nutrizione."
    }
};

async function loadCategory() {
    const grid = document.getElementById('recipe-grid');
    const titleEl = document.getElementById('category-title');
    const subtitleEl = document.getElementById('category-subtitle');
    const descEl = document.getElementById('category-description');

    const params = new URLSearchParams(window.location.search);
    const categoryQuery = params.get('type') || 'all';
    const key = categoryQuery.toLowerCase();

    // --- 1. AGGIORNAMENTO TESTI & SEO ---
    const info = infoCategorie[key] || infoCategorie['all'];

    if (titleEl) titleEl.innerText = info.title;
    if (subtitleEl) subtitleEl.innerText = info.subtitle;
    if (descEl) descEl.innerText = info.desc;

    // Aggiornamento Title Tag e Meta Description per SEO
    document.title = `${info.title} | BeddaFit Healthy Luxury`;
    const metaDesc = document.getElementById('cat-meta-description');
    if (metaDesc) metaDesc.setAttribute("content", info.desc);

    try {
        // --- 2. CARICAMENTO DATI ---
        const response = await fetch('ricettario.json');
        if (!response.ok) throw new Error('Database non trovato');

        const data = await response.json();
        let ricetteMostrate = data.ricettario || [];

        // Filtro
        if (key !== 'all') {
            ricetteMostrate = ricetteMostrate.filter(ricetta =>
                ricetta.categoria.toLowerCase().includes(key)
            );
        }

        // Ordinamento (ID decrescente = più recenti)
        ricetteMostrate.sort((a, b) => parseInt(b.id) - parseInt(a.id));

        // --- 3. RENDERING ---
        if (ricetteMostrate.length === 0) {
            grid.innerHTML = `
                <div class="col-12 text-center py-5">
                    <p class="recipe-concept">Nessuna ricetta disponibile in questa categoria.</p>
                    <a href="categoria.html?type=all" class="read-more">MOSTRA TUTTE LE RICETTE</a>
                </div>`;
            return;
        }

        grid.innerHTML = ricetteMostrate.map(ricetta => {
            const pro = ricetta.macros_stimati?.proteine || '0g';
            const kcal = ricetta.macros_stimati?.kcal || '0';
            const carb = ricetta.macros_stimati?.carboidrati || '0g';

            return `
            <div class="col-md-6 col-lg-4">
                <div class="bedda-luxury-card">
                    <div class="image-wrapper">
                        <img src="${ricetta.img || './img/placeholder.jpg'}" alt="${ricetta.titolo}" loading="lazy">
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
        }).join('');

    } catch (error) {
        console.error("Errore BeddaFit:", error);
        grid.innerHTML = `<p class="text-center">Spiacenti, si è verificato un errore nel caricamento.</p>`;
    }
}

document.addEventListener('DOMContentLoaded', loadCategory);