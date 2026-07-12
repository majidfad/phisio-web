import { describe, expect, it } from 'vitest';

import i18n from '@/i18n';
import { createPatientFormSchema } from '@/features/admin/patients/schemas/patient-form-schema';

const schema = createPatientFormSchema(i18n.t.bind(i18n));

describe('createPatientFormSchema', () => {
  it('accepts valid patient data', () => {
    const result = schema.safeParse({
      name: 'Ali Patient',
      phoneNumber: '+989121234567',
      email: 'ali@example.com',
    });

    expect(result.success).toBe(true);
  });

  it('accepts empty optional email', () => {
    const result = schema.safeParse({
      name: 'Ali Patient',
      phoneNumber: '+989121234567',
      email: '',
    });

    expect(result.success).toBe(true);
  });

  it('rejects missing required fields', () => {
    const result = schema.safeParse({
      name: '',
      phoneNumber: '',
      email: '',
    });

    expect(result.success).toBe(false);
  });

  it('rejects invalid email when provided', () => {
    const result = schema.safeParse({
      name: 'Ali Patient',
      phoneNumber: '+989121234567',
      email: 'not-an-email',
    });

    expect(result.success).toBe(false);
  });
});
