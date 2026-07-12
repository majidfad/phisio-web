import { describe, expect, it } from 'vitest';

import { adminListFilterToIsEnabled } from './admin-list-filter';

describe('adminListFilterToIsEnabled', () => {
  it('maps active filter to true', () => {
    expect(adminListFilterToIsEnabled('active')).toBe(true);
  });

  it('maps inactive filter to false', () => {
    expect(adminListFilterToIsEnabled('inactive')).toBe(false);
  });
});
