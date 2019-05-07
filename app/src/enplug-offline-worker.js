/**
 * Service worker responsible for providing offline support to Enplug Apps.
 * @author Michal Drewniak (michal@enplug.com)
 */

// CRITICAL ISSUE:
// It is extremely important to not perform cache.match() and cache.put() on the same URL/request in the the same
// promise chain or even a short period of time. Doing so, results in the browser creating additional file descriptors
// which are marked as deleted by the system but continue to exist. Please keep in mind that caches.match suffers from
// the same issue. Said file descriptors are found in the com.enplug.player process folder /proc/PID/fd/ and are only
// removed when the device is rebooted. Since the devices allow for relatively small amount of descriptors, this quickly
// leads to devices crashing.
//
// Sample code which MUST NOT be added at any place within a service worker:
//
//
// const cacheRequest = new Request('https://apps.enplug.com/myapp.js');
// const fetchRequest = new Request('https://apps.enplug.com/myapp.js');
// caches.open('my-cache').then((cache) => {
//   return cache.match(cacheRequest).then((cacheResposne) => {      // Can't have this .match(), and...
//     if (!cacheResposne) {
//       return fetch((fetchRequest)).then((fetchResponse) => {
//         cache.put(fetchResponse.clone());                         // ... this .put()
//         return fetchResponse;
//       });
//     }
//   });
// });



'use strict';

/**
 * Offline support configuration.
 * @type {Object}
 * @property {string} cacheName - Name of the cache. This is usually the same as the application
 *     name or ID.
 * @property {string} cacheVersion - Version of the cache. This should be updated any time we want
 *     the previous version of the cache removed.
 * @property {number} cacheTime - Time in minutes. After the given time, any URL in cache which hasn't been used for
 *     that long or longer, will be removed from cache.
 * @property {Array.<string>} staticResources - A list of static URLs which should be cached.
 * @property {Object.<string, number>} refreshUrls- A mapping of URLs (or their parts) to time in minutes.
 *     The URL denotes for which URL responses should be re-fetched and its response re-cached. Time denotes
 *     after what amount of time (in minutes), given response should be re-fetched and its response re-cached.
 *     Time set to 0 means that a given response should never be cached.
 */
var config = {"staticResources":["./","./enplug-offline-worker.js","./index.html","https://apps.enplug.com/sdk/v1/player.js","runtime.js","polyfills.js","styles.js","vendor.js","main.js"],"noCorsUrls":["google-analytics.com"],"refreshUrls":{},"appName":"player-app","cacheVersion":"player-app-1-1-0","noCacheUrls":[]};

const TAG = '[player-app|offline]';
const LAST_USED_TIME_CACHE = 'last-used-time-cache';
const REFRESH_TIME_CACHE = 'refresh-time';

const CACHE_PRUNE_CHECK_INTERVAL = 60;                      // in minutes
const META_DATA_STORE_INTERVAL = 20;                        // in minutes
const MAX_CACHE_TIME = config.cacheTime || 60 * 24;         // in minutes (default to 1 day)


// An object used to keep track of when was the last time a given URL has been re-fetched and its response re-cached.
let refreshTime = {};
// An object used to keep track of when whas a given URL last fetched. This helps us determine which URLs should
// be removed from cache (when they're not used for more than the  time specified in config.cacheTime)
let lastUsedTime = {};
// Last time cache was pruned from stale entries (see config.cacheTime)
let cachePruneTime = Date.now();
// Last time we've written lastUsedTime object to cache. We want to avoid writing to cache every time 'fetch' listener
// fires. To accomplish this, we keep track of when we did the last write and write to cache again only wn
// META_DATA_STORE_INTERVAL minutes have passed.
let lastUsedTimeWriteTimestamp = Date.now();


/**
 * Installs service worker and adds static resources to cache.
 */
self.addEventListener('install', function (event) {
  event.waitUntil(caches.open(config.cacheVersion).then((cache) => {
    return cache.addAll(config.staticResources)
      .then(() => {
        console.log(`${TAG} Offline support service worker v. ${config.cacheVersion} installed.`);
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
          return removeLeastUsedCacheEntries();
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
 * Captures requests and either exectures request to the server or returns a cached version. This is captures all URL
 * requests comping from an App.
 * IMPORTANT: See critical issue description at the top of this file.
 */
self.addEventListener('fetch', (event) => {
  // There following requests should not be cached: POST, .mp4 files, URLs specified in config.noCacheUrls array.
  // For any of those requests, a fetch is executed without any cache operations.
  if (event.request.method === 'POST') {
    return event.respondWith(fetch(event.request));
  }
  if (event.request.url.startsWith('blob:') || event.request.url.endsWith('.mp4')) {
    return event.respondWith(fetch(event.request));
  }
  for (const noCacheUrl of config.noCacheUrls) {
    if (event.request.url.indexOf(noCacheUrl) >= 0) {
      return event.respondWith(fetch(event.request));
    }
  }

  // Get rid of the app token to generalize URL for caching. Having unique URLs (unique appToken) for each request
  // will only make the cache get bigger over time. We use 2 types of URLs.
  // fetchUrl - original request URL. Used to fetch the data which will then be cached.
  // cacheUrl - URL without the unique appToken. Used to cache the data in service worker cache.
  const fetchUrl = event.request.url;
  const cacheUrl = fetchUrl.replace(/\?apptoken.*/g, '');

  // Remove least used cache entries and update used time for the current URL.
  if (shouldPruneCache()) {
    removeLeastUsedCacheEntries();
  }
  updateLastUsedTime(cacheUrl);

  // URL does not have to be refreshed. Return cached version or fetch and store new version if possible.
  if (!shouldUrlBeRefreshed(cacheUrl)) {
    return event.respondWith(caches.open(config.cacheVersion).then((cache) => {
        const cacheRequest = new Request(cacheUrl);
        return cache.match(cacheRequest)
          .then((cachedResponse) => {
            if (cachedResponse) {
                return cachedResponse;
              } else {
                // Cached data not found. Throw an error so that it's caught below and a fetch is attempted.
                cachedResponse = null;
                throw new Error('Cached data not found');
              }
          })
          .catch(() => {
            return fetchFileAndCache(event.request, cache, fetchUrl, cacheUrl);
          });
    }));
  }

  // URL has to be refreshed. Fetch new file and store it in cache. It's possible that this will get called while
  // the device is offline. In order to ensure the apps work, fetchFileAndCache implements a catch which will attempt
  // to return a cached version if the normal fetch fails.
  return event.respondWith(caches.open(config.cacheVersion).then((cache) => {
    return fetchFileAndCache(event.request, cache, fetchUrl, cacheUrl);
  }));

})  // End of fetch listener.



/**
 * Fetches specified file (fetchUrl) and caches it.
 * @param {*} cache - Opened Cache.
 * @param {*} fetchUrl - Original request URL. Used to fetch new response.
 * @param {*} cacheUrl - Modified URL (removed appToken). Used to cache fetched response.
 */
function fetchFileAndCache(originalRequest, cache, fetchUrl, cacheUrl) {
  // TripAdvisor API requires the headers and the rest of the options to be set in this specific way. If this needs
  // to be changed at any point in time, make sure the TripAdvisor pulls all the posts and works offline.
  const fetchRequest = new Request(fetchUrl, {
    headers: originalRequest.headers,
    mode: 'cors',
    credentials: 'omit',
    referrer: 'no-referrer',
  });
  return fetch(fetchRequest)
    // Initial error handling for requests which resolved but have incorrect status or null response. Returns
    // either cached response if available, or failed response if cached response is not available. Returning
    // invalid response will ensure we do not cache it.
    .then((fetchResponse) => {
      if (!fetchResponse || fetchResponse.status !== 200) {
        throw Error('CORS request failed.');
      }
      // Propagate correct response down the Promise chain.
      return fetchResponse;
    })

    // CORS request has failed. We need attempt to refetch the request as no-cors (which is still preferable)
    // then a failed response. We want to propagate down the Promise chain the response to our no-CORS request.
    .catch((err) => {
      console.log(`${TAG} CORS request failed. Attempting fetch with no-cors set.`);
      if (originalRequest.mode === 'no-cors') {
        return fetch(originalRequest);
      } else {
        const noCorsFetchRequest = new Request(fetchUrl, {
          credentials: 'omit',
          mode: 'no-cors',
          referrer: 'no-referrer',
        });
        return fetch(noCorsFetchRequest);
      }
    })

    // The response from either successful CORS or successful or successful no-CORS request. If there is no response,
    // throw an error so that service worker attempts to return a cached version of the response.
    .then((response) => {
      if (!response) {
        // We don't check whether response.ok is set to true because if the final request was a no-cors request,
        // we would get a false-positive (no-cors doesn't set the ok flag).
        return fetch(originalRequest);
      }
      const cacheRequest = new Request(cacheUrl);
      // A request is a stream and can only be consumed once. Since we are consuming it once by the cache and once
      // by the browser for fetch, we need to clone it.
      return cache.put(cacheRequest, response.clone())
        .then(() => storeCachedTime(cacheUrl))
        .then(() => {
          return response;
        });
    })

    // This usually happens when a player starts while being offline. In such a case,  the fetch will fail. In order
    // to be able to show the app, we must return a cached response here.
    .catch(() => {
      console.log(`${TAG} No-CORS request has failed. Attempting to return cached response.`);
      const cacheRequest = new Request(cacheUrl);
      return cache.match(cacheRequest);
    });
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
 * Checks whether given URL should be refeched and cached value associated with it replaced.
 * @param  {string} url
 * @return {boolean} - If true, the cached value associated with the URL should be refreshed.
 */
function shouldUrlBeRefreshed(url) {
  // Number of seconds that need to elapse since last refresh before the URL can be refreshed
  let refreshInterval = null;
  let isWhitelisted = false;
  let hasRequiredTimePassed = false;

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
 * Sets the time a request with the given URL was last cached. Service workers have no access to localStorage.
 * However, we need some way of persisting some data across reloads of the worker. To do so, we utilize CacheStorage.
 * The function constructs and returns name of the cache used for storage purposes.
 * @param {string} url - URL for which the time is set.
 */
function storeCachedTime(url) {
  refreshTime[url] = Date.now();
  const response = new Response(JSON.stringify(refreshTime));
  return caches.open(config.cacheVersion).then((cache) => cache.put(REFRESH_TIME_CACHE, response));
}


/**
 * Stores lastUsedTime object in cache.
 */
function storeLastUsedTimeInCache(cache) {
  const response = new Response(JSON.stringify(lastUsedTime));
  return cache.put(LAST_USED_TIME_CACHE, response);
}


/**
 * Based on the lastUsedTime object, it removes from Cache entries which haven't been accessed for longer than
 * MAX_CACHE_TIME.
 */
function removeLeastUsedCacheEntries() {
  return caches.open(config.cacheVersion).then((cache) => {
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
    return storeLastUsedTimeInCache(cache);
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
  const writeTimeDiff = (Date.now() - lastUsedTimeWriteTimestamp) / 1000 / 60;
  lastUsedTime[url] = Date.now();
  if (writeTimeDiff >= META_DATA_STORE_INTERVAL) {
    caches.open(config.cacheVersion).then((cache) => storeLastUsedTimeInCache(cache));
  }
}
