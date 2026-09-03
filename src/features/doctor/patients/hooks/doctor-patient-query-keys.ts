export const doctorPatientQueryKeys = {
  all: ['doctor-patients'] as const,
  lists: () => [...doctorPatientQueryKeys.all, 'list'] as const,
  list: (clinicId?: string | null) =>
    [...doctorPatientQueryKeys.lists(), clinicId ?? 'all'] as const,
  requests: (clinicId?: string | null) =>
    [...doctorPatientQueryKeys.all, 'requests', clinicId ?? 'all'] as const,
  clinics: () => [...doctorPatientQueryKeys.all, 'clinics'] as const,
  exercises: (patientId: string, clinicId?: string | null) =>
    [...doctorPatientQueryKeys.all, 'exercises', patientId, clinicId ?? 'any'] as const,
  exerciseHistory: (patientId: string, clinicId?: string | null) =>
    [...doctorPatientQueryKeys.all, 'exercise-history', patientId, clinicId ?? 'any'] as const,
  exerciseHistoryPage: (
    patientId: string,
    page: number,
    pageSize: number,
    clinicId?: string | null,
  ) => [...doctorPatientQueryKeys.exerciseHistory(patientId, clinicId), page, pageSize] as const,
  overview: (patientId: string, clinicId?: string | null) =>
    [...doctorPatientQueryKeys.all, 'overview', patientId, clinicId ?? 'any'] as const,
  programs: (patientId: string, clinicId?: string | null) =>
    [...doctorPatientQueryKeys.all, 'programs', patientId, clinicId ?? 'any'] as const,
  exerciseStats: (patientId: string, clinicId?: string | null) =>
    [...doctorPatientQueryKeys.all, 'exercise-stats', patientId, clinicId ?? 'any'] as const,
  exerciseStatsRange: (patientId: string, from: string, to: string, clinicId?: string | null) =>
    [...doctorPatientQueryKeys.exerciseStats(patientId, clinicId), from, to] as const,
};

export const exerciseCatalogQueryKeys = {
  all: ['exercise-catalog'] as const,
  list: () => [...exerciseCatalogQueryKeys.all, 'list'] as const,
};
