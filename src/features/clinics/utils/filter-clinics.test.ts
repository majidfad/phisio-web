import { describe, expect, it } from 'vitest';

import type { ClinicDto } from '@/features/clinics/types/clinic';
import { filterClinics } from '@/features/clinics/utils/filter-clinics';

const clinics: ClinicDto[] = [
  {
    clinicId: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
    name: 'North Clinic',
    address: 'Tehran, Valiasr',
    clinicManagerId: '7c9e6679-7425-40de-944b-e07fc1f90ae7',
    phoneNumbers: ['02112345678'],
    createdAt: '2026-08-12T10:00:00Z',
    isEnabled: true,
  },
  {
    clinicId: 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
    name: 'South Center',
    address: 'Shiraz',
    clinicManagerId: 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb',
    phoneNumbers: ['07112345678'],
    createdAt: '2026-08-12T10:00:00Z',
    isEnabled: true,
  },
];

describe('filterClinics', () => {
  it('returns all clinics when the query is empty', () => {
    expect(filterClinics(clinics, '  ')).toEqual(clinics);
  });

  it('matches clinic name', () => {
    expect(filterClinics(clinics, 'north')).toEqual([clinics[0]]);
  });

  it('matches address and phone number', () => {
    expect(filterClinics(clinics, 'shiraz')).toEqual([clinics[1]]);
    expect(filterClinics(clinics, '021123')).toEqual([clinics[0]]);
  });
});
