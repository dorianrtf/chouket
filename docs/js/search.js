// =======================
// MODULE RECHERCHE
// =======================
const foodInput = document.getElementById("foodInput");
const animalTabs = document.querySelectorAll("#animalTabs .nav-link");
const suggestionsContainer = document.getElementById("suggestions");
const resultDiv = document.getElementById("result");

let data = [];
let selectedAnimal = "chien";
let currentFocus = -1; // <<< MODIF : index de la suggestion active


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
  currentFocus = -1; // <<< MODIF : reset à chaque nouvelle saisie
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
      currentFocus = -1; // <<< MODIF : reset après clic
    });

    suggestionsContainer.appendChild(btn);
  });
});

// Sélection avec les flêches ou entrée
foodInput.addEventListener("keydown", e => {
  const items = suggestionsContainer.querySelectorAll(".list-group-item");
  if (!items.length) return;

  if (e.key === "ArrowDown") { // flèche bas
    e.preventDefault();
    currentFocus++;
    if (currentFocus >= items.length) currentFocus = 0;
    setActive(items);
  } else if (e.key === "ArrowUp") { // flèche haut
    e.preventDefault();
    currentFocus--;
    if (currentFocus < 0) currentFocus = items.length - 1;
    setActive(items);
  } else if (e.key === "Enter") { // entrée
    e.preventDefault();
    if (currentFocus > -1) {
      items[currentFocus].click(); // <<< MODIF : simule le clic sur la suggestion active
    } else {
      const first = items[0];
      if (first) {
        const match = data.find(f => f.name === first.textContent);
        if (match) {
          foodInput.value = match.name;
          showResult(match);
        }
      }
    }
    suggestionsContainer.innerHTML = "";
    currentFocus = -1; // <<< MODIF : reset
  }
});

function setActive(items) { // <<< MODIF : met en surbrillance l’élément courant
  items.forEach(item => item.classList.remove("active"));
  if (currentFocus >= 0 && currentFocus < items.length) {
    items[currentFocus].classList.add("active");
  }
}


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

    let colorClass = "danger";
    if (animalData.status === "OK") colorClass = "success";
    else if (animalData.status === "LIMITER") colorClass = "warning";

    resultDiv.innerHTML = `
  <div class="card mb-3 shadow-sm border-${colorClass}">
    <div class="card-header">
      <div class="d-flex justify-content-between align-items-center">
        <nav aria-label="breadcrumb">
          <ol class="breadcrumb mb-0">
            <li class="breadcrumb-item"><a href="./category.html?s=${encodeURIComponent(food.category)}">${food.category}</a></li>
            ${
              food.subCategory
                ? `<li class="breadcrumb-item"><a href="./category.html?s=${encodeURIComponent(food.subCategory)}">${food.subCategory}</a></li>`
                : ""
            }

            ${
              food.subSubCategory
                ? `<li class="breadcrumb-item"><a href="./category.html?s=${encodeURIComponent(food.subSubCategory)}">${food.subSubCategory}</a></li>`
                : ""
            }

            <li class="breadcrumb-item active" aria-current="page">
              ${food.name}
            </li>
          </ol>
        </nav>

        <span class="badge bg-${colorClass}">
          ${animalData.status}
        </span>
      </div>
    </div>

    <div class="card-body">
      <h4 class="card-title mb-0 text-${colorClass}">
        ${food.name}
      </h4>

      <p class="card-text">
        ${animalData.details}
      </p>
    </div>
  </div>
`;

  }, 300); // 300ms
}