import { combineReducers } from 'redux'
import tasks from './tasks'
// import city from './city'
// import categories from './categories'
// import guides from './guides'
// import users from './users'
// import auth from './auth'

const rootReducer = combineReducers({
  tasks,
  // categories,
  // guides,
  // users,
  // auth,
})

export default rootReducer
