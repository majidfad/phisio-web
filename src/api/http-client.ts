import axios from 'axios';

import { setupInterceptors } from '@/api/interceptors/setup-interceptors';
import { env } from '@/constants/env';

/**
 * Shared Axios instance for Phisio API requests.
 *
 * - Base URL and timeout from environment variables
 * - JWT attached via request interceptor (unless `skipAuth: true`)
 * - API errors normalized to {@link ApiError}
 */
export const httpClient = axios.create({
  baseURL: env.apiBaseUrl,
  timeout: env.apiTimeoutMs,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

setupInterceptors(httpClient);
