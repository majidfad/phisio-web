import type { TFunction } from 'i18next';
import { z } from 'zod';

import { createAdminPasswordFieldsSchema } from '@/features/admin/password/schemas/admin-password-schema';
import { GUID_PATTERN } from '@/features/clinics/utils/guid';

const phoneNumberPattern = /^\+?[0-9\s\-()]+$/;

export interface DoctorClinicPhoneField {
  value: string;
}

function createClinicPhoneFieldSchema(t: TFunction) {
  return z.object({
    value: z
      .string()
      .trim()
      .min(1, t('admin.doctors.validation.clinicPhoneRequired'))
      .max(20, t('admin.doctors.validation.clinicPhoneMaxLength'))
      .regex(phoneNumberPattern, t('admin.doctors.validation.clinicPhoneInvalid')),
  });
}

const doctorProfileShape = (t: TFunction, requireClinicAddress: boolean) => ({
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
    .refine((value) => value === '' || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value), {
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
  clinicAddress: requireClinicAddress
    ? z
        .string()
        .trim()
        .min(1, t('admin.doctors.validation.addressRequired'))
        .max(500, t('admin.doctors.validation.addressMaxLength'))
    : z.string().max(500, t('admin.doctors.validation.addressMaxLength')),
});

/** Edit mode: profile fields only (password handled separately). */
export function createDoctorEditFormSchema(t: TFunction) {
  return z.object(doctorProfileShape(t, true));
}

/**
 * Create mode: doctor profile + password + clinic association fields.
 * Clinic address is collected only on the create-clinic step (`newClinicAddress`).
 */
export function createDoctorFormSchema(t: TFunction) {
  return z
    .object({
      ...doctorProfileShape(t, false),
      clinicPhoneNumbers: z
        .array(createClinicPhoneFieldSchema(t))
        .min(1, t('admin.doctors.validation.clinicPhoneRequired')),
      newClinicName: z.string(),
      newClinicAddress: z.string(),
      managerIsThisDoctor: z.boolean(),
      clinicManagerId: z.string().optional(),
    })
    .and(createAdminPasswordFieldsSchema(t));
}

export function createNewClinicStepSchema(t: TFunction) {
  return z
    .object({
      newClinicName: z
        .string()
        .trim()
        .min(1, t('admin.doctors.validation.newClinicNameRequired'))
        .max(200, t('admin.doctors.validation.newClinicNameMaxLength')),
      newClinicAddress: z
        .string()
        .trim()
        .min(1, t('admin.doctors.validation.newClinicAddressRequired'))
        .max(500, t('admin.doctors.validation.newClinicAddressMaxLength')),
      clinicPhoneNumbers: z
        .array(createClinicPhoneFieldSchema(t))
        .min(1, t('admin.doctors.validation.clinicPhoneRequired')),
      managerIsThisDoctor: z.boolean(),
      clinicManagerId: z.string().optional(),
    })
    .superRefine((values, context) => {
      if (values.managerIsThisDoctor) {
        return;
      }

      const managerId = values.clinicManagerId?.trim() ?? '';
      if (!managerId) {
        context.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['clinicManagerId'],
          message: t('admin.doctors.validation.clinicManagerRequired'),
        });
        return;
      }

      if (!GUID_PATTERN.test(managerId)) {
        context.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['clinicManagerId'],
          message: t('admin.doctors.validation.guidInvalid'),
        });
      }
    });
}

export function toClinicPhonePayload(phoneNumbers: DoctorClinicPhoneField[]): string[] {
  return phoneNumbers.map((item) => item.value.trim()).filter((value) => value.length > 0);
}

export type DoctorFormSchemaValues = z.infer<ReturnType<typeof createDoctorFormSchema>>;
export type DoctorEditFormSchemaValues = z.infer<ReturnType<typeof createDoctorEditFormSchema>>;
