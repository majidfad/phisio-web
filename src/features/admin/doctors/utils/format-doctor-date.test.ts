import { describe, expect, it } from 'vitest';

import {
  formatDoctorDate,
  getDoctorCreatedAt,
} from '@/features/admin/doctors/utils/format-doctor-date';

describe('formatDoctorDate', () => {
  it('formats valid ISO dates with Persian digits', () => {
    const formatted = formatDoctorDate('2024-03-15T10:30:00.000Z');

    expect(formatted).not.toBe('—');
    expect(formatted).toMatch(/[۰-۹]/);
  });

  it('returns dash for missing dates', () => {
    expect(formatDoctorDate(undefined)).toBe('—');
  });
});

describe('getDoctorCreatedAt', () => {
  it('returns createdAt when present', () => {
    expect(
      getDoctorCreatedAt({
        createdAt: '2024-02-01T00:00:00Z',
      }),
    ).toBe('2024-02-01T00:00:00Z');
  });

  it('returns undefined when createdAt is missing', () => {
    expect(getDoctorCreatedAt({})).toBeUndefined();
  });
});
