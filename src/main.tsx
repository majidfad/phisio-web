import '@/i18n';

import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

import { App } from '@/App';
import { bootstrapPwa } from '@/pwa/bootstrap';
import { startReleaseWatcher } from '@/pwa/release-check';

import '@/styles/index.css';

void bootstrapPwa();
startReleaseWatcher();

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
