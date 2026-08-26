import '@/i18n';

import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { registerSW } from 'virtual:pwa-register';

import { App } from '@/App';

import '@/styles/index.css';

// Service worker must stay registered in all environments — Web Push delivers to the
// active SW. Clearing registrations here would leave Notification.permission=granted
// while PushManager.subscribe / push events never run.
registerSW({ immediate: true });

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
