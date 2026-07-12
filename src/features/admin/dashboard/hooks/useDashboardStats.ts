import { useQuery } from '@tanstack/react-query';

import { dashboardService } from '../services/dashboardService';
import { dashboardQueryKeys } from './dashboard-query-keys';

export function useDashboardStats() {
  return useQuery({
    queryKey: dashboardQueryKeys.stats(),
    queryFn: () => dashboardService.getStats(),
  });
}
