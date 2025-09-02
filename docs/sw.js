const CACHE_NAME = 'expense-tracker-v5';

const ASSETS_TO_CACHE = [
  'index.html',
  'script.js',
  'output.css',
  'images/icon-192x192.png',
  'images/icon-512x512.png'
];

// Install
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll(ASSETS_TO_CACHE);
    })
  );
  self.skipWaiting();
});

// Activate
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.map(key => key !== CACHE_NAME ? caches.delete(key) : null))
    )
  );
});

// Fetch with fallback to index.html
self.addEventListener('fetch', event => {
  event.respondWith(
    fetch(event.request).catch(() =>
      caches.match(event.request).then(response => {
        if (response) {
          return response;
        }
        // Fallback for navigation requests (like opening the app)
        if (event.request.mode === 'navigate') {
          return caches.match('index.html');
        }
      })
    )
  );
});
