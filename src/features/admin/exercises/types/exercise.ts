import type {
  ExerciseBodyRegion,
  ExerciseDifficulty,
  ExerciseEquipment,
  ExerciseMediaType,
} from '@/features/exercises/types';

export interface ExerciseDto {
  exerciseId: string;
  title: string;
  description: string;
  instructions: string;
  videoUrl?: string | null;
  mediaType: ExerciseMediaType;
  bodyRegion: ExerciseBodyRegion;
  equipment: ExerciseEquipment;
  difficulty: ExerciseDifficulty;
  createdAt: string;
  isEnabled: boolean;
}

export interface CreateExerciseRequest {
  title: string;
  description: string;
  instructions: string;
  videoUrl: string | null;
  mediaType: ExerciseMediaType;
  bodyRegion: ExerciseBodyRegion;
  equipment: ExerciseEquipment;
  difficulty: ExerciseDifficulty;
}
