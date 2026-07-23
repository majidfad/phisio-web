export const doctorExerciseQueryKeys = {
  all: ['doctor-exercises'] as const,
  library: () => [...doctorExerciseQueryKeys.all, 'library'] as const,
  catalog: () => [...doctorExerciseQueryKeys.all, 'catalog'] as const,
};
