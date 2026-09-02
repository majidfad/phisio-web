import '@/i18n';

import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { registerSW } from 'virtual:pwa-register';

import { App } from '@/App';
import { disablePwaOnPage, isPwaEnabled } from '@/utils/pwa';

import '@/styles/index.css';

if (isPwaEnabled()) {
  // Web Push requires an active service worker on the app host.
  registerSW({ immediate: true });
} else {
  disablePwaOnPage();
  void navigator.serviceWorker?.getRegistrations().then((registrations) => {
    for (const registration of registrations) {
      void registration.unregister();
    }
  });
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
