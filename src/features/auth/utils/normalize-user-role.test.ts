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
  });

  it('returns string roles unchanged', () => {
    expect(normalizeUserRole('Doctor')).toBe('Doctor');
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
});

describe('resolvePrimaryRole', () => {
  it('prefers Admin over other roles', () => {
    expect(resolvePrimaryRole(['Doctor', 'Admin'])).toBe('Admin');
  });
});
