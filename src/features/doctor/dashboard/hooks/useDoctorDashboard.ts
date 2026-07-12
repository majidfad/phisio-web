import { useQuery } from '@tanstack/react-query';

import { doctorDashboardService } from '../services/doctorDashboardService';
import { doctorDashboardQueryKeys } from './doctor-dashboard-query-keys';

export function useDoctorDashboard() {
  return useQuery({
    queryKey: doctorDashboardQueryKeys.stats(),
    queryFn: () => doctorDashboardService.getDashboard(),
  });
}
