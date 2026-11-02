// Vitrine Lab BA : thème, langue au 1er passage, serveur de téléchargement (Gitee en Chine, GitHub ailleurs), captures agrandies.
(function () {
  var stocker = function (cle, valeur) {
    try {
      localStorage.setItem(cle, valeur);
    } catch (e) {}
  };
  var lire = function (cle) {
    try {
      return localStorage.getItem(cle);
    } catch (e) {
      return null;
    }
  };

  // Langue : à la 1re visite de la page française, on propose la langue du navigateur ; ensuite le choix est retenu
  var racine = document.documentElement.dataset.langue === "fr" && !/\/(en|zh)\//.test(location.pathname);
  if (racine && !lire("labba-site-langue")) {
    var nav = (navigator.language || "fr").toLowerCase();
    var cible = nav.indexOf("zh") === 0 ? "zh/" : nav.indexOf("fr") === 0 ? "" : "en/";
    stocker("labba-site-langue", cible ? cible.slice(0, 2) : "fr");
    if (cible) {
      location.replace(cible + location.pathname.split("/").pop() + location.hash);
      return;
    }
  }

  document.addEventListener("DOMContentLoaded", function () {
    document.querySelectorAll("[data-choix-langue]").forEach(function (a) {
      a.addEventListener("click", function () {
        stocker("labba-site-langue", a.dataset.choixLangue);
      });
    });

    // Thème clair / sombre (par défaut : celui de l'ordinateur)
    var bouton = document.querySelector("[data-theme-bouton]");
    if (bouton)
      bouton.addEventListener("click", function () {
        var sombre = document.documentElement.dataset.theme
          ? document.documentElement.dataset.theme === "dark"
          : matchMedia("(prefers-color-scheme: dark)").matches;
        var nouveau = sombre ? "light" : "dark";
        document.documentElement.dataset.theme = nouveau;
        stocker("labba-site-theme", nouveau);
      });

    // Serveur : Gitee si l'ordinateur est réglé sur la Chine (fuseau horaire ou langue), sinon GitHub
    var fuseau = "";
    try {
      fuseau = Intl.DateTimeFormat().resolvedOptions().timeZone || "";
    } catch (e) {}
    var chine = /^Asia\/(Shanghai|Chongqing|Chungking|Harbin|Urumqi|Kashgar)$/.test(fuseau) || /^zh-(cn|hans)/i.test(navigator.language || "");
    var principal = chine ? "gitee" : "github";
    var autre = chine ? "github" : "gitee";
    document.querySelectorAll(".telechargement").forEach(function (bloc) {
      var lien = bloc.querySelector("[data-lien-principal]");
      var texte = bloc.querySelector("[data-serveur-texte]");
      var secours = bloc.querySelector("[data-lien-autre]");
      lien.href = bloc.dataset[principal];
      texte.textContent = texte.dataset[principal + "Texte"];
      secours.href = bloc.dataset[autre];
      secours.textContent = secours.dataset[principal + "Texte"];
    });

    // Captures : clic = agrandissement
    var visionneuse = document.querySelector(".visionneuse");
    if (visionneuse && visionneuse.showModal) {
      var image = visionneuse.querySelector("img");
      document.querySelectorAll("[data-agrandir]").forEach(function (b) {
        b.addEventListener("click", function () {
          image.src = b.dataset.agrandir;
          image.alt = b.querySelector("img").alt;
          visionneuse.showModal();
        });
      });
      visionneuse.addEventListener("click", function () {
        visionneuse.close();
      });
    }
  });
})();
