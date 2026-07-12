import type { AuthResponse, AuthenticatedUser, MeResponse } from '@/types/auth';

import { normalizeUserRole, normalizeUserRoles, resolvePrimaryRole } from './normalize-user-role';

export function mapAuthResponseToUser(response: AuthResponse): AuthenticatedUser {
  const role = normalizeUserRole(response.role);

  return {
    userId: response.userId,
    phoneNumber: response.phoneNumber,
    email: response.email,
    name: response.name,
    role,
    roles: [role],
  };
}

export function mapMeResponseToUser(
  response: MeResponse,
  existingUser?: AuthenticatedUser | null,
): AuthenticatedUser {
  const roles = normalizeUserRoles(response.roles, existingUser?.role ?? 'Patient');
  const primaryRole = resolvePrimaryRole(roles, existingUser?.role ?? 'Patient');

  return {
    userId: response.userId,
    phoneNumber: response.phoneNumber,
    email: response.email,
    name: existingUser?.name ?? response.phoneNumber,
    role: primaryRole,
    roles,
  };
}

export function normalizeAuthenticatedUser(user: AuthenticatedUser): AuthenticatedUser {
  const roles = normalizeUserRoles(user.roles, normalizeUserRole(user.role));

  return {
    ...user,
    role: resolvePrimaryRole(roles, normalizeUserRole(user.role)),
    roles,
  };
}
