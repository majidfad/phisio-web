import { useQuery } from '@tanstack/react-query';

import { useActiveDoctor } from '@/features/patient/doctors/hooks/useActiveDoctor';

import { patientExerciseService } from '../services/patientExerciseService';

import { useUtcDateKey } from './useUtcDateKey';
import { patientExerciseQueryKeys } from './patient-exercise-query-keys';

export function usePatientTodayExercises() {
  const dateKey = useUtcDateKey();
  const {
    selectedDoctorId,
    selectedClinicId,
    approvedDoctors,
    isLoading: isDoctorsLoading,
  } = useActiveDoctor();
  const doctorId = approvedDoctors.length > 0 ? selectedDoctorId : null;
  const clinicId = approvedDoctors.length > 0 ? selectedClinicId : null;

  return useQuery({
    queryKey: patientExerciseQueryKeys.today(dateKey, doctorId, clinicId),
    queryFn: () => patientExerciseService.getTodayExercises(doctorId, clinicId),
    enabled: !isDoctorsLoading,
  });
}
