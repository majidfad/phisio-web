export const doctorDashboardQueryKeys = {
  all: ['doctor', 'dashboard'] as const,
  stats: (clinicId?: string | null) =>
    [...doctorDashboardQueryKeys.all, 'stats', clinicId ?? 'all'] as const,
};
