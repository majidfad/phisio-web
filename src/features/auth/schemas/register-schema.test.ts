import { describe, expect, it } from 'vitest';

import i18n from '@/i18n';
import {
  createRegisterNewClinicStepSchema,
  createRegisterSchema,
} from '@/features/auth/schemas/register-schema';

const registerSchema = createRegisterSchema(i18n.t.bind(i18n));
const doctorSchema = createRegisterSchema(i18n.t.bind(i18n), 'doctor');
const newClinicSchema = createRegisterNewClinicStepSchema(i18n.t.bind(i18n));

const validDoctorBase = {
  name: 'دکتر مریم احمدی',
  phoneNumber: '09121112233',
  password: 'Password123!',
  confirmPassword: 'Password123!',
  medicalLicenseNumber: '123456',
  specialty: 'فیزیوتراپی',
  clinicPhoneNumbers: [{ value: '02112345678' }],
  newClinicName: '',
  newClinicAddress: '',
  managerIsThisDoctor: true,
};

describe('registerSchema', () => {
  it('accepts valid registration data', () => {
    const result = registerSchema.safeParse({
      name: 'علی رضایی',
      phoneNumber: '09121234567',
      password: 'Password123!',
      confirmPassword: 'Password123!',
    });

    expect(result.success).toBe(true);
  });

  it('rejects empty fields', () => {
    const result = registerSchema.safeParse({
      name: '',
      phoneNumber: '',
      password: '',
      confirmPassword: '',
    });

    expect(result.success).toBe(false);
  });

  it('rejects mismatched passwords', () => {
    const result = registerSchema.safeParse({
      name: 'علی رضایی',
      phoneNumber: '09121234567',
      password: 'Password123!',
      confirmPassword: 'DifferentPass1!',
    });

    expect(result.success).toBe(false);

    if (!result.success) {
      const confirmIssue = result.error.issues.find((issue) =>
        issue.path.includes('confirmPassword'),
      );
      expect(confirmIssue?.message).toBeTruthy();
    }
  });
});

describe('registerSchema (doctor)', () => {
  it('accepts valid doctor registration data with clinic phone', () => {
    const result = doctorSchema.safeParse(validDoctorBase);
    expect(result.success).toBe(true);
  });

  it('rejects doctor registration without license and specialty', () => {
    const result = doctorSchema.safeParse({
      ...validDoctorBase,
      medicalLicenseNumber: '',
      specialty: '',
    });

    expect(result.success).toBe(false);

    if (!result.success) {
      const paths = result.error.issues.map((issue) => issue.path[0]);
      expect(paths).toContain('medicalLicenseNumber');
      expect(paths).toContain('specialty');
    }
  });

  it('requires clinic phone numbers for doctors', () => {
    const result = doctorSchema.safeParse({
      ...validDoctorBase,
      clinicPhoneNumbers: [{ value: '' }],
    });

    expect(result.success).toBe(false);
  });

  it('does not require doctor fields for patients', () => {
    const result = registerSchema.safeParse({
      name: 'علی رضایی',
      phoneNumber: '09121234567',
      password: 'Password123!',
      confirmPassword: 'Password123!',
    });

    expect(result.success).toBe(true);
  });
});

describe('createRegisterNewClinicStepSchema', () => {
  it('requires clinic name and address for a new clinic', () => {
    const result = newClinicSchema.safeParse({
      newClinicName: '',
      newClinicAddress: '',
      clinicPhoneNumbers: [{ value: '02199999999' }],
      managerIsThisDoctor: true,
    });

    expect(result.success).toBe(false);
  });

  it('requires the registering doctor to be clinic manager', () => {
    const result = newClinicSchema.safeParse({
      newClinicName: 'Vanak',
      newClinicAddress: 'Vanak St',
      clinicPhoneNumbers: [{ value: '02199999999' }],
      managerIsThisDoctor: false,
    });

    expect(result.success).toBe(false);
  });

  it('accepts new clinic with this doctor as manager', () => {
    const result = newClinicSchema.safeParse({
      newClinicName: 'Vanak',
      newClinicAddress: 'Vanak St',
      clinicPhoneNumbers: [{ value: '02199999999' }],
      managerIsThisDoctor: true,
    });

    expect(result.success).toBe(true);
  });
});
