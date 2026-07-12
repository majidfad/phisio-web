export function formatAssignmentExercises(
  exerciseNames: string[],
  noExercisesLabel: string,
): string {
  if (exerciseNames.length === 0) {
    return noExercisesLabel;
  }

  return exerciseNames.join('، ');
}
