import {
  GET_INFOS,
  GET_INFOS_SUCCESS,
  GET_INFOS_FAILURE,
  CLEAR_INFOS,
} from './action/Actions'
import { InfoData } from '../interface'

const initialInfoState: RootInfoState = {
  isFetching: false,
  remote: false,
}

export type RootInfoState = {
  isFetching: boolean
  remote: boolean
  data?: InfoData
  lastUpdated?: string
  error?: string
}

const infos = (state = [initialInfoState], action: any): RootInfoState[] => {
  switch (action.type) {
    case GET_INFOS:
      const length = state.length
      const tmpData = state[length - 1]

      return [
        ...state,
        {
          isFetching: true,
          remote: false,
          data: tmpData.data,
          lastUpdated: tmpData.lastUpdated,
        },
      ]
    case GET_INFOS_SUCCESS:
      return [
        ...state,
        {
          isFetching: false,
          remote: true,
          data: action.data,
          lastUpdated: action.receivedAt,
        },
      ]
    case GET_INFOS_FAILURE:
      return [
        ...state,
        {
          isFetching: false,
          remote: true,
          error: action.error,
        },
      ]
    case CLEAR_INFOS:
      return [{ isFetching: false, remote: false }]
    default:
      return state
  }
}

export default infos
