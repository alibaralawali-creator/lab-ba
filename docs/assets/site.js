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

    // Thème : automatique par défaut (comme l'ordinateur, en direct), puis clair, sombre, et retour à automatique
    var bouton = document.querySelector("[data-theme-bouton]");
    var titrer = function () {
      var mode = document.documentElement.dataset.theme || "auto";
      bouton.title = bouton.dataset["titre" + mode.charAt(0).toUpperCase() + mode.slice(1)];
      bouton.setAttribute("aria-label", bouton.title);
    };
    if (bouton) {
      titrer();
      bouton.addEventListener("click", function () {
        var suivant = { auto: "light", light: "dark", dark: "auto" }[document.documentElement.dataset.theme || "auto"];
        if (suivant === "auto") delete document.documentElement.dataset.theme;
        else document.documentElement.dataset.theme = suivant;
        stocker("labba-site-theme", suivant);
        titrer();
      });
    }

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
      var film = visionneuse.querySelector("video");
      document.querySelectorAll("[data-agrandir]").forEach(function (b) {
        b.addEventListener("click", function () {
          film.hidden = true;
          image.hidden = false;
          image.src = b.dataset.agrandir;
          image.alt = b.querySelector("img").alt;
          visionneuse.showModal();
        });
      });
      // Vidéos : clic = grande taille, avec les commandes (pause, plein écran)
      document.querySelectorAll("[data-agrandir-video]").forEach(function (v) {
        v.addEventListener("click", function () {
          image.hidden = true;
          film.hidden = false;
          film.src = v.dataset.agrandirVideo;
          film.currentTime = v.currentTime;
          film.play();
          visionneuse.showModal();
        });
      });
      visionneuse.addEventListener("click", function (e) {
        if (e.target !== film) visionneuse.close();
      });
      visionneuse.addEventListener("close", function () {
        film.pause();
      });
    }
  });
})();
