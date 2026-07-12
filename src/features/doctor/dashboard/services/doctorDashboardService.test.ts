import { beforeEach, describe, expect, it, vi } from 'vitest';

import { httpClient } from '@/api/http-client';
import { doctorDashboardService } from '@/features/doctor/dashboard/services/doctorDashboardService';

vi.mock('@/api/http-client', () => ({
  httpClient: {
    get: vi.fn(),
  },
}));

describe('doctorDashboardService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('fetches dashboard data from doctor dashboard endpoint', async () => {
    const dashboard = {
      patientsCount: 2,
      recentPatients: [],
    };

    vi.mocked(httpClient.get).mockResolvedValue({ data: dashboard });

    await expect(doctorDashboardService.getDashboard()).resolves.toEqual(dashboard);
    expect(httpClient.get).toHaveBeenCalledWith('/doctor/dashboard');
  });
});
