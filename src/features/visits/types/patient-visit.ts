export const VISIT_TYPE_VALUES = [1, 2, 3, 4] as const;
export type VisitType = (typeof VISIT_TYPE_VALUES)[number];
// 1=Initial, 2=FollowUp, 3=Emergency, 4=Discharge

export const PATIENT_CONDITION_VALUES = [1, 2, 3] as const;
export type PatientCondition = (typeof PATIENT_CONDITION_VALUES)[number];
// 1=Improved, 2=Unchanged, 3=Worsened

export const VISIT_FEEDBACK_SCORE_MIN = 1;
export const VISIT_FEEDBACK_SCORE_MAX = 5;
export const VISIT_FEEDBACK_COMMENT_MAX_LENGTH = 1000;

export interface VisitFeedbackDto {
  satisfactionScore: number;
  doctorCommunicationScore: number;
  comment: string | null;
  submittedAt: string;
}

export interface SubmitVisitFeedbackRequest {
  satisfactionScore: number;
  doctorCommunicationScore: number;
  comment?: string | null;
}

export interface PatientVisitDto {
  visitId: string;
  patientId: string;
  patientName: string;
  doctorId: string;
  doctorName: string;
  clinicId: string;
  clinicName: string;
  visitAt: string;
  visitType: VisitType | null;
  patientCondition: PatientCondition | null;
  doctorNotes: string | null;
  feedback: VisitFeedbackDto | null;
}

export interface PatientVisitHistoryResponse {
  visits: PatientVisitDto[];
  totalVisits: number;
  page: number;
  pageSize: number;
}

export interface RegisterPatientVisitRequest {
  patientId: string;
  doctorId: string;
  clinicId: string;
  visitAt: string;
  visitType?: VisitType | null;
  patientCondition?: PatientCondition | null;
  doctorNotes?: string | null;
}
