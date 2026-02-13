// =======================
// MODULE HEADER
// =======================

// Charger le header externe
document.addEventListener("DOMContentLoaded", () => {
  fetch("header.html")
    .then(res => res.text())
    .then(html => {
      document.getElementById("header-container").innerHTML = html;

      // Après insertion, on met l'onglet actif
      const navLinks = document.querySelectorAll("#header-container .nav-link");
      const currentPath = window.location.pathname.replace("/", "");

      navLinks.forEach(link => {
        link.classList.remove("active");
        const href = link.getAttribute("href").replace("/", "");
        if (href === currentPath) link.classList.add("active");
      });
      setLanguage(currentLang);
    })
    .catch(err => console.error("Erreur chargement header :", err));
});

//class .active sur le bon onglet
document.addEventListener("DOMContentLoaded", () => {
  const navLinks = document.querySelectorAll("header .nav-link");
  const currentPath = window.location.pathname.replace("/", ""); // retire le "/" du début

  navLinks.forEach(link => {
    // On retire "active" de tous les liens
    link.classList.remove("active");

    // On récupère le href sans le "/" de début
    const href = link.getAttribute("href").replace("/", "");

    // Si le href correspond au chemin actuel, on active
    if (href === currentPath) {
      link.classList.add("active");
    }
  });
});
