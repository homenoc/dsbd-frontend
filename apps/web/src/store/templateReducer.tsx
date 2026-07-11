import {
  GET_TEMPLATES_FAILURE,
  GET_TEMPLATES_SUCCESS,
  GET_TEMPLATES_REQUEST,
  CLEAR_TEMPLATES,
} from './action/Actions'
import { TemplateData } from '../interface'

const initialTemplateState = {
  isFetching: false,
  data: null,
}

export type RootTemplateState = {
  isFetching: false
  data: TemplateData
  lastUpdated: number
  error: string
}

const templates = (state = [initialTemplateState], action: any) => {
  switch (action.type) {
    case GET_TEMPLATES_REQUEST:
      return [
        ...state,
        {
          isFetching: true,
          data: null,
        },
      ]
    case GET_TEMPLATES_SUCCESS:
      return [
        ...state,
        {
          isFetching: false,
          data: action.data,
          lastUpdated: action.receivedAt,
        },
      ]
    case GET_TEMPLATES_FAILURE:
      return [
        ...state,
        {
          isFetching: false,
          error: action.error,
        },
      ]
    case CLEAR_TEMPLATES:
      return [{ isFetching: false }]
    default:
      return state
  }
}

export default templates
