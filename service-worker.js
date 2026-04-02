const CACHE_NAME = 'wordwise-v1';
const urlsToCache = [
  '/wordwise/',
  '/wordwise/index.html',
  '/wordwise/styles.css',
  '/wordwise/app.js',
  '/wordwise/data.js',
  '/wordwise/wordwise_logo.png',
  'https://fonts.googleapis.com/css2?family=Cairo:wght@400;500;600;700&family=Poppins:wght@400;500;600;700&display=swap'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(urlsToCache))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', event => {
  // Use "Network First" strategy for pages and scripts to ensure data sync is fresh
  if (event.request.mode === 'navigate' || 
      event.request.destination === 'script' || 
      event.request.url.includes('app.js') || 
      event.request.url.includes('index.html')) {
    event.respondWith(
      fetch(event.request)
        .then(response => {
          // If network is OK, update cache and return
          if (response && response.status === 200) {
            const responseToCache = response.clone();
            caches.open(CACHE_NAME).then(cache => {
              cache.put(event.request, responseToCache);
            });
          }
          return response;
        })
        .catch(() => {
          // If network fails, try cache
          return caches.match(event.request);
        })
    );
  } else {
    // For other assets (images, fonts), use "Cache First"
    event.respondWith(
      caches.match(event.request)
        .then(response => {
          if (response) return response;
          return fetch(event.request).then(response => {
            if (!response || response.status !== 200) return response;
            const responseToCache = response.clone();
            caches.open(CACHE_NAME).then(cache => {
              cache.put(event.request, responseToCache);
            });
            return response;
          });
        })
    );
  }
});
