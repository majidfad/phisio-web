/**
 * Application environment variables.
 * All Vite env vars must be prefixed with VITE_.
 */
export const env = {
  apiBaseUrl: import.meta.env.VITE_API_BASE_URL ?? '/api',
  apiTimeoutMs: Number(import.meta.env.VITE_API_TIMEOUT_MS ?? 30_000),
  /** Default: 500 MB. Must stay aligned with proxy/API upload limits. */
  maxExerciseUploadBytes: Number(import.meta.env.VITE_MAX_EXERCISE_UPLOAD_BYTES ?? 524_288_000),
  /** Default: 10 minutes — large exercise video uploads. */
  uploadTimeoutMs: Number(import.meta.env.VITE_UPLOAD_TIMEOUT_MS ?? 600_000),
  authTokenStorageKey: import.meta.env.VITE_AUTH_TOKEN_STORAGE_KEY ?? 'phisio.auth.token',
  authSessionStorageKey: import.meta.env.VITE_AUTH_SESSION_STORAGE_KEY ?? 'phisio.auth.session',
  /** Marketing site (zivan.me). Localhost ignores this and keeps a single origin. */
  landingOrigin: import.meta.env.VITE_LANDING_ORIGIN ?? 'https://zivan.me',
  /** App site (app.zivan.me). Localhost ignores this and keeps a single origin. */
  appOrigin: import.meta.env.VITE_APP_ORIGIN ?? 'https://app.zivan.me',
  /** Git commit / release id baked into each production build. */
  appVersion: import.meta.env.VITE_APP_VERSION ?? 'dev',
  isDev: import.meta.env.DEV,
  isProd: import.meta.env.PROD,
} as const;
