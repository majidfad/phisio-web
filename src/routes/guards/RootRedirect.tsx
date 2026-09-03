import { Navigate } from 'react-router-dom';

import { appUrl, getSiteMode } from '@/constants/site';
import { useAuth } from '@/features/auth';
import { LandingPage } from '@/pages/landing/LandingPage';
import { ExternalRedirect } from '@/routes/guards/ExternalRedirect';
import { routes } from '@/routes/routes';
import { getHomeRouteForUser } from '@/routes/utils/role-access';

export function RootRedirect() {
  const { user, isAuthenticated, isInitializing } = useAuth();
  const mode = getSiteMode();

  if (isInitializing) {
    return <div className="route-loading" aria-busy="true" />;
  }

  if (!isAuthenticated || !user) {
    if (mode === 'app') {
      return <Navigate to={routes.login} replace />;
    }
    return <LandingPage />;
  }

  const home = getHomeRouteForUser(user);
  if (mode === 'landing') {
    return <ExternalRedirect to={appUrl(home)} />;
  }

  return <Navigate to={home} replace />;
}
