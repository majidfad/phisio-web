import { beforeEach, describe, expect, it, vi } from 'vitest';

import { httpClient } from '@/api/http-client';
import { exerciseCatalogService } from '@/features/exercises/services/exerciseCatalogService';

vi.mock('@/api/http-client', () => ({
  httpClient: {
    get: vi.fn(),
  },
}));

describe('exerciseCatalogService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('fetches exercises from catalog endpoint', async () => {
    const exercises = [
      {
        exerciseId: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
        title: 'Hamstring Stretch',
        description: 'Stretch the hamstring muscles.',
        videoUrl: 'https://example.com/hamstring.mp4',
        createdAt: '2024-01-15T10:00:00Z',
        isEnabled: true,
      },
    ];

    vi.mocked(httpClient.get).mockResolvedValue({ data: exercises });

    await expect(exerciseCatalogService.getAll()).resolves.toEqual(exercises);
    expect(httpClient.get).toHaveBeenCalledWith('/exercises');
  });

  it('fetches a single exercise by id', async () => {
    const exercise = {
      exerciseId: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
      title: 'Hamstring Stretch',
      description: 'Stretch the hamstring muscles.',
      videoUrl: 'https://example.com/hamstring.mp4',
      createdAt: '2024-01-15T10:00:00Z',
      isEnabled: true,
    };

    vi.mocked(httpClient.get).mockResolvedValue({ data: exercise });

    await expect(exerciseCatalogService.getById(exercise.exerciseId)).resolves.toEqual(exercise);
    expect(httpClient.get).toHaveBeenCalledWith(`/exercises/${exercise.exerciseId}`);
  });
});
