import type { AxiosError, AxiosInstance, AxiosResponse, InternalAxiosRequestConfig } from 'axios';

import { parseApiError } from '@/api/errors/parse-api-error';
import { getRequestAuthorizationHeader } from '@/api/interceptors/request.interceptor';
import { authSessionStore } from '@/store/auth-session';

function handleSuccess(response: AxiosResponse): AxiosResponse {
  return response;
}

export function shouldClearSessionOnUnauthorized(
  error: AxiosError,
  status = error.response?.status,
): boolean {
  if (status !== 401 || error.config?.skipAuth) {
    return false;
  }

  const currentToken = authSessionStore.getAccessToken();
  const sentHeader = getRequestAuthorizationHeader(
    error.config as InternalAxiosRequestConfig | undefined,
  );

  if (!currentToken || !sentHeader) {
    return false;
  }

  return sentHeader.replace(/^Bearer\s+/i, '') === currentToken;
}

function handleError(error: AxiosError): Promise<never> {
  const apiError = parseApiError(error);

  // #region agent log
  if (apiError.status === 401) { fetch('http://127.0.0.1:7278/ingest/3c071380-e9ac-4d92-a57f-e1db8fecd063',{method:'POST',headers:{'Content-Type':'application/json','X-Debug-Session-Id':'65b285'},body:JSON.stringify({sessionId:'65b285',runId:'run1',hypothesisId:'H5',location:'src/api/interceptors/response.interceptor.ts:32',message:'401 received',data:{url:error.config?.url,baseURL:error.config?.baseURL,sentAuthHeader:Boolean(getRequestAuthorizationHeader(error.config as InternalAxiosRequestConfig|undefined)),currentTokenLength:authSessionStore.getAccessToken()?.length??0,willClear:shouldClearSessionOnUnauthorized(error,apiError.status)},timestamp:Date.now()})}).catch(()=>{}); }
  // #endregion

  if (shouldClearSessionOnUnauthorized(error, apiError.status)) {
    authSessionStore.clear();
  }

  return Promise.reject(apiError);
}

export function registerResponseInterceptors(client: AxiosInstance): void {
  client.interceptors.response.use(handleSuccess, handleError);
}
