import axios from 'axios'
import { restfulApiConfig } from './Config'
import store from '../store'
import { getInfosFailure, getInfosSuccess } from '../store/action/Actions'
import Cookies from 'js-cookie'

// eslint-disable-next-line @typescript-eslint/ban-types
export function Get(): Promise<Object | string> {
  return axios
    .get(restfulApiConfig.apiURL + '/info', {
      headers: {
        'Content-Type': 'application/json',
        USER_TOKEN: Cookies.get('user_token')!,
        ACCESS_TOKEN: Cookies.get('access_token')!,
      },
    })
    .then((res) => {
      store.dispatch(getInfosSuccess(res.data))

      return res.data
    })
    .catch((err) => {
      // console.log(err.response);
      // console.log("[" + err.response.status + "] " + err.response.data.error);
      store.dispatch(
        getInfosFailure(
          '[' + err.response.status + '] ' + err.response.data.error
        )
      )
      return '[' + err.response.status + '] ' + err.response.data.error
    })
}

// eslint-disable-next-line @typescript-eslint/ban-types
export function GetTemplate(): Promise<Object | string> {
  return axios
    .get(restfulApiConfig.apiURL + '/template', {
      headers: {
        'Content-Type': 'application/json',
        USER_TOKEN: Cookies.get('user_token')!,
        ACCESS_TOKEN: Cookies.get('access_token')!,
      },
    })
    .then((res) => {
      return res.data
    })
    .catch((err) => {
      return '[' + err.response.status + '] ' + err.response.data.error
    })
}
