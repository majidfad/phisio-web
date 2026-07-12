import { describe, expect, it } from 'vitest';

import {
  formatPatientDate,
  getPatientCreatedAt,
} from '@/features/admin/patients/utils/format-patient-date';

describe('formatPatientDate', () => {
  it('formats valid ISO dates with Persian digits', () => {
    const formatted = formatPatientDate('2024-01-15T10:00:00Z');
    expect(formatted).not.toBe('—');
    expect(formatted).toMatch(/[۰-۹]/);
  });

  it('returns dash for missing dates', () => {
    expect(formatPatientDate(undefined)).toBe('—');
  });
});

describe('getPatientCreatedAt', () => {
  it('returns createdAt when present', () => {
    expect(
      getPatientCreatedAt({
        createdAt: '2024-02-01T00:00:00Z',
      }),
    ).toBe('2024-02-01T00:00:00Z');
  });

  it('returns undefined when createdAt is missing', () => {
    expect(getPatientCreatedAt({})).toBeUndefined();
  });
});
