import type { TFunction } from 'i18next';
import { z } from 'zod';

const phoneNumberPattern = /^\+?[0-9\s\-()]+$/;
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function createDoctorFormSchema(t: TFunction) {
  return z.object({
    name: z
      .string()
      .trim()
      .min(1, t('admin.doctors.validation.nameRequired'))
      .max(200, t('admin.doctors.validation.nameMaxLength')),
    phoneNumber: z
      .string()
      .trim()
      .min(1, t('admin.doctors.validation.phoneRequired'))
      .max(20, t('admin.doctors.validation.phoneMaxLength'))
      .regex(phoneNumberPattern, t('admin.doctors.validation.phoneInvalid')),
    email: z
      .string()
      .trim()
      .refine((value) => value === '' || emailPattern.test(value), {
        message: t('admin.doctors.validation.emailInvalid'),
      }),
    specialty: z
      .string()
      .trim()
      .min(1, t('admin.doctors.validation.specialtyRequired'))
      .max(200, t('admin.doctors.validation.specialtyMaxLength')),
    medicalLicenseNumber: z
      .string()
      .trim()
      .min(1, t('admin.doctors.validation.licenseRequired'))
      .max(50, t('admin.doctors.validation.licenseMaxLength')),
    clinicAddress: z
      .string()
      .trim()
      .min(1, t('admin.doctors.validation.addressRequired'))
      .max(500, t('admin.doctors.validation.addressMaxLength')),
  });
}

export type DoctorFormSchemaValues = z.infer<ReturnType<typeof createDoctorFormSchema>>;
