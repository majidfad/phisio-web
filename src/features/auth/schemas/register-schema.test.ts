import { describe, expect, it } from 'vitest';

import i18n from '@/i18n';
import { createRegisterSchema } from '@/features/auth/schemas/register-schema';

const registerSchema = createRegisterSchema(i18n.t.bind(i18n));

describe('registerSchema', () => {
  it('accepts valid registration data', () => {
    const result = registerSchema.safeParse({
      name: 'علی رضایی',
      phoneNumber: '09121234567',
      password: 'Password123!',
      confirmPassword: 'Password123!',
    });

    expect(result.success).toBe(true);
  });

  it('rejects empty fields', () => {
    const result = registerSchema.safeParse({
      name: '',
      phoneNumber: '',
      password: '',
      confirmPassword: '',
    });

    expect(result.success).toBe(false);
  });

  it('rejects mismatched passwords', () => {
    const result = registerSchema.safeParse({
      name: 'علی رضایی',
      phoneNumber: '09121234567',
      password: 'Password123!',
      confirmPassword: 'DifferentPass1!',
    });

    expect(result.success).toBe(false);

    if (!result.success) {
      const confirmIssue = result.error.issues.find((issue) =>
        issue.path.includes('confirmPassword'),
      );
      expect(confirmIssue?.message).toBeTruthy();
    }
  });
});

describe('registerSchema (doctor)', () => {
  const doctorSchema = createRegisterSchema(i18n.t.bind(i18n), 'doctor');

  it('accepts valid doctor registration data', () => {
    const result = doctorSchema.safeParse({
      name: 'دکتر مریم احمدی',
      phoneNumber: '09121112233',
      password: 'Password123!',
      confirmPassword: 'Password123!',
      medicalLicenseNumber: '123456',
      specialty: 'فیزیوتراپی',
    });

    expect(result.success).toBe(true);
  });

  it('rejects doctor registration without license and specialty', () => {
    const result = doctorSchema.safeParse({
      name: 'دکتر مریم احمدی',
      phoneNumber: '09121112233',
      password: 'Password123!',
      confirmPassword: 'Password123!',
      medicalLicenseNumber: '',
      specialty: '',
    });

    expect(result.success).toBe(false);

    if (!result.success) {
      const paths = result.error.issues.map((issue) => issue.path[0]);
      expect(paths).toContain('medicalLicenseNumber');
      expect(paths).toContain('specialty');
    }
  });

  it('does not require doctor fields for patients', () => {
    const result = registerSchema.safeParse({
      name: 'علی رضایی',
      phoneNumber: '09121234567',
      password: 'Password123!',
      confirmPassword: 'Password123!',
    });

    expect(result.success).toBe(true);
  });
});
