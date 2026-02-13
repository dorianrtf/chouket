const params = new URLSearchParams(window.location.search);
const selectedCategory = params.get("s"); // ex: "Fruit" ou "Légume"

let data = [];

fetch("data.json")
  .then(res => res.json())
  .then(json => {
    data = json;
    showCategoryCards(selectedCategory); // <<< MODIF : afficher les cards après chargement
  })
  .catch(err => console.error("Erreur JSON:", err));

  function showCategoryCards(category) {
  const container = document.getElementById("result");

  // CAS 1 : aucune catégorie sélectionnée → afficher toutes les catégories
  if (!category) {
    container.innerHTML = "<h1>Toutes les catégories</h1>";

    const categories = new Set();

    data.forEach(f => {
      if (f.category) categories.add(f.category);
      if (f.subCategory) categories.add(f.subCategory);
      if (f.subSubCategory) categories.add(f.subSubCategory);
    });

    categories.forEach(cat => {
      container.innerHTML += `
        <div class="card mb-3 shadow-sm">
          <div class="card-body">
            <h5 class="card-title">
              <a href="./category.html?s=${encodeURIComponent(cat)}">
                ${cat}
              </a>
            </h5>
          </div>
        </div>
      `;
    });

    return; // ⛔ on sort ici, on n’affiche PAS les aliments
  }


  // filtrer sur category, subCategory ou subSubCategory
  const filtered = data.filter(f =>
    f.category === category ||
    f.subCategory === category ||
    f.subSubCategory === category
  );

  if (!filtered.length) {
    container.innerHTML = `<p class="text-secondary">Aucun aliment trouvé pour "${category}"</p>`;
    return;
  }

  filtered.forEach(food => {
    // Tu peux ici adapter la couleur selon le status d'un animal par défaut si tu veux
    const colorClass = "secondary"; // ou success/danger selon ton choix
    container.innerHTML += `
      <div class="card mb-3 shadow-sm border-${colorClass}">
        <div class="card-body">
          <h5 class="card-title">${food.name}</h5>
          <p class="card-text">
            Catégorie : ${food.category}${food.subCategory ? " / " + food.subCategory : ""}${food.subSubCategory ? " / " + food.subSubCategory : ""}
          </p>
        </div>
      </div>
    `;
  });
}
