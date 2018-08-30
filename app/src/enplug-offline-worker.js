/**
 * Service worker responsible for providing offline support to Enplug Apps.
 * @author Michal Drewniak (michal@enplug.com)
 */

'use strict';

/**
 * Offline support configuration.
 * @type {Object}
 * @property {string} cacheVersion - Version of the cache. This should be updated any time we want
 *     the previous version of the cache removed.
 * @property {string} cacheName - Name of the cache. This is usually the same as the application
 *     name or ID.
 * @property {Array.<string>} = A list of static URLs which should be cached.
 * @property {Object.<string, number>} - A mapping of URLs (or their parts) to time in minutes.
 *     The URL denotes for which locations cached responses should be refreshed. Time denotes
 *     after which time (in minutes), given response should be refreshed. Time set to 0 means that
 *     a given response should never be cached.
 */
var config = {"staticResources":["./","./enplug-offline-worker.js","./index.html","https://apps.enplug.com/sdk/v1/player.js","runtime.6afe30102d8fe7337431.js","polyfills.b4a8dbdd923d69a735b8.js","main.66b9e518b4fd17f5606c.js","styles.34c57ab7888ec1573f9c.css"],"noCorsUrls":["google-analytics.com"],"refreshUrls":{},"appName":"player-app","cacheVersion":"player-app-1-1-0","noCacheUrls":[]};

// End of config. There shouldn't be any need to edit code below.


/**
 * Time which ellapsed since last refresh. Used to determine whether a refresh should take place.
 * @type {Object}
 */
var refreshTime = {};


/**
 * Installs service worker and adds static resources to cache.
 */
self.addEventListener('install', function (event) {
  event.waitUntil(caches.open(config.cacheVersion).then((cache) => {
    return cache.addAll(config.staticResources)
      .then(() => {
        console.log(`[player-app|offline] Offline support service worker v${config.cacheVersion} installed.`);
        self.skipWaiting();
      })
      .catch((error) => {
        console.warn(`[player-app|offline] Error adding static resources to cache ${config.cacheVersion}.`, error);
      })
      .then(() => cache.match('refreshTime'))
      .then((cachedData) => cachedData && cachedData.text())
      .then((text) => {
        try {
          refreshTime = text ? JSON.parse(text) : {};
        } catch (e) {
          refreshTime = {};
        }
      });
  }));
});


/**
 * Activate phase. Clears all non-whitelisted cache.
 */
self.addEventListener('activate', (event) => {
  var cacheWhitelist = [config.cacheVersion];

  event.waitUntil(
    caches.keys().then(function (cacheNames) {
      return Promise.all(
        cacheNames.map(function (cacheName) {
          if (cacheName.indexOf(config.appName) === 0 && cacheWhitelist.indexOf(cacheName) === -1) {
            console.log(`[player-app|offline] Deleting cache ${cacheName}`);
            return caches.delete(cacheName);
          }
        })
      ).then(() => self.clients.claim());
    })
  );
});


/**
 * Captures requests and either exectures request to the server or returns a cached version.
 */
self.addEventListener('fetch', (event) => {
  // Ignore POST requests
  if (event.request.method === 'POST') {
    return false;
  }

  // Get rid of the app token to generalize URL for caching. Having unique URLs for each request
  // will only make the cache get bigger over time.
  var cacheUrl = event.request.url.replace(/\?.*/g, '')

  for (const noCacheUrl of config.noCacheUrls) {
    if (event.request.url.indexOf(noCacheUrl) >= 0) {
      return false;
    }
  }

  var cacheRequest = new Request(cacheUrl, {
    mode: 'cors'
  });

  // We need to explicitly change the reqest to CORS request so that cross-domain resources
  // get properly cached.
  var fetchRequest = new Request(event.request.url, {
    mode: 'cors'
  });
  var noCorsFetchRequest = new Request(event.request.url, {
    mode: 'no-cors'
  });


  var response = caches.match(cacheRequest).then((cachedResponse) => {
    // IMPORTANT: Clone the request.
    // A request is a stream and can only be consumed once. Since we are consuming it once by
    // the cache and once by the browser for fetch, we need to clone.

    // Request data can't be refreshed. Return cached version of the request response.
    if (cachedResponse && !canUrlBeRefreshed(cacheUrl)) {
      return cachedResponse;
    }

    // URL can be refreshed. Fetch and cache new data.
    return new Promise((resolve, reject) => {
      fetch(fetchRequest)
        .then((response) => {
          if (!response || response.status !== 200 ||
            // Fetching new data resulted in invalid response.
            (response.type !== 'basic' && response.type !== 'cors')) {
            if (cachedResponse) {
              // Check if we have a valid cached response. If so, return it.
              return cachedResponse;
            } else {
              // No valid cached data. Simply return response. This will ensure we don't
              // cache an invalid response
              return response;
            }
          }
          return response;
        })
        .catch((err) => {
          console.log(`[player-app|offline] CORS request failed. Attempting fetch with no-cors set.`);
          return fetch(noCorsFetchRequest);
        })
        .then((response) => {
          // Fetching new data resulted in a valid response.
          // IMPORTANT: Clone the response, for the same reason as we cloned the request.
          var responseToCache = response.clone();
          caches.open(config.cacheVersion).then(
            // Cache response and update the time of caching this particular request.
            (cache) => {
              console.log(`[player-app|offline] Caching ${cacheUrl}.`);
              cache.put(cacheRequest, responseToCache);
              setCachedTime(cacheUrl);
            },
            (error) => console.warn(`[player-app|offline] Unable to cache ${cacheUrl}`, error)
          );
          resolve(response);
        },
        // In case we're offline but we have a cached version of the response, return response.
        (error) => {
          console.warn('[player-app|offline] CORS fetch failed with error.', error, cachedResponse);
          if (cachedResponse) {
            resolve(cachedResponse);
          }
          return null;
        }
      )
    });
  });

  if (response) {
    event.respondWith(response);
  } else {
    return false;
  }
});


/**
 * Checks whether given URL should be refeched and cached value associated with it replaced.
 * @param  {string} url
 * @return {boolean} - If true, the cached value associated with the URL should be refreshed.
 */
function canUrlBeRefreshed(url) {
  // Number of seconds that need to elapse since last refresh before the URL can be refreshed
  var refreshInterval = null;
  var isWhitelisted = false;
  var hasRequiredTimePassed = false;

  // Check whether the url is whitelisted
  if (config.refreshUrls) {
    for (var keyUrl in config.refreshUrls) {
      if (url.indexOf(keyUrl) >= 0) {
        isWhitelisted = true;
        refreshInterval = config.refreshUrls[keyUrl] * 60 * 1000; // convert to milliseconds
        break;
      }
    }
    // If refresh time is set to 0, requests should always return most recent version.
    if (refreshInterval === 0) {
      return true;
    }
  }

  // Check whether appropriate amount of time ellapsed since last refresh
  var currentTime = Date.now();
  var lastRefreshTime = refreshTime[url] || 0;
  hasRequiredTimePassed = currentTime - lastRefreshTime >= refreshInterval;

  return isWhitelisted && hasRequiredTimePassed;
}
/**
 * Sets the time a request with the given URL was last cached. Service workers have no access to
 * localStorage. However, we need some way of persisting some data across reloads of the worker.
 * To do so, we utilize CacheStorage. The function constructs and returns name of the cache used
 * for storage purposes.
 * @param {string} url - URL for which the time is set.
 */
function setCachedTime(url) {
  refreshTime[url] = Date.now();
  var response = new Response(JSON.stringify(refreshTime));

  caches.open(config.cacheVersion).then((cache) => {
    return cache.put('refreshTime', response);
  });
}
