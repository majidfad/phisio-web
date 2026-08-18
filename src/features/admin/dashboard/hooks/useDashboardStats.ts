import { useQuery } from '@tanstack/react-query';

import { useAuth } from '@/features/auth/hooks/useAuth';
import { useAuthenticatedQueryEnabled } from '@/features/auth/hooks/useAuthenticatedQueryEnabled';

import { dashboardService } from '../services/dashboardService';
import { dashboardQueryKeys } from './dashboard-query-keys';

export function useDashboardStats() {
  const { user } = useAuth();
  const enabled = useAuthenticatedQueryEnabled(user?.role === 'Admin');

  return useQuery({
    queryKey: dashboardQueryKeys.stats(),
    queryFn: () => dashboardService.getStats(),
    enabled,
  });
}
