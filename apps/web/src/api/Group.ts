import axios from 'axios'
import { restfulApiConfig } from './Config'
import { GroupAddData } from '../interface'
import Cookies from 'js-cookie'

export function Post(
  data: GroupAddData
): Promise<{ error: string; data: any }> {
  return axios
    .post(restfulApiConfig.apiURL + '/group', data, {
      headers: {
        'Content-Type': 'application/json',
        USER_TOKEN: Cookies.get('user_token')!,
        ACCESS_TOKEN: Cookies.get('access_token')!,
      },
    })
    .then((res) => {
      return {
        error: '',
        data: res.data.group,
      }
    })
    .catch((err) => {
      return {
        error: '[' + err.response.status + '] ' + err.response.data.error,
        data: null,
      }
    })
}
