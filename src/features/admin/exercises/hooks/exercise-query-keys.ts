export const exerciseQueryKeys = {
  all: ['admin', 'exercises'] as const,
  lists: () => [...exerciseQueryKeys.all, 'list'] as const,
  list: (isEnabled: boolean) => [...exerciseQueryKeys.lists(), { isEnabled }] as const,
};
