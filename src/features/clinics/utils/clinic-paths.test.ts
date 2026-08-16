import { describe, expect, it } from 'vitest';

import { routes } from '@/routes/routes';
import { getClinicDetailsPath, getClinicListPath } from '@/features/clinics/utils/clinic-paths';
import type { AuthenticatedUser } from '@/types/auth';

const clinicId = '3fa85f64-5717-4562-b3fc-2c963f66afa6';

const manager: AuthenticatedUser = {
  userId: 'user-id',
  phoneNumber: '+15551234567',
  email: null,
  name: 'Clinic Manager',
  role: 'ClinicManager',
  roles: ['ClinicManager'],
};

const admin: AuthenticatedUser = {
  ...manager,
  name: 'Admin',
  role: 'Admin',
  roles: ['Admin'],
};

const doctor: AuthenticatedUser = {
  ...manager,
  name: 'Doctor',
  role: 'Doctor',
  roles: ['Doctor'],
};

describe('clinic paths', () => {
  it('uses admin clinic routes for admin users', () => {
    expect(getClinicListPath(admin)).toBe(routes.admin.clinics);
    expect(getClinicDetailsPath(clinicId, admin)).toBe(`${routes.admin.clinics}/${clinicId}`);
  });

  it('keeps clinic managers inside the Doctor panel clinic routes', () => {
    expect(getClinicListPath(manager)).toBe(routes.doctor.clinics);
    expect(getClinicDetailsPath(clinicId, manager)).toBe(`${routes.doctor.clinics}/${clinicId}`);
  });

  it('uses doctor clinic routes for doctors', () => {
    expect(getClinicListPath(doctor)).toBe(routes.doctor.clinics);
    expect(getClinicDetailsPath(clinicId, doctor)).toBe(`${routes.doctor.clinics}/${clinicId}`);
  });
});
