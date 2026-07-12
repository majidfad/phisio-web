import type { TFunction } from 'i18next';
import { z } from 'zod';

const phoneNumberPattern = /^\+?[0-9\s\-()]+$/;

export function createRegisterSchema(t: TFunction) {
  return z
    .object({
      name: z.string().trim().min(1, t('auth.validation.nameRequired')),
      phoneNumber: z
        .string()
        .trim()
        .min(1, t('auth.validation.mobileRequired'))
        .max(20, t('auth.validation.mobileMaxLength'))
        .regex(phoneNumberPattern, t('auth.validation.mobileInvalid')),
      password: z.string().min(1, t('auth.validation.passwordRequired')),
      confirmPassword: z.string().min(1, t('auth.validation.confirmPasswordRequired')),
    })
    .refine((data) => data.password === data.confirmPassword, {
      message: t('auth.validation.passwordMismatch'),
      path: ['confirmPassword'],
    });
}

export type RegisterFormValues = z.infer<ReturnType<typeof createRegisterSchema>>;
