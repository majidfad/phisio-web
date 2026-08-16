import type { AuthenticatedUser, UserRole } from '@/types/auth';

import { routes } from '../routes';

export function hasRequiredRole(user: AuthenticatedUser, role: UserRole): boolean {
  if (user.role === role || user.roles.includes(role)) {
    return true;
  }

  return (
    role === 'Doctor' && (user.role === 'ClinicManager' || user.roles.includes('ClinicManager'))
  );
}

export function getHomeRouteForUser(user: AuthenticatedUser): string {
  switch (user.role) {
    case 'Admin':
      return routes.admin.root;
    case 'ClinicManager':
    case 'Doctor':
      return routes.doctor.root;
    case 'Patient':
      return routes.patient.root;
    default:
      return routes.login;
  }
}
