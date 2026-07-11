import axios from 'axios'
import { restfulApiConfig } from './Config'
import { SupportAddData } from '../interface'
import Cookies from 'js-cookie'

export function Post(
  data: SupportAddData
): Promise<{ error: string | undefined; data: any }> {
  return axios
    .post(restfulApiConfig.apiURL + '/support', data, {
      headers: {
        'Content-Type': 'application/json',
        USER_TOKEN: Cookies.get('user_token')!,
        ACCESS_TOKEN: Cookies.get('access_token')!,
      },
    })
    .then((res) => {
      return {
        error: undefined,
        data: res.data,
      }
    })
    .catch((err) => {
      return {
        error: '[' + err.response.status + '] ' + err.response.data.error,
        data: null,
      }
    })
}

export function Put(
  id: number,
  data: any
): Promise<{ error: string | undefined; data: any }> {
  return axios
    .put(restfulApiConfig.apiURL + '/support/' + id, data, {
      headers: {
        'Content-Type': 'application/json',
        USER_TOKEN: Cookies.get('user_token')!,
        ACCESS_TOKEN: Cookies.get('access_token')!,
      },
    })
    .then((res) => {
      return {
        error: undefined,
        data: res.data,
      }
    })
    .catch((err) => {
      return {
        error: '[' + err.response.status + '] ' + err.response.data.error,
        data: null,
      }
    })
}
