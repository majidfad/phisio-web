import { describe, expect, it } from 'vitest';

import {
  getSubmittableExerciseIds,
  isExerciseCheckboxChecked,
} from '@/features/patient/exercises/utils/exercise-checkbox-state';
import type { PatientTodayExerciseItemDto } from '@/features/patient/exercises/types/patient-exercise';

const baseExercise: PatientTodayExerciseItemDto = {
  userExerciseId: 'assignment-1',
  exerciseId: 'exercise-1',
  title: 'کشش گردن',
  videoUrl: null,
  scheduledDate: '2026-06-27',
  completedToday: false,
};

describe('exercise checkbox state', () => {
  it('checks box when completion exists for today', () => {
    expect(isExerciseCheckboxChecked({ ...baseExercise, completedToday: true }, new Set())).toBe(
      true,
    );
  });

  it('unchecks box when no completion exists for today', () => {
    expect(isExerciseCheckboxChecked(baseExercise, new Set())).toBe(false);
  });

  it('checks box for pending selection before submit', () => {
    expect(isExerciseCheckboxChecked(baseExercise, new Set(['assignment-1']))).toBe(true);
  });

  it('returns submittable ids excluding already completed exercises', () => {
    const exercises: PatientTodayExerciseItemDto[] = [
      baseExercise,
      { ...baseExercise, userExerciseId: 'assignment-2', completedToday: true },
      { ...baseExercise, userExerciseId: 'assignment-3' },
    ];

    expect(
      getSubmittableExerciseIds(
        exercises,
        new Set(['assignment-1', 'assignment-2', 'assignment-3']),
      ),
    ).toEqual(['assignment-1', 'assignment-3']);
  });
});
