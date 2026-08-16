import type { TFunction } from 'i18next';
import { z } from 'zod';

import { GUID_PATTERN } from '@/features/clinics/utils/guid';

const phoneNumberPattern = /^\+?[0-9\s\-()]+$/;

export interface ClinicPhoneField {
  value: string;
}

export interface ClinicFormSchemaValues {
  name: string;
  address: string;
  phoneNumbers: ClinicPhoneField[];
  clinicManagerId?: string;
}

export function createClinicFormSchema(t: TFunction, requireClinicManagerId: boolean) {
  const phoneSchema = z.object({
    value: z
      .string()
      .trim()
      .min(1, t('clinics.validation.phoneRequired'))
      .max(20, t('clinics.validation.phoneMaxLength'))
      .refine((value) => phoneNumberPattern.test(value), {
        message: t('clinics.validation.phoneInvalid'),
      }),
  });

  const baseShape = {
    name: z
      .string()
      .trim()
      .min(1, t('clinics.validation.nameRequired'))
      .max(200, t('clinics.validation.nameMaxLength')),
    address: z
      .string()
      .trim()
      .min(1, t('clinics.validation.addressRequired'))
      .max(500, t('clinics.validation.addressMaxLength')),
    phoneNumbers: z.array(phoneSchema).min(1, t('clinics.validation.phoneRequired')),
  };

  if (!requireClinicManagerId) {
    return z.object({
      ...baseShape,
      clinicManagerId: z.string().optional(),
    });
  }

  return z.object({
    ...baseShape,
    clinicManagerId: z
      .string()
      .trim()
      .min(1, t('clinics.validation.clinicManagerRequired'))
      .regex(GUID_PATTERN, t('clinics.validation.guidInvalid')),
  });
}

export function toClinicPhonePayload(phoneNumbers: ClinicPhoneField[]): string[] {
  return phoneNumbers.map((item) => item.value.trim()).filter((value) => value.length > 0);
}
