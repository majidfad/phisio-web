import { renderHook } from '@testing-library/react';
import { type ReactNode } from 'react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { AuthContext } from '@/features/auth/context/auth-context';
import { useAuthenticatedQueryEnabled } from '@/features/auth/hooks/useAuthenticatedQueryEnabled';
import { authSessionStore } from '@/store/auth-session';
import type { AuthenticatedUser } from '@/types/auth';

const admin: AuthenticatedUser = {
  userId: 'admin-id',
  phoneNumber: '+15550000001',
  email: null,
  name: 'Admin User',
  role: 'Admin',
  roles: ['Admin'],
};

function wrapper(user: AuthenticatedUser | null, isInitializing: boolean) {
  return function Wrapper({ children }: { children: ReactNode }) {
    return (
      <AuthContext.Provider
        value={{
          user,
          isAuthenticated: user !== null,
          isInitializing,
          login: vi.fn(),
          logout: vi.fn(),
        }}
      >
        {children}
      </AuthContext.Provider>
    );
  };
}

describe('useAuthenticatedQueryEnabled', () => {
  beforeEach(() => {
    authSessionStore.clear();
  });

  it('stays disabled while authentication is initializing', () => {
    authSessionStore.save({
      accessToken: 'admin-jwt',
      expiresAt: new Date(Date.now() + 60_000).toISOString(),
      user: admin,
    });

    const { result } = renderHook(() => useAuthenticatedQueryEnabled(), {
      wrapper: wrapper(admin, true),
    });

    expect(result.current).toBe(false);
  });

  it('stays disabled until the token is available', () => {
    const { result } = renderHook(() => useAuthenticatedQueryEnabled(), {
      wrapper: wrapper(admin, false),
    });

    expect(result.current).toBe(false);
  });

  it('enables only after auth state and token are ready', () => {
    authSessionStore.save({
      accessToken: 'admin-jwt',
      expiresAt: new Date(Date.now() + 60_000).toISOString(),
      user: admin,
    });

    const { result } = renderHook(() => useAuthenticatedQueryEnabled(), {
      wrapper: wrapper(admin, false),
    });

    expect(result.current).toBe(true);
  });
});
