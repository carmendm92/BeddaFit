async function loadRecipeDetail() {
    const urlParams = new URLSearchParams(window.location.search);
    const recipeId = urlParams.get('id');

    if (!recipeId) {
        window.location.href = 'index.html';
        return;
    }

    try {
        const response = await fetch('ricettario.json');
        if (!response.ok) throw new Error('Errore nel caricamento del database ricette');

        const data = await response.json();
        const ricetta = data.ricettario.find(r => r.id === recipeId);

        if (!ricetta) {
            console.error("Ricetta non trovata nel database.");
            return;
        }

        // --- 1. SEO & SOCIAL DINAMICI ---
        const pageTitle = `${ricetta.titolo} | BeddaFit - Ricette Healthy Luxury`;
        document.title = pageTitle;

        // Meta Description per Google
        const metaDescription = document.querySelector('meta[name="description"]');
        const descContent = ricetta.concept ? ricetta.concept.substring(0, 155).trim() + "..." : "Scopri questa ricetta esclusiva firmata BeddaFit.";
        if (metaDescription) {
            metaDescription.setAttribute("content", descContent);
        }

        // Open Graph per Social (Instagram, Pinterest, LinkedIn)
        const updateOG = (property, content) => {
            const el = document.querySelector(`meta[property="${property}"]`);
            if (el) el.setAttribute("content", content);
        };

        updateOG("og:title", pageTitle);
        updateOG("og:description", descContent);
        if (ricetta.img) updateOG("og:image", window.location.origin + ricetta.img.replace('./', '/'));

        // --- 2. UTILITY PER IL POPOLAMENTO ---
        const setElementText = (id, text) => {
            const el = document.getElementById(id);
            if (el) el.innerText = text || "—";
        };

        // --- 3. POPOLAMENTO IMMAGINE E HEADER ---
        setElementText('detail-title', ricetta.titolo);
        setElementText('detail-concept', ricetta.concept);

        const recipeImg = document.getElementById('detail-img');
        if (recipeImg) {
            recipeImg.src = ricetta.img || './img/placeholder.jpg';
            recipeImg.alt = `${ricetta.titolo} - Ricetta Healthy Luxury BeddaFit`; // SEO FIX

            recipeImg.onload = () => {
                recipeImg.classList.add('loaded');
            };

            // Effetto Zoom Elegante allo scroll
            window.addEventListener('scroll', () => {
                const scrollValue = window.scrollY;
                recipeImg.style.transform = `scale(${1 + scrollValue * 0.0002})`;
            });
        }

        // --- 4. INFO BAR & MACROS ---
        setElementText('detail-difficulty', ricetta.difficolta);
        setElementText('detail-time', ricetta.tempo_preparazione);

        const m = ricetta.macros_stimati;
        if (m) {
            const macrosString = `${m.kcal} Kcal | ${m.proteine} Pro | ${m.carboidrati} Carb | ${m.grassi} Gr`;
            setElementText('detail-macros', macrosString);
        }

        // --- 5. LISTA INGREDIENTI (Interattiva) ---
        const ingredientsList = document.getElementById('detail-ingredients');
        if (ingredientsList && ricetta.ingredienti) {
            ingredientsList.innerHTML = ricetta.ingredienti.map(item => `
                <li class="ingredient-item">
                    <div class="ingredient-diamond"></div>
                    <span class="ingredient-text">${item}</span>
                </li>
            `).join('');

            ingredientsList.querySelectorAll('.ingredient-item').forEach(li => {
                li.addEventListener('click', () => li.classList.toggle('is-checked'));
            });
        }

        // --- 6. PROCEDIMENTO ---
        const methodContainer = document.getElementById('detail-steps');
        if (methodContainer && ricetta.procedimento) {
            methodContainer.innerHTML = '';
            ricetta.procedimento.split('\n\n').forEach(textBlock => {
                if (textBlock.trim() === "") return;
                const p = document.createElement('p');
                p.className = 'recipe-step-paragraph';

                if (textBlock.includes(':')) {
                    const [title, ...rest] = textBlock.split(':');
                    p.innerHTML = `<span class="step-highlight">${title.trim()}:</span> ${rest.join(':').trim()}`;
                } else {
                    p.innerText = textBlock;
                }
                methodContainer.appendChild(p);
            });
        }

        // --- 7. CONSIGLIO BEDDAFIT ---
        setElementText('detail-tips', ricetta.consiglio_beddafit || ricetta.consigli);

    } catch (error) {
        console.error("BeddaFit Error (Detail):", error);
    }
}

document.addEventListener('DOMContentLoaded', loadRecipeDetail);