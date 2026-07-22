import { beforeEach, describe, expect, it, vi } from 'vitest';

import { httpClient } from '@/api/http-client';
import { patientExerciseService } from '@/features/patient/exercises/services/patientExerciseService';

vi.mock('@/api/http-client', () => ({
  httpClient: {
    get: vi.fn(),
    post: vi.fn(),
  },
}));

describe('patientExerciseService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('fetches today exercises from patient exercises today endpoint', async () => {
    const response = {
      doctorGroups: [
        {
          doctorName: 'دکتر رحمانی',
          exercises: [
            {
              userExerciseId: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
              exerciseId: '7c9e6679-7425-40de-944b-e07fc1f90ae7',
              title: 'کشش گردن',
              videoUrl: '/uploads/exercises/neck.mp4',
              scheduledDate: '2026-06-27',
              completedToday: false,
            },
          ],
        },
      ],
    };

    vi.mocked(httpClient.get).mockResolvedValue({ data: response });

    await expect(patientExerciseService.getTodayExercises()).resolves.toEqual(response);
    expect(httpClient.get).toHaveBeenCalledWith('/patient/exercises/today', {
      params: undefined,
    });
  });

  it('fetches today exercises scoped to a doctor', async () => {
    const response = { doctorGroups: [] };
    vi.mocked(httpClient.get).mockResolvedValue({ data: response });

    await expect(
      patientExerciseService.getTodayExercises('11111111-1111-1111-1111-111111111111'),
    ).resolves.toEqual(response);
    expect(httpClient.get).toHaveBeenCalledWith('/patient/exercises/today', {
      params: { doctorId: '11111111-1111-1111-1111-111111111111' },
    });
  });

  it('submits bulk exercise completions', async () => {
    const request = {
      userExerciseIds: [
        'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
        'b2c3d4e5-f6a7-8901-bcde-f12345678901',
      ],
    };
    const response = {
      completionDate: '2026-06-27',
      createdUserExerciseIds: request.userExerciseIds,
      skippedUserExerciseIds: [],
    };

    vi.mocked(httpClient.post).mockResolvedValue({ data: response });

    await expect(patientExerciseService.completeExercises(request)).resolves.toEqual(response);
    expect(httpClient.post).toHaveBeenCalledWith('/patient/exercises/complete', request);
  });
});
