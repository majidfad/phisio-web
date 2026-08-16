import { AxiosHeaders, type InternalAxiosRequestConfig } from 'axios';
import { beforeEach, describe, expect, it } from 'vitest';

import { attachAuthToken } from '@/api/interceptors/request.interceptor';
import { authSessionStore } from '@/store/auth-session';

function config(): InternalAxiosRequestConfig {
  return { headers: new AxiosHeaders() } as InternalAxiosRequestConfig;
}

describe('attachAuthToken', () => {
  beforeEach(() => {
    authSessionStore.clear();
  });

  it('reads and attaches a token persisted immediately before the request', () => {
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

    const request = attachAuthToken(config());

    expect(request.headers.get('Authorization')).toBe('Bearer fresh-jwt');
  });

  it('does not attach authentication to explicitly public requests', () => {
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

    const request = attachAuthToken({
      ...config(),
      skipAuth: true,
    });

    expect(request.headers.get('Authorization')).toBeUndefined();
  });
});
