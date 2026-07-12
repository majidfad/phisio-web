import type { PatientTodayExerciseItemDto } from '@/features/patient/exercises/types/patient-exercise';

/**
 * Checkbox checked state is derived only from today's completion records (API)
 * plus in-session selections that are not yet submitted.
 */
export function isExerciseCheckboxChecked(
  exercise: PatientTodayExerciseItemDto,
  pendingSelectionIds: ReadonlySet<string>,
): boolean {
  return exercise.completedToday || pendingSelectionIds.has(exercise.userExerciseId);
}

export function getSubmittableExerciseIds(
  exercises: PatientTodayExerciseItemDto[],
  pendingSelectionIds: ReadonlySet<string>,
): string[] {
  return exercises
    .filter(
      (exercise) => pendingSelectionIds.has(exercise.userExerciseId) && !exercise.completedToday,
    )
    .map((exercise) => exercise.userExerciseId);
}
