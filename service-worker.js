const CACHE_NAME = "mt-plan-v1";
const ASSETS = ["./", "./index.html", "./app.js", "./app-data.js", "./manifest.json", "./icon.svg"];

self.addEventListener("install", e => {
  e.waitUntil(caches.open(CACHE_NAME).then(c => c.addAll(ASSETS)));
});

self.addEventListener("activate", e => {
  e.waitUntil(
    caches.keys().then(keys => Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k))))
  );
});

self.addEventListener("fetch", e => {
  e.respondWith(
    caches.match(e.request).then(cached => cached || fetch(e.request))
  );
});
