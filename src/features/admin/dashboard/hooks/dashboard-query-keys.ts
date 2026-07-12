export const dashboardQueryKeys = {
  all: ['admin', 'dashboard'] as const,
  stats: () => [...dashboardQueryKeys.all, 'stats'] as const,
};
