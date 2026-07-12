/**
 * Application environment variables.
 * All Vite env vars must be prefixed with VITE_.
 */
export const env = {
  apiBaseUrl: import.meta.env.VITE_API_BASE_URL ?? '/api',
  apiTimeoutMs: Number(import.meta.env.VITE_API_TIMEOUT_MS ?? 30_000),
  authTokenStorageKey: import.meta.env.VITE_AUTH_TOKEN_STORAGE_KEY ?? 'phisio.auth.token',
  authSessionStorageKey: import.meta.env.VITE_AUTH_SESSION_STORAGE_KEY ?? 'phisio.auth.session',
  isDev: import.meta.env.DEV,
  isProd: import.meta.env.PROD,
} as const;
