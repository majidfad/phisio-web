export const articleQueryKeys = {
  all: ['admin-articles'] as const,
  lists: () => [...articleQueryKeys.all, 'list'] as const,
  list: (isEnabled: boolean) => [...articleQueryKeys.lists(), isEnabled] as const,
  details: () => [...articleQueryKeys.all, 'detail'] as const,
  detail: (id: string) => [...articleQueryKeys.details(), id] as const,
};
