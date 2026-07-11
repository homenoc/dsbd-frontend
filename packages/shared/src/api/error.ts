/**
 * Normalized API error thrown by the shared client. Callers (and TanStack
 * Query) receive this instead of the previous `{ error: string }` convention.
 */
export class ApiError extends Error {
  /** HTTP status, or 0 for a network / no-response failure. */
  readonly status: number;
  /** The server's `error` field verbatim (e.g. VLAN exhaustion / NetBox down). */
  readonly serverMessage: string;

  constructor(status: number, serverMessage: string) {
    super(status === 0 ? serverMessage : `[${status}] ${serverMessage}`);
    this.name = 'ApiError';
    this.status = status;
    this.serverMessage = serverMessage;
  }

  get isAuthError(): boolean {
    return this.status === 401;
  }
}
