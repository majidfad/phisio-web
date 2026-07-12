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

function readFromStorage(): StoredAuthSession | null {
  const storage = getLocalStorage();

  if (!storage) {
    return memorySession.value;
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

    return memorySession.value;
  } catch {
    return memorySession.value;
  }
}

function writeToStorage(session: StoredAuthSession | null): void {
  memorySession.value = session;

  const storage = getLocalStorage();

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
    return readFromStorage();
  },

  save(session: StoredAuthSession): void {
    writeToStorage(session);
  },

  clear(): void {
    writeToStorage(null);
    dispatchSessionCleared();
  },

  getAccessToken(): string | null {
    return readFromStorage()?.accessToken ?? null;
  },

  hasValidSession(): boolean {
    const session = readFromStorage();

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
