document.addEventListener("DOMContentLoaded", function () {

    // caricamento card dinamiche //
    async function loadRecipes() {
        try {
            const response = await fetch('ricettario.json');
            const data = await response.json();

            const ricetteArray = data.ricettario;
            const grid = document.getElementById('recipe-grid');

            if (!grid) return;

            let htmlContent = "";

            for (let i = 0; i < ricetteArray.length; i++) {
                const ricetta = ricetteArray[i];

                htmlContent += `
                <div class="col-md-6 col-lg-4">
                    <div class="bedda-luxury-card">
                        <div class="image-wrapper">
                            <img src="${ricetta.img || ''}" class="img-fluid" alt="${ricetta.titolo}">
                            <div class="macro-overlay">
                                <div class="d-flex justify-content-around w-100">
                                    <div class="v-detail"><span>${ricetta.macros_stimati?.proteine || '0g'}</span><small>PRO</small></div>
                                    <div class="v-detail"><span>${ricetta.macros_stimati?.kcal || '0'}</span><small>KCAL</small></div>
                                    <div class="v-detail"><span>${ricetta.macros_stimati?.carboidrati || '0g'}</span><small>CARB</small></div>
                                </div>
                            </div>
                        </div>
                        <div class="content-wrapper pt-4">
                            <span class="recipe-number">RECIPE N. ${ricetta.id || i}</span>
                            <h2 class="recipe-title">${ricetta.titolo || 'Senza Titolo'}</h2>
                            <p class="recipe-concept">${ricetta.concept || ''}</p>
                            <a href="ricetta.html?id=${ricetta.id}" class="read-more">Discovery Recipe —</a>
                        </div>
                    </div>
                </div>`;
            }
            grid.innerHTML = htmlContent;

        } catch (error) {
            console.error("Errore nel caricamento:", error);
        }
    }
    loadRecipes();


});
