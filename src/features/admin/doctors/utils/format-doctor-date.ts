import { formatPersianDate } from '@/utils/persian-format';

export function formatDoctorDate(isoDate: string | undefined): string {
  return formatPersianDate(isoDate);
}

export function getDoctorCreatedAt(doctor: { createdAt?: string }): string | undefined {
  return doctor.createdAt;
}
