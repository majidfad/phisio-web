import type { TFunction } from 'i18next';
import { z } from 'zod';

export const MAX_EXERCISE_VIDEO_SIZE_BYTES = 52_428_800;

const mp4MimeType = 'video/mp4';

export function createExerciseFormSchema(t: TFunction) {
  return z.object({
    name: z
      .string()
      .trim()
      .min(1, t('admin.exercises.validation.nameRequired'))
      .max(200, t('admin.exercises.validation.nameMaxLength')),
    video: z
      .custom<FileList>(
        (value) =>
          typeof value === 'object' &&
          value !== null &&
          'length' in value &&
          typeof (value as FileList).length === 'number' &&
          (value as FileList).length > 0,
        { message: t('admin.exercises.validation.videoRequired') },
      )
      .refine((files) => files[0]?.type === mp4MimeType, {
        message: t('admin.exercises.validation.videoMp4Only'),
      })
      .refine((files) => (files[0]?.size ?? 0) <= MAX_EXERCISE_VIDEO_SIZE_BYTES, {
        message: t('admin.exercises.validation.videoMaxSize'),
      }),
  });
}

export type ExerciseFormSchemaValues = z.infer<ReturnType<typeof createExerciseFormSchema>>;
