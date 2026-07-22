import type { ExerciseMediaType, ExerciseSide } from '@/features/exercises/types';

export interface PatientTodayExerciseItemDto {
  userExerciseId: string;
  exerciseId: string;
  title: string;
  videoUrl: string | null;
  mediaType: ExerciseMediaType;
  instructions: string | null;
  sets: number | null;
  reps: string | null;
  holdSeconds: number | null;
  restSeconds: number | null;
  side: ExerciseSide;
  patientCue: string | null;
  scheduledDate: string;
  completedToday: boolean;
}

export interface PatientDoctorExerciseGroupDto {
  doctorId: string;
  doctorName: string;
  exercises: PatientTodayExerciseItemDto[];
}

export interface PatientTodayExercisesResponse {
  doctorGroups: PatientDoctorExerciseGroupDto[];
}

/** @deprecated Use PatientTodayExerciseItemDto — kept for legacy list helpers during tab migration */
export interface PatientExerciseItemDto {
  userExerciseId: string;
  exerciseId: string;
  title: string;
  videoUrl: string | null;
  mediaType: ExerciseMediaType;
  scheduledDate: string;
  completedToday: boolean;
}

export interface PatientExercisesResponse {
  doctorName: string | null;
  exercises: PatientExerciseItemDto[];
}

export interface CompleteExercisesRequest {
  userExerciseIds: string[];
}

export interface CompleteExercisesResponse {
  completionDate: string;
  createdUserExerciseIds: string[];
  skippedUserExerciseIds: string[];
}

export interface PatientExercisePlayback {
  title: string;
  videoUrl: string | null;
  mediaType: ExerciseMediaType;
}

export function flattenTodayExercises(
  response: PatientTodayExercisesResponse,
): PatientTodayExerciseItemDto[] {
  return response.doctorGroups.flatMap((group) => group.exercises);
}

export function hasTodayExercises(response: PatientTodayExercisesResponse): boolean {
  return response.doctorGroups.some((group) => group.exercises.length > 0);
}
