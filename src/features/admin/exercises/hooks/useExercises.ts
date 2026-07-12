import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import {
  adminListFilterToIsEnabled,
  type AdminListFilter,
} from '@/features/admin/types/admin-list-filter';

import { exerciseService, type CreateExerciseRequest } from '../services/exerciseService';
import { exerciseQueryKeys } from './exercise-query-keys';

export function useExercises(filter: AdminListFilter = 'active') {
  const isEnabled = adminListFilterToIsEnabled(filter);

  return useQuery({
    queryKey: exerciseQueryKeys.list(isEnabled),
    queryFn: () => exerciseService.getAll(isEnabled),
  });
}

export function useCreateExercise() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ name, videoFile }: { name: string; videoFile: File }) => {
      const upload = await exerciseService.uploadVideo(name, videoFile);

      const request: CreateExerciseRequest = {
        title: name,
        description: name,
        videoUrl: upload.videoUrl,
      };

      return exerciseService.create(request);
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: exerciseQueryKeys.lists() });
    },
  });
}

export function useActivateExercise() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => exerciseService.activate(id),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: exerciseQueryKeys.lists() });
    },
  });
}
