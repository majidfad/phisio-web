import { describe, expect, it } from 'vitest';

import i18n from '@/i18n';
import {
  createClinicFormSchema,
  toClinicPhonePayload,
} from '@/features/clinics/schemas/clinic-form-schema';

const managerId = '7c9e6679-7425-40de-944b-e07fc1f90ae7';

describe('createClinicFormSchema', () => {
  it('accepts valid clinic data for clinic managers', () => {
    const schema = createClinicFormSchema(i18n.t.bind(i18n), false);
    const result = schema.safeParse({
      name: 'North Clinic',
      address: 'Tehran, Valiasr',
      phoneNumbers: [{ value: '02112345678' }],
    });

    expect(result.success).toBe(true);
  });

  it('requires clinic manager id for admin create', () => {
    const schema = createClinicFormSchema(i18n.t.bind(i18n), true);
    const result = schema.safeParse({
      name: 'North Clinic',
      address: 'Tehran, Valiasr',
      phoneNumbers: [{ value: '' }],
      clinicManagerId: '',
    });

    expect(result.success).toBe(false);
  });

  it('accepts a valid clinic manager id for admin create', () => {
    const schema = createClinicFormSchema(i18n.t.bind(i18n), true);
    const result = schema.safeParse({
      name: 'North Clinic',
      address: 'Tehran, Valiasr',
      phoneNumbers: [{ value: '+982112345678' }],
      clinicManagerId: managerId,
    });

    expect(result.success).toBe(true);
  });

  it('rejects invalid phone numbers', () => {
    const schema = createClinicFormSchema(i18n.t.bind(i18n), false);
    const result = schema.safeParse({
      name: 'North Clinic',
      address: 'Tehran, Valiasr',
      phoneNumbers: [{ value: 'abc' }],
    });

    expect(result.success).toBe(false);
  });

  it('requires at least one non-empty clinic phone number', () => {
    const schema = createClinicFormSchema(i18n.t.bind(i18n), false);

    expect(
      schema.safeParse({
        name: 'North Clinic',
        address: 'Tehran, Valiasr',
        phoneNumbers: [],
      }).success,
    ).toBe(false);

    expect(
      schema.safeParse({
        name: 'North Clinic',
        address: 'Tehran, Valiasr',
        phoneNumbers: [{ value: '   ' }],
      }).success,
    ).toBe(false);
  });
});

describe('toClinicPhonePayload', () => {
  it('trims and drops empty phone numbers', () => {
    expect(toClinicPhonePayload([{ value: ' 0211 ' }, { value: '' }, { value: '021222' }])).toEqual(
      ['0211', '021222'],
    );
  });
});
