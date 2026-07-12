import { describe, expect, it } from 'vitest';

import {
  adminLayoutConfig,
  doctorLayoutConfig,
  patientLayoutConfig,
} from '@/layouts/config/role-layout-config';

describe('role-layout-config', () => {
  it.each([
    ['layout.roles.admin', adminLayoutConfig, 5],
    ['layout.roles.doctor', doctorLayoutConfig, 3],
    ['layout.roles.patient', patientLayoutConfig, 3],
  ])('defines navigation for %s', (roleLabelKey, config, itemCount) => {
    expect(config.roleLabelKey).toBe(roleLabelKey);
    expect(config.navItems).toHaveLength(itemCount);
    expect(config.navItems.every((item) => item.id && item.labelKey)).toBe(true);
    expect(config.navAriaLabelKey.length).toBeGreaterThan(0);
    expect(config.layoutClassName).toMatch(/^role-layout--/);
  });

  it('links admin navigation items to admin routes', () => {
    expect(adminLayoutConfig.navItems.every((item) => item.to)).toBe(true);
  });

  it('links doctor navigation items to doctor routes', () => {
    expect(doctorLayoutConfig.navItems.every((item) => item.to)).toBe(true);
  });

  it('links patient exercises navigation to patient exercises route', () => {
    const exercisesNav = patientLayoutConfig.navItems.find((item) => item.id === 'exercises');
    expect(exercisesNav?.to).toBe('/patient/exercises');
  });
});
