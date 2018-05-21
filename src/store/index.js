import { createStore } from 'redux'
import rootReducer from './modules/index'

const configureStore = initialState => {
  const store = createStore(
    rootReducer,
    initialState,
    window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
  )

  return store
}

const store = configureStore()

export default store
