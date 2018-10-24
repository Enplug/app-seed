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
var config = {"staticResources":["./","./enplug-offline-worker.js","./index.html"],"noCorsUrls":["google-analytics.com"],"refreshUrls":{},"appName":"player-app","cacheVersion":"player-app-1-1-0","noCacheUrls":[]};
const TAG = '[player-app|offline]';

// End of config. There shouldn't be any need to edit code below.



const LAST_USED_TIME_CACHE = 'last-used-time-cache';
const REFRESH_TIME_CACHE = 'refresh-time';
const CACHE_PRUNE_CHECK_INTERVAL = 60;                      // in minutes
const META_DATA_STORE_INTERVAL = 20;                        // in minutes
const MAX_CACHE_TIME = config.cacheTime || 60 * 24;         // in minutes (default to 1 day)


/**
 * Time which ellapsed since last refresh. Used to determine whether a refresh should take place.
 * @type {Object}
 */
let refreshTime = {};
let lastUsedTime = {};

let cachePruneTime = Date.now();
let writeTime = Date.now();


/**
 * Installs service worker and adds static resources to cache.
 */
self.addEventListener('install', function (event) {
  event.waitUntil(caches.open(config.cacheVersion).then((cache) => {
    return cache.addAll(config.staticResources)
      .then((response) => {
        console.log(`${TAG} Offline support service worker v${config.cacheVersion} installed.`);
        self.skipWaiting();
      })
      .catch((error) => {
        console.warn(`${TAG} Error adding static resources to cache ${config.cacheVersion}.`, error);
      })
      // Read Refresh Time object from cache
      .then(() => cache.match(REFRESH_TIME_CACHE))
      .then((cachedData) => cachedData && cachedData.text())
      .then((text) => {
        try {
          refreshTime = text ? JSON.parse(text) : {};
        } catch (e) {
          refreshTime = {};
        }
      })
      // Read lastUsedTime object from cache
      .catch(() => {})
      .then(() => cache.match(LAST_USED_TIME_CACHE))
      .then((cachedData) => cachedData && cachedData.text())
      .then((text) => {
        try {
          lastUsedTime = text ? JSON.parse(text) : {};
          removeLeastUsedCacheEntries();
        } catch (e) {
          lastUsedTime = {};
        }
      })
  }));
});


/**
 * Activate phase. Clears all non-whitelisted cache.
 */
self.addEventListener('activate', (event) => {
  var cacheWhitelist = [config.cacheVersion];

  // Check all available caches. If a cache for the specific app is found but its cache name differs (different app
  // version), remove that cache.
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map(function (cacheName) {
          if (cacheName.indexOf(config.appName) === 0 && cacheWhitelist.indexOf(cacheName) === -1) {
            console.log(`${TAG} Deleting cache ${cacheName}`);
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
  var cacheUrl = event.request.url.replace(/\?apptoken.*/g, '');

  if (shouldPruneCache()) {
    removeLeastUsedCacheEntries();
  }

  // Keep track as to when a particular URL was called last. We need this to be able to prune from cache
  // least used URLs.
  updateLastUsedTime(cacheUrl);

  if (cacheUrl.startsWith('blob:') || cacheUrl.endsWith('.mp4')) {
    console.log(`${TAG} Caching prevented: URL starts with blob:// or ends with .mp4.`);
    return false;
  }

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
          console.log(`${TAG} CORS request failed. Attempting fetch with no-cors set.`);
          return fetch(noCorsFetchRequest);
        })
        .then((response) => {
          // Fetching new data resulted in a valid response.
          // IMPORTANT: Clone the response, for the same reason as we cloned the request.
          var responseToCache = response.clone();
          caches.open(config.cacheVersion).then(
            // Cache response and update the time of caching this particular request.
            (cache) => {
              console.log(`${TAG} Caching ${cacheUrl}.`);
              cache.put(cacheRequest, responseToCache);
              storeCachedTime(cacheUrl);
            },
            (error) => console.warn(`${TAG} Unable to cache ${cacheUrl}`, error)
          );
          resolve(response);
        },
        // In case we're offline but we have a cached version of the response, return response.
        (error) => {
          console.warn('${TAG} CORS fetch failed with error.', error, cachedResponse);
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
 * Determines whether enough time has passed since last cache prune check to allow for another round of pruning.
 * @returns {boolean} true if cache should be pruned again.
 */
function shouldPruneCache() {
  const timeDiff = (Date.now() - cachePruneTime) / 1000 / 60;   // in minutes
  if (timeDiff >= CACHE_PRUNE_CHECK_INTERVAL) {
    cachePruneTime = Date.now();
    return true;
  }
  return false;
}


/**
 * Sets the time a request with the given URL was last cached. Service workers have no access to localStorage.
 * However, we need some way of persisting some data across reloads of the worker. To do so, we utilize CacheStorage.
 * The function constructs and returns name of the cache used for storage purposes.
 * @param {string} url - URL for which the time is set.
 */
function storeCachedTime(url) {
  refreshTime[url] = Date.now();
  var response = new Response(JSON.stringify(refreshTime));
  caches.open(config.cacheVersion).then((cache) => {
    return cache.put(REFRESH_TIME_CACHE, response);
  });
}


/**
 * Stores lastUsedTime object in cache.
 */
function storeLastUsedTimeInCache() {
  var response = new Response(JSON.stringify(lastUsedTime));
  caches.open(config.cacheVersion).then((cache) => {
    writeTime = Date.now();
    return cache.put(LAST_USED_TIME_CACHE, response);
  });
}


/**
 * Based on the lastUsedTime object, it removes from Cache entries which haven't been accessed for longer than
 * MAX_CACHE_TIME.
 */
function removeLeastUsedCacheEntries() {
  caches.open(config.cacheVersion).then((cache) => {
    for (const url in lastUsedTime) {
      if (lastUsedTime.hasOwnProperty(url)) {
        let timeDiff = (Date.now() - lastUsedTime[url]) / 1000 / 60;   // in minutes
        if (timeDiff >= MAX_CACHE_TIME) {
          console.log(`${TAG} Deleting cache entry for URL: ${url}`);
          delete lastUsedTime[url];
          cache.delete(url);
        }
      }
    }
    storeLastUsedTimeInCache();
  });
}


/**
 * Stores the object containing times where each URL has last been used in Cache. We use this data to determine
 * whether the stored URL and associated response are still used or whether they can be removed from cache.
 * While the time stored in memory is constantly updated, the full object is written to Cache every
 * META_DATA_STORE_INTERVAL minutes. This is done to prevent extremely frequent writes to Cache.
 * @param {string} url - URL of a reasourse which is currently being accessed.
 */
function updateLastUsedTime(url) {
  const writeTimeDiff = (Date.now() - writeTime) / 1000 / 60;
  lastUsedTime[url] = Date.now();

  if (writeTimeDiff >= META_DATA_STORE_INTERVAL) {
    caches.match(LAST_USED_TIME_CACHE)
      .then((cachedData) => cachedData && cachedData.text())
      .then((text) => {
        try {
          const storedLastUsedTime = text ? JSON.parse(text) : {};
          lastUsedTime = Object.assign(lastUsedTime, storedLastUsedTime);
        } catch (e) {
          // noop
        }
        storeLastUsedTimeInCache();
      });
  }
}
