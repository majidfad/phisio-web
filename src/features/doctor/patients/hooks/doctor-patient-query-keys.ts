export const doctorPatientQueryKeys = {
  all: ['doctor-patients'] as const,
  lists: () => [...doctorPatientQueryKeys.all, 'list'] as const,
  list: () => [...doctorPatientQueryKeys.lists()] as const,
  requests: () => [...doctorPatientQueryKeys.all, 'requests'] as const,
  exercises: (patientId: string) =>
    [...doctorPatientQueryKeys.all, 'exercises', patientId] as const,
  exerciseHistory: (patientId: string) =>
    [...doctorPatientQueryKeys.all, 'exercise-history', patientId] as const,
  overview: (patientId: string) => [...doctorPatientQueryKeys.all, 'overview', patientId] as const,
  programs: (patientId: string) => [...doctorPatientQueryKeys.all, 'programs', patientId] as const,
};

export const exerciseCatalogQueryKeys = {
  all: ['exercise-catalog'] as const,
  list: () => [...exerciseCatalogQueryKeys.all, 'list'] as const,
};
