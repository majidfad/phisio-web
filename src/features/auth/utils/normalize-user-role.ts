import type { UserRole } from '@/types/auth';

const ROLE_BY_NUMBER: Record<number, UserRole> = {
  1: 'Doctor',
  2: 'Patient',
  3: 'Admin',
};

const ROLE_NAMES = new Set<UserRole>(['Doctor', 'Patient', 'Admin']);

export function normalizeUserRole(value: unknown, fallback: UserRole = 'Patient'): UserRole {
  if (typeof value === 'string' && ROLE_NAMES.has(value as UserRole)) {
    return value as UserRole;
  }

  if (typeof value === 'number' && value in ROLE_BY_NUMBER) {
    return ROLE_BY_NUMBER[value];
  }

  return fallback;
}

export function normalizeUserRoles(values: unknown[], fallback: UserRole = 'Patient'): UserRole[] {
  const normalized = values.map((value) => normalizeUserRole(value, fallback));

  return [...new Set(normalized)];
}

export function resolvePrimaryRole(roles: UserRole[], fallback: UserRole = 'Patient'): UserRole {
  if (roles.includes('Admin')) {
    return 'Admin';
  }

  if (roles.includes('Doctor')) {
    return 'Doctor';
  }

  if (roles.includes('Patient')) {
    return 'Patient';
  }

  return fallback;
}
