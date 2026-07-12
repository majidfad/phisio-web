import { beforeEach, describe, expect, it, vi } from 'vitest';

import { env } from '@/constants/env';
import { authSessionStore } from '@/store/auth-session';
import type { AuthenticatedUser } from '@/types/auth';

const storage = new Map<string, string>();

const sampleUser: AuthenticatedUser = {
  userId: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
  phoneNumber: '+15551234567',
  email: 'jane@example.com',
  name: 'Dr. Jane Smith',
  role: 'Doctor',
  roles: ['Doctor'],
};

describe('authSessionStore', () => {
  beforeEach(() => {
    storage.clear();
    authSessionStore.clear();

    vi.stubGlobal('localStorage', {
      getItem: (key: string) => storage.get(key) ?? null,
      setItem: (key: string, value: string) => {
        storage.set(key, value);
      },
      removeItem: (key: string) => {
        storage.delete(key);
      },
    });
  });

  it('persists session and access token', () => {
    authSessionStore.save({
      accessToken: 'jwt-token',
      expiresAt: new Date(Date.now() + 60 * 60 * 1000).toISOString(),
      user: sampleUser,
    });

    expect(authSessionStore.getAccessToken()).toBe('jwt-token');
    expect(authSessionStore.get()?.user).toEqual(sampleUser);
    expect(storage.get(env.authSessionStorageKey)).toBeDefined();
    expect(storage.get(env.authSessionStorageKey)).toContain('jwt-token');
    expect(storage.get(env.authTokenStorageKey)).toBe('jwt-token');
  });

  it('clears persisted session data', () => {
    authSessionStore.save({
      accessToken: 'jwt-token',
      expiresAt: new Date(Date.now() + 60 * 60 * 1000).toISOString(),
      user: sampleUser,
    });

    authSessionStore.clear();

    expect(authSessionStore.get()).toBeNull();
    expect(storage.get(env.authSessionStorageKey)).toBeUndefined();
  });

  it('detects expired sessions', () => {
    authSessionStore.save({
      accessToken: 'jwt-token',
      expiresAt: new Date(Date.now() - 1000).toISOString(),
      user: sampleUser,
    });

    expect(authSessionStore.hasValidSession()).toBe(false);
  });
});
