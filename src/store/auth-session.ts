import { env } from '@/constants/env';
import type { AuthenticatedUser } from '@/types/auth';

export const AUTH_SESSION_CLEARED_EVENT = 'phisio:auth-session-cleared';

export interface StoredAuthSession {
  accessToken: string;
  expiresAt: string;
  user: AuthenticatedUser;
}

const memorySession: { value: StoredAuthSession | null } = { value: null };

function getLocalStorage(): Storage | null {
  try {
    return globalThis.localStorage ?? null;
  } catch {
    return null;
  }
}

function readFromLocalStorage(): StoredAuthSession | null {
  const storage = getLocalStorage();

  if (!storage) {
    return null;
  }

  try {
    const sessionRaw = storage.getItem(env.authSessionStorageKey);

    if (sessionRaw) {
      return JSON.parse(sessionRaw) as StoredAuthSession;
    }

    const legacyToken = storage.getItem(env.authTokenStorageKey);

    if (legacyToken) {
      return {
        accessToken: legacyToken,
        expiresAt: new Date(Date.now() + 60 * 60 * 1000).toISOString(),
        user: {
          userId: '',
          phoneNumber: '',
          email: null,
          name: '',
          role: 'Patient',
          roles: [],
        },
      };
    }

    return null;
  } catch {
    return null;
  }
}

function getSession(): StoredAuthSession | null {
  if (memorySession.value) {
    return memorySession.value;
  }

  const stored = readFromLocalStorage();

  if (stored) {
    memorySession.value = stored;
  }

  return stored;
}

function writeToStorage(session: StoredAuthSession | null): void {
  memorySession.value = session;

  const storage = getLocalStorage();

  // #region agent log
  fetch('http://127.0.0.1:7278/ingest/3c071380-e9ac-4d92-a57f-e1db8fecd063',{method:'POST',headers:{'Content-Type':'application/json','X-Debug-Session-Id':'65b285'},body:JSON.stringify({sessionId:'65b285',runId:'run1',hypothesisId:'H4',location:'src/store/auth-session.ts:73',message:session?'session write':'session erase',data:{hasStorage:Boolean(storage),tokenLength:session?.accessToken?.length??0,role:session?.user?.role??null,sessionKey:env.authSessionStorageKey,stack:new Error().stack?.split('\n').slice(1,6).join(' | ')},timestamp:Date.now()})}).catch(()=>{});
  // #endregion

  if (!storage) {
    return;
  }

  try {
    if (session === null) {
      storage.removeItem(env.authSessionStorageKey);
      storage.removeItem(env.authTokenStorageKey);
      return;
    }

    storage.setItem(env.authSessionStorageKey, JSON.stringify(session));
    storage.setItem(env.authTokenStorageKey, session.accessToken);

    // #region agent log
    fetch('http://127.0.0.1:7278/ingest/3c071380-e9ac-4d92-a57f-e1db8fecd063',{method:'POST',headers:{'Content-Type':'application/json','X-Debug-Session-Id':'65b285'},body:JSON.stringify({sessionId:'65b285',runId:'run1',hypothesisId:'H4',location:'src/store/auth-session.ts:89',message:'session persisted readback',data:{readBackLength:storage.getItem(env.authSessionStorageKey)?.length??0,legacyTokenLength:storage.getItem(env.authTokenStorageKey)?.length??0},timestamp:Date.now()})}).catch(()=>{});
    // #endregion
  } catch {
    // Fall back to in-memory storage when localStorage is unavailable.
  }
}

function dispatchSessionCleared(): void {
  if (typeof globalThis === 'undefined') {
    return;
  }

  globalThis.dispatchEvent?.(new Event(AUTH_SESSION_CLEARED_EVENT));
}

function isExpired(expiresAt: string): boolean {
  const expiresAtMs = Date.parse(expiresAt);

  if (Number.isNaN(expiresAtMs)) {
    return false;
  }

  return expiresAtMs <= Date.now();
}

/**
 * Persists JWT and authenticated user snapshot for auto-login on refresh.
 */
export const authSessionStore = {
  get(): StoredAuthSession | null {
    return getSession();
  },

  save(session: StoredAuthSession): void {
    writeToStorage(session);
  },

  clear(): void {
    writeToStorage(null);
    dispatchSessionCleared();
  },

  getAccessToken(): string | null {
    return getSession()?.accessToken ?? null;
  },

  hasValidSession(): boolean {
    const session = getSession();

    if (!session?.accessToken) {
      return false;
    }

    return !isExpired(session.expiresAt);
  },

  isExpired(expiresAt: string): boolean {
    return isExpired(expiresAt);
  },
};

/** @deprecated Use authSessionStore.getAccessToken() */
export const authTokenStore = {
  get(): string | null {
    return authSessionStore.getAccessToken();
  },

  set(token: string): void {
    const existing = authSessionStore.get();

    if (existing) {
      authSessionStore.save({ ...existing, accessToken: token });
      return;
    }

    writeToStorage({
      accessToken: token,
      expiresAt: new Date(Date.now() + 60 * 60 * 1000).toISOString(),
      user: {
        userId: '',
        phoneNumber: '',
        email: null,
        name: '',
        role: 'Patient',
        roles: [],
      },
    });
  },

  clear(): void {
    authSessionStore.clear();
  },

  hasToken(): boolean {
    return authSessionStore.getAccessToken() !== null;
  },
};
