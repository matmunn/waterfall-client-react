import { combineReducers } from 'redux'
import tasks from './tasks'
import categories from './categories'
import auth from './auth'

const rootReducer = combineReducers({
  tasks,
  categories,
  auth,
})

export default rootReducer
