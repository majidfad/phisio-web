import { authSessionStore } from '@/store/auth-session';

import { useAuth } from './useAuth';

/**
 * Enables protected queries only when React auth state and the persisted
 * request-time credential represent the same ready authentication session.
 */
export function useAuthenticatedQueryEnabled(additionalEnabled = true): boolean {
  const { user, isAuthenticated, isInitializing } = useAuth();

  return (
    additionalEnabled &&
    !isInitializing &&
    isAuthenticated &&
    user !== null &&
    Boolean(authSessionStore.getAccessToken())
  );
}
