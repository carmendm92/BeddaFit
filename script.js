/**
 * BEDDAFIT - Core Script
 * Gestisce: Caricamento Ricette, Navbar Active State e Cookie Banner
 */

// 1. CARICAMENTO RICETTE (Ultime 3 Novità)
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

        // Ordina per ID decrescente e prendi le ultime 3
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
        console.error("BeddaFit Error (Recipes):", error);
        grid.innerHTML = `<p class="text-center">Errore tecnico: ${error.message}</p>`;
    }
}

// 2. GESTIONE NAVBAR (Stato Active)
function updateNavbar() {
    const currentPath = window.location.pathname;
    const currentSearch = window.location.search;
    const navLinks = document.querySelectorAll('.nav-link, .dropdown-item');

    navLinks.forEach(link => {
        link.classList.remove('active');
        const href = link.getAttribute('href');
        if (!href || href === '#') return;

        if (currentSearch && href.includes(currentSearch)) {
            link.classList.add('active');
            const parent = link.closest('.dropdown');
            if (parent) {
                const toggle = parent.querySelector('.dropdown-toggle');
                if (toggle) toggle.classList.add('active');
            }
        } else if (!currentSearch && currentPath.endsWith(href.replace('./', ''))) {
            link.classList.add('active');
        }
    });
}

// 3. LOGICA COOKIE BANNER (GDPR Compliant)
function handleCookieBanner() {
    const storageKey = "bedda-cookie-choice";

    // Controlla se l'utente ha già fatto una scelta
    if (localStorage.getItem(storageKey)) {
        console.log("Cookie Banner: Scelta già effettuata, non mostro nulla.");
        return;
    }

    // Creazione elemento banner
    const bannerContainer = document.createElement('div');
    bannerContainer.id = "cookie-banner";

    bannerContainer.innerHTML = `
        <button id="close-x" aria-label="Chiudi">&times;</button>
        <div id="container-banner">
            <p>
                Utilizziamo i cookie per assicurarti la migliore esperienza culinaria su <strong>BeddaFit</strong>. 
                Puoi accettarli tutti o continuare con i soli tecnici necessari.
                <a href="https://www.iubenda.com/privacy-policy/79120979/cookie-policy" target="_blank">Leggi la policy</a>
            </p>
            <div class="banner-buttons">
                <button id="necessary-cookie" class="btn-secondary">SOLO NECESSARI</button>
                <button id="accept-cookie" class="btn-primary">ACCETTA TUTTI</button>
            </div>
        </div>
    `;

    document.body.appendChild(bannerContainer);
    console.log("Cookie Banner: Inserito nel DOM.");

    // Animazione entrata (ritardata per fluidità)
    setTimeout(() => {
        bannerContainer.classList.add('show');
    }, 300);

    // Funzione per chiudere e salvare
    const closeBanner = (choice) => {
        localStorage.setItem(storageKey, choice);
        bannerContainer.classList.remove('show');
        setTimeout(() => bannerContainer.remove(), 600);
        console.log(`Cookie Banner: Scelta salvata -> ${choice}`);
    };

    // Eventi sui bottoni (assegnati solo dopo l'inserimento nel DOM)
    document.getElementById("accept-cookie").onclick = () => closeBanner("accepted");
    document.getElementById("necessary-cookie").onclick = () => closeBanner("necessary");
    document.getElementById("close-x").onclick = () => closeBanner("closed-x");
}

// --- AVVIO COORDINATO ---
// Aspetta che il DOM sia caricato prima di eseguire le funzioni
document.addEventListener('DOMContentLoaded', () => {
    console.log("BeddaFit: DOM pronto, avvio funzioni...");
    updateNavbar();
    loadRecipes();
    handleCookieBanner();
});