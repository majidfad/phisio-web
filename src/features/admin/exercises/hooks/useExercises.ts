import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { ExerciseMediaType } from '@/features/exercises/types';
import {
  adminListFilterToIsEnabled,
  type AdminListFilter,
} from '@/features/admin/types/admin-list-filter';

import { exerciseService } from '../services/exerciseService';
import type { CreateExerciseRequest } from '../types/exercise';
import { exerciseQueryKeys } from './exercise-query-keys';

function resolveMediaType(request: CreateExerciseRequest, videoFile?: File) {
  if (!videoFile) {
    return request.mediaType;
  }

  const isGif = videoFile.type === 'image/gif' || videoFile.name.toLowerCase().endsWith('.gif');
  return isGif ? ExerciseMediaType.Gif : ExerciseMediaType.UploadedVideo;
}

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
    mutationFn: async ({
      request,
      videoFile,
    }: {
      request: CreateExerciseRequest;
      videoFile?: File;
    }) =>
      exerciseService.create({
        ...request,
        mediaType: resolveMediaType(request, videoFile),
        videoUrl: videoFile
          ? (await exerciseService.uploadVideo(request.title, videoFile)).videoUrl
          : request.videoUrl,
      }),

    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: exerciseQueryKeys.lists() });
    },
  });
}

export function useUpdateExercise() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      id,
      request,
      videoFile,
    }: {
      id: string;
      request: CreateExerciseRequest;
      videoFile?: File;
    }) =>
      exerciseService.update(id, {
        ...request,
        mediaType: resolveMediaType(request, videoFile),
        videoUrl: videoFile
          ? (await exerciseService.uploadVideo(request.title, videoFile)).videoUrl
          : request.videoUrl,
      }),

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
