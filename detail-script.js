async function loadRecipeDetail() {
    const urlParams = new URLSearchParams(window.location.search);
    const recipeId = urlParams.get('id');

    if (!recipeId) {
        window.location.href = 'index.html';
        return;
    }

    try {
        const response = await fetch('ricettario.json');
        const data = await response.json();
        const ricetta = data.ricettario.find(r => r.id === recipeId);

        if (!ricetta) {
            alert("Ricetta non trovata!");
            return;
        }

        // --- 1. SETTAGGI META E TITOLO PAGINA ---
        document.title = `${ricetta.titolo} | BeddaFit`;
        const metaDescription = document.querySelector('meta[name="description"]');
        if (metaDescription) metaDescription.setAttribute("content", ricetta.concept);

        // --- 2. UTILITY PER IL POPOLAMENTO SICURO ---
        const setElementText = (id, text) => {
            const el = document.getElementById(id);
            if (el) el.innerText = text || "—";
        };

        const setElementSrc = (id, src) => {
            const el = document.getElementById(id);
            if (el) el.src = src;
        };

        // --- 3. POPOLAMENTO HEADER E INFO BAR ---
        setElementText('detail-title', ricetta.titolo);
        setElementText('detail-concept', ricetta.concept);
        setElementSrc('detail-img', ricetta.img);

        const recipeImg = document.getElementById('detail-img');

        if (recipeImg) {
            recipeImg.onload = () => {
                recipeImg.classList.add('loaded');
            };

            window.addEventListener('scroll', () => {
                const scrollValue = window.scrollY;
                // 0.0002 è un fattore di zoom quasi impercettibile, molto elegante
                recipeImg.style.transform = `scale(${1 + scrollValue * 0.0002})`;
            });
        }

        setElementText('detail-difficulty', ricetta.difficolta);
        setElementText('detail-time', ricetta.tempo_preparazione);
        setElementText('detail-tips', ricetta.consigli);

        // Gestione Macro strutturati
        const m = ricetta.macros_stimati;
        if (m) {
            const macrosString = `${m.kcal} Kcal | ${m.proteine} Pro | ${m.carboidrati} Carb | ${m.grassi} Gr`;
            setElementText('detail-macros', macrosString);
        }

        // --- 4. POPOLAMENTO INGREDIENTI (Lista Interattiva) ---
        const ingredientsList = document.getElementById('detail-ingredients');
        if (ingredientsList && ricetta.ingredienti) {
            ingredientsList.innerHTML = ricetta.ingredienti.map(item => `
                <li class="ingredient-item">
                    <div class="ingredient-diamond"></div>
                    <span class="ingredient-text">${item}</span>
                </li>
            `).join('');

            // Aggiungi listener per il check degli ingredienti
            ingredientsList.querySelectorAll('.ingredient-item').forEach(li => {
                li.addEventListener('click', () => li.classList.toggle('is-checked'));
            });
        }


        // --- 5. POPOLAMENTO PROCEDIMENTO ---
        const methodContainer = document.getElementById('detail-steps');
        if (methodContainer && ricetta.procedimento) {
            methodContainer.innerHTML = '';

            // Dividiamo per paragrafi e formattiamo
            ricetta.procedimento.split('\n\n').forEach(textBlock => {
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

        document.getElementById('detail-tips').innerText = ricetta.consiglio_beddafit;

    } catch (error) {
        console.error("Errore nel caricamento della ricetta:", error);
    }
}

document.addEventListener('DOMContentLoaded', loadRecipeDetail);