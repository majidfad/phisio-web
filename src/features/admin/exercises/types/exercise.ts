import type { ExerciseDifficulty, ExerciseEquipment, ExerciseMediaType } from '@/features/exercises/types';
import type { ExerciseCategorySummaryDto } from '@/features/admin/exercise-categories/types/exercise-category';

export interface ExerciseDto {
  exerciseId: string;
  title: string;
  description: string;
  instructions: string;
  videoUrl?: string | null;
  mediaType: ExerciseMediaType;
  equipment: ExerciseEquipment;
  difficulty: ExerciseDifficulty;
  categories: ExerciseCategorySummaryDto[];
  createdAt: string;
  isEnabled: boolean;
}

export interface CreateExerciseRequest {
  title: string;
  description: string;
  instructions: string;
  videoUrl: string | null;
  mediaType: ExerciseMediaType;
  equipment: ExerciseEquipment;
  difficulty: ExerciseDifficulty;
  categoryIds: string[];
}
