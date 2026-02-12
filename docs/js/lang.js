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
  if (lang.startsWith("de")) return "de";
  return "en"; // fallback
}

// Applique une langue au site
function setLanguage(lang) {
  currentLang = lang;

  // Traductions
  document.querySelectorAll("[data-i18n]").forEach(el => {
    const key = el.dataset.i18n;
    if (translations[lang] && translations[lang][key]) {
      el.textContent = translations[lang][key];
    }
  });

  // Bouton actif
  document.querySelectorAll("[data-lang]").forEach(btn => {
    btn.classList.toggle("active", btn.dataset.lang === lang);
  });

  // Mettre à jour le <meta http-equiv="Content-Language">
  let metaLang = document.querySelector('meta[http-equiv="Content-Language"]');
  if (!metaLang) {
    metaLang = document.createElement("meta");
    metaLang.setAttribute("http-equiv", "Content-Language");
    document.head.appendChild(metaLang);
  }
  metaLang.setAttribute("content", lang);

  

  // Sauvegarde
  localStorage.setItem("lang", lang);
}

// Chargement des traductions
fetch("translations.json")
  .then(res => res.json())
  .then(json => {
    translations = json;

    const lang =
      localStorage.getItem("lang") ||
      detectLanguage() ||
      "en";

    setLanguage(lang);
  })
  .catch(err => console.error("Error loading translations :", err));
