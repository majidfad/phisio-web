import { describe, expect, it } from 'vitest';

import i18n from '@/i18n';
import {
  createExerciseFormSchema,
  MAX_EXERCISE_VIDEO_SIZE_BYTES,
} from '@/features/admin/exercises/schemas/exercise-form-schema';

const schema = createExerciseFormSchema(i18n.t.bind(i18n));

function createFileList(...files: Array<Pick<File, 'name' | 'type' | 'size'>>): FileList {
  const list = {
    length: files.length,
    item: (index: number) => (files[index] as File | undefined) ?? null,
    ...Object.fromEntries(files.map((file, index) => [index, file])),
  } as FileList;

  return list;
}

describe('createExerciseFormSchema', () => {
  it('accepts valid exercise data', () => {
    const file = { name: 'stretch.mp4', type: 'video/mp4', size: 1024 };
    const result = schema.safeParse({
      title: 'Hamstring Stretch',
      description: 'A gentle stretch.',
      instructions: 'Move slowly.',
      bodyRegion: 5,
      equipment: 1,
      difficulty: 1,
      mediaMode: 'upload',
      mediaType: 1,
      videoUrl: '',
      video: createFileList(file),
    });

    expect(result.success).toBe(true);
  });

  it('rejects missing video', () => {
    const result = schema.safeParse({
      title: 'Hamstring Stretch',
      description: '',
      instructions: '',
      bodyRegion: 5,
      equipment: 1,
      difficulty: 1,
      mediaMode: 'upload',
      mediaType: 1,
      videoUrl: '',
      video: createFileList(),
    });

    expect(result.success).toBe(false);
  });

  it('rejects non-mp4 files', () => {
    const file = { name: 'stretch.webm', type: 'video/webm', size: 1024 };
    const result = schema.safeParse({
      title: 'Hamstring Stretch',
      description: '',
      instructions: '',
      bodyRegion: 5,
      equipment: 1,
      difficulty: 1,
      mediaMode: 'upload',
      mediaType: 1,
      videoUrl: '',
      video: createFileList(file),
    });

    expect(result.success).toBe(false);
  });

  it('rejects files larger than 50MB', () => {
    const file = {
      name: 'stretch.mp4',
      type: 'video/mp4',
      size: MAX_EXERCISE_VIDEO_SIZE_BYTES + 1,
    };

    const result = schema.safeParse({
      title: 'Hamstring Stretch',
      description: '',
      instructions: '',
      bodyRegion: 5,
      equipment: 1,
      difficulty: 1,
      mediaMode: 'upload',
      mediaType: 1,
      videoUrl: '',
      video: createFileList(file),
    });

    expect(result.success).toBe(false);
  });
});
