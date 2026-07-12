/**
 * Standard API error response from the Phisio backend.
 */
export interface ApiErrorResponse {
  errors: string[];
}

export type ApiErrorCode =
  | 'network'
  | 'timeout'
  | 'unauthorized'
  | 'forbidden'
  | 'not_found'
  | 'validation'
  | 'server'
  | 'unknown';
