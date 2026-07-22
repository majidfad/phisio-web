import { useQuery } from '@tanstack/react-query';

import { useActiveDoctor } from '@/features/patient/doctors/hooks/useActiveDoctor';

import { patientExerciseService } from '../services/patientExerciseService';

import { useUtcDateKey } from './useUtcDateKey';
import { patientExerciseQueryKeys } from './patient-exercise-query-keys';

export function usePatientTodayExercises() {
  const dateKey = useUtcDateKey();
  const { selectedDoctorId, approvedDoctors, isLoading: isDoctorsLoading } = useActiveDoctor();
  const doctorId = approvedDoctors.length > 0 ? selectedDoctorId : null;

  return useQuery({
    queryKey: patientExerciseQueryKeys.today(dateKey, doctorId),
    queryFn: () => patientExerciseService.getTodayExercises(doctorId),
    enabled: !isDoctorsLoading,
  });
}
