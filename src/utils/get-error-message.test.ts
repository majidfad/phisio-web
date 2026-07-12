import { describe, expect, it } from 'vitest';

import { ApiError } from '@/api/errors/api-error';
import { getErrorMessage } from '@/utils/get-error-message';

describe('getErrorMessage', () => {
  it('returns the first ApiError message', () => {
    const error = new ApiError('Primary message', {
      errors: ['Primary message', 'Secondary message'],
    });

    expect(getErrorMessage(error)).toBe('Primary message');
  });

  it('returns fallback for unknown errors', () => {
    expect(getErrorMessage(null, 'Fallback')).toBe('Fallback');
  });
});
