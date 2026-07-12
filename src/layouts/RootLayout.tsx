import { Outlet } from 'react-router-dom';

import { PwaInstallPrompt } from '@/components/PwaInstallPrompt';

export function RootLayout() {
  return (
    <div className="app-shell">
      <Outlet />
      <PwaInstallPrompt />
    </div>
  );
}
