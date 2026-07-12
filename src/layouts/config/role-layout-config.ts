import { routes } from '@/routes/routes';

import type { RoleLayoutConfig } from './role-layout-config.types';

export type { RoleLayoutConfig, RoleLayoutNavItem } from './role-layout-config.types';

export const adminLayoutConfig: RoleLayoutConfig = {
  layoutClassName: 'role-layout--admin',
  roleLabelKey: 'layout.roles.admin',
  navAriaLabelKey: 'layout.navAria.admin',
  navItems: [
    { id: 'dashboard', labelKey: 'layout.nav.dashboard', to: routes.admin.root, end: true },
    { id: 'doctors', labelKey: 'layout.nav.doctors', to: routes.admin.doctors },
    { id: 'patients', labelKey: 'layout.nav.patients', to: routes.admin.patients },
    { id: 'exercises', labelKey: 'layout.nav.exercises', to: routes.admin.exercises },
    { id: 'assignments', labelKey: 'layout.nav.assignments', to: routes.admin.assignments },
  ],
};

export const doctorLayoutConfig: RoleLayoutConfig = {
  layoutClassName: 'role-layout--doctor',
  roleLabelKey: 'layout.roles.doctor',
  navAriaLabelKey: 'layout.navAria.doctor',
  navItems: [
    { id: 'dashboard', labelKey: 'layout.nav.overview', to: routes.doctor.root, end: true },
    { id: 'patients', labelKey: 'layout.nav.myPatients', to: routes.doctor.patients },
    { id: 'exercises', labelKey: 'layout.nav.exercises', to: routes.doctor.exercises },
  ],
};

export const patientLayoutConfig: RoleLayoutConfig = {
  layoutClassName: 'role-layout--patient',
  roleLabelKey: 'layout.roles.patient',
  navAriaLabelKey: 'layout.navAria.patient',
  navItems: [
    { id: 'dashboard', labelKey: 'layout.nav.dashboard', to: routes.patient.root, end: true },
    { id: 'exercises', labelKey: 'layout.nav.myExercises', to: routes.patient.exercises },
    { id: 'progress', labelKey: 'layout.nav.progress', to: routes.patient.progress },
  ],
};
