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

        document.getElementById('detail-title').innerText = ricetta.titolo;
        document.getElementById('detail-img').src = ricetta.img;
        document.getElementById('detail-concept').innerText = ricetta.concept;

        const ingredientsList = document.getElementById('detail-ingredients');
        ingredientsList.innerHTML = "";

        ricetta.ingredienti.forEach(ing => {
            let li = document.createElement('li');
            li.innerText = ing;
            ingredientsList.appendChild(li);
        });

        const stepsContainer = document.getElementById('detail-steps');
        let testo = ricetta.procedimento;

        // Trucco per mettere in grassetto i titoli che finiscono con i due punti ":"
        const testoFormattato = testo.replace(/([A-Z\sÀ-Ú]+:)/g, '<strong>$1</strong>');

        stepsContainer.innerHTML = testoFormattato; // Usiamo innerHTML per leggere i <strong>

    } catch (error) {
        console.error("Errore tecnico:", error);
    }
}

document.addEventListener('DOMContentLoaded', loadRecipeDetail);