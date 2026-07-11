import { applyMiddleware, createStore } from 'redux'
import rootReducer from './rootReducer'
import logger from 'redux-logger'
import { RootInfoState } from './infoReducer'
import { RootTemplateState } from './templateReducer'
import { composeWithDevTools } from '@redux-devtools/extension'

const store = createStore(
  rootReducer,
  composeWithDevTools(applyMiddleware(logger))
)

export default store

export type RootState = {
  infos: RootInfoState[]
  templates: RootTemplateState[]
}
