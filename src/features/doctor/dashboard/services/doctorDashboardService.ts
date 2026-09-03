import { httpClient } from '@/api/http-client';

import type { DoctorDashboardDto } from '../types/dashboard';

const DASHBOARD_BASE = '/doctor/dashboard';

export const doctorDashboardService = {
  async getDashboard(clinicId?: string): Promise<DoctorDashboardDto> {
    const { data } = clinicId
      ? await httpClient.get<DoctorDashboardDto>(DASHBOARD_BASE, { params: { clinicId } })
      : await httpClient.get<DoctorDashboardDto>(DASHBOARD_BASE);
    return data;
  },
};
