import { useQuery } from '@tanstack/react-query';

import { exerciseCatalogService } from '@/features/exercises/services/exerciseCatalogService';

export const patientLibraryQueryKeys = {
  all: ['patient-library'] as const,
  exercises: () => [...patientLibraryQueryKeys.all, 'exercises'] as const,
};

export function usePatientExerciseLibrary() {
  return useQuery({
    queryKey: patientLibraryQueryKeys.exercises(),
    queryFn: () => exerciseCatalogService.getAll(),
  });
}
