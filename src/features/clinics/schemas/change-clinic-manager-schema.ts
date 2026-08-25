import type { TFunction } from 'i18next';
import { z } from 'zod';

import { GUID_PATTERN } from '@/features/clinics/utils/guid';

export interface ChangeClinicManagerSchemaValues {
  clinicManagerId: string;
}

export function createChangeClinicManagerSchema(t: TFunction) {
  return z.object({
    clinicManagerId: z
      .string()
      .trim()
      .min(1, t('clinics.validation.clinicManagerRequired'))
      .regex(GUID_PATTERN, t('clinics.validation.guidInvalid')),
  });
}

export function resolveChangeClinicManagerId(values: ChangeClinicManagerSchemaValues): string {
  return values.clinicManagerId.trim();
}
