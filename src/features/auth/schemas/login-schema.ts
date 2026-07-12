import type { TFunction } from 'i18next';
import { z } from 'zod';

const phoneNumberPattern = /^\+?[0-9\s\-()]+$/;

export function createLoginSchema(t: TFunction) {
  return z.object({
    phoneNumber: z
      .string()
      .trim()
      .min(1, t('auth.validation.phoneRequired'))
      .max(20, t('auth.validation.phoneMaxLength'))
      .regex(phoneNumberPattern, t('auth.validation.phoneInvalid')),
    password: z.string().min(1, t('auth.validation.passwordRequired')),
  });
}

export type LoginFormValues = z.infer<ReturnType<typeof createLoginSchema>>;
