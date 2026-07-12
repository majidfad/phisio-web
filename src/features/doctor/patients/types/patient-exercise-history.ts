export interface PatientExerciseHistoryExerciseDto {
  userExerciseId: string;
  exerciseId: string;
  title: string;
  isCompleted: boolean;
}

export interface PatientExerciseHistoryDayDto {
  date: string;
  completedExerciseCount: number;
  isCompleted: boolean;
  exercises: PatientExerciseHistoryExerciseDto[];
  improvementScore: number | null;
  comment: string | null;
}

export interface PatientExerciseHistorySummaryDto {
  assignedExerciseCount: number;
  completedDaysCount: number;
  missedDaysCount: number;
  adherencePercentage: number;
}

export interface PatientExerciseHistoryPatientDto {
  patientId: string;
  patientName: string;
  phoneNumber: string;
}

export interface PatientExerciseHistoryResponse {
  patient: PatientExerciseHistoryPatientDto;
  summary: PatientExerciseHistorySummaryDto;
  dailyHistory: PatientExerciseHistoryDayDto[];
}
