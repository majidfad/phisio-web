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

  // #region agent log
  fetch('http://127.0.0.1:7278/ingest/3c071380-e9ac-4d92-a57f-e1db8fecd063',{method:'POST',headers:{'Content-Type':'application/json','X-Debug-Session-Id':'65b285'},body:JSON.stringify({sessionId:'65b285',runId:'run1',hypothesisId:'H2',location:'src/api/interceptors/request.interceptor.ts:29',message:'attachAuthToken',data:{url:config.url,baseURL:config.baseURL,method:config.method,hasToken:Boolean(token),tokenLength:token?.length??0},timestamp:Date.now()})}).catch(()=>{});
  // #endregion

  if (!token) {
    return config;
  }

  const headers = AxiosHeaders.from(config.headers ?? {});
  headers.set('Authorization', `Bearer ${token}`, true);
  config.headers = headers;

  return config;
}
