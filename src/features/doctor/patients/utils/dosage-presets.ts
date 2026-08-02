import type { AssignPatientExerciseItem } from '@/features/doctor/patients/types/patient-exercise-plan';

export type DosagePresetId = 'strength' | 'stretch' | 'activation';

export const DOSAGE_PRESETS: Record<
  DosagePresetId,
  Pick<AssignPatientExerciseItem, 'sets' | 'reps'>
> = {
  strength: { sets: 3, reps: '10' },
  stretch: { sets: 2, reps: '1' },
  activation: { sets: 2, reps: '12' },
};

export function createDefaultDosage(exerciseId: string): AssignPatientExerciseItem {
  return {
    exerciseId,
    sets: 3,
    reps: '10',
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
  };
}
