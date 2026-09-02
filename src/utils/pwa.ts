import { getSiteMode, isAppPath } from '@/constants/site';

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
