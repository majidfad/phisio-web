import { describe, expect, it } from 'vitest';

import i18n from '@/i18n';
import { createPatientFormSchema } from '@/features/admin/patients/schemas/patient-form-schema';

const schema = createPatientFormSchema(i18n.t.bind(i18n));

describe('createPatientFormSchema', () => {
  it('accepts valid patient data with generate password', () => {
    const result = schema.safeParse({
      name: 'Ali Patient',
      phoneNumber: '+989121234567',
      email: 'ali@example.com',
      passwordMode: 'generate',
      password: '',
      confirmPassword: '',
    });

    expect(result.success).toBe(true);
  });

  it('accepts empty optional email', () => {
    const result = schema.safeParse({
      name: 'Ali Patient',
      phoneNumber: '+989121234567',
      email: '',
      passwordMode: 'generate',
      password: '',
      confirmPassword: '',
    });

    expect(result.success).toBe(true);
  });

  it('rejects missing required fields', () => {
    const result = schema.safeParse({
      name: '',
      phoneNumber: '',
      email: '',
      passwordMode: 'generate',
      password: '',
      confirmPassword: '',
    });

    expect(result.success).toBe(false);
  });

  it('rejects invalid email when provided', () => {
    const result = schema.safeParse({
      name: 'Ali Patient',
      phoneNumber: '+989121234567',
      email: 'not-an-email',
      passwordMode: 'generate',
      password: '',
      confirmPassword: '',
    });

    expect(result.success).toBe(false);
  });

  it('requires password when mode is set', () => {
    const result = schema.safeParse({
      name: 'Ali Patient',
      phoneNumber: '+989121234567',
      email: 'ali@example.com',
      passwordMode: 'set',
      password: '',
      confirmPassword: '',
    });

    expect(result.success).toBe(false);
  });
});
