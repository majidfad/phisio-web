import { beforeEach, describe, expect, it, vi } from 'vitest';

import { httpClient } from '@/api/http-client';
import { patientDailyFeedbackService } from '@/features/patient/feedback/services/patientDailyFeedbackService';

vi.mock('@/api/http-client', () => ({
  httpClient: {
    post: vi.fn(),
  },
}));

describe('patientDailyFeedbackService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('submits daily feedback to patient daily-feedback endpoint', async () => {
    const request = {
      improvementScore: 4,
      comment: 'امروز درد زانو کمتر بود.',
    };
    const response = {
      dailyPatientFeedbackId: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
      patientId: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
      doctorId: '7c9e6679-7425-40de-944b-e07fc1f90ae7',
      feedbackDate: '2026-06-15',
      improvementScore: 4,
      comment: 'امروز درد زانو کمتر بود.',
      wasUpdated: false,
    };

    vi.mocked(httpClient.post).mockResolvedValue({ data: response });

    await expect(patientDailyFeedbackService.submitFeedback(request)).resolves.toEqual(response);
    expect(httpClient.post).toHaveBeenCalledWith('/patient/daily-feedback', request);
  });
});
