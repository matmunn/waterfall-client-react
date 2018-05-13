import { combineReducers } from 'redux'
import tasks from './tasks'
import categories from './categories'
import auth from './auth'
import users from './users'
import clients from './clients'
import notes from './notes'

const rootReducer = combineReducers({
  tasks,
  categories,
  auth,
  users,
  clients,
  notes,
})

export default rootReducer
