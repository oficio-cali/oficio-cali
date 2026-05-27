// Service Worker Oficio.co
const CACHE_NAME = 'oficio-v1';

self.addEventListener('install', event => {
  console.log('Service Worker installé');
  self.skipWaiting();
});

self.addEventListener('activate', event => {
  console.log('Service Worker activé');
  event.waitUntil(clients.claim());
});

self.addEventListener('push', event => {
  const data = event.data ? event.data.json() : {};
  const title = data.title || 'Oficio.co';
  const options = {
    body: data.body || 'Vous avez un nouveau message',
    icon: '/icon-192.png',
    badge: '/icon-192.png',
    vibrate: [200, 100, 200],
    data: { url: data.url || '/' },
    actions: [
      { action: 'open', title: '📱 Ouvrir' },
      { action: 'close', title: '✕ Fermer' }
    ]
  };
  event.waitUntil(self.registration.showNotification(title, options));
});

self.addEventListener('notificationclick', event => {
  event.notification.close();
  if (event.action === 'open' || !event.action) {
    event.waitUntil(clients.openWindow(event.notification.data.url || '/'));
  }
});

self.addEventListener('fetch', event => {
  event.respondWith(fetch(event.request).catch(() => caches.match(event.request)));
});
