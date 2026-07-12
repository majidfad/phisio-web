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
