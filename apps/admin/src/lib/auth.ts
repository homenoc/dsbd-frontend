import { api } from './api';

export async function login(username: string, password: string): Promise<void> {
  const res = await api.post<{ token: { access_token: string }[] }>('/login', undefined, {
    headers: {
      USER: username,
      PASS: password,
    },
  });
  // NOTE: key must be 'AccessToken' — all API call sites read that key.
  // Previously written as 'ACCESS_TOKEN', so the token was never read back
  // and every authenticated admin request sent a null token.
  sessionStorage.setItem('AccessToken', res.token[0].access_token);
}

export function logout(): Promise<void> {
  return api.post<void>('/logout', {});
}
