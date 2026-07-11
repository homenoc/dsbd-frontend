import { ApiError } from './error';

export interface ApiClientConfig {
  /** Base URL, e.g. import.meta.env.VITE_API_URL. */
  baseURL: string;
  /**
   * Auth headers to merge into every request. web returns USER_TOKEN +
   * ACCESS_TOKEN (cookies); admin returns ACCESS_TOKEN (sessionStorage).
   */
  getAuthHeaders: () => Record<string, string>;
  /** Called once on any 401 (clear tokens + redirect to login). */
  onUnauthorized?: () => void;
}

export interface RequestOptions {
  /** Extra headers for this request. */
  headers?: Record<string, string>;
  /** Query parameters (undefined/null values are skipped). */
  query?: Record<string, string | number | boolean | undefined | null>;
  /** Abort signal. */
  signal?: AbortSignal;
}

export interface ApiClient {
  get<T>(path: string, opts?: RequestOptions): Promise<T>;
  post<T>(path: string, body?: unknown, opts?: RequestOptions): Promise<T>;
  put<T>(path: string, body?: unknown, opts?: RequestOptions): Promise<T>;
  delete<T>(path: string, opts?: RequestOptions): Promise<T>;
}

/**
 * Build the shared API client over the native fetch API (no axios). Every
 * request merges the app's auth headers and JSON content type; every non-2xx
 * or network failure is thrown as an ApiError (see error.ts), and a 401 fires
 * onUnauthorized. Replaces the per-file header blocks, the copy-pasted
 * `[status] message` handling, and the unguarded `err.response` access.
 */
export function createApiClient(config: ApiClientConfig): ApiClient {
  async function request<T>(
    method: string,
    path: string,
    body?: unknown,
    opts?: RequestOptions,
  ): Promise<T> {
    const url = buildUrl(config.baseURL, path, opts?.query);
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...config.getAuthHeaders(),
      ...opts?.headers,
    };

    let res: Response;
    try {
      res = await fetch(url, {
        method,
        headers,
        body: body === undefined ? undefined : JSON.stringify(body),
        signal: opts?.signal,
      });
    } catch (e) {
      // Network error, DNS failure, CORS block, abort, etc. — no response.
      throw new ApiError(0, e instanceof Error ? e.message : 'network error');
    }

    const text = await res.text();
    const data = text ? safeJsonParse(text) : undefined;

    if (!res.ok) {
      if (res.status === 401) {
        config.onUnauthorized?.();
      }
      throw new ApiError(res.status, serverMessageOf(data, text) || res.statusText);
    }

    return data as T;
  }

  return {
    get: (path, opts) => request('GET', path, undefined, opts),
    post: (path, body, opts) => request('POST', path, body, opts),
    put: (path, body, opts) => request('PUT', path, body, opts),
    delete: (path, opts) => request('DELETE', path, undefined, opts),
  };
}

function buildUrl(baseURL: string, path: string, query?: RequestOptions['query']): string {
  const base = baseURL.replace(/\/$/, '') + path;
  if (!query) return base;
  const params = new URLSearchParams();
  for (const [key, value] of Object.entries(query)) {
    if (value !== undefined && value !== null) {
      params.append(key, String(value));
    }
  }
  const qs = params.toString();
  return qs ? `${base}?${qs}` : base;
}

function safeJsonParse(text: string): unknown {
  try {
    return JSON.parse(text);
  } catch {
    return text;
  }
}

function serverMessageOf(data: unknown, fallback: string): string {
  if (data && typeof data === 'object' && 'error' in data) {
    return String((data as { error: unknown }).error);
  }
  return fallback;
}
