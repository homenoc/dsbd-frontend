import { createApiClient } from '@dsbd/shared';
import Cookies from 'js-cookie';
import { restfulApiConfig } from './config';

/**
 * Shared API client for the user app. Auth uses the dual USER_TOKEN /
 * ACCESS_TOKEN cookies. On 401 we clear both cookies and return to /login,
 * replacing the 401 handler copy-pasted across ~14 files.
 */
export const api = createApiClient({
  baseURL: restfulApiConfig.apiURL,
  getAuthHeaders: () => ({
    USER_TOKEN: Cookies.get('user_token') ?? '',
    ACCESS_TOKEN: Cookies.get('access_token') ?? '',
  }),
  onUnauthorized: () => {
    Cookies.remove('user_token');
    Cookies.remove('access_token');
    if (window.location.pathname !== '/login') {
      window.location.href = '/login';
    }
  },
});
