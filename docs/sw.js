const CACHE_NAME = 'Matiri-boys-cache-v2';
const APP_SHELL = [
  './',
  './index.html',
  './home/',
  './home/index.html',
  './manifest.json',
  './styles/shared.css',
  './styles/components.css',
  './styles/mobile.css',
  './js/main.js',
  './js/router.js',
  './js/slider.js',
  './logo/favicon.ico',
  './logo/apple-touch-icon.png',
  './logo/logo-192.png',
  './logo/logo-512.png'
];

self.addEventListener('install', (event) => {
  event.waitUntil(caches.open(CACHE_NAME).then((cache) => cache.addAll(APP_SHELL)));
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => Promise.all(
      cacheNames.filter((name) => name !== CACHE_NAME).map((name) => caches.delete(name))
    ))
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') {
    return;
  }

  event.respondWith(
    fetch(event.request).then((response) => {
      if (response.ok) {
        const responseCopy = response.clone();
        caches.open(CACHE_NAME).then((cache) => cache.put(event.request, responseCopy));
      }

      return response;
    }).catch(() => caches.match(event.request).then((cachedResponse) => cachedResponse || caches.match('./index.html')))
  );
});

