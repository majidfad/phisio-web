import type {
  ExerciseBodyRegion,
  ExerciseDifficulty,
  ExerciseEquipment,
  ExerciseMediaType,
} from '@/features/exercises/types';

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
}
