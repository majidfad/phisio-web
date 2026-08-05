import { httpClient } from '@/api/http-client';

interface PushSubscriptionDto {
  endpoint: string;
  p256dh: string;
  auth: string;
}

interface VapidPublicKeyDto {
  publicKey: string;
}

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

function toDto(subscription: PushSubscription): PushSubscriptionDto {
  const json = subscription.toJSON();
  return {
    endpoint: json.endpoint ?? '',
    p256dh: json.keys?.p256dh ?? '',
    auth: json.keys?.auth ?? '',
  };
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

  const registration = await navigator.serviceWorker.ready;
  const { data } = await httpClient.get<VapidPublicKeyDto>('/notifications/push/public-key');

  const existing = await registration.pushManager.getSubscription();
  const subscription =
    existing ??
    (await registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: urlBase64ToUint8Array(data.publicKey) as BufferSource,
    }));

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

  const registration = await navigator.serviceWorker.ready;
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
