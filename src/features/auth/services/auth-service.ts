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

    // #region agent log
    fetch('http://127.0.0.1:7278/ingest/3c071380-e9ac-4d92-a57f-e1db8fecd063',{method:'POST',headers:{'Content-Type':'application/json','X-Debug-Session-Id':'65b285'},body:JSON.stringify({sessionId:'65b285',runId:'run1',hypothesisId:'H4',location:'src/features/auth/services/auth-service.ts:29',message:'login persisted token',data:{tokenLengthAfterSave:authSessionStore.getAccessToken()?.length??0,role:user.role,expiresAt:normalized.expiresAt},timestamp:Date.now()})}).catch(()=>{});
    // #endregion

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
    } catch (restoreError) {
      // #region agent log
      fetch('http://127.0.0.1:7278/ingest/3c071380-e9ac-4d92-a57f-e1db8fecd063',{method:'POST',headers:{'Content-Type':'application/json','X-Debug-Session-Id':'65b285'},body:JSON.stringify({sessionId:'65b285',runId:'run1',hypothesisId:'H5',location:'src/features/auth/services/auth-service.ts:63',message:'restoreSession failed',data:{status:(restoreError as {status?:number})?.status??null,willClear:authSessionStore.getAccessToken()===session.accessToken},timestamp:Date.now()})}).catch(()=>{});
      // #endregion

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
