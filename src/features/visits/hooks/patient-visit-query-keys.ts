export const patientVisitQueryKeys = {
  all: ['patient-visits'] as const,

  recentForPatient: (patientId: string, clinicId?: string | null, doctorId?: string | null) =>
    [
      ...patientVisitQueryKeys.all,
      'recent',
      { patientId, clinicId: clinicId ?? null, doctorId: doctorId ?? null },
    ] as const,

  historyForPatient: (
    patientId: string,
    clinicId?: string | null,
    doctorId?: string | null,
    page: number = 1,
    pageSize: number = 10,
    search?: string | null,
  ) =>
    [
      ...patientVisitQueryKeys.all,
      'history',
      {
        patientId,
        clinicId: clinicId ?? null,
        doctorId: doctorId ?? null,
        page,
        pageSize,
        search: search ?? null,
      },
    ] as const,

  myHistory: (
    clinicId?: string | null,
    doctorId?: string | null,
    page: number = 1,
    pageSize: number = 10,
    search?: string | null,
  ) =>
    [
      ...patientVisitQueryKeys.all,
      'mine',
      {
        clinicId: clinicId ?? null,
        doctorId: doctorId ?? null,
        page,
        pageSize,
        search: search ?? null,
      },
    ] as const,

  myRecent: () => [...patientVisitQueryKeys.all, 'mine-recent'] as const,

  doctorVisits: (
    doctorId: string,
    clinicId?: string | null,
    page: number = 1,
    pageSize: number = 10,
    search?: string | null,
  ) =>
    [
      ...patientVisitQueryKeys.all,
      'doctor',
      {
        doctorId,
        clinicId: clinicId ?? null,
        page,
        pageSize,
        search: search ?? null,
      },
    ] as const,

  clinicVisits: (
    clinicId: string,
    doctorId?: string | null,
    page: number = 1,
    pageSize: number = 10,
    search?: string | null,
  ) =>
    [
      ...patientVisitQueryKeys.all,
      'clinic',
      {
        clinicId,
        doctorId: doctorId ?? null,
        page,
        pageSize,
        search: search ?? null,
      },
    ] as const,
};
