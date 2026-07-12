import { Spin } from 'antd';
import { type ReactNode } from 'react';
import { Navigate, Outlet } from 'react-router-dom';

import { useAuth } from '@/features/auth';
import { getHomeRouteForUser } from '@/routes/utils/role-access';

interface GuestRouteProps {
  children?: ReactNode;
}

export function GuestRoute({ children }: GuestRouteProps) {
  const { user, isAuthenticated, isInitializing } = useAuth();

  if (isInitializing) {
    return (
      <div className="route-loading" aria-busy="true">
        <Spin size="large" />
      </div>
    );
  }

  if (isAuthenticated && user) {
    return <Navigate to={getHomeRouteForUser(user)} replace />;
  }

  return children ?? <Outlet />;
}
