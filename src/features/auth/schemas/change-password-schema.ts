import type { TFunction } from 'i18next';
import { z } from 'zod';

export interface ChangePasswordFormValues {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export function createChangePasswordSchema(t: TFunction) {
  return z
    .object({
      currentPassword: z.string().min(1, t('auth.changePassword.validation.currentRequired')),
      newPassword: z.string().min(1, t('auth.changePassword.validation.newRequired')),
      confirmPassword: z.string().min(1, t('auth.changePassword.validation.confirmRequired')),
    })
    .refine((data) => data.newPassword === data.confirmPassword, {
      message: t('auth.changePassword.validation.mismatch'),
      path: ['confirmPassword'],
    })
    .refine((data) => !data.newPassword || data.newPassword !== data.currentPassword, {
      message: t('auth.changePassword.validation.sameAsCurrent'),
      path: ['newPassword'],
    });
}
