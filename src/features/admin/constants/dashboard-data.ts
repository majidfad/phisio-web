import { routes } from '@/routes/routes';

import type { DashboardNavItem, DashboardSummaryItem } from '../types/dashboard';

export const adminDashboardSummary: Omit<DashboardSummaryItem, 'value'>[] = [
  {
    id: 'doctors',
    labelKey: 'admin.dashboard.summary.doctors',
    valueKey: 'doctorCount',
    to: routes.admin.doctors,
  },
  {
    id: 'patients',
    labelKey: 'admin.dashboard.summary.patients',
    valueKey: 'patientCount',
    to: routes.admin.patients,
  },
  {
    id: 'exercises',
    labelKey: 'admin.dashboard.summary.exercises',
    valueKey: 'exerciseCount',
    to: routes.admin.exercises,
  },
];

export const adminDashboardNavItems: DashboardNavItem[] = [
  {
    id: 'manage-doctors',
    labelKey: 'admin.dashboard.actions.manageDoctors',
    to: routes.admin.doctors,
  },
  {
    id: 'manage-patients',
    labelKey: 'admin.dashboard.actions.managePatients',
    to: routes.admin.patients,
  },
  {
    id: 'manage-exercises',
    labelKey: 'admin.dashboard.actions.manageExercises',
    to: routes.admin.exercises,
  },
  {
    id: 'assign-exercises',
    labelKey: 'admin.dashboard.actions.assignExercises',
    to: routes.admin.assignments,
  },
];
