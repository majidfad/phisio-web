import type { InternalAxiosRequestConfig } from 'axios';

import { authSessionStore } from '@/store/auth-session';

export function attachAuthToken(config: InternalAxiosRequestConfig): InternalAxiosRequestConfig {
  if (config.skipAuth) {
    return config;
  }

  const token = authSessionStore.getAccessToken();

  if (!token) {
    return config;
  }

  config.headers.set('Authorization', `Bearer ${token}`);

  return config;
}
