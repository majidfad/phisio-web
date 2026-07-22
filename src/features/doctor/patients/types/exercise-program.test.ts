import { describe, expect, it } from 'vitest';

import {
  addMonthsIso,
  buildDaysOfWeekMask,
  daysFromMask,
} from '@/features/doctor/patients/types/exercise-program';

describe('exercise program helpers', () => {
  it('builds and reads days-of-week mask', () => {
    const mask = buildDaysOfWeekMask([1, 3, 5]);
    expect(daysFromMask(mask)).toEqual([1, 3, 5]);
  });

  it('adds months to iso date', () => {
    expect(addMonthsIso('2026-01-15', 3)).toBe('2026-04-15');
  });
});
