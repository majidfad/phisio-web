import type { TFunction } from 'i18next';
import { z } from 'zod';

const phoneNumberPattern = /^\+?[0-9\s\-()]+$/;

export type RegistrationRole = 'patient' | 'doctor';

export interface RegisterFormValues {
  name: string;
  phoneNumber: string;
  password: string;
  confirmPassword: string;
  medicalLicenseNumber?: string;
  specialty?: string;
}

export function createRegisterSchema(t: TFunction, role: RegistrationRole = 'patient') {
  const baseShape = {
    name: z.string().trim().min(1, t('auth.validation.nameRequired')),
    phoneNumber: z
      .string()
      .trim()
      .min(1, t('auth.validation.mobileRequired'))
      .max(20, t('auth.validation.mobileMaxLength'))
      .regex(phoneNumberPattern, t('auth.validation.mobileInvalid')),
    password: z.string().min(1, t('auth.validation.passwordRequired')),
    confirmPassword: z.string().min(1, t('auth.validation.confirmPasswordRequired')),
  };

  const doctorShape = {
    ...baseShape,
    medicalLicenseNumber: z
      .string()
      .trim()
      .min(1, t('auth.validation.licenseRequired'))
      .max(50, t('auth.validation.licenseMaxLength')),
    specialty: z
      .string()
      .trim()
      .min(1, t('auth.validation.specialtyRequired'))
      .max(200, t('auth.validation.specialtyMaxLength')),
  };

  const schema = role === 'doctor' ? z.object(doctorShape) : z.object(baseShape);

  return schema.refine((data) => data.password === data.confirmPassword, {
    message: t('auth.validation.passwordMismatch'),
    path: ['confirmPassword'],
  });
}
