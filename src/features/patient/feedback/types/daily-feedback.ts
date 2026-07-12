export interface SubmitDailyFeedbackRequest {
  improvementScore: number;
  comment?: string | null;
}

export interface SubmitDailyFeedbackResponse {
  dailyPatientFeedbackId: string;
  patientId: string;
  doctorId: string;
  feedbackDate: string;
  improvementScore: number;
  comment: string | null;
  wasUpdated: boolean;
}

export const DAILY_FEEDBACK_SCORE_MIN = 1;
export const DAILY_FEEDBACK_SCORE_MAX = 5;
export const DAILY_FEEDBACK_COMMENT_MAX_LENGTH = 1000;

export const DAILY_FEEDBACK_SCORE_LABEL_KEYS = [
  'patient.feedback.scoreLabels.1',
  'patient.feedback.scoreLabels.2',
  'patient.feedback.scoreLabels.3',
  'patient.feedback.scoreLabels.4',
  'patient.feedback.scoreLabels.5',
] as const;
