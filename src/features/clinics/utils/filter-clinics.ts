import type { ClinicDto } from '@/features/clinics/types/clinic';

function normalizeSearchValue(value: string): string {
  return value.trim().toLowerCase();
}

export function filterClinics(clinics: ClinicDto[], query: string): ClinicDto[] {
  const normalizedQuery = normalizeSearchValue(query);

  if (!normalizedQuery) {
    return clinics;
  }

  return clinics.filter((clinic) => {
    if (normalizeSearchValue(clinic.name).includes(normalizedQuery)) {
      return true;
    }

    if (normalizeSearchValue(clinic.address).includes(normalizedQuery)) {
      return true;
    }

    if (normalizeSearchValue(clinic.clinicManagerId).includes(normalizedQuery)) {
      return true;
    }

    return clinic.phoneNumbers.some((phoneNumber) =>
      normalizeSearchValue(phoneNumber).includes(normalizedQuery),
    );
  });
}
