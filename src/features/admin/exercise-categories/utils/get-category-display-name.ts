import type { ExerciseCategorySummaryDto } from '../types/exercise-category';

export function getCategoryDisplayName(
  category: Pick<ExerciseCategorySummaryDto, 'nameFa' | 'nameEn'>,
  language: string,
): string {
  return language.startsWith('fa') ? category.nameFa : category.nameEn;
}
