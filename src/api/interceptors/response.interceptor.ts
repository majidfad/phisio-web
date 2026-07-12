import type { AxiosError, AxiosInstance, AxiosResponse } from 'axios';

import { parseApiError } from '@/api/errors/parse-api-error';
import { authSessionStore } from '@/store/auth-session';

function handleSuccess(response: AxiosResponse): AxiosResponse {
  return response;
}

function handleError(error: AxiosError): Promise<never> {
  const apiError = parseApiError(error);

  if (apiError.status === 401) {
    authSessionStore.clear();
  }

  return Promise.reject(apiError);
}

export function registerResponseInterceptors(client: AxiosInstance): void {
  client.interceptors.response.use(handleSuccess, handleError);
}
