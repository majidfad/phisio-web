import type { TFunction } from 'i18next';
import { z } from 'zod';

const phoneNumberPattern = /^\+?[0-9\s\-()]+$/;

export type RegistrationRole = 'patient' | 'doctor';

export interface RegisterClinicPhoneField {
  value: string;
}

export interface RegisterFormValues {
  name: string;
  phoneNumber: string;
  password: string;
  confirmPassword: string;
  medicalLicenseNumber?: string;
  specialty?: string;
  clinicPhoneNumbers?: RegisterClinicPhoneField[];
  newClinicName?: string;
  newClinicAddress?: string;
  managerIsThisDoctor?: boolean;
}

function createClinicPhoneFieldSchema(t: TFunction) {
  return z.object({
    value: z
      .string()
      .trim()
      .min(1, t('auth.validation.clinicPhoneRequired'))
      .max(20, t('auth.validation.clinicPhoneMaxLength'))
      .regex(phoneNumberPattern, t('auth.validation.clinicPhoneInvalid')),
  });
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
    clinicPhoneNumbers: z
      .array(createClinicPhoneFieldSchema(t))
      .min(1, t('auth.validation.clinicPhoneRequired')),
    newClinicName: z.string(),
    newClinicAddress: z.string(),
    managerIsThisDoctor: z.boolean(),
  };

  const schema = role === 'doctor' ? z.object(doctorShape) : z.object(baseShape);

  return schema.refine((data) => data.password === data.confirmPassword, {
    message: t('auth.validation.passwordMismatch'),
    path: ['confirmPassword'],
  });
}

export function createRegisterNewClinicStepSchema(t: TFunction) {
  return z
    .object({
      newClinicName: z
        .string()
        .trim()
        .min(1, t('auth.validation.newClinicNameRequired'))
        .max(200, t('auth.validation.newClinicNameMaxLength')),
      newClinicAddress: z
        .string()
        .trim()
        .min(1, t('auth.validation.newClinicAddressRequired'))
        .max(500, t('auth.validation.newClinicAddressMaxLength')),
      clinicPhoneNumbers: z
        .array(createClinicPhoneFieldSchema(t))
        .min(1, t('auth.validation.clinicPhoneRequired')),
      managerIsThisDoctor: z.boolean(),
    })
    .superRefine((values, context) => {
      if (values.managerIsThisDoctor) {
        return;
      }

      context.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['managerIsThisDoctor'],
        message: t('auth.validation.managerMustBeThisDoctor'),
      });
    });
}

export function toRegisterClinicPhonePayload(
  phoneNumbers: RegisterClinicPhoneField[],
): string[] {
  return phoneNumbers.map((item) => item.value.trim()).filter((value) => value.length > 0);
}
