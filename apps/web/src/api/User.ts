import axios from 'axios'
import { restfulApiConfig } from './Config'
import { UserAddData } from '../interface'
import Cookies from 'js-cookie'

export function Post(
  data: UserAddData
): Promise<{ error: string | undefined }> {
  return axios
    .post(restfulApiConfig.apiURL + '/user', data, {
      headers: {
        'Content-Type': 'application/json',
        USER_TOKEN: Cookies.get('user_token')!,
        ACCESS_TOKEN: Cookies.get('access_token')!,
      },
    })
    .then((res) => {
      return {
        error: undefined,
      }
    })
    .catch((err) => {
      return {
        error: '[' + err.response.status + '] ' + err.response.data.error,
      }
    })
}

export function PostGroup(
  id: number,
  data: UserAddData
): Promise<{ error: string | undefined }> {
  return axios
    .post(restfulApiConfig.apiURL + '/group/' + id + '/user', data, {
      headers: {
        'Content-Type': 'application/json',
        USER_TOKEN: Cookies.get('user_token')!,
        ACCESS_TOKEN: Cookies.get('access_token')!,
      },
    })
    .then((res) => {
      return {
        error: undefined,
      }
    })
    .catch((err) => {
      return {
        error: '[' + err.response.status + '] ' + err.response.data.error,
      }
    })
}

export function Delete(id: number): Promise<{ error: string | undefined }> {
  return axios
    .delete(restfulApiConfig.apiURL + '/user/' + id, {
      headers: {
        'Content-Type': 'application/json',
        USER_TOKEN: Cookies.get('user_token')!,
        ACCESS_TOKEN: Cookies.get('access_token')!,
      },
    })
    .then((res) => {
      return {
        error: undefined,
      }
    })
    .catch((err) => {
      return {
        error: '[' + err.response.status + '] ' + err.response.data.error,
      }
    })
}

export function Put(
  id: number,
  data: any
): Promise<{ error: string | undefined }> {
  return axios
    .put(restfulApiConfig.apiURL + '/user/' + id, data, {
      headers: {
        'Content-Type': 'application/json',
        USER_TOKEN: Cookies.get('user_token')!,
        ACCESS_TOKEN: Cookies.get('access_token')!,
      },
    })
    .then((res) => {
      return {
        error: undefined,
      }
    })
    .catch((err) => {
      return {
        error: '[' + err.response.status + '] ' + err.response.data.error,
      }
    })
}

export function PasswordRecovery(
  email: string
): Promise<{ error: string | undefined; data: any }> {
  return axios
    .post(
      restfulApiConfig.apiURL + '/recovery',
      { email },
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

export function AgreeAntisocial(): Promise<{ error: string | undefined }> {
  return axios
    .put(restfulApiConfig.apiURL + '/user/antisocial/agree', null, {
      headers: {
        'Content-Type': 'application/json',
        USER_TOKEN: Cookies.get('user_token')!,
        ACCESS_TOKEN: Cookies.get('access_token')!,
      },
    })
    .then((res) => {
      return {
        error: undefined,
      }
    })
    .catch((err) => {
      return {
        error: '[' + err.response.status + '] ' + err.response.data.error,
      }
    })
}
