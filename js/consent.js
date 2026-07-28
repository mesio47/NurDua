// NurDua – GA4 Consent Mode + Cookie-Consent-Banner
// Ausgelagert aus index.html, damit es unter strikter CSP (script-src 'self') läuft.
(function () {
  "use strict";

  var GA_ID = "G-8QE8RLXZHQ";
  var CONSENT_KEY = "nurdua:analytics-consent";

  // --- Google Analytics 4 Consent Mode (Default: alles verweigert) ---
  window.dataLayer = window.dataLayer || [];
  function gtag() { dataLayer.push(arguments); }
  window.gtag = gtag;

  gtag("consent", "default", {
    ad_storage: "denied",
    analytics_storage: "denied",
  });

  // Lädt GA4 erst nach Einwilligung (einmalig).
  var gaLoaded = false;
  function loadGA() {
    if (gaLoaded) return;
    gaLoaded = true;

    gtag("consent", "update", { analytics_storage: "granted" });

    var script = document.createElement("script");
    script.async = true;
    script.src = "https://www.googletagmanager.com/gtag/js?id=" + GA_ID;
    document.head.appendChild(script);

    gtag("js", new Date());
    gtag("config", GA_ID, {
      anonymize_ip: true,
      allow_google_signals: false,
    });
  }

  // Wenn bereits früher zugestimmt wurde: GA sofort laden.
  if (localStorage.getItem(CONSENT_KEY) === "accepted") {
    loadGA();
  }

  // --- Cookie-Consent-Banner ---
  // Eine Entscheidung gilt für die GESAMTE Seite (localStorage ist pro Domain,
  // nicht pro Unterseite) – kein erneutes Abfragen auf jeder einzelnen Seite.
  var banner = null;

  function initBanner() {
    banner = document.getElementById("cookie-consent-banner");
    if (!banner) return;

    // Banner nur zeigen, wenn noch keine Entscheidung getroffen wurde.
    if (!localStorage.getItem(CONSENT_KEY)) {
      banner.style.display = "flex";
    }

    var acceptBtn = document.getElementById("cookie-accept-btn");
    var rejectBtn = document.getElementById("cookie-reject-btn");

    if (acceptBtn) {
      acceptBtn.addEventListener("click", function () {
        localStorage.setItem(CONSENT_KEY, "accepted");
        banner.style.display = "none";
        loadGA();
      });
    }

    if (rejectBtn) {
      rejectBtn.addEventListener("click", function () {
        localStorage.setItem(CONSENT_KEY, "rejected");
        banner.style.display = "none";
        // Widerruf muss so einfach wirken wie die Zustimmung (Art. 7 Abs. 3 DSGVO):
        // auch wenn GA vorher schon geladen wurde, Consent-Signal aktualisieren.
        gtag("consent", "update", { analytics_storage: "denied" });
      });
    }
  }

  // Erlaubt es, die Entscheidung später zu ändern (Link "Cookie-Einstellungen"
  // im Footer aller Seiten) – öffnet denselben Banner erneut.
  function initSettingsLink() {
    var link = document.getElementById("cookie-settings-link");
    if (!link) return;
    link.addEventListener("click", function (e) {
      e.preventDefault();
      if (banner) banner.style.display = "flex";
    });
  }

  function init() {
    initBanner();
    initSettingsLink();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
