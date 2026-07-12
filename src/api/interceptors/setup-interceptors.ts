import type { AxiosInstance } from 'axios';

import { attachAuthToken } from '@/api/interceptors/request.interceptor';
import { registerResponseInterceptors } from '@/api/interceptors/response.interceptor';

export function setupInterceptors(client: AxiosInstance): void {
  client.interceptors.request.use(attachAuthToken);
  registerResponseInterceptors(client);
}
