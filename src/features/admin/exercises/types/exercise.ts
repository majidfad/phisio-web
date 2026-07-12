export interface ExerciseDto {
  exerciseId: string;
  title: string;
  description: string;
  videoUrl?: string | null;
  createdAt: string;
  isEnabled: boolean;
}

export interface CreateExerciseRequest {
  title: string;
  description: string;
  videoUrl: string;
}
