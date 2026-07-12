import { httpClient } from '@/api/http-client';

import type { DoctorDashboardDto } from '../types/dashboard';

const DASHBOARD_BASE = '/doctor/dashboard';

export const doctorDashboardService = {
  async getDashboard(): Promise<DoctorDashboardDto> {
    const { data } = await httpClient.get<DoctorDashboardDto>(DASHBOARD_BASE);
    return data;
  },
};
