/// <reference lib="webworker" />
import { clientsClaim } from 'workbox-core';
import {
  cleanupOutdatedCaches,
  createHandlerBoundToURL,
  precacheAndRoute,
} from 'workbox-precaching';
import { NavigationRoute, registerRoute } from 'workbox-routing';
import { NetworkFirst } from 'workbox-strategies';
import { ExpirationPlugin } from 'workbox-expiration';

import {
  getPushNotificationCopy,
  getPushNotificationLanguageMeta,
} from '@/features/notifications/utils/notification-push-copy';
import { getPushNotificationLanguage } from '@/features/notifications/utils/push-language-store';

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
  event.waitUntil(
    (async () => {
      let fallbackTitle = 'Zivan';
      let fallbackBody: string;
      let notificationType = '';
      let payloadData: Record<string, unknown> = {};
      let data: Record<string, unknown> = {};

      try {
        const payload = event.data?.json() as {
          title?: string;
          body?: string;
          data?: {
            type?: string;
            url?: string;
            payload?: Record<string, unknown>;
          };
        };

        fallbackTitle = payload?.title || fallbackTitle;
        fallbackBody = payload?.body || '';
        notificationType = payload?.data?.type || '';
        payloadData = payload?.data?.payload || {};
        data = {
          url: payload?.data?.url,
          type: notificationType,
          payload: payloadData,
        };
      } catch {
        fallbackBody = event.data?.text() || '';
      }

      const language = await getPushNotificationLanguage();
      const localized = notificationType
        ? getPushNotificationCopy(notificationType, language, payloadData)
        : { title: fallbackTitle, body: fallbackBody };
      const { lang, dir } = getPushNotificationLanguageMeta(language);

      await self.registration.showNotification(localized.title || fallbackTitle, {
        body: localized.body || fallbackBody,
        icon: '/icons/zivan-192.png',
        badge: '/icons/zivan-192.png',
        data,
        dir,
        lang,
      });
    })(),
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
