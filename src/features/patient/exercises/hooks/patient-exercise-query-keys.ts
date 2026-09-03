export const patientExerciseQueryKeys = {
  all: ['patient-exercises'] as const,
  today: (dateKey: string, doctorId: string | null, clinicId: string | null) =>
    [...patientExerciseQueryKeys.all, 'today', dateKey, doctorId, clinicId] as const,
  list: (dateKey: string, doctorId: string | null, clinicId: string | null) =>
    [...patientExerciseQueryKeys.all, 'list', dateKey, doctorId, clinicId] as const,
};
