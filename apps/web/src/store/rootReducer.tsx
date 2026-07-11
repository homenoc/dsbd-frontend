import { combineReducers } from 'redux'
import infos from './infoReducer'
import templates from './templateReducer'

const rootReducer = combineReducers({
  infos,
  templates,
})

export default rootReducer
