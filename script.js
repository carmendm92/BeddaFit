document.addEventListener("DOMContentLoaded", function () {

    /**
     * Caricamento dinamico delle ricette dal file JSON
     */
    async function loadRecipes() {
        const grid = document.getElementById('recipe-grid');
        if (!grid) return;

        try {
            const response = await fetch('ricettario.json');
            if (!response.ok) throw new Error('Errore nel caricamento del file JSON');

            const data = await response.json();
            const ricetteArray = data.ricettario || [];

            let htmlContent = "";

            ricetteArray.forEach((ricetta, index) => {
                // Gestione sicura dei macro (default a 0 se mancano)
                const proteins = ricetta.macros_stimati?.proteine || '0g';
                const kcal = ricetta.macros_stimati?.kcal || '0';
                const carbs = ricetta.macros_stimati?.carboidrati || '0g';

                // ID ricetta per il link e il numero visualizzato
                const recipeId = ricetta.id || index + 1;

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
                            <span class="recipe-number">RICETTA N. ${recipeId}</span>
                            <h2 class="recipe-title">${ricetta.titolo || 'Senza Titolo'}</h2>
                            <p class="recipe-concept">${ricetta.concept || ''}</p>
                            <a href="ricetta.html?id=${recipeId}" class="read-more">LASCIATI ISPIRARE —</a>
                        </div>
                    </div>
                </div>`;
            });

            grid.innerHTML = htmlContent;

        } catch (error) {
            console.error("BeddaFit Error:", error);
            grid.innerHTML = `<p class="text-center">Si è verificato un errore nel caricamento delle ricette.</p>`;
        }
    }

    loadRecipes();
});