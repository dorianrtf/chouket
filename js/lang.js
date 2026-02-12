// =======================
// MODULE LANGUAGE
// =======================
let translations = {};
let currentLang;

// Détecte la langue du navigateur
function detectLanguage() {
  const lang = navigator.language || navigator.userLanguage;
  if (lang.startsWith("fr")) return "fr";
  if (lang.startsWith("es")) return "es";
  return "en"; // fallback
}

// Applique une langue au site
function setLanguage(lang) {
  currentLang = lang;
   document.querySelectorAll("[data-i18n]").forEach(el => {
    const key = el.dataset.i18n;
    if (translations[lang] && translations[lang][key]) {
      el.textContent = translations[lang][key];
    }
  });

  // Sauvegarde le choix utilisateur
  localStorage.setItem("lang", lang);
}

// Chargement des traductions
fetch("translations.json")
  .then(res => res.json())
  .then(json => {
    translations = json;

    // Priorité : choix utilisateur > navigateur > anglais
    const lang =
      localStorage.getItem("lang") ||
      detectLanguage() ||
      "en";

    setLanguage(lang);
  })
  .catch(err => console.error("Error loading translations :", err));

