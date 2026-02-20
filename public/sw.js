const CACHE_NAME = 'rp-v2';
const CACHE_PATHS = [
  // `/v1/collection/list`,
  // `/v1/country/list`,
  // `/v1/movie/hot`,
  // `/v1/collection/homepageTopics`,
  // `/v1/genre/mostPopularRanking`,
  // `/v1/comment/latestComments`,
  // `/v1/movie/mostFavoriteRanking`,
  // `/v1/movie/mostCommentedRanking`,
]

self.addEventListener('install', event => {
  const hostname = self.location.hostname;
  const apiUrl = hostname === 'localhost'
    ? 'http://localhost:3011'
    : 'https://ophim1.com/v1/api'

  const urlsToCache = CACHE_PATHS.map(path => `${apiUrl}${path}`);

  try {
    event.waitUntil(
      caches.open(CACHE_NAME).then(cache => {
        return cache.addAll(urlsToCache);
      })
    )
  } catch (e) {
    console.log("Install error:")
    console.log(e)
  }
});

self.addEventListener('fetch', event => {
  try {
    if (CACHE_PATHS.includes(new URL(event.request.url).pathname)) {
      event.respondWith(
        caches.open(CACHE_NAME).then(cache => {
          return cache.match(event.request).then(cachedResponse => {
            const fetchPromise = fetch(event.request).then(networkResponse => {
              cache.put(event.request, networkResponse.clone());
              return networkResponse;
            });

            return cachedResponse || fetchPromise;
          });
        })
      );
    }
  } catch (e) {
    console.log("Fetch error:")
    console.log(e)
  }
});

self.addEventListener('activate', event => {
  try {
    const cacheWhitelist = [CACHE_NAME];
    event.waitUntil(
      caches.keys().then(cacheNames => {
        return Promise.all(
          cacheNames.map(cacheName => {
            if (!cacheWhitelist.includes(cacheName)) {
              return caches.delete(cacheName);
            }
          })
        );
      })
    );
  } catch (e) {
    console.log("Active error:")
    console.log(e)
  }
});

self.addEventListener("message", (event) => {
  if (event.data && event.data.type === "SKIP_WAITING") {
    console.log("Received SKIP_WAITING message, activating new Service Worker...");
    self.skipWaiting();
  }
});
