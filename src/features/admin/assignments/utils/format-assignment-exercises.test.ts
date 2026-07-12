import { describe, expect, it } from 'vitest';

import { formatAssignmentExercises } from './format-assignment-exercises';

describe('formatAssignmentExercises', () => {
  it('returns comma-separated exercise names', () => {
    expect(formatAssignmentExercises(['کشش همسترینگ', 'اسکوات'], 'بدون تمرین')).toBe(
      'کشش همسترینگ، اسکوات',
    );
  });

  it('returns no-exercises label when list is empty', () => {
    expect(formatAssignmentExercises([], 'بدون تمرین')).toBe('بدون تمرین');
  });
});
