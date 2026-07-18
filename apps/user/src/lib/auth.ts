import Cookies from 'js-cookie';
import shaJS from 'sha.js';
import { api } from './api';

const len = 30;

function generateUserToken(): string {
  const c = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const cl = c.length;
  let result = '';
  for (let i = 0; i < len; i++) {
    result += c[Math.floor(Math.random() * cl)];
  }
  return result;
}

/**
 * The two-step login flow: GET /login (with a fresh USER_TOKEN cookie) for a
 * one-time challenge token, then POST /login with the SHA256 challenge hash
 * and Email headers. On success the access token cookie is written; on
 * failure an ApiError is thrown.
 */
export async function Login(email: string, password: string): Promise<void> {
  Cookies.set('user_token', generateUserToken());
  const init = await api.get<{ token: string }>('/login', {
    headers: {
      USER_TOKEN: Cookies.get('user_token')!,
    },
  });

  const passHash: string = shaJS('sha256').update(password).digest('hex');
  const hash: string = shaJS('sha256')
    .update(passHash + init.token)
    .digest('hex');

  const res = await api.post<{ token: { access_token: string }[] }>('/login', undefined, {
    headers: {
      USER_TOKEN: Cookies.get('user_token')!,
      HASH_PASS: hash,
      Email: email,
    },
  });
  Cookies.set('access_token', res.token[0].access_token);
}

export function Logout(): Promise<void> {
  return api.post<void>('/logout', {});
}
