export interface PatientExerciseStatsSummaryDto {
  scheduledDays: number;
  completedDays: number;
  missedDays: number;
  adherencePercentage: number;
  assignedExerciseCount: number;
  completedExerciseCount: number;
  exerciseCompletionPercentage: number;
  averageImprovementScore: number | null;
  averageHardnessScore: number | null;
  feedbackDayCount: number;
}

export interface PatientExerciseStatsDailyDto {
  date: string;
  scheduledCount: number;
  completedCount: number;
  isCompleted: boolean;
  improvementScore: number | null;
  hardnessScore: number | null;
}

export interface PatientExerciseStatsWeeklyDto {
  weekStart: string;
  scheduledDays: number;
  completedDays: number;
  adherencePercentage: number;
}

export interface PatientExerciseStatsExerciseDto {
  exerciseId: string;
  title: string;
  assignedCount: number;
  completedCount: number;
  completionPercentage: number;
}

export interface PatientExerciseStatsResponse {
  from: string;
  to: string;
  summary: PatientExerciseStatsSummaryDto;
  daily: PatientExerciseStatsDailyDto[];
  weekly: PatientExerciseStatsWeeklyDto[];
  exercises: PatientExerciseStatsExerciseDto[];
}

export interface PatientExerciseStatsParams {
  from?: string;
  to?: string;
}

export type ExerciseStatsRangeDays = 7 | 30 | 90;

export function statsRangeFromDays(days: ExerciseStatsRangeDays): {
  from: string;
  to: string;
} {
  const to = new Date();
  const from = new Date();
  from.setUTCDate(to.getUTCDate() - (days - 1));
  return {
    from: from.toISOString().slice(0, 10),
    to: to.toISOString().slice(0, 10),
  };
}
