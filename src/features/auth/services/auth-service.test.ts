import { beforeEach, describe, expect, it, vi } from 'vitest';

import { getMeApi, loginApi } from '@/features/auth/api/auth-api';
import { authService } from '@/features/auth/services/auth-service';
import { authSessionStore } from '@/store/auth-session';

vi.mock('@/features/auth/api/auth-api', () => ({
  loginApi: vi.fn(),
  getMeApi: vi.fn(),
}));

vi.mock('@/api/query-client', () => ({
  queryClient: {
    clear: vi.fn(),
  },
}));

const storage = new Map<string, string>();

describe('authService', () => {
  beforeEach(() => {
    storage.clear();
    authSessionStore.clear();
    vi.clearAllMocks();

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

  it('login stores session and returns authenticated user', async () => {
    vi.mocked(loginApi).mockResolvedValue({
      accessToken: 'jwt-token',
      expiresAt: new Date(Date.now() + 60 * 60 * 1000).toISOString(),
      userId: 'user-id',
      phoneNumber: '+15551234567',
      email: 'jane@example.com',
      name: 'Dr. Jane Smith',
      role: 'Doctor',
    });

    const user = await authService.login({
      phoneNumber: '+15551234567',
      password: 'SecurePass1!',
    });

    expect(user.name).toBe('Dr. Jane Smith');
    expect(authSessionStore.getAccessToken()).toBe('jwt-token');
  });

  it('restoreSession returns null when no session exists', async () => {
    await expect(authService.restoreSession()).resolves.toBeNull();
    expect(getMeApi).not.toHaveBeenCalled();
  });

  it('restoreSession validates token with me endpoint', async () => {
    authSessionStore.save({
      accessToken: 'jwt-token',
      expiresAt: new Date(Date.now() + 60 * 60 * 1000).toISOString(),
      user: {
        userId: 'user-id',
        phoneNumber: '+15551234567',
        email: 'jane@example.com',
        name: 'Dr. Jane Smith',
        role: 'Doctor',
        roles: ['Doctor'],
      },
    });

    vi.mocked(getMeApi).mockResolvedValue({
      userId: 'user-id',
      phoneNumber: '+15551234567',
      email: 'jane@example.com',
      roles: ['Doctor'],
    });

    const user = await authService.restoreSession();

    expect(getMeApi).toHaveBeenCalledOnce();
    expect(user?.userId).toBe('user-id');
  });

  it('logout clears persisted session', () => {
    authSessionStore.save({
      accessToken: 'jwt-token',
      expiresAt: new Date(Date.now() + 60 * 60 * 1000).toISOString(),
      user: {
        userId: 'user-id',
        phoneNumber: '+15551234567',
        email: null,
        name: 'Dr. Jane Smith',
        role: 'Doctor',
        roles: ['Doctor'],
      },
    });

    authService.logout();

    expect(authSessionStore.get()).toBeNull();
  });
});
