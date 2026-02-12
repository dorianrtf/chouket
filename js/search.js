// =======================
// MODULE RECHERCHE
// =======================
const foodInput = document.getElementById("foodInput");
const animalTabs = document.querySelectorAll("#animalTabs .nav-link");
const suggestionsContainer = document.getElementById("suggestions");
const resultDiv = document.getElementById("result");

let data = [];
let selectedAnimal = "chien";

// Charger les données
fetch("data.json")
  .then(res => res.json())
  .then(json => data = json)
  .catch(err => console.error("Erreur JSON:", err));

// Gestion des onglets
animalTabs.forEach(tab => {
  tab.addEventListener("click", () => {
    animalTabs.forEach(t => {
      t.classList.remove("active");
      t.setAttribute("aria-selected", "false");
    });
    tab.classList.add("active");
    tab.setAttribute("aria-selected", "true");
    selectedAnimal = tab.dataset.animal;

    const query = foodInput.value.trim().toLowerCase();
    if (query) {
      const match = data.find(f => f.name.toLowerCase() === query);
      if (match) showResult(match);
    }

    suggestionsContainer.innerHTML = "";
  });
});


// Filtrer suggestions
foodInput.addEventListener("input", () => {
  const query = foodInput.value.trim().toLowerCase();
  suggestionsContainer.innerHTML = "";
  if (!query) return;

  const filtered = data
    .filter(f => f.name.toLowerCase().startsWith(query) && f.animalStatus[selectedAnimal])
    .slice(0, 6);

  filtered.forEach(f => {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "list-group-item list-group-item-action";
    btn.textContent = f.name;

    btn.addEventListener("click", () => {
      // IMPORTANT : mettre à jour le input avec le nom exact
      foodInput.value = f.name;
      showResult(f);
      suggestionsContainer.innerHTML = "";
    });

    suggestionsContainer.appendChild(btn);
  });
});

// Sélection par entrée
foodInput.addEventListener("keydown", e => {
  if (e.key === "Enter") {
    const first = suggestionsContainer.querySelector(".list-group-item");
    if (first) {
      const match = data.find(f => f.name === first.textContent);
      if (match) {
        // IMPORTANT : mettre à jour le input avec le nom exact
        foodInput.value = match.name;
        showResult(match);
      }
      suggestionsContainer.innerHTML = "";
    }
  }
});

// Affichage du résultat
function showResult(food) {
  const animalData = food.animalStatus[selectedAnimal];

  // Vider l'ancien résultat et afficher le loader
  resultDiv.innerHTML = `
    <div class="spinner-border text-primary" role="status">
      <span class="visually-hidden">Chargement...</span>
    </div>
    <span class="ms-2">Chargement...</span>
  `;

  // Afficher le vrai résultat après 500ms
  setTimeout(() => {
    if (!animalData) {
      resultDiv.innerHTML = `<div class="text-secondary">Aucune info pour ${selectedAnimal}</div>`;
      return;
    }

    let colorClass = "text-danger";
    if (animalData.status === "OK") colorClass = "text-success";
    else if (animalData.status === "LIMITER") colorClass = "text-warning";

    resultDiv.innerHTML = `
      <h4 class="${colorClass}">${food.name}</h4>
      <p>Status : <strong>${animalData.status}</strong></p>
      <p>${animalData.details}</p>
    `;
  }, 300); // 300ms
}



