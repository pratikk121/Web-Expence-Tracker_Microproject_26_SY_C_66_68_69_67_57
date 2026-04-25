const CACHE_NAME = 'expense-tracker-v7';
const STATIC_ASSETS = [
    '/',
    '/index.html',
    '/login.html',
    '/register.html',
    '/style.css',
    '/js/app.js',
    '/js/auth.js',
    '/manifest.php',
    '/icon-192.png',
    '/icon-512.png',
    'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css',
    'https://cdn.jsdelivr.net/npm/chart.js'
];

// Helper for fetch with timeout
function fetchWithTimeout(resource, options = {}) {
    const { timeout = 3000 } = options;
    const controller = new AbortController();
    const id = setTimeout(() => controller.abort(), timeout);
    return fetch(resource, {
        ...options,
        signal: controller.signal
    }).then(response => {
        clearTimeout(id);
        return response;
    }).catch(err => {
        clearTimeout(id);
        throw err;
    });
}

self.addEventListener('install', (e) => {
    e.waitUntil(
        caches.open(CACHE_NAME).then(cache => {
            return cache.addAll(STATIC_ASSETS);
        })
    );
    self.skipWaiting();
});

self.addEventListener('activate', (e) => {
    e.waitUntil(
        caches.keys().then(keys => {
            return Promise.all(
                keys.filter(key => key !== CACHE_NAME).map(key => caches.delete(key))
            );
        })
    );
    self.clients.claim();
});

self.addEventListener('fetch', (e) => {
    const req = e.request;
    
    // For API requests, handle offline fallback
    if (req.url.includes('/api/')) {
        e.respondWith(
            fetchWithTimeout(req)
                .catch(() => new Response(JSON.stringify({ success: false, error: 'Offline' }), { 
                    status: 503, 
                    headers: { 'Content-Type': 'application/json' } 
                }))
        );
        return;
    }

    // Stale-While-Revalidate strategy for static assets
    e.respondWith(
        caches.open(CACHE_NAME).then(cache => {
            return cache.match(req).then(cachedRes => {
                const fetchPromise = fetchWithTimeout(req, { timeout: 3500 })
                    .then(networkRes => {
                        // Check if response is valid and NOT a tunnel error landing page
                        // Some tunnel providers return 200 OK with a landing page
                        const contentType = networkRes.headers.get('content-type');
                        if (networkRes.ok && (!contentType || !contentType.includes('text/html') || !networkRes.url.includes('localtunnel') && !networkRes.url.includes('loca.lt'))) {
                             if(req.url.startsWith('http')) {
                                cache.put(req, networkRes.clone());
                             }
                        }
                        return networkRes;
                    })
                    .catch(() => cachedRes); // Silently fail fetch and return cached if available

                return cachedRes || fetchPromise;
            });
        })
    );
});

self.addEventListener('notificationclick', function(event) {
    event.notification.close();
    event.waitUntil(
        clients.matchAll({ type: 'window' }).then(windowClients => {
            for (var i = 0; i < windowClients.length; i++) {
                var client = windowClients[i];
                if (client.url === '/' && 'focus' in client) {
                    return client.focus();
                }
            }
            if (clients.openWindow) {
                return clients.openWindow('/');
            }
        })
    );
});
