import { queryClient } from '@/api/query-client';
import { getMeApi, loginApi } from '@/features/auth/api/auth-api';
import {
  mapAuthResponseToUser,
  mapMeResponseToUser,
  normalizeAuthenticatedUser,
} from '@/features/auth/utils/map-auth-user';
import { authSessionStore } from '@/store/auth-session';
import type { AuthenticatedUser, LoginRequest } from '@/types/auth';

export const authService = {
  async login(credentials: LoginRequest): Promise<AuthenticatedUser> {
    const response = await loginApi(credentials);
    const user = mapAuthResponseToUser(response);

    authSessionStore.save({
      accessToken: response.accessToken,
      expiresAt: response.expiresAt,
      user,
    });

    return user;
  },

  async restoreSession(): Promise<AuthenticatedUser | null> {
    const session = authSessionStore.get();

    if (!session?.accessToken) {
      return null;
    }

    if (authSessionStore.isExpired(session.expiresAt)) {
      authSessionStore.clear();
      return null;
    }

    const cachedUser = normalizeAuthenticatedUser(session.user);

    try {
      const me = await getMeApi();
      const user = mapMeResponseToUser(me, cachedUser);

      authSessionStore.save({
        accessToken: session.accessToken,
        expiresAt: session.expiresAt,
        user,
      });

      return user;
    } catch {
      authSessionStore.clear();
      return null;
    }
  },

  logout(): void {
    authSessionStore.clear();
    queryClient.clear();
  },
};
