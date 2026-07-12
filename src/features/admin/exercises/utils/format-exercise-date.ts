import { formatPersianDate } from '@/utils/persian-format';

export function formatExerciseDate(isoDate: string | undefined): string {
  return formatPersianDate(isoDate);
}
