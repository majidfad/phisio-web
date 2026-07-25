import { z } from 'zod';

export function createExerciseCategoryFormSchema(t: (key: string) => string) {
  return z.object({
    nameFa: z
      .string()
      .trim()
      .min(1, t('admin.exerciseCategories.validation.nameFaRequired'))
      .max(100, t('admin.exerciseCategories.validation.nameMax')),
    nameEn: z
      .string()
      .trim()
      .min(1, t('admin.exerciseCategories.validation.nameEnRequired'))
      .max(100, t('admin.exerciseCategories.validation.nameMax')),
    sortOrder: z.number().int().min(0),
  });
}

export type ExerciseCategoryFormSchemaValues = z.infer<
  ReturnType<typeof createExerciseCategoryFormSchema>
>;
