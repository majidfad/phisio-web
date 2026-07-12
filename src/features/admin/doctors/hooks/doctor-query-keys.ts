export const doctorQueryKeys = {
  all: ['admin', 'doctors'] as const,

  lists: () => [...doctorQueryKeys.all, 'list'] as const,

  list: (isEnabled: boolean) => [...doctorQueryKeys.lists(), { isEnabled }] as const,

  details: () => [...doctorQueryKeys.all, 'detail'] as const,

  detail: (id: string) => [...doctorQueryKeys.details(), id] as const,
};
