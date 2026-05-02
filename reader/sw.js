// MCU Doomsday Reader - Service Worker
// Version 1.0.0

const CACHE_NAME = 'mcu-doomsday-v1.0.0';
const RUNTIME_CACHE = 'mcu-runtime-v1';
const IMAGE_CACHE = 'mcu-images-v1';

// Assets to cache on install
const STATIC_ASSETS = [
  './',
  './index.html',
  './styles.css',
  './app.js',
  './enhancements.js',
  './enhancements.css',
  './data/watchlist.en.json',
  './data/watchlist.nl.json',
  './data/watchlist.de.json',
  './manifest.json',
  './assets/icons/icon-192.png',
  './assets/icons/icon-512.png'
];

// Install event - cache static assets
self.addEventListener('install', (event) => {
  console.log('[Service Worker] Installing...');
  
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('[Service Worker] Caching static assets');
        return cache.addAll(STATIC_ASSETS);
      })
      .then(() => {
        console.log('[Service Worker] Installation complete');
        return self.skipWaiting();
      })
      .catch((error) => {
        console.error('[Service Worker] Installation failed:', error);
      })
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  console.log('[Service Worker] Activating...');
  
  event.waitUntil(
    caches.keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames
            .filter((name) => {
              return name !== CACHE_NAME && 
                     name !== RUNTIME_CACHE && 
                     name !== IMAGE_CACHE;
            })
            .map((name) => {
              console.log('[Service Worker] Deleting old cache:', name);
              return caches.delete(name);
            })
        );
      })
      .then(() => {
        console.log('[Service Worker] Activation complete');
        return self.clients.claim();
      })
  );
});

// Fetch event - serve from cache, fallback to network
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);
  
  // Skip non-GET requests
  if (request.method !== 'GET') {
    return;
  }
  
  // Skip chrome-extension and other non-http(s) requests
  if (!url.protocol.startsWith('http')) {
    return;
  }
  
  // Handle different types of requests
  if (request.destination === 'image') {
    event.respondWith(handleImageRequest(request));
  } else if (url.pathname.endsWith('.json')) {
    event.respondWith(handleDataRequest(request));
  } else {
    event.respondWith(handleStaticRequest(request));
  }
});

// Handle static assets (HTML, CSS, JS)
async function handleStaticRequest(request) {
  try {
    // Try cache first
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      console.log('[Service Worker] Serving from cache:', request.url);
      return cachedResponse;
    }
    
    // Fetch from network
    console.log('[Service Worker] Fetching from network:', request.url);
    const networkResponse = await fetch(request);
    
    // Cache successful responses
    if (networkResponse.ok) {
      const cache = await caches.open(RUNTIME_CACHE);
      cache.put(request, networkResponse.clone());
    }
    
    return networkResponse;
  } catch (error) {
    console.error('[Service Worker] Fetch failed:', error);
    
    // Return offline page if available
    const offlineResponse = await caches.match('./offline.html');
    if (offlineResponse) {
      return offlineResponse;
    }
    
    // Return basic offline response
    return new Response(
      '<html><body><h1>Offline</h1><p>You are currently offline. Please check your connection.</p></body></html>',
      { headers: { 'Content-Type': 'text/html' } }
    );
  }
}

// Handle image requests with aggressive caching
async function handleImageRequest(request) {
  try {
    // Try cache first
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }
    
    // Fetch from network
    const networkResponse = await fetch(request);
    
    // Cache images for offline use
    if (networkResponse.ok) {
      const cache = await caches.open(IMAGE_CACHE);
      cache.put(request, networkResponse.clone());
    }
    
    return networkResponse;
  } catch (error) {
    console.error('[Service Worker] Image fetch failed:', error);
    
    // Return placeholder image if available
    const placeholder = await caches.match('./assets/placeholder.png');
    if (placeholder) {
      return placeholder;
    }
    
    // Return empty response
    return new Response('', { status: 404, statusText: 'Image not found' });
  }
}

// Handle JSON data requests
async function handleDataRequest(request) {
  try {
    // Try network first for fresh data
    const networkResponse = await fetch(request);
    
    if (networkResponse.ok) {
      // Update cache with fresh data
      const cache = await caches.open(RUNTIME_CACHE);
      cache.put(request, networkResponse.clone());
      return networkResponse;
    }
    
    throw new Error('Network response not ok');
  } catch (error) {
    console.log('[Service Worker] Network failed, serving from cache:', request.url);
    
    // Fallback to cache
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }
    
    // Return empty JSON if nothing in cache
    return new Response('{}', { 
      headers: { 'Content-Type': 'application/json' },
      status: 503,
      statusText: 'Service Unavailable'
    });
  }
}

// Handle messages from clients
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
  
  if (event.data && event.data.type === 'CACHE_URLS') {
    const urls = event.data.urls || [];
    event.waitUntil(
      caches.open(IMAGE_CACHE)
        .then((cache) => cache.addAll(urls))
        .then(() => {
          console.log('[Service Worker] Cached additional URLs:', urls.length);
        })
    );
  }
});

// Background sync for offline actions
self.addEventListener('sync', (event) => {
  if (event.tag === 'sync-watchlist') {
    event.waitUntil(syncWatchlist());
  }
});

async function syncWatchlist() {
  console.log('[Service Worker] Syncing watchlist...');
  // Implement sync logic here if needed
  return Promise.resolve();
}

// Push notifications (future enhancement)
self.addEventListener('push', (event) => {
  const options = {
    body: event.data ? event.data.text() : 'New MCU content available!',
    icon: './assets/icons/icon-192.png',
    badge: './assets/icons/badge-72.png',
    vibrate: [200, 100, 200],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: 1
    }
  };
  
  event.waitUntil(
    self.registration.showNotification('MCU Doomsday Reader', options)
  );
});

console.log('[Service Worker] Loaded successfully');

// Made with Bob
