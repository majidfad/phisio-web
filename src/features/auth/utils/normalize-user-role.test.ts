import { describe, expect, it } from 'vitest';

import {
  normalizeUserRole,
  normalizeUserRoles,
  resolvePrimaryRole,
} from '@/features/auth/utils/normalize-user-role';

describe('normalizeUserRole', () => {
  it('maps numeric API roles to string roles', () => {
    expect(normalizeUserRole(1)).toBe('Doctor');
    expect(normalizeUserRole(2)).toBe('Patient');
    expect(normalizeUserRole(3)).toBe('Admin');
    expect(normalizeUserRole(4)).toBe('ClinicManager');
  });

  it('returns string roles unchanged', () => {
    expect(normalizeUserRole('Doctor')).toBe('Doctor');
    expect(normalizeUserRole('ClinicManager')).toBe('ClinicManager');
  });

  it('maps numeric roles encoded as strings', () => {
    expect(normalizeUserRole('4')).toBe('ClinicManager');
  });

  it('maps camelCase API role names', () => {
    expect(normalizeUserRole('clinicManager')).toBe('ClinicManager');
  });

  it('falls back for unknown values', () => {
    expect(normalizeUserRole('unknown')).toBe('Patient');
    expect(normalizeUserRole(99)).toBe('Patient');
  });
});

describe('normalizeUserRoles', () => {
  it('normalizes and deduplicates roles', () => {
    expect(normalizeUserRoles([3, 'Admin', 3])).toEqual(['Admin']);
  });

  it('uses the fallback when the role list is empty', () => {
    expect(normalizeUserRoles([], 'ClinicManager')).toEqual(['ClinicManager', 'Doctor']);
  });

  it('adds Doctor capabilities to ClinicManager roles', () => {
    expect(normalizeUserRoles(['ClinicManager'])).toEqual(['ClinicManager', 'Doctor']);
  });
});

describe('resolvePrimaryRole', () => {
  it('prefers Admin over other roles', () => {
    expect(resolvePrimaryRole(['Doctor', 'Admin'])).toBe('Admin');
  });

  it('prefers ClinicManager over Doctor', () => {
    expect(resolvePrimaryRole(['Doctor', 'ClinicManager'])).toBe('ClinicManager');
  });
});
