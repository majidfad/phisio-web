import type { UserRole } from '@/types/auth';

const ROLE_BY_NUMBER: Record<number, UserRole> = {
  1: 'Doctor',
  2: 'Patient',
  3: 'Admin',
  4: 'ClinicManager',
};

const ROLE_NAMES = new Set<UserRole>(['Doctor', 'Patient', 'Admin', 'ClinicManager']);

const ROLE_BY_NAME: Record<string, UserRole> = {
  doctor: 'Doctor',
  patient: 'Patient',
  admin: 'Admin',
  clinicmanager: 'ClinicManager',
};

export function normalizeUserRole(value: unknown, fallback: UserRole = 'Patient'): UserRole {
  if (typeof value === 'string') {
    const trimmed = value.trim();

    if (ROLE_NAMES.has(trimmed as UserRole)) {
      return trimmed as UserRole;
    }

    const compactName = trimmed.replace(/[\s_-]/g, '').toLowerCase();

    if (compactName in ROLE_BY_NAME) {
      return ROLE_BY_NAME[compactName];
    }

    if (/^\d+$/.test(trimmed)) {
      return normalizeUserRole(Number(trimmed), fallback);
    }
  }

  if (typeof value === 'number' && value in ROLE_BY_NUMBER) {
    return ROLE_BY_NUMBER[value];
  }

  return fallback;
}

export function normalizeUserRoles(values: unknown[], fallback: UserRole = 'Patient'): UserRole[] {
  const normalized = values.map((value) => normalizeUserRole(value, fallback));
  const unique = [...new Set(normalized)];
  const roles = unique.length > 0 ? unique : [fallback];

  return roles.includes('ClinicManager') && !roles.includes('Doctor') ? [...roles, 'Doctor'] : roles;
}

export function resolvePrimaryRole(roles: UserRole[], fallback: UserRole = 'Patient'): UserRole {
  if (roles.includes('Admin')) {
    return 'Admin';
  }

  if (roles.includes('ClinicManager')) {
    return 'ClinicManager';
  }

  if (roles.includes('Doctor')) {
    return 'Doctor';
  }

  if (roles.includes('Patient')) {
    return 'Patient';
  }

  return fallback;
}
