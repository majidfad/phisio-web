import { describe, expect, it } from 'vitest';

import { parseLandingHash } from '@/features/landing/utils/smooth-scroll';

describe('parseLandingHash', () => {
  it('strips the hash prefix', () => {
    expect(parseLandingHash('#features')).toBe('features');
    expect(parseLandingHash('how')).toBe('how');
  });

  it('returns null for empty hashes', () => {
    expect(parseLandingHash('')).toBeNull();
    expect(parseLandingHash('#')).toBeNull();
    expect(parseLandingHash('   ')).toBeNull();
  });
});
