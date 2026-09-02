import { registerSW } from 'virtual:pwa-register';

import { getSiteMode, isAppPath } from '@/constants/site';

const MANIFEST_HREF = '/manifest.webmanifest';
const APPLE_TOUCH_ICON_HREF = '/icons/apple-touch-icon.png';

let swRegistered = false;

/** True when the current host/path should expose PWA install + service worker. */
export function isPwaEnabled(
  hostname = typeof window !== 'undefined' ? window.location.hostname : '',
  pathname = typeof window !== 'undefined' ? window.location.pathname : '/',
): boolean {
  const mode = getSiteMode(hostname);
  if (mode === 'app') {
    return true;
  }
  if (mode === 'landing') {
    return false;
  }
  return isAppPath(pathname);
}

function ensureLink(rel: string, href: string): void {
  const selector = `link[rel="${rel}"]`;
  const existing = document.querySelector<HTMLLinkElement>(selector);
  if (existing) {
    existing.href = href;
    return;
  }

  const link = document.createElement('link');
  link.rel = rel;
  link.href = href;
  document.head.appendChild(link);
}

function ensureMeta(name: string, content: string): void {
  const selector = `meta[name="${name}"]`;
  const existing = document.querySelector<HTMLMetaElement>(selector);
  if (existing) {
    existing.content = content;
    return;
  }

  const meta = document.createElement('meta');
  meta.name = name;
  meta.content = content;
  document.head.appendChild(meta);
}

function applyPwaHeadTags(): void {
  ensureLink('manifest', MANIFEST_HREF);
  ensureLink('apple-touch-icon', APPLE_TOUCH_ICON_HREF);
  ensureMeta('apple-mobile-web-app-capable', 'yes');
  ensureMeta('apple-mobile-web-app-status-bar-style', 'default');
  ensureMeta('apple-mobile-web-app-title', 'Zivan');
  ensureMeta('theme-color', '#ffffff');
}

/** Strip PWA installability from the marketing site. */
export function disablePwaOnPage(): void {
  if (typeof document === 'undefined') {
    return;
  }

  document.querySelector('link[rel="manifest"]')?.remove();
  document.querySelector('link[rel="apple-touch-icon"]')?.remove();
  document.querySelector('meta[name="apple-mobile-web-app-capable"]')?.remove();
  document.querySelector('meta[name="apple-mobile-web-app-status-bar-style"]')?.remove();
  document.querySelector('meta[name="apple-mobile-web-app-title"]')?.remove();
}

async function unregisterServiceWorkers(): Promise<void> {
  if (!('serviceWorker' in navigator)) {
    return;
  }

  const registrations = await navigator.serviceWorker.getRegistrations();
  await Promise.all(registrations.map((registration) => registration.unregister()));
  swRegistered = false;
}

function registerServiceWorker(): void {
  if (swRegistered || !('serviceWorker' in navigator)) {
    return;
  }

  const updateSW = registerSW({
    immediate: true,
    onNeedRefresh() {
      void updateSW(true);
    },
  });

  swRegistered = true;
}

/** Keep manifest + service worker aligned with host and route. */
export async function bootstrapPwa(
  hostname = window.location.hostname,
  pathname = window.location.pathname,
): Promise<void> {
  if (typeof window === 'undefined') {
    return;
  }

  if (isPwaEnabled(hostname, pathname)) {
    applyPwaHeadTags();
    registerServiceWorker();
    return;
  }

  disablePwaOnPage();
  await unregisterServiceWorkers();
}
