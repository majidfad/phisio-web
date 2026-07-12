import { describe, expect, it } from 'vitest';

import i18n from '@/i18n';
import { createDoctorFormSchema } from '@/features/admin/doctors/schemas/doctor-form-schema';

const schema = createDoctorFormSchema(i18n.t.bind(i18n));

describe('createDoctorFormSchema', () => {
  it('accepts valid doctor data', () => {
    const result = schema.safeParse({
      name: 'Dr. Ali',
      phoneNumber: '+989121234567',
      email: 'ali@example.com',
      specialty: 'Orthopedics',
      medicalLicenseNumber: 'MD-12345',
      clinicAddress: 'Tehran, Clinic St',
    });

    expect(result.success).toBe(true);
  });

  it('accepts empty optional email', () => {
    const result = schema.safeParse({
      name: 'Dr. Ali',
      phoneNumber: '+989121234567',
      email: '',
      specialty: 'Orthopedics',
      medicalLicenseNumber: 'MD-12345',
      clinicAddress: 'Tehran, Clinic St',
    });

    expect(result.success).toBe(true);
  });

  it('rejects missing profile fields', () => {
    const result = schema.safeParse({
      name: 'Dr. Ali',
      phoneNumber: '+989121234567',
      email: '',
      specialty: '',
      medicalLicenseNumber: '',
      clinicAddress: '',
    });

    expect(result.success).toBe(false);
  });
});
