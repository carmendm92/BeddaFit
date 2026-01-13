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

// --- LOGICA COOKIE BANNER AUTOMATICO BEDDAFIT ---
function handleCookieBanner() {
    if (localStorage.getItem("bedda-cookie-accepted")) return;


    const bannerContainer = document.createElement('div');
    bannerContainer.id = "cookie-banner";

    bannerContainer.innerHTML = `
        <div id="container-banner">
            <p>
                Utilizziamo i cookie per assicurarti la migliore esperienza culinaria sul nostro sito. 
                <a href="https://www.iubenda.com/privacy-policy/79120979/cookie-policy" target="_blank" id="button-cookie">Leggi la policy</a>
            </p>
            <button id="close-cookie">ACCETTA</button>
        </div>
    `;

    document.body.appendChild(bannerContainer);

    setTimeout(() => {
        bannerContainer.style.display = "block";
        setTimeout(() => {
            bannerContainer.style.opacity = "1";
            bannerContainer.style.transform = "translateX(-50%) translateY(0)";
        }, 50);
    }, 300);

    document.getElementById("close-cookie").addEventListener("click", function () {
        localStorage.setItem("bedda-cookie-accepted", "true");

        bannerContainer.style.opacity = "0";
        bannerContainer.style.transform = "translateX(-50%) translateY(10px)";

        setTimeout(() => {
            bannerContainer.remove();
        }, 600);
    });
}

document.addEventListener('DOMContentLoaded', () => {
    updateNavbar();
    loadRecipes();
    handleCookieBanner();
});