import { httpClient } from '@/api/http-client';

import type {
  SubmitDailyFeedbackRequest,
  SubmitDailyFeedbackResponse,
} from '../types/daily-feedback';

const PATIENT_DAILY_FEEDBACK_BASE = '/patient/daily-feedback';

export const patientDailyFeedbackService = {
  async submitFeedback(request: SubmitDailyFeedbackRequest): Promise<SubmitDailyFeedbackResponse> {
    const { data } = await httpClient.post<SubmitDailyFeedbackResponse>(
      PATIENT_DAILY_FEEDBACK_BASE,
      request,
    );
    return data;
  },
};
