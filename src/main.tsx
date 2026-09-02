import '@/i18n';

import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

import { App } from '@/App';
import { bootstrapPwa } from '@/pwa/bootstrap';

import '@/styles/index.css';

void bootstrapPwa();

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
