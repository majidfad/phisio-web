import { describe, expect, it } from 'vitest';

import i18n from '@/i18n';
import {
  createAddClinicDoctorSchema,
  resolveAddClinicDoctorId,
} from '@/features/clinics/schemas/add-clinic-doctor-schema';

const doctorId = '11111111-1111-1111-1111-111111111111';

describe('createAddClinicDoctorSchema', () => {
  it('accepts a selected doctor id', () => {
    const schema = createAddClinicDoctorSchema(i18n.t.bind(i18n));
    const result = schema.safeParse({
      selectedDoctorId: doctorId,
    });

    expect(result.success).toBe(true);
  });

  it('rejects when no doctor is selected', () => {
    const schema = createAddClinicDoctorSchema(i18n.t.bind(i18n));
    const result = schema.safeParse({
      selectedDoctorId: '',
    });

    expect(result.success).toBe(false);
  });
});

describe('resolveAddClinicDoctorId', () => {
  it('returns the selected doctor id', () => {
    expect(
      resolveAddClinicDoctorId({
        selectedDoctorId: doctorId,
      }),
    ).toBe(doctorId);
  });
});
