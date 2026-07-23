import { beforeEach, describe, expect, it, vi } from 'vitest';

import { httpClient } from '@/api/http-client';
import { doctorExerciseService } from '@/features/doctor/exercises/services/doctorExerciseService';

vi.mock('@/api/http-client', () => ({
  httpClient: {
    get: vi.fn(),
  },
}));

describe('doctorExerciseService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('fetches doctor library from doctor exercises endpoint', async () => {
    const exercises = [
      {
        exerciseId: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
        title: 'Hamstring Stretch',
        description: 'Stretch the hamstring muscles.',
        videoUrl: 'https://example.com/videos/hamstring-stretch.mp4',
      },
    ];

    vi.mocked(httpClient.get).mockResolvedValue({ data: exercises });

    await expect(doctorExerciseService.getLibrary()).resolves.toEqual(exercises);
    expect(httpClient.get).toHaveBeenCalledWith('/doctor/exercises');
  });

  it('fetches admin catalog from doctor catalog endpoint', async () => {
    const catalog = [
      {
        exerciseId: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
        title: 'Hamstring Stretch',
      },
    ];

    vi.mocked(httpClient.get).mockResolvedValue({ data: catalog });

    await expect(doctorExerciseService.getCatalog()).resolves.toEqual(catalog);
    expect(httpClient.get).toHaveBeenCalledWith('/doctor/exercises/catalog');
  });
});
