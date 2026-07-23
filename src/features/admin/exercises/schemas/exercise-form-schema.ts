import type { TFunction } from 'i18next';
import { z } from 'zod';

export const MAX_EXERCISE_VIDEO_SIZE_BYTES = 52_428_800;

const supportedUploadMimeTypes = ['video/mp4', 'image/gif'];

export type ExerciseMediaMode = 'upload' | 'url' | 'gif';

export function createExerciseFormSchema(t: TFunction) {
  return z
    .object({
      title: z
        .string()
        .trim()
        .min(1, t('admin.exercises.validation.nameRequired'))
        .max(200, t('admin.exercises.validation.nameMaxLength')),
      description: z.string().trim().max(2_000),
      instructions: z.string().trim().max(4_000),
      bodyRegion: z.union([
        z.literal(1),
        z.literal(2),
        z.literal(3),
        z.literal(4),
        z.literal(5),
        z.literal(6),
        z.literal(7),
        z.literal(8),
        z.literal(9),
      ]),
      equipment: z.union([
        z.literal(1),
        z.literal(2),
        z.literal(3),
        z.literal(4),
        z.literal(5),
        z.literal(6),
      ]),
      difficulty: z.union([z.literal(1), z.literal(2), z.literal(3)]),
      mediaMode: z.enum(['upload', 'url', 'gif']),
      mediaType: z.union([z.literal(1), z.literal(2), z.literal(3), z.literal(4), z.literal(5)]),
      videoUrl: z.string().trim().url(t('admin.exercises.validation.urlInvalid')).or(z.literal('')),
      video: z.custom<FileList | undefined>(),
    })
    .superRefine((value, context) => {
      const file = value.video?.[0];
      if (value.mediaMode === 'upload' && !file && !value.videoUrl) {
        context.addIssue({
          code: 'custom',
          path: ['video'],
          message: t('admin.exercises.validation.videoRequired'),
        });
      }
      if (file && !supportedUploadMimeTypes.includes(file.type)) {
        context.addIssue({
          code: 'custom',
          path: ['video'],
          message: t('admin.exercises.validation.videoMp4Only'),
        });
      }
      if (file && file.size > MAX_EXERCISE_VIDEO_SIZE_BYTES) {
        context.addIssue({
          code: 'custom',
          path: ['video'],
          message: t('admin.exercises.validation.videoMaxSize'),
        });
      }
      if (value.mediaMode !== 'upload' && !value.videoUrl) {
        context.addIssue({
          code: 'custom',
          path: ['videoUrl'],
          message: t('admin.exercises.validation.videoRequired'),
        });
      }
    });
}

export type ExerciseFormSchemaValues = z.infer<ReturnType<typeof createExerciseFormSchema>>;
