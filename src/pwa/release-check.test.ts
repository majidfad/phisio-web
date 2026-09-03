import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

describe('release-check', () => {
  beforeEach(() => {
    vi.resetModules();
    vi.stubGlobal('fetch', vi.fn());
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('detects a new release when server version differs from build version', async () => {
    vi.mocked(fetch).mockResolvedValue({
      ok: true,
      json: async () => ({ version: 'release-b' }),
    } as Response);

    const { hasNewRelease } = await import('@/pwa/release-check');
    await expect(hasNewRelease()).resolves.toBe(true);
  });

  it('does not reload when server version matches build version', async () => {
    vi.mocked(fetch).mockResolvedValue({
      ok: true,
      json: async () => ({ version: 'dev' }),
    } as Response);

    const { hasNewRelease } = await import('@/pwa/release-check');
    await expect(hasNewRelease()).resolves.toBe(false);
  });
});
