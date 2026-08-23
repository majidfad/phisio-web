import { describe, expect, it } from 'vitest';

import i18n from '@/i18n';
import {
  createDoctorFormSchema,
  createNewClinicStepSchema,
} from '@/features/admin/doctors/schemas/doctor-form-schema';

const schema = createDoctorFormSchema(i18n.t.bind(i18n));
const newClinicSchema = createNewClinicStepSchema(i18n.t.bind(i18n));

const validCreateBase = {
  name: 'Dr. Ali',
  phoneNumber: '+989121234567',
  email: 'ali@example.com',
  specialty: 'Orthopedics',
  medicalLicenseNumber: 'MD-12345',
  clinicAddress: '',
  clinicPhoneNumbers: [{ value: '02112345678' }],
  newClinicName: '',
  newClinicAddress: '',
  managerIsThisDoctor: true,
  clinicManagerId: '',
  passwordMode: 'generate' as const,
  password: '',
  confirmPassword: '',
};

describe('createDoctorFormSchema', () => {
  it('accepts valid doctor data with clinic phone and generate password', () => {
    const result = schema.safeParse(validCreateBase);
    expect(result.success).toBe(true);
  });

  it('accepts empty optional email', () => {
    const result = schema.safeParse({
      ...validCreateBase,
      email: '',
    });

    expect(result.success).toBe(true);
  });

  it('does not require clinic address on the first create step', () => {
    const result = schema.safeParse({
      ...validCreateBase,
      clinicAddress: '',
    });

    expect(result.success).toBe(true);
  });

  it('rejects missing profile fields', () => {
    const result = schema.safeParse({
      ...validCreateBase,
      specialty: '',
      medicalLicenseNumber: '',
    });

    expect(result.success).toBe(false);
  });

  it('requires clinic phone numbers', () => {
    const result = schema.safeParse({
      ...validCreateBase,
      clinicPhoneNumbers: [{ value: '' }],
    });

    expect(result.success).toBe(false);
  });

  it('requires password when mode is set', () => {
    const result = schema.safeParse({
      ...validCreateBase,
      passwordMode: 'set',
      password: '',
      confirmPassword: '',
    });

    expect(result.success).toBe(false);
  });
});

describe('createNewClinicStepSchema', () => {
  it('requires clinic name and address for a new clinic', () => {
    const result = newClinicSchema.safeParse({
      newClinicName: '',
      newClinicAddress: '',
      clinicPhoneNumbers: [{ value: '02199999999' }],
      managerIsThisDoctor: true,
      clinicManagerId: '',
    });

    expect(result.success).toBe(false);
  });

  it('requires clinic manager when checkbox is unchecked', () => {
    const result = newClinicSchema.safeParse({
      newClinicName: 'Vanak',
      newClinicAddress: 'Vanak St',
      clinicPhoneNumbers: [{ value: '02199999999' }],
      managerIsThisDoctor: false,
      clinicManagerId: '',
    });

    expect(result.success).toBe(false);
  });

  it('accepts new clinic with this doctor as manager', () => {
    const result = newClinicSchema.safeParse({
      newClinicName: 'Vanak',
      newClinicAddress: 'Vanak St',
      clinicPhoneNumbers: [{ value: '02199999999' }],
      managerIsThisDoctor: true,
      clinicManagerId: '',
    });

    expect(result.success).toBe(true);
  });
});
