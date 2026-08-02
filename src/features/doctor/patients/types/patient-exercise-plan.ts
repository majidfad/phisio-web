import type { ExerciseMediaType } from '@/features/exercises/types';

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
  clinicianNote?: string;
  patientCue?: string;
}

export interface AssignPatientExercisesResultDto {
  assignedCount: number;
}
