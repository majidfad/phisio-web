import { describe, expect, it } from 'vitest';

import {
  doctorDashboardNavItems,
  doctorDashboardSummary,
} from '@/features/doctor/dashboard/constants/dashboard-data';
import { routes } from '@/routes/routes';

describe('doctor dashboard-data', () => {
  it('maps summary cards to doctor patients route', () => {
    expect(doctorDashboardSummary).toHaveLength(1);
    expect(doctorDashboardSummary[0]?.to).toBe(routes.doctor.patients);
  });

  it('maps quick actions to doctor patients and exercises routes', () => {
    expect(doctorDashboardNavItems.map((item) => item.to)).toEqual([
      routes.doctor.patients,
      routes.doctor.exercises,
    ]);
  });
});
