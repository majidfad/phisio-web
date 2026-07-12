import { describe, expect, it } from 'vitest';

import { getUtcDateKey } from '@/features/patient/exercises/utils/get-utc-date-key';

describe('getUtcDateKey', () => {
  it('returns UTC calendar date in YYYY-MM-DD format', () => {
    const date = new Date('2026-06-27T23:30:00.000Z');

    expect(getUtcDateKey(date)).toBe('2026-06-27');
  });
});
