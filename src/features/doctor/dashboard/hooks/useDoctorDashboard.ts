import { useQuery } from '@tanstack/react-query';

import { doctorDashboardService } from '../services/doctorDashboardService';
import { doctorDashboardQueryKeys } from './doctor-dashboard-query-keys';

export function useDoctorDashboard(clinicId?: string | null) {
  return useQuery({
    queryKey: doctorDashboardQueryKeys.stats(clinicId),
    queryFn: () => doctorDashboardService.getDashboard(clinicId ?? undefined),
  });
}
