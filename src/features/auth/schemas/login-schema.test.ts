import { describe, expect, it } from 'vitest';

import i18n from '@/i18n';
import { createLoginSchema } from '@/features/auth/schemas/login-schema';

const loginSchema = createLoginSchema(i18n.t.bind(i18n));

describe('loginSchema', () => {
  it('accepts valid credentials', () => {
    const result = loginSchema.safeParse({
      phoneNumber: '+15551234567',
      password: 'SecurePass1!',
    });

    expect(result.success).toBe(true);
  });

  it('rejects empty fields', () => {
    const result = loginSchema.safeParse({
      phoneNumber: '',
      password: '',
    });

    expect(result.success).toBe(false);

    if (!result.success) {
      const messages = result.error.issues.map((issue) => issue.message);
      expect(messages).toContain('Phone number is required.');
      expect(messages).toContain('Password is required.');
    }
  });

  it('rejects invalid phone number format', () => {
    const result = loginSchema.safeParse({
      phoneNumber: 'not-a-phone',
      password: 'SecurePass1!',
    });

    expect(result.success).toBe(false);

    if (!result.success) {
      expect(result.error.issues[0]?.message).toBe('Phone number format is invalid.');
    }
  });

  it('trims phone number before validation', () => {
    const result = loginSchema.safeParse({
      phoneNumber: '  +15551234567  ',
      password: 'SecurePass1!',
    });

    expect(result.success).toBe(true);

    if (result.success) {
      expect(result.data.phoneNumber).toBe('+15551234567');
    }
  });
});
