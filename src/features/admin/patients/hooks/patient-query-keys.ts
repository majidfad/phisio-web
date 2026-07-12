export const patientQueryKeys = {
  all: ['patients'] as const,

  lists: () => [...patientQueryKeys.all, 'list'] as const,

  list: (isEnabled: boolean) => [...patientQueryKeys.lists(), { isEnabled }] as const,

  details: () => [...patientQueryKeys.all, 'detail'] as const,

  detail: (id: string) => [...patientQueryKeys.details(), id] as const,
};
