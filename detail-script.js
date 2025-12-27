async function loadRecipeDetail() {
    const queryString = window.location.search;

    const urlParams = new URLSearchParams(queryString);
    const recipeId = urlParams.get('id');
    if (!recipeId) {
        alert("Attenzione: nessun ID trovato nell'URL!");
        window.location.href = 'index.html';
        return;
    }

    try {
        const response = await fetch('ricettario.json');
        const data = await response.json();

        const ricetta = data.ricettario.find(r => r.id === recipeId);

        if (!ricetta) {
            alert("Ricetta non trovata nel file JSON!");
            return;
        }

        document.title = `${ricetta.titolo} | BeddaFit`;


        const metaDescription = document.querySelector('meta[name="description"]');
        if (metaDescription) {
            metaDescription.setAttribute("content", ricetta.concept);
        }
        document.getElementById('detail-title').innerText = ricetta.titolo;
        document.getElementById('detail-img').src = ricetta.img;
        document.getElementById('detail-concept').innerText = ricetta.concept;

        const ingredientsList = document.getElementById('detail-ingredients');
        const rawIngredients = ricetta.ingredienti;

        ingredientsList.innerHTML = '';

        rawIngredients.forEach(item => {
            const li = document.createElement('li');
            li.className = 'ingredient-item';

            li.innerHTML = `
        <div class="ingredient-diamond"></div>
        <span class="ingredient-text">${item}</span>
    `;

            li.addEventListener('click', () => {
                li.classList.toggle('is-checked');
            });

            ingredientsList.appendChild(li);
        });

        const methodContainer = document.getElementById('detail-steps');
        const rawMethod = ricetta.procedimento;

        methodContainer.innerHTML = '';

        const paragraphs = rawMethod.split('\n\n');

        paragraphs.forEach(textBlock => {
            const p = document.createElement('p');
            p.className = 'recipe-step-paragraph';

            if (textBlock.includes(':')) {
                const parts = textBlock.split(':');
                const stepTitle = parts[0].trim();
                const stepContent = parts.slice(1).join(':').trim();

                p.innerHTML = `<span class="step-highlight">${stepTitle}:</span> ${stepContent}`;
            } else {
                p.innerText = textBlock;
            }

            methodContainer.appendChild(p);
        });

    } catch (error) {
        console.error("Errore tecnico:", error);
    }
}

document.addEventListener('DOMContentLoaded', loadRecipeDetail);