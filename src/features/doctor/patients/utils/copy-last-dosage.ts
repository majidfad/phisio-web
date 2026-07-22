import type {
  AssignPatientExerciseItem,
  DoctorPatientExerciseDto,
} from '@/features/doctor/patients/types/patient-exercise-plan';
import { createDefaultDosage } from '@/features/doctor/patients/utils/dosage-presets';
import { ExerciseSide } from '@/features/exercises/types';

export function dosageFromPlanRow(row: DoctorPatientExerciseDto): AssignPatientExerciseItem {
  return {
    exerciseId: row.exerciseId,
    sets: row.sets ?? undefined,
    reps: row.reps ?? undefined,
    holdSeconds: row.holdSeconds ?? undefined,
    restSeconds: row.restSeconds ?? undefined,
    side: (row.side ?? ExerciseSide.None) as AssignPatientExerciseItem['side'],
    clinicianNote: row.clinicianNote ?? undefined,
    patientCue: row.patientCue ?? undefined,
  };
}

/** First row per exerciseId wins — API returns newest first. */
export function latestDosageByExerciseId(
  planExercises: DoctorPatientExerciseDto[],
): Map<string, AssignPatientExerciseItem> {
  const map = new Map<string, AssignPatientExerciseItem>();
  for (const row of planExercises) {
    if (!map.has(row.exerciseId)) {
      map.set(row.exerciseId, dosageFromPlanRow(row));
    }
  }
  return map;
}

export function resolveDosageForSelection(
  exerciseId: string,
  latestByExerciseId: Map<string, AssignPatientExerciseItem>,
): { item: AssignPatientExerciseItem; copiedFromLast: boolean } {
  const fromPlan = latestByExerciseId.get(exerciseId);
  if (fromPlan) {
    return { item: fromPlan, copiedFromLast: true };
  }
  return { item: createDefaultDosage(exerciseId), copiedFromLast: false };
}
