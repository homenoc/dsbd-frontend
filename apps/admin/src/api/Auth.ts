import axios from 'axios'
import { restfulApiConfig } from './Config'

export function Login(username: string, password: string): Promise<string> {
  return axios
    .post(restfulApiConfig.apiURL + '/login', null, {
      headers: {
        'Content-Type': 'application/json',
        USER: username,
        PASS: password,
      },
    })
    .then((res) => {
      // NOTE: key must be 'AccessToken' — all 52 API call sites read that key.
      // Previously written as 'ACCESS_TOKEN', so the token was never read back
      // and every authenticated admin request sent a null token.
      sessionStorage.setItem('AccessToken', res.data.token[0].access_token)
      return ''
    })
    .catch((err) => {
      return err
    })
}

export function Logout(): Promise<string> {
  return axios
    .post(
      restfulApiConfig.apiURL + '/logout',
      {},
      {
        headers: {
          'Content-Type': 'application/json',
          ACCESS_TOKEN: sessionStorage.getItem('AccessToken')!,
        },
      }
    )
    .then(() => {
      return ''
    })
    .catch((err) => {
      return err
    })
}

// export const login = Login
