import { Outlet } from 'react-router-dom';

import { PwaInstallPrompt } from '@/components/PwaInstallPrompt';
import { PwaBootstrap } from '@/pwa/PwaBootstrap';

export function RootLayout() {
  return (
    <div className="app-shell">
      <PwaBootstrap />
      <Outlet />
      <PwaInstallPrompt />
    </div>
  );
}
