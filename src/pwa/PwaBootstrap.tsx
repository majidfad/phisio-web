import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

import { bootstrapPwa } from '@/pwa/bootstrap';

/** Re-bootstrap PWA when SPA navigation crosses landing/app boundaries on combined hosts. */
export function PwaBootstrap() {
  const location = useLocation();

  useEffect(() => {
    void bootstrapPwa(window.location.hostname, location.pathname);
  }, [location.pathname]);

  return null;
}
