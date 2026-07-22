import type {
  ExerciseBodyRegion,
  ExerciseDifficulty,
  ExerciseEquipment,
  ExerciseMediaType,
} from '@/features/exercises/types';

export type DoctorExerciseScope = 'all' | 'mine' | 'clinic';

export interface DoctorExerciseDto {
  exerciseId: string;
  title: string;
  description: string | null;
  instructions: string | null;
  videoUrl: string | null;
  mediaType: ExerciseMediaType;
  bodyRegion: ExerciseBodyRegion;
  equipment: ExerciseEquipment;
  difficulty: ExerciseDifficulty;
  createdByDoctorId: string | null;
  isClinicShared: boolean;
  isOwnedByCurrentDoctor: boolean;
}

export interface CreateDoctorExerciseRequest {
  title: string;
  description: string;
  instructions: string;
  videoUrl: string | null;
  mediaType: ExerciseMediaType;
  bodyRegion: ExerciseBodyRegion;
  equipment: ExerciseEquipment;
  difficulty: ExerciseDifficulty;
  isClinicShared: boolean;
}
