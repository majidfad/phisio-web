import { routes } from '@/routes/routes';
import { hasRequiredRole } from '@/routes/utils/role-access';
import type { AuthenticatedUser } from '@/types/auth';

export function getClinicListPath(user: AuthenticatedUser | null | undefined): string {
  if (user && hasRequiredRole(user, 'Admin')) {
    return routes.admin.clinics;
  }

  return routes.doctor.clinics;
}

export function getClinicDetailsPath(
  clinicId: string,
  user: AuthenticatedUser | null | undefined,
): string {
  if (user && hasRequiredRole(user, 'Admin')) {
    return `${routes.admin.clinics}/${clinicId}`;
  }

  return `${routes.doctor.clinics}/${clinicId}`;
}
