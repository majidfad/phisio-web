import { describe, expect, it } from 'vitest';

import {
  formatImprovementScoreDisplay,
  formatPatientCommentDisplay,
  hasPatientFeedback,
} from '@/features/doctor/patients/utils/exercise-history-feedback-display';

describe('exercise-history-feedback-display', () => {
  it('formats improvement score as stars', () => {
    expect(formatImprovementScoreDisplay(4)).toBe('⭐⭐⭐⭐');
  });

  it('returns dash when improvement score is missing', () => {
    expect(formatImprovementScoreDisplay(null)).toBe('—');
    expect(formatImprovementScoreDisplay(undefined)).toBe('—');
  });

  it('returns dash for empty comments', () => {
    expect(formatPatientCommentDisplay(null)).toBe('—');
    expect(formatPatientCommentDisplay('')).toBe('—');
    expect(formatPatientCommentDisplay('   ')).toBe('—');
  });

  it('trims non-empty comments', () => {
    expect(formatPatientCommentDisplay('  امروز بهتر بود.  ')).toBe('امروز بهتر بود.');
  });

  it('detects when feedback exists', () => {
    expect(hasPatientFeedback(3, null)).toBe(true);
    expect(hasPatientFeedback(null, 'نظر')).toBe(true);
    expect(hasPatientFeedback(null, null)).toBe(false);
    expect(hasPatientFeedback(null, '   ')).toBe(false);
  });
});
