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

  if (shouldClearSessionOnUnauthorized(error, apiError.status)) {
    authSessionStore.clear();
  }

  return Promise.reject(apiError);
}

export function registerResponseInterceptors(client: AxiosInstance): void {
  client.interceptors.response.use(handleSuccess, handleError);
}
