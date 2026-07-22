export const patientExerciseQueryKeys = {
  all: ['patient-exercises'] as const,
  today: (dateKey: string, doctorId: string | null) =>
    [...patientExerciseQueryKeys.all, 'today', dateKey, doctorId] as const,
  list: (dateKey: string, doctorId: string | null) =>
    [...patientExerciseQueryKeys.all, 'list', dateKey, doctorId] as const,
};
