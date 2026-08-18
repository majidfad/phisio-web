import type { TFunction } from 'i18next';
import { z } from 'zod';

import { GUID_PATTERN } from '@/features/clinics/utils/guid';

export interface AddClinicDoctorSchemaValues {
  selectedDoctorId: string;
}

export function createAddClinicDoctorSchema(t: TFunction) {
  return z.object({
    selectedDoctorId: z
      .string()
      .trim()
      .min(1, t('clinics.doctors.validation.doctorRequired'))
      .regex(GUID_PATTERN, t('clinics.validation.guidInvalid')),
  });
}

export function resolveAddClinicDoctorId(values: AddClinicDoctorSchemaValues): string {
  return values.selectedDoctorId.trim();
}
