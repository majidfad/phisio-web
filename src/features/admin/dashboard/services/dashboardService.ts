import { httpClient } from '@/api/http-client';

import type { AdminDashboardStatsDto } from '@/features/admin/types/dashboard';

const DASHBOARD_BASE = '/admin/dashboard';

export const dashboardService = {
  async getStats(): Promise<AdminDashboardStatsDto> {
    const { data } = await httpClient.get<AdminDashboardStatsDto>(`${DASHBOARD_BASE}/stats`);
    return data;
  },
};
