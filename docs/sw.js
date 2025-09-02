// sw.js

// Using a new version number to force an update
const CACHE_NAME = 'expense-tracker-v6'; 

// Use relative paths for everything
const ASSETS_TO_CACHE = [
  'index.html',
  'script.js',
  'output.css',
  'images/icon-192x192.png',
  'images/icon-512x512.png'
];

// Install Event: Cache the essential app files
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Opened cache and caching assets');
        return cache.addAll(ASSETS_TO_CACHE);
      })
  );
  self.skipWaiting();
});

// Activate Event: Clean up old caches
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cache => {
          if (cache !== CACHE_NAME) {
            return caches.delete(cache);
          }
        })
      );
    })
  );
});

// Fetch Event (Stale-While-Revalidate): Best for speed and freshness
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.open(CACHE_NAME).then(cache => {
      return cache.match(event.request).then(response => {
        const fetchPromise = fetch(event.request).then(networkResponse => {
          if (networkResponse.status === 200) {
            cache.put(event.request, networkResponse.clone());
          }
          return networkResponse;
        });
        // Return cached response immediately, while updating in the background
        return response || fetchPromise;
      });
    })
  );
});
