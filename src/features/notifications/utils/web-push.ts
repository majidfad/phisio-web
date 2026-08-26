import { httpClient } from '@/api/http-client';

interface PushSubscriptionDto {
  endpoint: string;
  p256dh: string;
  auth: string;
}

interface VapidPublicKeyDto {
  publicKey: string;
}

const SERVICE_WORKER_READY_TIMEOUT_MS = 15_000;

function urlBase64ToUint8Array(base64String: string): Uint8Array {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);
  for (let i = 0; i < rawData.length; i += 1) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

function toUint8Array(source: BufferSource): Uint8Array {
  if (source instanceof ArrayBuffer) {
    return new Uint8Array(source);
  }
  if (ArrayBuffer.isView(source)) {
    return new Uint8Array(source.buffer, source.byteOffset, source.byteLength);
  }
  return new Uint8Array(source);
}

function applicationServerKeysEqual(left: BufferSource, right: Uint8Array): boolean {
  const leftBytes = toUint8Array(left);
  if (leftBytes.byteLength !== right.byteLength) {
    return false;
  }
  return leftBytes.every((value, index) => value === right[index]);
}

function toDto(subscription: PushSubscription): PushSubscriptionDto {
  const json = subscription.toJSON();
  return {
    endpoint: json.endpoint ?? '',
    p256dh: json.keys?.p256dh ?? '',
    auth: json.keys?.auth ?? '',
  };
}

async function waitForServiceWorkerRegistration(): Promise<ServiceWorkerRegistration> {
  const existing = await navigator.serviceWorker.getRegistration();
  if (existing?.active) {
    return existing;
  }

  return await new Promise<ServiceWorkerRegistration>((resolve, reject) => {
    const timeoutId = window.setTimeout(() => {
      reject(
        new Error(
          'Service worker is not active. Web Push requires a registered service worker (registerSW).',
        ),
      );
    }, SERVICE_WORKER_READY_TIMEOUT_MS);

    void navigator.serviceWorker.ready.then((registration) => {
      window.clearTimeout(timeoutId);
      resolve(registration);
    });
  });
}

export function isPushSupported(): boolean {
  return (
    typeof window !== 'undefined' &&
    'serviceWorker' in navigator &&
    'PushManager' in window &&
    'Notification' in window
  );
}

export async function getNotificationPermission(): Promise<NotificationPermission | 'unsupported'> {
  if (!isPushSupported()) {
    return 'unsupported';
  }
  return Notification.permission;
}

export async function enablePushNotifications(): Promise<'granted' | 'denied' | 'unsupported'> {
  if (!isPushSupported()) {
    return 'unsupported';
  }

  const permission = await Notification.requestPermission();
  if (permission !== 'granted') {
    return permission === 'denied' ? 'denied' : 'denied';
  }

  const registration = await waitForServiceWorkerRegistration();
  const { data } = await httpClient.get<VapidPublicKeyDto>('/notifications/push/public-key');
  if (!data.publicKey) {
    throw new Error('VAPID public key is not configured.');
  }

  const applicationServerKey = urlBase64ToUint8Array(data.publicKey);
  const existing = await registration.pushManager.getSubscription();

  // Subscriptions are bound to the VAPID applicationServerKey used at subscribe time.
  // Reusing a mismatched subscription causes the push service to reject sends (403).
  let subscription = existing;
  const existingKey = existing?.options?.applicationServerKey;
  const keyMatches =
    existingKey != null ? applicationServerKeysEqual(existingKey, applicationServerKey) : false;

  if (existing && !keyMatches) {
    await existing.unsubscribe();
    subscription = null;
  }

  subscription ??= await registration.pushManager.subscribe({
    userVisibleOnly: true,
    applicationServerKey: applicationServerKey as BufferSource,
  });

  const dto = toDto(subscription);
  if (!dto.endpoint || !dto.p256dh || !dto.auth) {
    throw new Error('Invalid push subscription.');
  }

  await httpClient.post('/notifications/push/subscribe', dto);
  return 'granted';
}

export async function disablePushNotifications(): Promise<void> {
  if (!isPushSupported()) {
    return;
  }

  const registration = await waitForServiceWorkerRegistration();
  const subscription = await registration.pushManager.getSubscription();
  if (!subscription) {
    return;
  }

  const dto = toDto(subscription);
  try {
    await httpClient.post('/notifications/push/unsubscribe', dto);
  } finally {
    await subscription.unsubscribe();
  }
}
