// NurDua Service Worker für PWA & Offline-Support
const CACHE_NAME = "nurdua-v48";
const URLS_TO_CACHE = [
  "/",
  "/index.html",
  "/impressum.html",
  "/datenschutz.html",
  "/css/styles.css",
  "/js/app.js",
  "/js/consent.js",
  "/js/duas-data.js",
  "/assets/logo-full.png",
  "https://fonts.googleapis.com/css2?family=Amiri:wght@400;700&family=Inter:wght@400;500;600;700&family=Playfair+Display:wght@700;800&display=swap",
];

// Installation: Assets frisch aus dem Netz cachen (cache:"reload" umgeht den
// HTTP-Cache, damit immutable JS/CSS nicht als alte Version reingezogen wird)
// und den neuen SW sofort aktivieren (skipWaiting).
self.addEventListener("install", (event) => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) =>
      Promise.all(
        URLS_TO_CACHE.map((url) =>
          fetch(new Request(url, { cache: "reload" }))
            .then((response) => {
              if (response && (response.ok || response.type === "opaque")) {
                return cache.put(url, response);
              }
            })
            .catch(() => {
              /* einzelne Ressource nicht erreichbar -> Install trotzdem fortsetzen */
            })
        )
      )
    )
  );
});

// Activation: alte Caches löschen und Kontrolle über offene Tabs übernehmen
// (clients.claim) -> neue Version greift sofort, ohne App-Neustart.
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((cacheNames) =>
        Promise.all(
          cacheNames.map((cacheName) => {
            if (cacheName !== CACHE_NAME) {
              return caches.delete(cacheName);
            }
          })
        )
      )
      .then(() => self.clients.claim())
  );
});

// Fetch-Strategie:
//  - HTML / Seitenaufrufe (navigate): NETWORK-FIRST -> immer aktuell,
//    Cache nur als Offline-Fallback.
//  - Statische Assets (JS/CSS/Bilder/Fonts): CACHE-FIRST -> schnell & offline.
self.addEventListener("fetch", (event) => {
  const req = event.request;
  if (req.method !== "GET") {
    return;
  }

  // Network-first für Navigationen (HTML)
  if (req.mode === "navigate") {
    event.respondWith(
      fetch(req)
        .then((response) => {
          // frische index.html für Offline-Fall aktualisieren
          const copy = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put("/index.html", copy));
          return response;
        })
        .catch(() =>
          caches
            .match(req)
            .then((cached) => cached || caches.match("/index.html"))
        )
    );
    return;
  }

  // Cache-first für alles andere
  event.respondWith(
    caches.match(req).then((cached) => {
      if (cached) {
        return cached;
      }

      return fetch(req)
        .then((response) => {
          // Nur erfolgreiche Same-Origin-Antworten cachen
          if (!response || response.status !== 200 || response.type !== "basic") {
            return response;
          }
          const copy = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(req, copy));
          return response;
        })
        .catch(() =>
          new Response("Offline - Inhalte nicht verfügbar", {
            status: 503,
            statusText: "Service Unavailable",
            headers: new Headers({ "Content-Type": "text/plain" }),
          })
        );
    })
  );
});
