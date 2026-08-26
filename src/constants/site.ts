import { env } from '@/constants/env';

export type SiteMode = 'landing' | 'app' | 'combined';

function stripTrailingSlash(value: string): string {
  return value.replace(/\/$/, '');
}

function hostnameFromOrigin(origin: string): string {
  try {
    return new URL(origin).hostname.toLowerCase();
  } catch {
    return '';
  }
}

function isLoopbackHost(hostname: string): boolean {
  return (
    hostname === 'localhost' ||
    hostname === '127.0.0.1' ||
    hostname === '[::1]' ||
    hostname === '::1' ||
    hostname.endsWith('.local')
  );
}

/** Marketing site origin (zivan.me). */
export function getLandingOrigin(): string {
  return stripTrailingSlash(env.landingOrigin);
}

/** Authenticated app origin (app.zivan.me). */
export function getAppOrigin(): string {
  return stripTrailingSlash(env.appOrigin);
}

/**
 * Host mode for the current browser location.
 * - `landing`: marketing-only host
 * - `app`: login/register + authenticated panels
 * - `combined`: localhost / unknown hosts — both route trees work (local Docker at 127.0.0.1:8080)
 */
export function getSiteMode(
  hostname = typeof window !== 'undefined' ? window.location.hostname : '',
): SiteMode {
  const host = hostname.toLowerCase();
  if (!host || isLoopbackHost(host)) {
    return 'combined';
  }

  const appHost = hostnameFromOrigin(getAppOrigin());
  const landingHost = hostnameFromOrigin(getLandingOrigin());

  if (appHost && (host === appHost || host.startsWith('app.'))) {
    return 'app';
  }

  if (landingHost && (host === landingHost || host === `www.${landingHost}`)) {
    return 'landing';
  }

  return 'combined';
}

export function isAppPath(pathname: string): boolean {
  return (
    pathname === '/login' ||
    pathname === '/register' ||
    pathname === '/unauthorized' ||
    pathname.startsWith('/admin') ||
    pathname.startsWith('/clinic-manager') ||
    pathname.startsWith('/doctor') ||
    pathname.startsWith('/patient')
  );
}

export function isMarketingPath(pathname: string): boolean {
  return (
    pathname === '/' ||
    pathname === '/about' ||
    pathname === '/download' ||
    pathname === '/privacy' ||
    pathname === '/terms'
  );
}

/** Absolute or same-origin URL for an app path (`/login`, `/patient`, …). */
export function appUrl(pathAndQuery: string): string {
  const path = pathAndQuery.startsWith('/') ? pathAndQuery : `/${pathAndQuery}`;
  if (getSiteMode() === 'combined') {
    return path;
  }
  return `${getAppOrigin()}${path}`;
}

/** Absolute or same-origin URL for a marketing path. */
export function landingUrl(pathAndQuery: string): string {
  const path = pathAndQuery.startsWith('/') ? pathAndQuery : `/${pathAndQuery}`;
  if (getSiteMode() === 'combined') {
    return path;
  }
  return `${getLandingOrigin()}${path}`;
}

/** True when navigating to `href` leaves the current origin. */
export function isCrossOriginHref(href: string): boolean {
  if (!href.startsWith('http://') && !href.startsWith('https://')) {
    return false;
  }
  if (typeof window === 'undefined') {
    return true;
  }
  try {
    return new URL(href).origin !== window.location.origin;
  } catch {
    return false;
  }
}
