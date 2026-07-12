import { describe, expect, it } from 'vitest';

import { formatExerciseDate } from '@/features/admin/exercises/utils/format-exercise-date';

describe('formatExerciseDate', () => {
  it('formats valid ISO dates with Persian digits', () => {
    const formatted = formatExerciseDate('2024-03-15T10:30:00.000Z');

    expect(formatted).not.toBe('—');
    expect(formatted).toMatch(/[۰-۹]/);
  });

  it('returns dash for missing dates', () => {
    expect(formatExerciseDate(undefined)).toBe('—');
  });
});
