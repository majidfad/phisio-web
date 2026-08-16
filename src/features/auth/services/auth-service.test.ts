import { beforeEach, describe, expect, it, vi } from 'vitest';

import { getMeApi, loginApi } from '@/features/auth/api/auth-api';
import { authService } from '@/features/auth/services/auth-service';
import { authSessionStore } from '@/store/auth-session';
import type { AuthResponse } from '@/types/auth';

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

  it('login stores a ClinicManager session', async () => {
    vi.mocked(loginApi).mockResolvedValue({
      accessToken: 'clinic-manager-jwt',
      expiresAt: new Date(Date.now() + 60 * 60 * 1000).toISOString(),
      userId: 'manager-id',
      phoneNumber: '+15550000004',
      email: null,
      name: 'Clinic Manager',
      role: 4,
    });

    const user = await authService.login({
      phoneNumber: '+15550000004',
      password: 'SecurePass1!',
    });

    expect(user.role).toBe('ClinicManager');
    expect(authSessionStore.getAccessToken()).toBe('clinic-manager-jwt');
  });

  it('normalizes the runtime response before persisting the token', async () => {
    vi.mocked(loginApi).mockResolvedValue({
      AccessToken: 'runtime-jwt',
      ExpiresAt: new Date(Date.now() + 60 * 60 * 1000).toISOString(),
      UserId: 'admin-id',
      PhoneNumber: '+15550000001',
      Email: null,
      Name: 'Admin User',
      Role: 3,
    } as unknown as AuthResponse);

    const user = await authService.login({
      phoneNumber: '+15550000001',
      password: 'SecurePass1!',
    });

    expect(user.role).toBe('Admin');
    expect(authSessionStore.getAccessToken()).toBe('runtime-jwt');
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

  it('does not let a late restore failure clear a newer login session', async () => {
    authSessionStore.save({
      accessToken: 'stale-jwt',
      expiresAt: new Date(Date.now() + 60 * 60 * 1000).toISOString(),
      user: {
        userId: 'stale-id',
        phoneNumber: '+15550000000',
        email: null,
        name: 'Stale User',
        role: 'Patient',
        roles: ['Patient'],
      },
    });

    let rejectRestore: (reason?: unknown) => void = () => {};
    vi.mocked(getMeApi).mockImplementation(
      () =>
        new Promise((_, reject) => {
          rejectRestore = reject;
        }),
    );
    const restorePromise = authService.restoreSession();

    vi.mocked(loginApi).mockResolvedValue({
      accessToken: 'fresh-jwt',
      expiresAt: new Date(Date.now() + 60 * 60 * 1000).toISOString(),
      userId: 'admin-id',
      phoneNumber: '+15550000001',
      email: null,
      name: 'Admin User',
      role: 3,
    });

    await authService.login({
      phoneNumber: '+15550000001',
      password: 'SecurePass1!',
    });
    rejectRestore(new Error('stale request failed'));
    await restorePromise;

    expect(authSessionStore.getAccessToken()).toBe('fresh-jwt');
    expect(authSessionStore.get()?.user.role).toBe('Admin');
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
