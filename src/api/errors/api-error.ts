import type { ApiErrorCode } from '@/types/api';

export class ApiError extends Error {
  readonly status?: number;
  readonly errors: string[];
  readonly code: ApiErrorCode;
  readonly isApiError = true;

  constructor(
    message: string,
    options: {
      status?: number;
      errors?: string[];
      code?: ApiErrorCode;
      cause?: unknown;
    } = {},
  ) {
    super(message, { cause: options.cause });
    this.name = 'ApiError';
    this.status = options.status;
    this.errors = options.errors ?? [message];
    this.code = options.code ?? 'unknown';
  }
}

export function isApiError(error: unknown): error is ApiError {
  return error instanceof ApiError;
}
