import 'axios';

declare module 'axios' {
  export interface AxiosRequestConfig {
    /** When true, the Authorization header is not attached. */
    skipAuth?: boolean;
  }
}
