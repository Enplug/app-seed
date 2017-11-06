export default {
  cacheVersion: '2-0-5',
  cacheName: 'sports-center',
  staticResources: [
    './',
    './img/screenfeed-logo.png'
  ],
  // Pictures associated with screenfeed news are served from msecnd.net domain and are cached
  // automatically.
  refreshUrls: {
    'kitchen.screenfeed.com': 10,
    'msecnd.net': 10
  }
};
