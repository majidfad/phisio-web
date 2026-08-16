import { useCallback, useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import { flushSync } from 'react-dom';

import { AUTH_SESSION_CLEARED_EVENT, authSessionStore } from '@/store/auth-session';
import type { AuthenticatedUser, LoginRequest } from '@/types/auth';

import { AuthContext, type AuthContextValue } from './auth-context';
import { authService } from '../services/auth-service';

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<AuthenticatedUser | null>(null);
  const [isInitializing, setIsInitializing] = useState(true);
  const authGenerationRef = useRef(0);

  useEffect(() => {
    let isMounted = true;
    const generation = authGenerationRef.current;

    authService
      .restoreSession()
      .then((restoredUser) => {
        if (isMounted && generation === authGenerationRef.current) {
          setUser(restoredUser);
        }
      })
      .finally(() => {
        if (isMounted && generation === authGenerationRef.current) {
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

    if (!authSessionStore.getAccessToken()) {
      throw new Error('Login succeeded without persisting an access token.');
    }

    authGenerationRef.current += 1;
    flushSync(() => {
      setUser(authenticatedUser);
      setIsInitializing(false);
    });

    return authenticatedUser;
  }, []);

  const logout = useCallback(() => {
    authGenerationRef.current += 1;
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
