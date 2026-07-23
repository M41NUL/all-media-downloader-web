// Bump this version any time you update index.html / cached assets,
// otherwise users will keep getting the old cached version.
const CACHE_VERSION = 'amd-v1';
const CACHE_NAME = `all-media-downloader-${CACHE_VERSION}`;

// Only cache same-origin app shell files here.
// Do NOT cache API calls (video info / video downloads) — those must always be live.
const APP_SHELL = [
  '/',
  '/index.html',
  '/manifest.json',
  '/offline.html'
];

// Install: pre-cache the app shell
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(APP_SHELL))
      .then(() => self.skipWaiting())
  );
});

// Activate: clean up old cache versions
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys
          .filter((key) => key.startsWith('all-media-downloader-') && key !== CACHE_NAME)
          .map((key) => caches.delete(key))
      )
    ).then(() => self.clients.claim())
  );
});

// Fetch strategy:
// - Never touch API requests (video fetch/proxy-video/etc) — always go to network.
// - For navigation requests (page loads): network first, fall back to cache, then offline.html.
// - For other same-origin static assets: cache first, fall back to network.
self.addEventListener('fetch', (event) => {
  const req = event.request;
  const url = new URL(req.url);

  // Only handle GET requests
  if (req.method !== 'GET') return;

  // Never cache/intercept API calls to the backend — always live
  if (url.hostname.includes('all-media-downloader-api.onrender.com')) {
    return;
  }

  // Page navigations (loading the app itself)
  if (req.mode === 'navigate') {
    event.respondWith(
      fetch(req)
        .then((res) => {
          const resClone = res.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(req, resClone));
          return res;
        })
        .catch(() =>
          caches.match(req).then((cached) => cached || caches.match('/offline.html'))
        )
    );
    return;
  }

  // Same-origin static assets: cache-first
  if (url.origin === self.location.origin) {
    event.respondWith(
      caches.match(req).then((cached) => {
        if (cached) return cached;
        return fetch(req)
          .then((res) => {
            const resClone = res.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(req, resClone));
            return res;
          })
          .catch(() => caches.match('/offline.html'));
      })
    );
  }
  // Cross-origin (fonts, icons, cdn) — let the browser handle normally
});
