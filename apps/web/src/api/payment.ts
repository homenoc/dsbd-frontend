import { restfulApiConfig } from './Config'
import axios from 'axios'
import Cookies from 'js-cookie'

export function PostSubscribe(
  plan: string
): Promise<{ error: string; data: any }> {
  return axios
    .post(
      restfulApiConfig.apiURL + '/payment/subscribe',
      { plan },
      {
        headers: {
          'Content-Type': 'application/json',
          USER_TOKEN: Cookies.get('user_token')!,
          ACCESS_TOKEN: Cookies.get('access_token')!,
        },
      }
    )
    .then((res) => {
      return {
        error: '',
        data: res.data.url,
      }
    })
    .catch((err) => {
      return {
        error: '[' + err.response.status + '] ' + err.response.data.error,
        data: null,
      }
    })
}

export function GetPayment(): Promise<{ error: string; data: any }> {
  return axios
    .get(restfulApiConfig.apiURL + '/payment', {
      headers: {
        'Content-Type': 'application/json',
        USER_TOKEN: Cookies.get('user_token')!,
        ACCESS_TOKEN: Cookies.get('access_token')!,
      },
    })
    .then((res) => {
      return {
        error: '',
        data: res.data.url,
      }
    })
    .catch((err) => {
      return {
        error: '[' + err.response.status + '] ' + err.response.data.error,
        data: null,
      }
    })
}
