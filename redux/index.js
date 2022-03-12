import { createStore, applyMiddleware } from 'redux'
import { composeWithDevTools } from 'redux-devtools-extension/developmentOnly'
import thunk from 'redux-thunk'
import reducer from './reducer'

export const makeStore = () => {
  return createStore(reducer, composeWithDevTools(applyMiddleware(thunk)))
}
