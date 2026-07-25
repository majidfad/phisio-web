import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import {
  adminListFilterToIsEnabled,
  type AdminListFilter,
} from '@/features/admin/types/admin-list-filter';

import { exerciseCategoryService } from '../services/exerciseCategoryService';
import type {
  CreateExerciseCategoryRequest,
  UpdateExerciseCategoryRequest,
} from '../types/exercise-category';
import { exerciseCategoryQueryKeys } from './exercise-category-query-keys';

export function useExerciseCategories(filter: AdminListFilter = 'active') {
  const isEnabled = adminListFilterToIsEnabled(filter);

  return useQuery({
    queryKey: exerciseCategoryQueryKeys.list(isEnabled),
    queryFn: () => exerciseCategoryService.getAll(isEnabled),
  });
}

export function useCreateExerciseCategory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (request: CreateExerciseCategoryRequest) => exerciseCategoryService.create(request),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: exerciseCategoryQueryKeys.lists() });
    },
  });
}

export function useUpdateExerciseCategory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, request }: { id: string; request: UpdateExerciseCategoryRequest }) =>
      exerciseCategoryService.update(id, request),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: exerciseCategoryQueryKeys.lists() });
    },
  });
}

export function useDeleteExerciseCategory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => exerciseCategoryService.delete(id),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: exerciseCategoryQueryKeys.lists() });
    },
  });
}

export function useActivateExerciseCategory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => exerciseCategoryService.activate(id),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: exerciseCategoryQueryKeys.lists() });
    },
  });
}
