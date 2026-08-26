import { Navigate } from 'react-router-dom';

import { useAuth } from '@/features/auth';
import { LandingPage } from '@/pages/landing/LandingPage';
import { getHomeRouteForUser } from '@/routes/utils/role-access';

export function RootRedirect() {
  const { user, isAuthenticated, isInitializing } = useAuth();

  if (isInitializing) {
    return <div className="route-loading" aria-busy="true" />;
  }

  if (!isAuthenticated || !user) {
    return <LandingPage />;
  }

  return <Navigate to={getHomeRouteForUser(user)} replace />;
}
