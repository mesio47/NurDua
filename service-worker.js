// NurDua Service Worker für PWA & Offline-Support
const CACHE_NAME = "nurdua-v3";
const URLS_TO_CACHE = [
  "/",
  "/index.html",
  "/impressum.html",
  "/datenschutz.html",
  "/css/styles.css",
  "/js/app.js",
  "/js/duas-data.js",
  "/assets/logo.svg",
  "/assets/logo-full.png",
  "https://fonts.googleapis.com/css2?family=Amiri:wght@400;700&family=Inter:wght@400;500;600;700&family=Playfair+Display:wght@700;800&display=swap",
];

// Installation: Cache wichtige Assets
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(URLS_TO_CACHE);
    }).catch(() => {
      console.log("Cache installation failed");
    })
  );
});

// Activation: Cleanup alte Caches
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

// Fetch: Serve from cache, fallback to network
self.addEventListener("fetch", (event) => {
  if (event.request.method !== "GET") {
    return;
  }

  event.respondWith(
    caches.match(event.request).then((response) => {
      if (response) {
        return response;
      }

      return fetch(event.request).then((response) => {
        if (!response || response.status !== 200 || response.type === "basic") {
          return response;
        }

        const responseToCache = response.clone();
        caches.open(CACHE_NAME).then((cache) => {
          cache.put(event.request, responseToCache);
        });

        return response;
      }).catch(() => {
        return new Response("Offline - Inhalte nicht verfügbar", {
          status: 503,
          statusText: "Service Unavailable",
          headers: new Headers({
            "Content-Type": "text/plain"
          })
        });
      });
    })
  );
});
