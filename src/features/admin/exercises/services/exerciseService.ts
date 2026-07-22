import { httpClient } from '@/api/http-client';

import type { CreateExerciseRequest, ExerciseDto } from '../types/exercise';

const EXERCISES_BASE = '/admin/exercises';

export interface UploadExerciseVideoResponse {
  videoUrl: string;
  fileName: string;
}

export const exerciseService = {
  async getAll(isEnabled = true): Promise<ExerciseDto[]> {
    const { data } = await httpClient.get<ExerciseDto[]>(EXERCISES_BASE, {
      params: { isEnabled },
    });
    return data;
  },

  async uploadVideo(exerciseName: string, file: File): Promise<UploadExerciseVideoResponse> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('exerciseName', exerciseName);

    const { data } = await httpClient.post<UploadExerciseVideoResponse>(
      `${EXERCISES_BASE}/upload`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        timeout: 120_000,
      },
    );

    return data;
  },

  async create(request: CreateExerciseRequest): Promise<ExerciseDto> {
    const { data } = await httpClient.post<ExerciseDto>(EXERCISES_BASE, request);
    return data;
  },

  async update(id: string, request: CreateExerciseRequest): Promise<ExerciseDto> {
    const { data } = await httpClient.put<ExerciseDto>(`${EXERCISES_BASE}/${id}`, request);
    return data;
  },

  async activate(id: string): Promise<void> {
    await httpClient.patch(`${EXERCISES_BASE}/${id}/activate`);
  },
};
