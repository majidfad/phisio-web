import { AxiosError, AxiosHeaders, type InternalAxiosRequestConfig } from 'axios';
import { beforeEach, describe, expect, it } from 'vitest';

import { shouldClearSessionOnUnauthorized } from '@/api/interceptors/response.interceptor';
import { authSessionStore } from '@/store/auth-session';

function unauthorized(headers = new AxiosHeaders()): AxiosError {
  const config = { headers } as InternalAxiosRequestConfig;
  const error = new AxiosError('Unauthorized');
  error.config = config;
  error.response = {
    status: 401,
    statusText: 'Unauthorized',
    data: {},
    headers: {},
    config,
  };
  return error;
}

describe('shouldClearSessionOnUnauthorized', () => {
  beforeEach(() => {
    authSessionStore.clear();
  });

  it('does not clear a fresh session for an older request sent without a token', () => {
    authSessionStore.save({
      accessToken: 'fresh-jwt',
      expiresAt: new Date(Date.now() + 60_000).toISOString(),
      user: {
        userId: 'admin-id',
        phoneNumber: '+15550000001',
        email: null,
        name: 'Admin User',
        role: 'Admin',
        roles: ['Admin'],
      },
    });

    expect(shouldClearSessionOnUnauthorized(unauthorized())).toBe(false);
    expect(authSessionStore.getAccessToken()).toBe('fresh-jwt');
  });

  it('clears only when the server rejected the current token', () => {
    authSessionStore.save({
      accessToken: 'current-jwt',
      expiresAt: new Date(Date.now() + 60_000).toISOString(),
      user: {
        userId: 'admin-id',
        phoneNumber: '+15550000001',
        email: null,
        name: 'Admin User',
        role: 'Admin',
        roles: ['Admin'],
      },
    });
    const headers = new AxiosHeaders();
    headers.set('Authorization', 'Bearer current-jwt');

    expect(shouldClearSessionOnUnauthorized(unauthorized(headers))).toBe(true);
  });
});
