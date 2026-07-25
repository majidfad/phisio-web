import { httpClient } from '@/api/http-client';

import type {
  CreateExerciseCategoryRequest,
  ExerciseCategoryDto,
  UpdateExerciseCategoryRequest,
} from '../types/exercise-category';

const CATEGORIES_BASE = '/admin/exercise-categories';

export const exerciseCategoryService = {
  async getAll(isEnabled = true): Promise<ExerciseCategoryDto[]> {
    const { data } = await httpClient.get<ExerciseCategoryDto[]>(CATEGORIES_BASE, {
      params: { isEnabled },
    });
    return data;
  },

  async create(request: CreateExerciseCategoryRequest): Promise<ExerciseCategoryDto> {
    const { data } = await httpClient.post<ExerciseCategoryDto>(CATEGORIES_BASE, request);
    return data;
  },

  async update(id: string, request: UpdateExerciseCategoryRequest): Promise<ExerciseCategoryDto> {
    const { data } = await httpClient.put<ExerciseCategoryDto>(`${CATEGORIES_BASE}/${id}`, request);
    return data;
  },

  async delete(id: string): Promise<void> {
    await httpClient.delete(`${CATEGORIES_BASE}/${id}`);
  },

  async activate(id: string): Promise<void> {
    await httpClient.patch(`${CATEGORIES_BASE}/${id}/activate`);
  },
};
