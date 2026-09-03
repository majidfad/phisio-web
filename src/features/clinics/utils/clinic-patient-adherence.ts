import type { ClinicPatientDto } from '@/features/clinics/types/clinic';

export type ClinicPatientTableRow = ClinicPatientDto & {
  adherencePercentage?: number | null;
};

export function patientCareKey(patient: Pick<ClinicPatientDto, 'patientId' | 'doctorId'>): string {
  return `${patient.patientId}-${patient.doctorId}`;
}

export function mergePatientsWithAdherence(
  patients: ClinicPatientDto[],
  adherenceByKey: Record<string, number>,
): ClinicPatientTableRow[] {
  return patients.map((patient) => ({
    ...patient,
    adherencePercentage: adherenceByKey[patientCareKey(patient)] ?? null,
  }));
}

export function toAdherenceLookup(
  items: Array<{ patientId: string; doctorId: string; adherencePercentage: number }>,
): Record<string, number> {
  return Object.fromEntries(
    items.map((item) => [`${item.patientId}-${item.doctorId}`, item.adherencePercentage]),
  );
}
