/* All paths are scope-relative, including GitHub Pages /MosquitoGame/. */
"use strict";
const CACHE = "lories-picnic-v3";
const ASSETS = [
  "./",
  "./index.html",
  "./style.css",
  "./progression.js",
  "./game.js",
  "./assets/picnic.webp",
  "./icon.svg",
  "./assets/icon-192.png",
  "./assets/icon-512.png",
  "./manifest.webmanifest",
];
self.addEventListener("install", (event) =>
  event.waitUntil(caches.open(CACHE).then((cache) => cache.addAll(ASSETS))),
);
self.addEventListener("activate", (event) =>
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(
          keys
            .filter((key) => key.startsWith("lories-picnic-") && key !== CACHE)
            .map((key) => caches.delete(key)),
        ),
      )
      .then(() => self.clients.claim()),
  ),
);
self.addEventListener("fetch", (event) => {
  if (
    event.request.method !== "GET" ||
    new URL(event.request.url).origin !== self.location.origin
  )
    return;
  if (event.request.mode === "navigate")
    event.respondWith(
      fetch(event.request).catch(() => caches.match("./index.html")),
    );
  else
    event.respondWith(
      caches
        .match(event.request)
        .then((cached) => cached || fetch(event.request)),
    );
});
