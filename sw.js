const CACHE_NAME = "catan-pwa-v1";
const ASSETS_TO_CACHE = [
  "./",
  "./index.html",
  "./manifest.webmanifest",
  "./img/icon/local-catan-apple-touch-icon-180.png",
  "./img/icon/local-catan-icon-192.png",
  "./img/icon/local-catan-splash-512.png",
  "./img/dev_knight.png",
  "./img/dev_monopoly.png",
  "./img/dev_road_building.png",
  "./img/dev_victory_point.png",
  "./img/dev_year_of_plenty.png"
];

self.addEventListener("install", (event) => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS_TO_CACHE))
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(
        keys
          .filter((key) => key !== CACHE_NAME)
          .map((key) => caches.delete(key))
      ))
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (event) => {
  const { request } = event;

  if (request.method !== "GET") {
    return;
  }

  event.respondWith(
    caches.match(request).then((cachedResponse) => {
      if (cachedResponse) {
        return cachedResponse;
      }

      return fetch(request).catch(() => {
        const acceptsHtml = request.mode === "navigate"
          || (request.headers.get("accept") || "").includes("text/html");

        if (acceptsHtml) {
          return caches.match("./index.html");
        }

        throw new Error("Network request failed and no cache entry was found.");
      });
    })
  );
});
