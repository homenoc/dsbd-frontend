import { createApiClient } from '@dsbd/shared';
import { restfulApiConfig } from '../api/Config';

/**
 * Shared API client for the admin app. Auth is the ACCESS_TOKEN header sourced
 * from sessionStorage (key 'AccessToken' — the one all call sites read). On 401
 * we clear the token and return to the login screen.
 */
export const api = createApiClient({
  baseURL: restfulApiConfig.apiURL,
  getAuthHeaders: () => ({ ACCESS_TOKEN: sessionStorage.getItem('AccessToken') ?? '' }),
  onUnauthorized: () => {
    sessionStorage.removeItem('AccessToken');
    if (window.location.pathname !== '/') {
      window.location.href = '/';
    }
  },
});
