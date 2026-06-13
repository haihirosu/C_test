const CACHE_NAME = "catan-pwa-v2";
const ASSETS_TO_CACHE = [
  "./",
  "./index.html",
  "./manifest.webmanifest",
  "./local-catan-apple-touch-icon-180.png",
  "./local-catan-icon-192.png",
  "./local-catan-splash-512.png",
  "./img/terrain/terrain-desert.webp",
  "./img/terrain/terrain-forest.webp",
  "./img/terrain/terrain-sheep.webp",
  "./img/terrain/terrain-brick.webp",
  "./img/terrain/terrain-ore.webp",
  "./img/terrain/terrain-wheat.webp",
  "./img/card/dev_knight.webp",
  "./img/card/dev_monopoly.webp",
  "./img/card/dev_road_building.webp",
  "./img/card/dev_victory_point.webp",
  "./img/card/dev_year_of_plenty.webp"
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
