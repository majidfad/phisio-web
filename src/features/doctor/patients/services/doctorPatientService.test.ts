import { beforeEach, describe, expect, it, vi } from 'vitest';

import { httpClient } from '@/api/http-client';
import { doctorPatientService } from '@/features/doctor/patients/services/doctorPatientService';

vi.mock('@/api/http-client', () => ({
  httpClient: {
    get: vi.fn(),
    post: vi.fn(),
    delete: vi.fn(),
  },
}));

describe('doctorPatientService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('fetches patient exercise plan from doctor patients endpoint', async () => {
    const patientId = '7c9e6679-7425-40de-944b-e07fc1f90ae7';
    const exercises = [
      {
        exerciseId: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
        exerciseName: 'Hamstring Stretch',
        videoUrl: 'https://example.com/hamstring.mp4',
        assignedAt: '2024-01-15T10:00:00Z',
      },
    ];

    vi.mocked(httpClient.get).mockResolvedValue({ data: exercises });

    await expect(doctorPatientService.getPatientExercises(patientId)).resolves.toEqual(exercises);
    expect(httpClient.get).toHaveBeenCalledWith(`/doctor/patients/${patientId}/exercises`);
  });

  it('assigns exercises through doctor patients endpoint', async () => {
    const patientId = '7c9e6679-7425-40de-944b-e07fc1f90ae7';
    const request = {
      exerciseIds: ['3fa85f64-5717-4562-b3fc-2c963f66afa6'],
      scheduledDates: ['2026-06-15'],
    };
    const response = { assignedCount: 1 };

    vi.mocked(httpClient.post).mockResolvedValue({ data: response });

    await expect(doctorPatientService.assignExercises(patientId, request)).resolves.toEqual(
      response,
    );
    expect(httpClient.post).toHaveBeenCalledWith(
      `/doctor/patients/${patientId}/exercises`,
      request,
    );
  });

  it('fetches patient exercise history from doctor patients endpoint', async () => {
    const patientId = '7c9e6679-7425-40de-944b-e07fc1f90ae7';
    const history = {
      patient: {
        patientId,
        patientName: 'Alice Patient',
        phoneNumber: '+15551111111',
      },
      summary: {
        assignedExerciseCount: 2,
        completedDaysCount: 1,
        missedDaysCount: 0,
        adherencePercentage: 100,
      },
      dailyHistory: [],
      totalDays: 0,
      page: 1,
      pageSize: 10,
    };

    vi.mocked(httpClient.get).mockResolvedValue({ data: history });

    await expect(doctorPatientService.getExerciseHistory(patientId)).resolves.toEqual(history);
    expect(httpClient.get).toHaveBeenCalledWith(`/doctor/patients/${patientId}/exercise-history`, {
      params: { page: 1, pageSize: 10 },
    });
  });
});
