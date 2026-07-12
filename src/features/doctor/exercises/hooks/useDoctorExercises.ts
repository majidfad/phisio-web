import { useQuery } from '@tanstack/react-query';

import { doctorExerciseService } from '../services/doctorExerciseService';

import { doctorExerciseQueryKeys } from './doctor-exercise-query-keys';

export function useDoctorExercises() {
  return useQuery({
    queryKey: doctorExerciseQueryKeys.list(),
    queryFn: () => doctorExerciseService.getAll(),
  });
}
