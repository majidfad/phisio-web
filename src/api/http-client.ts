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
// #region agent log
fetch('http://127.0.0.1:7278/ingest/3c071380-e9ac-4d92-a57f-e1db8fecd063',{method:'POST',headers:{'Content-Type':'application/json','X-Debug-Session-Id':'65b285'},body:JSON.stringify({sessionId:'65b285',runId:'run1',hypothesisId:'H1',location:'src/api/http-client.ts:13',message:'http client init',data:{apiBaseUrl:env.apiBaseUrl,rawEnv:import.meta.env.VITE_API_BASE_URL??null,mode:import.meta.env.MODE,dev:import.meta.env.DEV,origin:globalThis.location?.origin??null,swController:(globalThis.navigator?.serviceWorker?.controller?.scriptURL)??null},timestamp:Date.now()})}).catch(()=>{});
// #endregion

export const httpClient = axios.create({
  baseURL: env.apiBaseUrl,
  timeout: env.apiTimeoutMs,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

setupInterceptors(httpClient);
