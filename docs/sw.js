const CACHE_NAME = 'expense-tracker-v2';
const ASSETS_TO_CACHE = [
  './',
  './index.html',
  './script.js',
  './output.css',
  './images/icon-192x192.png',
  './images/icon-512x512.png'

];


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


self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cache => {
          if (cache !== CACHE_NAME) {
            console.log('Service Worker: clearing old cache');
            return caches.delete(cache);
          }
        })
      );
    })
  );
});


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

        
        return response || fetchPromise;
      });
    })
  );
});