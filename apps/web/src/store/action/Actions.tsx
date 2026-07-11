import axios from 'axios'
import { InfoData } from '../../interface'
import { restfulApiConfig } from '../../api/Config'
import Cookies from 'js-cookie'

export const GET_INFOS = 'GET_INFOS'
export const getInfos = () => {
  return {
    type: GET_INFOS,
  }
}

export const GET_INFOS_SUCCESS = 'GET_INFOS_SUCCESS'
export const getInfosSuccess = (json: InfoData) => {
  const date = new Date()
  return {
    type: GET_INFOS_SUCCESS,
    data: json,
    receivedAt: date.toLocaleString(),
  }
}

export const GET_INFOS_FAILURE = 'GET_INFOS_FAILURE'
export const getInfosFailure = (error: string) => {
  return {
    type: GET_INFOS_FAILURE,
    error,
  }
}

export const CLEAR_INFOS = 'CLEAR_INFOS'
export const clearInfos = () => {
  return {
    type: CLEAR_INFOS,
  }
}

export const renewInfos = () => {
  return (dispatch: any) => {
    axios
      .get(restfulApiConfig.apiURL + '/info', {
        headers: {
          'Content-Type': 'application/json',
          USER_TOKEN: Cookies.get('user_token')!,
          ACCESS_TOKEN: Cookies.get('access_token')!,
        },
      })
      .then((res) => {
        return dispatch(getInfosSuccess(res.data))
      })
      .catch((err) => {
        return dispatch(
          getInfosFailure(
            '[' + err.response.status + '] ' + err.response.data.error
          )
        )
      })
  }
}

export const GET_TEMPLATES_REQUEST = 'GET_TEMPLATES_REQUEST'
const getTemplatesRequest = () => {
  return {
    type: GET_TEMPLATES_REQUEST,
  }
}

export const GET_TEMPLATES_SUCCESS = 'GET_TEMPLATES_SUCCESS'
export const getTemplatesSuccess = (json: InfoData) => {
  return {
    type: GET_TEMPLATES_SUCCESS,
    data: json,
    receivedAt: Date.now().toLocaleString(),
  }
}

export const GET_TEMPLATES_FAILURE = 'GET_TEMPLATES_FAILURE'
export const getTemplatesFailure = (error: string) => {
  return {
    type: GET_TEMPLATES_FAILURE,
    error,
  }
}

export const CLEAR_TEMPLATES = 'CLEAR_TEMPLATES'
export const clearTemplates = () => {
  return {
    type: CLEAR_TEMPLATES,
  }
}

export const getTemplates = () => {
  return (dispatch: any) => {
    dispatch(getTemplatesRequest())
    axios
      .get(restfulApiConfig.apiURL + '/template', {
        headers: {
          'Content-Type': 'application/json',
          USER_TOKEN: Cookies.get('user_token')!,
          ACCESS_TOKEN: Cookies.get('access_token')!,
        },
      })
      .then((res) => {
        dispatch(getTemplatesSuccess(res.data))
      })
      .catch((err) => {
        dispatch(
          getTemplatesFailure(
            '[' + err.response.status + '] ' + err.response.data.error
          )
        )
      })
  }
}
