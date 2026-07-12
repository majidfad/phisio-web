import { describe, expect, it } from 'vitest';

import { formatPatientDoctors } from '@/features/admin/patients/utils/format-patient-doctors';

describe('formatPatientDoctors', () => {
  it('returns empty label when no doctors are assigned', () => {
    expect(formatPatientDoctors([], 'بدون پزشک')).toBe('بدون پزشک');
    expect(formatPatientDoctors(undefined, 'بدون پزشک')).toBe('بدون پزشک');
  });

  it('joins doctor names with Persian comma separator', () => {
    expect(formatPatientDoctors(['دکتر احمدی', 'دکتر رضایی'], 'بدون پزشک')).toBe(
      'دکتر احمدی، دکتر رضایی',
    );
  });
});
