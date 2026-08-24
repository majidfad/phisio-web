import { AxiosHeaders, type InternalAxiosRequestConfig } from 'axios';

import { authSessionStore } from '@/store/auth-session';

export function getRequestAuthorizationHeader(
  config: InternalAxiosRequestConfig | undefined,
): string | undefined {
  const headers = config?.headers;

  if (!headers) {
    return undefined;
  }

  if (typeof headers.get === 'function') {
    const value = headers.get('Authorization');
    return typeof value === 'string' && value.length > 0 ? value : undefined;
  }

  const record = headers as unknown as Record<string, unknown>;
  const value = record.Authorization ?? record.authorization;
  return typeof value === 'string' && value.length > 0 ? value : undefined;
}

export function attachAuthToken(config: InternalAxiosRequestConfig): InternalAxiosRequestConfig {
  if (config.skipAuth) {
    return config;
  }

  const token = authSessionStore.getAccessToken();

  if (!token) {
    return config;
  }

  const headers = AxiosHeaders.from(config.headers ?? {});
  headers.set('Authorization', `Bearer ${token}`, true);
  config.headers = headers;

  return config;
}
