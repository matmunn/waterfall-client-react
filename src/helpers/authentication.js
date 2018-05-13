import moment from 'moment'
import store from '@/store'

import { dispatchers } from '@/store/reducers/auth'

export const isLoggedIn = () => {
  return store.getState().auth.loginStatus
}

export const attemptLogin = (email, password) => {
  return dispatchers.dispatchAttemptLogin(store.dispatch, {
    email,
    password
  })
}

export const logout = () => {
  return dispatchers.dispatchLogout(store.dispatch)
}

export const getUser = () => {
  return store.getState().auth.user
}

export const getToken = () => {
  return getUser().api_token || ''
}

export const expireInvalidLogins = () => {
  if (localStorage.getItem('loginExpires') !== null) {
    const expiry = moment(localStorage.getItem('loginExpires'))
    if (expiry < moment()) {
      dispatchers.dispatchLogout(store.dispatch)
    }
  }
}

export default {
  isLoggedIn,
  attemptLogin,
  logout,
  getUser,
  getToken,
  expireInvalidLogins
}
