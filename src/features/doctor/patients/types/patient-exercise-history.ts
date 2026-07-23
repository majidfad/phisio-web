import type { ExerciseSide } from '@/features/exercises/types';

export interface PatientExerciseHistoryExerciseDto {
  userExerciseId: string;
  exerciseId: string;
  title: string;
  isCompleted: boolean;
  sets: number | null;
  reps: string | null;
  holdSeconds: number | null;
  restSeconds: number | null;
  side: ExerciseSide;
  clinicianNote: string | null;
  patientCue: string | null;
}

export interface PatientExerciseHistoryDayDto {
  date: string;
  completedExerciseCount: number;
  isCompleted: boolean;
  exercises: PatientExerciseHistoryExerciseDto[];
  improvementScore: number | null;
  hardnessScore: number | null;
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
  totalDays: number;
  page: number;
  pageSize: number;
}

export interface PatientExerciseHistoryParams {
  page?: number;
  pageSize?: number;
}
