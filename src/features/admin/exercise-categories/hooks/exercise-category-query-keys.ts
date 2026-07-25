export const exerciseCategoryQueryKeys = {
  all: ['admin-exercise-categories'] as const,
  lists: () => [...exerciseCategoryQueryKeys.all, 'list'] as const,
  list: (isEnabled: boolean) => [...exerciseCategoryQueryKeys.lists(), isEnabled] as const,
};
