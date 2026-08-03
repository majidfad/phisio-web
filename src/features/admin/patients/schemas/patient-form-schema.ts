import type { TFunction } from 'i18next';
import { z } from 'zod';

import { createAdminPasswordFieldsSchema } from '@/features/admin/password/schemas/admin-password-schema';

const phoneNumberPattern = /^\+?[0-9\s\-()]+$/;
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function createPatientFormSchema(t: TFunction) {
  return z
    .object({
      name: z
        .string()
        .trim()
        .min(1, t('admin.patients.validation.nameRequired'))
        .max(200, t('admin.patients.validation.nameMaxLength')),
      phoneNumber: z
        .string()
        .trim()
        .min(1, t('admin.patients.validation.phoneRequired'))
        .max(20, t('admin.patients.validation.phoneMaxLength'))
        .regex(phoneNumberPattern, t('admin.patients.validation.phoneInvalid')),
      email: z
        .string()
        .trim()
        .refine((value) => value === '' || emailPattern.test(value), {
          message: t('admin.patients.validation.emailInvalid'),
        }),
    })
    .and(createAdminPasswordFieldsSchema(t));
}

export type PatientFormSchemaValues = z.infer<ReturnType<typeof createPatientFormSchema>>;
