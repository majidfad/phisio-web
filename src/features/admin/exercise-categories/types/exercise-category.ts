export interface ExerciseCategoryDto {
  exerciseCategoryId: string;
  nameFa: string;
  nameEn: string;
  sortOrder: number;
  createdAt: string;
  isEnabled: boolean;
}

export interface ExerciseCategorySummaryDto {
  exerciseCategoryId: string;
  nameFa: string;
  nameEn: string;
}

export interface CreateExerciseCategoryRequest {
  nameFa: string;
  nameEn: string;
  sortOrder: number;
}

export type UpdateExerciseCategoryRequest = CreateExerciseCategoryRequest;
