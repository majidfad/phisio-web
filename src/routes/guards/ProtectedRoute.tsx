import { Spin } from 'antd';
import { type ReactNode } from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';

import { useAuth } from '@/features/auth';
import { routes } from '@/routes/routes';
import { hasRequiredRole } from '@/routes/utils/role-access';
import type { UserRole } from '@/types/auth';

interface ProtectedRouteProps {
  /** When set, only users with this role may access the route. */
  role?: UserRole;
  children?: ReactNode;
}

export function ProtectedRoute({ role, children }: ProtectedRouteProps) {
  const { user, isAuthenticated, isInitializing } = useAuth();
  const location = useLocation();

  if (isInitializing) {
    return (
      <div className="route-loading" aria-busy="true">
        <Spin size="large" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to={routes.login} replace state={{ from: location }} />;
  }

  if (role !== undefined && (!user || !hasRequiredRole(user, role))) {
    return <Navigate to={routes.unauthorized} replace />;
  }

  return children ?? <Outlet />;
}
