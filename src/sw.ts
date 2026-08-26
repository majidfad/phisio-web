/// <reference lib="webworker" />
import { clientsClaim } from 'workbox-core';
import { cleanupOutdatedCaches, createHandlerBoundToURL, precacheAndRoute } from 'workbox-precaching';
import { NavigationRoute, registerRoute } from 'workbox-routing';
import { NetworkFirst } from 'workbox-strategies';
import { ExpirationPlugin } from 'workbox-expiration';

declare let self: ServiceWorkerGlobalScope;

precacheAndRoute(self.__WB_MANIFEST);
cleanupOutdatedCaches();

self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    void self.skipWaiting();
  }
});

void self.skipWaiting();
clientsClaim();

try {
  registerRoute(
    new NavigationRoute(createHandlerBoundToURL('/index.html'), {
      denylist: [/^\/api/],
    }),
  );
} catch {
  // createHandlerBoundToURL may fail if index.html is not in the precache manifest.
}

registerRoute(
  ({ url }) => url.pathname.startsWith('/api/'),
  new NetworkFirst({
    cacheName: 'api-cache',
    networkTimeoutSeconds: 10,
    plugins: [
      new ExpirationPlugin({
        maxEntries: 50,
        maxAgeSeconds: 300,
      }),
    ],
  }),
);

self.addEventListener('push', (event) => {
  let title = 'Zivan';
  let body = '';
  let data: Record<string, unknown> = {};

  try {
    const payload = event.data?.json() as
      | { title?: string; body?: string; data?: Record<string, unknown> }
      | undefined;
    title = payload?.title || title;
    body = payload?.body || '';
    data = payload?.data || {};
  } catch {
    body = event.data?.text() || '';
  }

  event.waitUntil(
    self.registration.showNotification(title, {
      body,
      icon: '/icons/zivan-192.png',
      badge: '/icons/zivan-192.png',
      data,
      dir: 'auto',
      lang: 'fa',
    }),
  );
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  const targetUrl =
    typeof event.notification.data?.url === 'string'
      ? event.notification.data.url
      : '/patient/exercises';

  event.waitUntil(
    (async () => {
      const allClients = await self.clients.matchAll({
        type: 'window',
        includeUncontrolled: true,
      });

      for (const client of allClients) {
        if ('focus' in client) {
          await client.focus();
          if ('navigate' in client) {
            await (client as WindowClient).navigate(targetUrl);
          }
          return;
        }
      }

      await self.clients.openWindow(targetUrl);
    })(),
  );
});
