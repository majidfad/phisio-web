export const patientExerciseQueryKeys = {
  all: ['patient-exercises'] as const,
  today: (dateKey: string) => [...patientExerciseQueryKeys.all, 'today', dateKey] as const,
  list: (dateKey: string) => [...patientExerciseQueryKeys.all, 'list', dateKey] as const,
};
