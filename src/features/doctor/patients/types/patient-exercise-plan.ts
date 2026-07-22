import type { ExerciseMediaType, ExerciseSide } from '@/features/exercises/types';

export interface DoctorPatientExerciseDto {
  userExerciseId: string;
  exerciseId: string;
  exerciseName: string;
  videoUrl: string | null;
  mediaType: ExerciseMediaType;
  assignedAt: string;
  scheduledDate: string;
  sets: number | null;
  reps: string | null;
  holdSeconds: number | null;
  restSeconds: number | null;
  side: ExerciseSide;
  clinicianNote: string | null;
  patientCue: string | null;
}

export interface AssignPatientExercisesRequest {
  items: AssignPatientExerciseItem[];
  scheduledDates: string[];
}

export interface AssignPatientExerciseItem {
  exerciseId: string;
  sets?: number;
  reps?: string;
  holdSeconds?: number;
  restSeconds?: number;
  side: 0 | 1 | 2 | 3;
  clinicianNote?: string;
  patientCue?: string;
}

export interface AssignPatientExercisesResultDto {
  assignedCount: number;
}
