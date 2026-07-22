export const doctorExerciseQueryKeys = {
  all: ['doctor-exercises'] as const,
  list: (scope: string) => [...doctorExerciseQueryKeys.all, 'list', scope] as const,
};
