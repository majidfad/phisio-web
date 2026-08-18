import { act, renderHook, waitFor } from '@testing-library/react';
import { type ReactNode } from 'react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { AuthProvider } from '@/features/auth/context/AuthProvider';
import { useAuth } from '@/features/auth/hooks/useAuth';
import { authService } from '@/features/auth/services/auth-service';
import { authSessionStore } from '@/store/auth-session';
import type { AuthenticatedUser } from '@/types/auth';

vi.mock('@/features/auth/services/auth-service', () => ({
  authService: {
    login: vi.fn(),
    logout: vi.fn(),
    restoreSession: vi.fn(),
  },
}));

const admin: AuthenticatedUser = {
  userId: 'admin-id',
  phoneNumber: '+15550000001',
  email: null,
  name: 'Admin User',
  role: 'Admin',
  roles: ['Admin'],
};

function wrapper({ children }: { children: ReactNode }) {
  return <AuthProvider>{children}</AuthProvider>;
}

describe('AuthProvider authentication ordering', () => {
  beforeEach(() => {
    authSessionStore.clear();
    vi.clearAllMocks();
    vi.mocked(authService.restoreSession).mockResolvedValue(null);
  });

  it('commits authenticated state before login resolves', async () => {
    vi.mocked(authService.login).mockImplementation(async () => {
      authSessionStore.save({
        accessToken: 'admin-jwt',
        expiresAt: new Date(Date.now() + 60_000).toISOString(),
        user: admin,
      });
      return admin;
    });

    const { result } = renderHook(() => useAuth(), { wrapper });
    await waitFor(() => expect(result.current.isInitializing).toBe(false));

    await act(async () => {
      await result.current.login({
        phoneNumber: admin.phoneNumber,
        password: 'SecurePass1!',
      });

      expect(authSessionStore.getAccessToken()).toBe('admin-jwt');
      expect(result.current.user).toEqual(admin);
      expect(result.current.isAuthenticated).toBe(true);
      expect(result.current.isInitializing).toBe(false);
    });
  });

  it('does not authenticate when login returns without a persisted token', async () => {
    vi.mocked(authService.login).mockResolvedValue(admin);

    const { result } = renderHook(() => useAuth(), { wrapper });
    await waitFor(() => expect(result.current.isInitializing).toBe(false));

    await expect(
      act(() =>
        result.current.login({
          phoneNumber: admin.phoneNumber,
          password: 'SecurePass1!',
        }),
      ),
    ).rejects.toThrow('Login succeeded without persisting an access token.');

    expect(result.current.user).toBeNull();
  });
});
