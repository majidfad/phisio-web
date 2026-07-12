import { formatPersianDate } from '@/utils/persian-format';

export function formatPatientDate(isoDate: string | undefined): string {
  return formatPersianDate(isoDate);
}

export function getPatientCreatedAt(patient: { createdAt?: string }): string | undefined {
  return patient.createdAt;
}
