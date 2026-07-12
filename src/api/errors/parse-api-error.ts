import axios, { type AxiosError } from 'axios';

import { ApiError } from '@/api/errors/api-error';
import i18n from '@/i18n';
import type { ApiErrorCode, ApiErrorResponse } from '@/types/api';

function resolveErrorCode(status?: number): ApiErrorCode {
  if (status === undefined) {
    return 'unknown';
  }

  if (status === 401) {
    return 'unauthorized';
  }

  if (status === 403) {
    return 'forbidden';
  }

  if (status === 404) {
    return 'not_found';
  }

  if (status === 400 || status === 422) {
    return 'validation';
  }

  if (status >= 500) {
    return 'server';
  }

  return 'unknown';
}

function extractErrors(data: unknown, fallbackMessage: string): string[] {
  if (
    typeof data === 'object' &&
    data !== null &&
    'errors' in data &&
    Array.isArray((data as ApiErrorResponse).errors) &&
    (data as ApiErrorResponse).errors.length > 0
  ) {
    return (data as ApiErrorResponse).errors;
  }

  return [fallbackMessage];
}

export function parseApiError(error: unknown): ApiError {
  if (error instanceof ApiError) {
    return error;
  }

  if (!axios.isAxiosError(error)) {
    const message = error instanceof Error ? error.message : i18n.t('errors.unexpected');
    return new ApiError(message, { code: 'unknown', cause: error });
  }

  return parseAxiosError(error);
}

function parseAxiosError(error: AxiosError<ApiErrorResponse>): ApiError {
  if (error.code === 'ECONNABORTED') {
    return new ApiError(i18n.t('errors.timeout'), {
      code: 'timeout',
      cause: error,
    });
  }

  if (!error.response) {
    return new ApiError(i18n.t('errors.network'), {
      code: 'network',
      cause: error,
    });
  }

  const { status, data } = error.response;
  const code = resolveErrorCode(status);
  const fallbackMessage = error.message || i18n.t('errors.requestFailed');
  const errors = extractErrors(data, fallbackMessage);
  const message = errors[0] ?? fallbackMessage;

  return new ApiError(message, {
    status,
    errors,
    code,
    cause: error,
  });
}
