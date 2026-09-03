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
      pendingRequestsCount: 0,
      assignedExercisesCount: 0,
      completedExercisesCount: 0,
      feedbackCount: 0,
      recentPatients: [],
    };

    vi.mocked(httpClient.get).mockResolvedValue({ data: dashboard });

    await expect(doctorDashboardService.getDashboard()).resolves.toEqual(dashboard);
    expect(httpClient.get).toHaveBeenCalledWith('/doctor/dashboard');
  });

  it('fetches dashboard data filtered by clinicId', async () => {
    const clinicId = '11111111-1111-1111-1111-111111111111';
    const dashboard = {
      patientsCount: 1,
      pendingRequestsCount: 0,
      assignedExercisesCount: 0,
      completedExercisesCount: 0,
      feedbackCount: 0,
      recentPatients: [],
    };

    vi.mocked(httpClient.get).mockResolvedValue({ data: dashboard });

    await expect(doctorDashboardService.getDashboard(clinicId)).resolves.toEqual(dashboard);
    expect(httpClient.get).toHaveBeenCalledWith('/doctor/dashboard', { params: { clinicId } });
  });
});
