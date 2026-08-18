import { queryClient } from '@/api/query-client';
import { getMeApi, loginApi } from '@/features/auth/api/auth-api';
import {
  mapAuthResponseToUser,
  mapMeResponseToUser,
  normalizeAuthResponse,
  normalizeAuthenticatedUser,
} from '@/features/auth/utils/map-auth-user';
import { authSessionStore } from '@/store/auth-session';
import type { AuthenticatedUser, LoginRequest } from '@/types/auth';

export const authService = {
  async login(credentials: LoginRequest): Promise<AuthenticatedUser> {
    const response = await loginApi(credentials);
    const normalized = normalizeAuthResponse(response);

    if (!normalized.accessToken) {
      throw new Error('Login succeeded without an access token.');
    }

    const user = mapAuthResponseToUser(normalized);

    authSessionStore.save({
      accessToken: normalized.accessToken,
      expiresAt: normalized.expiresAt,
      user,
    });

    queryClient.clear();

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

      if (authSessionStore.getAccessToken() !== session.accessToken) {
        return authSessionStore.get()?.user ?? null;
      }

      authSessionStore.save({
        accessToken: session.accessToken,
        expiresAt: session.expiresAt,
        user,
      });

      return user;
    } catch {
      if (authSessionStore.getAccessToken() === session.accessToken) {
        authSessionStore.clear();
      }

      return authSessionStore.get()?.user ?? null;
    }
  },

  logout(): void {
    authSessionStore.clear();
    queryClient.clear();
  },
};
