import { AxiosError, type AxiosResponse, type InternalAxiosRequestConfig } from 'axios';
import { describe, expect, it } from 'vitest';

import { ApiError } from '@/api/errors/api-error';
import { parseApiError } from '@/api/errors/parse-api-error';

function createAxiosError(
  overrides: Partial<AxiosError<{ errors: string[] }>> = {},
): AxiosError<{ errors: string[] }> {
  const error = new AxiosError('Request failed') as AxiosError<{ errors: string[] }>;

  error.config = { headers: {} } as InternalAxiosRequestConfig;
  error.response = {
    status: 400,
    statusText: 'Bad Request',
    data: { errors: ['Validation failed.'] },
    headers: {},
    config: error.config,
  } as AxiosResponse<{ errors: string[] }>;

  return Object.assign(error, overrides);
}

describe('parseApiError', () => {
  it('returns the same ApiError when input is already ApiError', () => {
    const original = new ApiError('Already parsed', { status: 404, code: 'not_found' });

    expect(parseApiError(original)).toBe(original);
  });

  it('maps network errors without a response', () => {
    const axiosError = createAxiosError({ response: undefined });

    const result = parseApiError(axiosError);

    expect(result).toBeInstanceOf(ApiError);
    expect(result.code).toBe('network');
    expect(result.errors[0]).toContain('Unable to reach the server');
  });

  it('maps timeout errors', () => {
    const axiosError = createAxiosError({ code: 'ECONNABORTED', response: undefined });

    const result = parseApiError(axiosError);

    expect(result.code).toBe('timeout');
  });

  it('extracts backend validation errors', () => {
    const axiosError = createAxiosError({
      response: {
        status: 400,
        statusText: 'Bad Request',
        data: { errors: ['Phone number is already registered.'] },
        headers: {},
        config: {} as InternalAxiosRequestConfig,
      },
    });

    const result = parseApiError(axiosError);

    expect(result.code).toBe('validation');
    expect(result.status).toBe(400);
    expect(result.errors).toEqual(['Phone number is already registered.']);
    expect(result.message).toBe('Phone number is already registered.');
  });

  it('maps unauthorized responses', () => {
    const axiosError = createAxiosError({
      response: {
        status: 401,
        statusText: 'Unauthorized',
        data: { errors: ['Invalid phone number or password.'] },
        headers: {},
        config: {} as InternalAxiosRequestConfig,
      },
    });

    const result = parseApiError(axiosError);

    expect(result.code).toBe('unauthorized');
    expect(result.status).toBe(401);
  });
});
