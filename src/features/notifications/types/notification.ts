export type NotificationType =
  | 'PatientLinkRequested'
  | 'LinkApproved'
  | 'LinkRejected'
  | 'PatientRemoved'
  | 'ExercisesAssigned'
  | 'ProgramCreated'
  | 'ExercisesCompleted'
  | 'DailyFeedbackReceived'
  | 'DoctorPendingActivation'
  | 'DoctorActivated'
  | 'ExerciseReminder';

export interface NotificationDto {
  notificationId: string;
  type: NotificationType | string;
  title: string;
  body: string;
  data: string | null;
  isRead: boolean;
  createdAt: string;
}

export interface UnreadCountDto {
  count: number;
}

export interface NotificationData {
  patientId?: string;
  patientName?: string;
  doctorId?: string;
  doctorName?: string;
  programId?: string;
  count?: number;
  date?: string;
}
