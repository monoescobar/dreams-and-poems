/**
 * Dreams and Poems - Service Worker
 * Provides offline support and performance optimization
 * Enhanced with PWA installation support
 * 
 * @author Carlos Escobar
 */

const CACHE_NAME = 'dreams-and-poems-v008';
const STATIC_CACHE_NAME = 'dreams-and-poems-static-v008';
const DYNAMIC_CACHE_NAME = 'dreams-and-poems-dynamic-v008';

// Files to cache immediately
const STATIC_FILES = [
  '/',
  '/index.html',
  '/manifest.json',
  '/src/styles/main.css',
  '/src/js/app.js',
  '/src/js/utils.js',
  '/src/js/videoManager.js',
  '/src/js/uiController.js',
  '/src/js/errorBoundary.js',
  '/video-urls.js',
  '/icon-192x192.png',
  '/icon-512x512.png'
];

// Maximum cache sizes
const MAX_DYNAMIC_CACHE_SIZE = 50;
const MAX_VIDEO_CACHE_SIZE = 5; // Only cache a few videos due to size

// Cache duration (24 hours)
const CACHE_DURATION = 24 * 60 * 60 * 1000;

/**
 * Install event - cache static files
 */
self.addEventListener('install', (event) => {
  console.log('Service Worker: Installing...');
  
  event.waitUntil(
    caches.open(STATIC_CACHE_NAME)
      .then((cache) => {
        console.log('Service Worker: Caching static files');
        return cache.addAll(STATIC_FILES);
      })
      .then(() => {
        console.log('Service Worker: Static files cached');
        return self.skipWaiting();
      })
      .catch((error) => {
        console.error('Service Worker: Failed to cache static files', error);
      })
  );
});

/**
 * Activate event - cleanup old caches
 */
self.addEventListener('activate', (event) => {
  console.log('Service Worker: Activating...');
  
  event.waitUntil(
    caches.keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (cacheName !== STATIC_CACHE_NAME && 
                cacheName !== DYNAMIC_CACHE_NAME &&
                cacheName.startsWith('dreams-and-poems')) {
              console.log('Service Worker: Deleting old cache', cacheName);
              return caches.delete(cacheName);
            }
          })
        );
      })
      .then(() => {
        console.log('Service Worker: Activated');
        return self.clients.claim();
      })
  );
});

/**
 * Fetch event - serve cached files or fetch from network
 */
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);
  
  // Skip non-GET requests
  if (request.method !== 'GET') {
    return;
  }
  
  // Skip cross-origin requests (except for video files)
  if (url.origin !== location.origin && !isVideoFile(url.pathname)) {
    return;
  }
  
  // Handle different types of requests
  if (isStaticFile(url.pathname)) {
    event.respondWith(handleStaticFile(request));
  } else if (isVideoFile(url.pathname)) {
    event.respondWith(handleVideoFile(request));
  } else {
    event.respondWith(handleDynamicFile(request));
  }
});

/**
 * Handle static file requests
 * @param {Request} request - Request object
 * @returns {Promise<Response>} Response promise
 */
async function handleStaticFile(request) {
  try {
    // Try cache first
    const cachedResponse = await caches.match(request);
    
    if (cachedResponse) {
      // Check if cache is still valid
      const cacheDate = new Date(cachedResponse.headers.get('sw-cache-date') || 0);
      const isExpired = Date.now() - cacheDate.getTime() > CACHE_DURATION;
      
      if (!isExpired) {
        console.log('Service Worker: Serving from cache', request.url);
        return cachedResponse;
      }
    }
    
    // Fetch from network
    console.log('Service Worker: Fetching from network', request.url);
    const networkResponse = await fetch(request);
    
    if (networkResponse.ok) {
      // Cache the new response
      const cache = await caches.open(STATIC_CACHE_NAME);
      const responseToCache = networkResponse.clone();
      
      // Add cache date header
      const headers = new Headers(responseToCache.headers);
      headers.set('sw-cache-date', new Date().toISOString());
      
      const modifiedResponse = new Response(responseToCache.body, {
        status: responseToCache.status,
        statusText: responseToCache.statusText,
        headers: headers
      });
      
      await cache.put(request, modifiedResponse);
    }
    
    return networkResponse;
    
  } catch (error) {
    console.error('Service Worker: Static file fetch failed', error);
    
    // Try to serve from cache as fallback
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }
    
    // Return offline page or error response
    return createOfflineResponse(request);
  }
}

/**
 * Handle video file requests with smart caching
 * @param {Request} request - Request object
 * @returns {Promise<Response>} Response promise
 */
async function handleVideoFile(request) {
  try {
    const cache = await caches.open(DYNAMIC_CACHE_NAME);
    const cachedResponse = await cache.match(request);
    
    // For video files, we prioritize network for better streaming
    try {
      const networkResponse = await fetch(request);
      
      if (networkResponse.ok) {
        // Only cache smaller video files or partial content
        const contentLength = networkResponse.headers.get('content-length');
        const shouldCache = !contentLength || parseInt(contentLength) < 50 * 1024 * 1024; // 50MB limit
        
        if (shouldCache) {
          // Manage cache size
          await limitCacheSize(DYNAMIC_CACHE_NAME, MAX_VIDEO_CACHE_SIZE);
          
          // Cache the response
          cache.put(request, networkResponse.clone());
        }
      }
      
      return networkResponse;
      
    } catch (networkError) {
      console.log('Service Worker: Network failed, trying cache for video');
      
      if (cachedResponse) {
        return cachedResponse;
      }
      
      throw networkError;
    }
    
  } catch (error) {
    console.error('Service Worker: Video fetch failed', error);
    return createVideoErrorResponse();
  }
}

/**
 * Handle dynamic file requests
 * @param {Request} request - Request object
 * @returns {Promise<Response>} Response promise
 */
async function handleDynamicFile(request) {
  try {
    // Network first strategy for dynamic content
    const networkResponse = await fetch(request);
    
    if (networkResponse.ok) {
      // Cache successful responses
      const cache = await caches.open(DYNAMIC_CACHE_NAME);
      
      // Manage cache size
      await limitCacheSize(DYNAMIC_CACHE_NAME, MAX_DYNAMIC_CACHE_SIZE);
      
      // Cache with timestamp
      const responseToCache = networkResponse.clone();
      const headers = new Headers(responseToCache.headers);
      headers.set('sw-cache-date', new Date().toISOString());
      
      const modifiedResponse = new Response(responseToCache.body, {
        status: responseToCache.status,
        statusText: responseToCache.statusText,
        headers: headers
      });
      
      await cache.put(request, modifiedResponse);
    }
    
    return networkResponse;
    
  } catch (error) {
    console.log('Service Worker: Network failed, trying cache');
    
    // Try cache as fallback
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }
    
    console.error('Service Worker: Dynamic fetch failed', error);
    return createOfflineResponse(request);
  }
}

/**
 * Check if file is a static file
 * @param {string} pathname - URL pathname
 * @returns {boolean} True if static file
 */
function isStaticFile(pathname) {
  return STATIC_FILES.some(file => pathname.endsWith(file)) ||
         pathname.match(/\.(js|css|html|json)$/);
}

/**
 * Check if file is a video file
 * @param {string} pathname - URL pathname
 * @returns {boolean} True if video file
 */
function isVideoFile(pathname) {
  return pathname.match(/\.(mp4|webm|ogg|mov|avi)$/i);
}

/**
 * Limit cache size by removing oldest entries
 * @param {string} cacheName - Cache name
 * @param {number} maxSize - Maximum number of entries
 */
async function limitCacheSize(cacheName, maxSize) {
  const cache = await caches.open(cacheName);
  const keys = await cache.keys();
  
  if (keys.length > maxSize) {
    // Sort by cache date (oldest first)
    const sortedKeys = keys.sort((a, b) => {
      const dateA = new Date(a.headers?.get('sw-cache-date') || 0);
      const dateB = new Date(b.headers?.get('sw-cache-date') || 0);
      return dateA - dateB;
    });
    
    // Remove oldest entries
    const keysToDelete = sortedKeys.slice(0, keys.length - maxSize);
    await Promise.all(keysToDelete.map(key => cache.delete(key)));
    
    console.log(`Service Worker: Cleaned ${keysToDelete.length} entries from ${cacheName}`);
  }
}

/**
 * Create offline response
 * @param {Request} request - Request object
 * @returns {Response} Offline response
 */
function createOfflineResponse(request) {
  if (request.destination === 'document') {
    return new Response(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Dreams and Poems - Offline</title>
          <style>
            body {
              font-family: sans-serif;
              text-align: center;
              padding: 2rem;
              background: #000;
              color: #fff;
            }
            .offline-content {
              max-width: 600px;
              margin: 0 auto;
            }
            .retry-btn {
              background: #3b82f6;
              color: white;
              border: none;
              padding: 12px 24px;
              border-radius: 8px;
              cursor: pointer;
              margin-top: 1rem;
            }
          </style>
        </head>
        <body>
          <div class="offline-content">
            <h1>🌙 Dreams and Poems</h1>
            <h2>You're offline</h2>
            <p>It looks like you're not connected to the internet. Please check your connection and try again.</p>
            <button class="retry-btn" onclick="location.reload()">Retry</button>
          </div>
        </body>
      </html>
    `, {
      status: 200,
      headers: {
        'Content-Type': 'text/html',
        'Cache-Control': 'no-cache'
      }
    });
  }
  
  return new Response('Offline - Please check your internet connection', {
    status: 503,
    statusText: 'Service Unavailable'
  });
}

/**
 * Create video error response
 * @returns {Response} Video error response
 */
function createVideoErrorResponse() {
  return new Response('Video unavailable offline', {
    status: 503,
    statusText: 'Service Unavailable',
    headers: {
      'Content-Type': 'text/plain'
    }
  });
}

/**
 * Handle background sync (if supported)
 */
self.addEventListener('sync', (event) => {
  if (event.tag === 'background-sync') {
    event.waitUntil(doBackgroundSync());
  }
});

/**
 * Perform background sync operations
 */
async function doBackgroundSync() {
  try {
    // Sync any pending data
    console.log('Service Worker: Background sync started');
    
    // Update caches
    await updateCaches();
    
    console.log('Service Worker: Background sync completed');
  } catch (error) {
    console.error('Service Worker: Background sync failed', error);
  }
}

/**
 * Update caches in background
 */
async function updateCaches() {
  try {
    const cache = await caches.open(STATIC_CACHE_NAME);
    
    // Update static files
    const updatePromises = STATIC_FILES.map(async (file) => {
      try {
        const response = await fetch(file);
        if (response.ok) {
          await cache.put(file, response);
        }
      } catch (error) {
        console.warn('Service Worker: Failed to update', file, error);
      }
    });
    
    await Promise.all(updatePromises);
    console.log('Service Worker: Caches updated');
    
  } catch (error) {
    console.error('Service Worker: Failed to update caches', error);
  }
}

/**
 * Handle push notifications (future feature)
 */
self.addEventListener('push', (event) => {
  if (event.data) {
    const data = event.data.json();
    
    const options = {
      body: data.body || 'New content available',
      icon: '/icon-192.png',
      badge: '/badge-72.png',
      data: data.url || '/',
      actions: [
        {
          action: 'open',
          title: 'Open Dreams and Poems'
        },
        {
          action: 'close',
          title: 'Close'
        }
      ]
    };
    
    event.waitUntil(
      self.registration.showNotification(data.title || 'Dreams and Poems', options)
    );
  }
});

/**
 * Handle notification clicks
 */
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  
  if (event.action === 'open' || !event.action) {
    event.waitUntil(
      clients.openWindow(event.notification.data || '/')
    );
  }
});

/**
 * Handle messages from main thread
 */
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
  
  if (event.data && event.data.type === 'GET_CACHE_SIZE') {
    getCacheSize().then(size => {
      event.ports[0].postMessage({ size });
    });
  }
  
  if (event.data && event.data.type === 'CLEAR_CACHE') {
    clearCaches().then(() => {
      event.ports[0].postMessage({ success: true });
    });
  }
});

/**
 * Get total cache size
 * @returns {Promise<number>} Cache size in bytes
 */
async function getCacheSize() {
  let totalSize = 0;
  
  const cacheNames = await caches.keys();
  
  for (const cacheName of cacheNames) {
    const cache = await caches.open(cacheName);
    const keys = await cache.keys();
    
    for (const key of keys) {
      const response = await cache.match(key);
      if (response) {
        const blob = await response.blob();
        totalSize += blob.size;
      }
    }
  }
  
  return totalSize;
}

/**
 * Clear all caches
 */
async function clearCaches() {
  const cacheNames = await caches.keys();
  await Promise.all(cacheNames.map(name => caches.delete(name)));
  console.log('Service Worker: All caches cleared');
}

/**
 * PWA Installation Events
 */

// Handle app installation
self.addEventListener('appinstalled', (event) => {
  console.log('PWA: App was installed successfully');
  
  // Send analytics or track installation
  self.clients.matchAll().then(clients => {
    clients.forEach(client => {
      client.postMessage({
        type: 'APP_INSTALLED',
        timestamp: Date.now()
      });
    });
  });
});

// Handle beforeinstallprompt (for custom install UI)
self.addEventListener('beforeinstallprompt', (event) => {
  console.log('PWA: Before install prompt triggered');
  
  // Prevent the default install prompt
  event.preventDefault();
  
  // Send the event to the main thread for custom handling
  self.clients.matchAll().then(clients => {
    clients.forEach(client => {
      client.postMessage({
        type: 'BEFORE_INSTALL_PROMPT',
        timestamp: Date.now()
      });
    });
  });
});

// Handle app launch from home screen
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
  
  if (event.data && event.data.type === 'GET_PWA_STATUS') {
    event.ports[0].postMessage({
      isInstalled: true,
      displayMode: self.matchMedia('(display-mode: standalone)').matches ? 'standalone' : 'browser'
    });
  }
});

console.log('Service Worker: Script loaded with PWA support');
