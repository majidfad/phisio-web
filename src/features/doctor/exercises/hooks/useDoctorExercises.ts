import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { ExerciseMediaType } from '@/features/exercises/types';

import { doctorExerciseService } from '../services/doctorExerciseService';
import type { CreateDoctorExerciseRequest } from '../types/doctor-exercise';

import { doctorExerciseQueryKeys } from './doctor-exercise-query-keys';

function resolveMediaType(request: CreateDoctorExerciseRequest, videoFile?: File) {
  if (!videoFile) {
    return request.mediaType;
  }

  const isGif = videoFile.type === 'image/gif' || videoFile.name.toLowerCase().endsWith('.gif');
  return isGif ? ExerciseMediaType.Gif : ExerciseMediaType.UploadedVideo;
}

export function useDoctorExerciseLibrary() {
  return useQuery({
    queryKey: doctorExerciseQueryKeys.library(),
    queryFn: () => doctorExerciseService.getLibrary(),
  });
}

export function useDoctorExerciseCatalog(enabled = true) {
  return useQuery({
    queryKey: doctorExerciseQueryKeys.catalog(),
    queryFn: () => doctorExerciseService.getCatalog(),
    enabled,
  });
}

function useInvalidateDoctorExercises() {
  const queryClient = useQueryClient();
  return () => queryClient.invalidateQueries({ queryKey: doctorExerciseQueryKeys.all });
}

export function useSaveDoctorExercise() {
  const invalidate = useInvalidateDoctorExercises();
  return useMutation({
    mutationFn: async ({
      id,
      request,
      videoFile,
    }: {
      id?: string;
      request: CreateDoctorExerciseRequest;
      videoFile?: File;
    }) => {
      const videoUrl = videoFile
        ? (await doctorExerciseService.uploadVideo(request.title, videoFile)).videoUrl
        : request.videoUrl;
      const mediaType = resolveMediaType(request, videoFile);
      return id
        ? doctorExerciseService.update(id, { ...request, videoUrl, mediaType })
        : doctorExerciseService.create({ ...request, videoUrl, mediaType });
    },
    onSuccess: invalidate,
  });
}

export function useArchiveDoctorExercise() {
  const invalidate = useInvalidateDoctorExercises();
  return useMutation({
    mutationFn: doctorExerciseService.remove,
    onSuccess: invalidate,
  });
}
