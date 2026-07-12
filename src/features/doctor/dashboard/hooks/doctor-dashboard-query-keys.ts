export const doctorDashboardQueryKeys = {
  all: ['doctor', 'dashboard'] as const,
  stats: () => [...doctorDashboardQueryKeys.all, 'stats'] as const,
};
