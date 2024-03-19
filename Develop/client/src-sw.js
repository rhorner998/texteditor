
const { offlineFallback, warmStrategyCache } = require('workbox-recipes');
const { CacheFirst } = require('workbox-strategies');
const { registerRoute } = require('workbox-routing');
const { CacheableResponsePlugin } = require('workbox-cacheable-response');
const { ExpirationPlugin } = require('workbox-expiration');
const { precacheAndRoute } = require('workbox-precaching/precacheAndRoute');

precacheAndRoute(self.__WB_MANIFEST);

const pageCache = new CacheFirst({
  cacheName: 'page-cache',
  plugins: [
    new CacheableResponsePlugin({
      statuses: [0, 200],
    }),
    new ExpirationPlugin({
      maxAgeSeconds: 30 * 24 * 60 * 60,
    }),
  ],
});

warmStrategyCache({
  urls: ['/index.html', '/'],
  strategy: pageCache,
});

registerRoute(({ request }) => request.mode === 'navigate', pageCache);

// TODO: Implement asset caching
// Asset caching
registerRoute(
  // Define a callback function that will filter the requests to cache
  // Cache based on file extension
  ({ request }) => ['style', 'script', 'image'].includes(request.destination),
  // Use the CacheFirst strategy
  new CacheFirst({
    // Name of the cache storage
    cacheName: 'asset-cache',
    plugins: [
      // Ensure that only requests that result in a 200 status are cached
      new CacheableResponsePlugin({
        statuses: [200],
      }),
      // Ensure that cached responses are updated in the background async
      new ExpirationPlugin({
        // Cache files for 30 days
        maxAgeSeconds: 30 * 24 * 60 * 60,
        // Only cache 60 items
        maxEntries: 60,
        // Automatically cleanup if quota is exceeded
        purgeOnQuotaError: true,
      }),
    ],
  })
);

