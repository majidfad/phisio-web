import type { AssignPatientExerciseItem } from '@/features/doctor/patients/types/patient-exercise-plan';
import type { PatientExerciseHistorySummaryDto } from '@/features/doctor/patients/types/patient-exercise-history';

export const ExerciseProgramCadenceType = {
  DaysOfWeek: 1,
  Interval: 2,
} as const;
export type ExerciseProgramCadenceType =
  (typeof ExerciseProgramCadenceType)[keyof typeof ExerciseProgramCadenceType];

export interface CreateExerciseProgramRequest {
  startDate: string;
  endDate: string;
  cadenceType: ExerciseProgramCadenceType;
  daysOfWeekMask: number;
  intervalDays?: number | null;
  items: AssignPatientExerciseItem[];
}

export type UpdateExerciseProgramRequest = CreateExerciseProgramRequest;

export interface ExerciseProgramExerciseDto {
  exerciseId: string;
  exerciseName: string;
  sets: number | null;
  reps: string | null;
  holdSeconds: number | null;
  restSeconds: number | null;
  side: 0 | 1 | 2 | 3;
  clinicianNote: string | null;
  patientCue: string | null;
}

export interface ExerciseProgramDto {
  programId: string;
  patientId: string;
  startDate: string;
  endDate: string;
  cadenceType: ExerciseProgramCadenceType;
  daysOfWeekMask: number;
  intervalDays: number | null;
  createdAt: string;
  exercises: ExerciseProgramExerciseDto[];
  upcomingAssignmentCount: number;
  pastAssignmentCount: number;
}

export interface CreateExerciseProgramResultDto {
  programId: string;
  assignedCount: number;
}

export interface DoctorPatientOverviewDto {
  patientId: string;
  patientName: string;
  phoneNumber: string;
  linkedAt: string;
  patientRegisteredAt: string | null;
  summary: PatientExerciseHistorySummaryDto;
  programs: ExerciseProgramDto[];
  activeExerciseCountToday: number;
}

export function buildDaysOfWeekMask(days: number[]): number {
  return days.reduce((mask, day) => mask | (1 << day), 0);
}

export function daysFromMask(mask: number): number[] {
  return [0, 1, 2, 3, 4, 5, 6].filter((day) => (mask & (1 << day)) !== 0);
}

export function addMonthsIso(isoDate: string, months: number): string {
  const date = new Date(`${isoDate}T00:00:00Z`);
  const year = date.getUTCFullYear();
  const month = date.getUTCMonth();
  const day = date.getUTCDate();
  const target = new Date(Date.UTC(year, month + months, day));
  // Clamp overflow (e.g. Jan 31 + 1 month)
  if (target.getUTCDate() !== day) {
    target.setUTCDate(0);
  }
  return target.toISOString().slice(0, 10);
}
