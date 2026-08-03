import type { TFunction } from 'i18next';
import { z } from 'zod';

export type AdminPasswordMode = 'set' | 'generate';

export interface AdminPasswordFields {
  passwordMode: AdminPasswordMode;
  password: string;
  confirmPassword: string;
}

export const EMPTY_ADMIN_PASSWORD_FIELDS: AdminPasswordFields = {
  passwordMode: 'generate',
  password: '',
  confirmPassword: '',
};

export function createAdminPasswordFieldsSchema(t: TFunction) {
  return z
    .object({
      passwordMode: z.enum(['set', 'generate']),
      password: z.string(),
      confirmPassword: z.string(),
    })
    .superRefine((data, ctx) => {
      if (data.passwordMode !== 'set') {
        return;
      }

      if (!data.password.trim()) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: t('admin.password.validation.passwordRequired'),
          path: ['password'],
        });
      }

      if (!data.confirmPassword.trim()) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: t('admin.password.validation.confirmRequired'),
          path: ['confirmPassword'],
        });
      } else if (data.password !== data.confirmPassword) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: t('admin.password.validation.mismatch'),
          path: ['confirmPassword'],
        });
      }
    });
}

export function toAdminSetPasswordRequest(fields: AdminPasswordFields) {
  if (fields.passwordMode === 'generate') {
    return { generatePassword: true };
  }

  return {
    generatePassword: false,
    password: fields.password,
    confirmPassword: fields.confirmPassword,
  };
}
