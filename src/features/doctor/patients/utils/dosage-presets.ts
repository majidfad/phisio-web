import type { AssignPatientExerciseItem } from '@/features/doctor/patients/types/patient-exercise-plan';
import { ExerciseSide } from '@/features/exercises/types';

export type DosagePresetId = 'strength' | 'stretch' | 'activation';

export const DOSAGE_PRESETS: Record<
  DosagePresetId,
  Pick<AssignPatientExerciseItem, 'sets' | 'reps' | 'holdSeconds' | 'restSeconds'>
> = {
  strength: { sets: 3, reps: '10', holdSeconds: undefined, restSeconds: 60 },
  stretch: { sets: 2, reps: '1', holdSeconds: 30, restSeconds: 15 },
  activation: { sets: 2, reps: '12', holdSeconds: undefined, restSeconds: 30 },
};

export function createDefaultDosage(exerciseId: string): AssignPatientExerciseItem {
  return {
    exerciseId,
    sets: 3,
    reps: '10',
    side: ExerciseSide.None,
  };
}

export function applyDosagePreset(
  current: AssignPatientExerciseItem,
  presetId: DosagePresetId,
): AssignPatientExerciseItem {
  const preset = DOSAGE_PRESETS[presetId];
  return {
    ...current,
    sets: preset.sets,
    reps: preset.reps,
    holdSeconds: preset.holdSeconds,
    restSeconds: preset.restSeconds,
  };
}
