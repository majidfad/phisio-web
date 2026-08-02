import { describe, expect, it } from 'vitest';

import type { DoctorPatientExerciseDto } from '@/features/doctor/patients/types/patient-exercise-plan';
import {
  latestDosageByExerciseId,
  resolveDosageForSelection,
} from '@/features/doctor/patients/utils/copy-last-dosage';
import {
  applyDosagePreset,
  createDefaultDosage,
} from '@/features/doctor/patients/utils/dosage-presets';
import { ExerciseMediaType } from '@/features/exercises/types';

function planRow(
  overrides: Partial<DoctorPatientExerciseDto> & Pick<DoctorPatientExerciseDto, 'exerciseId'>,
): DoctorPatientExerciseDto {
  return {
    userExerciseId: 'ue-1',
    exerciseName: 'Test',
    videoUrl: null,
    mediaType: ExerciseMediaType.UploadedVideo,
    assignedAt: '2026-07-01T00:00:00Z',
    scheduledDate: '2026-07-01',
    sets: 3,
    reps: '10',
    clinicianNote: null,
    patientCue: null,
    ...overrides,
  };
}

describe('dosage presets', () => {
  it('applies strength preset fields', () => {
    expect(applyDosagePreset(createDefaultDosage('ex-1'), 'strength')).toMatchObject({
      exerciseId: 'ex-1',
      sets: 3,
      reps: '10',
    });
  });

  it('applies stretch preset fields', () => {
    expect(applyDosagePreset(createDefaultDosage('ex-1'), 'stretch')).toMatchObject({
      sets: 2,
      reps: '1',
    });
  });

  it('applies activation preset fields', () => {
    expect(applyDosagePreset(createDefaultDosage('ex-1'), 'activation')).toMatchObject({
      sets: 2,
      reps: '12',
    });
  });
});

describe('copy-last dosage', () => {
  it('keeps first (latest) row per exerciseId', () => {
    const map = latestDosageByExerciseId([
      planRow({ exerciseId: 'ex-1', sets: 4, reps: '8', scheduledDate: '2026-07-20' }),
      planRow({ exerciseId: 'ex-1', sets: 2, reps: '15', scheduledDate: '2026-07-01' }),
    ]);

    expect(map.get('ex-1')).toMatchObject({ sets: 4, reps: '8' });
  });

  it('resolves from plan when available', () => {
    const map = latestDosageByExerciseId([
      planRow({
        exerciseId: 'ex-1',
        sets: 5,
        reps: '6',
        patientCue: 'Slow',
      }),
    ]);

    const resolved = resolveDosageForSelection('ex-1', map);
    expect(resolved.copiedFromLast).toBe(true);
    expect(resolved.item).toMatchObject({
      sets: 5,
      reps: '6',
      patientCue: 'Slow',
    });
  });

  it('falls back to defaults when no plan history', () => {
    const resolved = resolveDosageForSelection('ex-2', new Map());
    expect(resolved.copiedFromLast).toBe(false);
    expect(resolved.item).toEqual(createDefaultDosage('ex-2'));
  });
});
