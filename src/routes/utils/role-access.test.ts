import { describe, expect, it } from 'vitest';

import { routes } from '@/routes/routes';
import { getHomeRouteForUser, hasRequiredRole } from '@/routes/utils/role-access';
import type { AuthenticatedUser } from '@/types/auth';

const baseUser: AuthenticatedUser = {
  userId: 'user-id',
  phoneNumber: '+15551234567',
  email: 'user@example.com',
  name: 'Test User',
  role: 'Doctor',
  roles: ['Doctor'],
};

describe('hasRequiredRole', () => {
  it('returns true when primary role matches', () => {
    expect(hasRequiredRole(baseUser, 'Doctor')).toBe(true);
  });

  it('returns true when role exists in identity roles', () => {
    const user: AuthenticatedUser = {
      ...baseUser,
      role: 'Doctor',
      roles: ['Doctor', 'Admin'],
    };

    expect(hasRequiredRole(user, 'Admin')).toBe(true);
  });

  it('returns false when role is missing', () => {
    expect(hasRequiredRole(baseUser, 'Patient')).toBe(false);
  });

  it('treats ClinicManager as having Doctor access', () => {
    expect(
      hasRequiredRole(
        {
          ...baseUser,
          role: 'ClinicManager',
          roles: ['ClinicManager'],
        },
        'Doctor',
      ),
    ).toBe(true);
  });
});

describe('getHomeRouteForUser', () => {
  it('returns admin route for admin users', () => {
    const user: AuthenticatedUser = {
      ...baseUser,
      role: 'Admin',
      roles: ['Admin'],
    };

    expect(getHomeRouteForUser(user)).toBe(routes.admin.root);
  });

  it('returns Doctor panel for clinic manager users', () => {
    const user: AuthenticatedUser = {
      ...baseUser,
      role: 'ClinicManager',
      roles: ['ClinicManager'],
    };

    expect(getHomeRouteForUser(user)).toBe(routes.doctor.root);
  });

  it('does not send ClinicManager to the Admin home when Doctor is also present', () => {
    const user: AuthenticatedUser = {
      ...baseUser,
      role: 'ClinicManager',
      roles: ['ClinicManager', 'Doctor'],
    };

    expect(getHomeRouteForUser(user)).toBe(routes.doctor.root);
  });

  it('returns doctor route for doctor users', () => {
    expect(getHomeRouteForUser(baseUser)).toBe(routes.doctor.root);
  });

  it('returns patient route for patient users', () => {
    const user: AuthenticatedUser = {
      ...baseUser,
      role: 'Patient',
      roles: ['Patient'],
    };

    expect(getHomeRouteForUser(user)).toBe(routes.patient.root);
  });
});
