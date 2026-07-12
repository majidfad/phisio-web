import { httpClient } from '@/api/http-client';

import type { ExerciseDto } from '@/features/admin/exercises/types/exercise';

const EXERCISES_BASE = '/exercises';

export const exerciseCatalogService = {
  async getAll(): Promise<ExerciseDto[]> {
    const { data } = await httpClient.get<ExerciseDto[]>(EXERCISES_BASE);
    return data;
  },

  async getById(exerciseId: string): Promise<ExerciseDto> {
    const { data } = await httpClient.get<ExerciseDto>(`${EXERCISES_BASE}/${exerciseId}`);
    return data;
  },
};
