const CACHE_NAME = 'expense-tracker-v2';
const STATIC_ASSETS = [
    '/',
    '/index.html',
    '/login.html',
    '/register.html',
    '/style.css',
    '/js/app.js',
    '/js/auth.js',
    '/manifest.json',
    'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css',
    'https://cdn.jsdelivr.net/npm/chart.js'
];

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
    
    // For API requests, we will handle caching in app.js using localStorage to be more robust
    // Here we just intercept static assets
    if (req.url.includes('/api/')) {
        // Just fetch from network. app.js handles offline fallback.
        e.respondWith(fetch(req).catch(() => new Response(JSON.stringify({ success: false, error: 'Offline' }), { status: 503, headers: { 'Content-Type': 'application/json' } })));
        return;
    }

    // Network First strategy for other resources (like HTML, CSS, JS)
    e.respondWith(
        fetch(req).then(networkRes => {
            return caches.open(CACHE_NAME).then(cache => {
                // Ignore remote chrome-extensions or unsupported protocols
                if(req.url.startsWith('http')) {
                    cache.put(req, networkRes.clone());
                }
                return networkRes;
            });
        }).catch(() => {
            return caches.match(req);
        })
    );
});

self.addEventListener('notificationclick', function(event) {
    event.notification.close();
    event.waitUntil(
        clients.matchAll({ type: 'window' }).then(windowClients => {
            // Check if there is already a window/tab open with the target URL
            for (var i = 0; i < windowClients.length; i++) {
                var client = windowClients[i];
                // If so, just focus it.
                if (client.url === '/' && 'focus' in client) {
                    return client.focus();
                }
            }
            // If not, then open the target URL in a new window/tab.
            if (clients.openWindow) {
                return clients.openWindow('/');
            }
        })
    );
});
