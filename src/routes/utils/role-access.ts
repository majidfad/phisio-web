import type { AuthenticatedUser, UserRole } from '@/types/auth';

import { routes } from '../routes';

export function hasRequiredRole(user: AuthenticatedUser, role: UserRole): boolean {
  return user.role === role || user.roles.includes(role);
}

export function getHomeRouteForUser(user: AuthenticatedUser): string {
  if (hasRequiredRole(user, 'Admin')) {
    return routes.admin.root;
  }

  if (hasRequiredRole(user, 'Doctor')) {
    return routes.doctor.root;
  }

  if (hasRequiredRole(user, 'Patient')) {
    return routes.patient.root;
  }

  return routes.login;
}
