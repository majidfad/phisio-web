import { useCallback, useEffect, useMemo, useState, type ReactNode } from 'react';

import { AUTH_SESSION_CLEARED_EVENT } from '@/store/auth-session';
import type { AuthenticatedUser, LoginRequest } from '@/types/auth';

import { AuthContext, type AuthContextValue } from './auth-context';
import { authService } from '../services/auth-service';

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<AuthenticatedUser | null>(null);
  const [isInitializing, setIsInitializing] = useState(true);

  useEffect(() => {
    let isMounted = true;

    authService
      .restoreSession()
      .then((restoredUser) => {
        if (isMounted) {
          setUser(restoredUser);
        }
      })
      .finally(() => {
        if (isMounted) {
          setIsInitializing(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    const handleSessionCleared = () => {
      setUser(null);
    };

    window.addEventListener(AUTH_SESSION_CLEARED_EVENT, handleSessionCleared);

    return () => {
      window.removeEventListener(AUTH_SESSION_CLEARED_EVENT, handleSessionCleared);
    };
  }, []);

  const login = useCallback(async (credentials: LoginRequest) => {
    const authenticatedUser = await authService.login(credentials);
    setUser(authenticatedUser);
    return authenticatedUser;
  }, []);

  const logout = useCallback(() => {
    authService.logout();
    setUser(null);
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      isAuthenticated: user !== null,
      isInitializing,
      login,
      logout,
    }),
    [user, isInitializing, login, logout],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
