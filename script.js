async function loadRecipes() {
    const grid = document.getElementById('recipe-grid');
    if (!grid) return;

    try {
        const response = await fetch('ricettario.json');
        if (!response.ok) throw new Error('Errore nel caricamento del file JSON');

        const data = await response.json();

        let ricette = data.ricettario || [];

        if (ricette.length === 0) {
            grid.innerHTML = `<p class="text-center">Nessuna ricetta trovata.</p>`;
            return;
        }

        ricette.sort((a, b) => parseInt(b.id) - parseInt(a.id));

        const ultimeTre = ricette.slice(0, 3);

        let htmlContent = "";

        ultimeTre.forEach((ricetta) => {
            const proteins = ricetta.macros_stimati?.proteine || '0g';
            const kcal = ricetta.macros_stimati?.kcal || '0';
            const carbs = ricetta.macros_stimati?.carboidrati || '0g';
            const recipeId = ricetta.id;

            htmlContent += `
            <div class="col-md-6 col-lg-4">
                <div class="bedda-luxury-card">
                    <div class="image-wrapper">
                        <img src="${ricetta.img || './img/placeholder.jpg'}" alt="${ricetta.titolo}">
                        <div class="macro-overlay">
                            <div class="d-flex justify-content-around w-100">
                                <div class="v-detail"><span>${proteins}</span><small>PRO</small></div>
                                <div class="v-detail"><span>${kcal}</span><small>KCAL</small></div>
                                <div class="v-detail"><span>${carbs}</span><small>CARB</small></div>
                            </div>
                        </div>
                    </div>
                    <div class="recipe-info-box">
                        <span class="recipe-number">L'ULTIMA NOVITÀ — N. ${recipeId}</span>
                        <h2 class="recipe-title">${ricetta.titolo || 'Senza Titolo'}</h2>
                        <p class="recipe-concept">${ricetta.concept || ''}</p>
                        <a href="ricetta.html?id=${recipeId}" class="read-more">SCOPRI IL DESIGN —</a>
                    </div>
                </div>
            </div>`;
        });

        grid.innerHTML = htmlContent;

    } catch (error) {
        console.error("BeddaFit Error:", error);
        grid.innerHTML = `<p class="text-center">Errore tecnico: ${error.message}</p>`;
    }
}

function updateNavbar() {
    const currentPath = window.location.pathname; // es: /manifesto.html
    const currentSearch = window.location.search; // es: ?type=primi
    const navLinks = document.querySelectorAll('.nav-link, .dropdown-item');

    navLinks.forEach(link => {
        link.classList.remove('active');
        const href = link.getAttribute('href');

        if (!href || href === '#') return;

        // --- 1. LOGICA PER CATEGORIE (con parametri) ---
        if (currentSearch && href.includes(currentSearch)) {
            link.classList.add('active');
            // Accendi il menu "Ricette" se siamo in una sottocategoria
            const parent = link.closest('.dropdown');
            if (parent) {
                const toggle = parent.querySelector('.dropdown-toggle');
                if (toggle) toggle.classList.add('active');
            }
        }

        // --- 2. LOGICA PER PAGINE STATICHE (Home, Manifesto, etc.) ---
        // Controlla se il percorso attuale termina con il nome del file nel link
        else if (!currentSearch && currentPath.endsWith(href.replace('./', ''))) {
            link.classList.add('active');
        }
    });
}

document.addEventListener('DOMContentLoaded', updateNavbar);
document.addEventListener('DOMContentLoaded', loadRecipes);