import type { ApiError } from '@/api';
import i18n from '@/i18n';

/**
 * Returns a user-facing message from an API or unknown error.
 */
export function getErrorMessage(
  error: unknown,
  fallback = i18n.t('errors.somethingWentWrong'),
): string {
  if (isApiErrorLike(error)) {
    return error.errors[0] ?? error.message ?? fallback;
  }

  if (error instanceof Error) {
    return error.message;
  }

  return fallback;
}

function isApiErrorLike(error: unknown): error is ApiError {
  return (
    typeof error === 'object' &&
    error !== null &&
    'isApiError' in error &&
    (error as ApiError).isApiError === true
  );
}
