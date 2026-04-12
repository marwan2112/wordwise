const CACHE_NAME = 'wordwise-v2'; // زيادة الإصدار لضمان تحديث الكاش
const urlsToCache = [
  '/wordwise/',
  '/wordwise/index.html',
  '/wordwise/styles.css',
  '/wordwise/wordwise_logo.png',
  'https://fonts.googleapis.com/css2?family=Cairo:wght@400;500;600;700&family=Poppins:wght@400;500;600;700&display=swap'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(urlsToCache))
      .then(() => self.skipWaiting())
      .catch(error => console.error('Install failed:', error))
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
  const url = new URL(event.request.url);
  
  // استراتيجية الشبكة أولاً للملفات المهمة (الصفحة الرئيسية وملفات التطبيق الأساسية)
  if (event.request.mode === 'navigate' ||
      url.pathname.endsWith('app.js') ||
      url.pathname.endsWith('data.js') ||
      url.pathname.endsWith('gapfillDB.js') ||
      url.pathname.endsWith('index.html')) {
    event.respondWith(
      fetch(event.request)
        .then(response => {
          // فقط طلبات GET يتم تخزينها مؤقتاً
          if (response && response.status === 200 && event.request.method === 'GET') {
            const responseToCache = response.clone();
            caches.open(CACHE_NAME).then(cache => {
              cache.put(event.request, responseToCache).catch(err => {
                console.warn('Failed to cache:', event.request.url, err);
              });
            });
          }
          return response;
        })
        .catch(() => {
          // في حالة فشل الشبكة، حاول من الكاش
          return caches.match(event.request);
        })
    );
  } else {
    // للملفات الأخرى (الصور، الخطوط، إلخ) استخدم الكاش أولاً ثم الشبكة
    event.respondWith(
      caches.match(event.request)
        .then(response => {
          if (response) return response;
          // فقط طلبات GET يتم تخزينها مؤقتاً
          if (event.request.method !== 'GET') {
            return fetch(event.request);
          }
          return fetch(event.request).then(response => {
            if (!response || response.status !== 200) return response;
            const responseToCache = response.clone();
            caches.open(CACHE_NAME).then(cache => {
              cache.put(event.request, responseToCache).catch(err => {
                console.warn('Failed to cache:', event.request.url, err);
              });
            });
            return response;
          });
        })
    );
  }
});
