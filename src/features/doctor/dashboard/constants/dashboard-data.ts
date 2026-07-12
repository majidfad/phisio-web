import { routes } from '@/routes/routes';

import type { DoctorDashboardNavItem, DoctorDashboardSummaryItem } from '../types/dashboard';

export const doctorDashboardSummary: DoctorDashboardSummaryItem[] = [
  {
    id: 'patients',
    labelKey: 'doctor.dashboard.summary.patients',
    valueKey: 'patientsCount',
    to: routes.doctor.patients,
  },
];

export const doctorDashboardNavItems: DoctorDashboardNavItem[] = [
  {
    id: 'my-patients',
    labelKey: 'doctor.dashboard.actions.myPatients',
    to: routes.doctor.patients,
  },
  {
    id: 'exercises',
    labelKey: 'doctor.dashboard.actions.exercises',
    to: routes.doctor.exercises,
  },
];
