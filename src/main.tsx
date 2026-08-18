import '@/i18n';

import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

import { App } from '@/App';

import '@/styles/index.css';

const DEV_SERVICE_WORKER_RELOAD_KEY = 'phisio.dev.service-worker-cleared';

async function prepareDevelopmentRuntime(): Promise<boolean> {
  if (!import.meta.env.DEV || !('serviceWorker' in navigator)) {
    return true;
  }

  const wasControlled = navigator.serviceWorker.controller !== null;
  const registrations = await navigator.serviceWorker.getRegistrations();

  await Promise.all(registrations.map((registration) => registration.unregister()));

  if ('caches' in globalThis) {
    const cacheNames = await globalThis.caches.keys();
    await Promise.all(cacheNames.map((cacheName) => globalThis.caches.delete(cacheName)));
  }

  if (wasControlled && sessionStorage.getItem(DEV_SERVICE_WORKER_RELOAD_KEY) !== 'true') {
    sessionStorage.setItem(DEV_SERVICE_WORKER_RELOAD_KEY, 'true');
    window.location.reload();
    return false;
  }

  sessionStorage.removeItem(DEV_SERVICE_WORKER_RELOAD_KEY);
  return true;
}

function renderApp(): void {
  createRoot(document.getElementById('root')!).render(
    <StrictMode>
      <App />
    </StrictMode>,
  );
}

void prepareDevelopmentRuntime()
  .then((shouldRender) => {
    if (shouldRender) {
      renderApp();
    }
  })
  .catch(renderApp);
