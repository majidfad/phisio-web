export const clinicQueryKeys = {
  all: ['clinics'] as const,

  lists: () => [...clinicQueryKeys.all, 'list'] as const,

  list: (isEnabled: boolean) => [...clinicQueryKeys.lists(), { isEnabled }] as const,

  details: () => [...clinicQueryKeys.all, 'detail'] as const,

  detail: (id: string) => [...clinicQueryKeys.details(), id] as const,

  doctors: (clinicId: string) => [...clinicQueryKeys.detail(clinicId), 'doctors'] as const,

  patients: (clinicId: string, doctorId?: string) =>
    [...clinicQueryKeys.detail(clinicId), 'patients', { doctorId: doctorId ?? null }] as const,

  adherence: (clinicId: string, doctorId?: string) =>
    [...clinicQueryKeys.detail(clinicId), 'adherence', { doctorId: doctorId ?? null }] as const,

  doctorCandidates: () => [...clinicQueryKeys.all, 'doctor-candidates'] as const,
};
