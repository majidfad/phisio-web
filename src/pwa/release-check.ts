const VERSION_ENDPOINT = '/version.json';
const CHECK_INTERVAL_MS = 5 * 60 * 1000;

const BUILD_VERSION = import.meta.env.VITE_APP_VERSION ?? 'dev';

let isChecking = false;
let isReloading = false;

async function fetchServerVersion(): Promise<string | null> {
  try {
    const response = await fetch(`${VERSION_ENDPOINT}?t=${Date.now()}`, {
      cache: 'no-store',
      headers: {
        'Cache-Control': 'no-cache',
        Pragma: 'no-cache',
      },
    });

    if (!response.ok) {
      return null;
    }

    const data = (await response.json()) as { version?: string };
    return typeof data.version === 'string' ? data.version : null;
  } catch {
    return null;
  }
}

export function getBuildVersion(): string {
  return BUILD_VERSION;
}

export async function hasNewRelease(): Promise<boolean> {
  const serverVersion = await fetchServerVersion();
  if (!serverVersion) {
    return false;
  }

  return serverVersion !== BUILD_VERSION;
}

export async function applyReleaseUpdate(): Promise<void> {
  if (isReloading) {
    return;
  }

  isReloading = true;

  if ('caches' in window) {
    const cacheKeys = await caches.keys();
    await Promise.all(cacheKeys.map((key) => caches.delete(key)));
  }

  window.location.reload();
}

export async function checkForNewRelease(): Promise<void> {
  if (import.meta.env.DEV || isChecking || isReloading) {
    return;
  }

  isChecking = true;
  try {
    if (await hasNewRelease()) {
      await applyReleaseUpdate();
    }
  } finally {
    isChecking = false;
  }
}

/** Poll for a new frontend release and hard-reload when version.json changes. */
export function startReleaseWatcher(): void {
  if (import.meta.env.DEV) {
    return;
  }

  void checkForNewRelease();

  window.addEventListener('focus', () => {
    void checkForNewRelease();
  });

  document.addEventListener('visibilitychange', () => {
    if (!document.hidden) {
      void checkForNewRelease();
    }
  });

  window.setInterval(() => {
    void checkForNewRelease();
  }, CHECK_INTERVAL_MS);
}
