export const doctorExerciseQueryKeys = {
  all: ['doctor-exercises'] as const,
  list: () => [...doctorExerciseQueryKeys.all, 'list'] as const,
};
