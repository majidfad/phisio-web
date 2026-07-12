import { useQuery } from '@tanstack/react-query';

import { patientExerciseService } from '../services/patientExerciseService';

import { useUtcDateKey } from './useUtcDateKey';
import { patientExerciseQueryKeys } from './patient-exercise-query-keys';

export function usePatientTodayExercises() {
  const dateKey = useUtcDateKey();

  return useQuery({
    queryKey: patientExerciseQueryKeys.today(dateKey),
    queryFn: () => patientExerciseService.getTodayExercises(),
  });
}
