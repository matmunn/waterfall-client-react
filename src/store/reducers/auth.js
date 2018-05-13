import axios from 'axios'
import moment from 'moment'

import config from 'Config'

import { LOGIN, LOGOUT } from '../mutations'

const mutations = {
  [LOGIN]: (state, user) => {
    return {
      ...state,
      user,
      loginStatus: true
    }
  },
  [LOGOUT]: state => {
    return {
      ...state,
      loginStatus: false,
      user: {}
    }
  },
}

const initialState = {
  loginStatus: !!localStorage.getItem('loggedIn'),
  user: JSON.parse(localStorage.getItem('user')) || {}
}

const actions = {
  login: user => ({
    type: LOGIN,
    payload: user
  }),
  logout: () => ({
    type: LOGOUT,
    payload: null
  })
}

const dispatchers = {
  dispatchAttemptLogin: (dispatch, userData) => {
    return new Promise((resolve, reject) => {
      axios.post(`${config.baseApiUrl}/login`, userData).then(response => {
        if (response.status === 200) {
          dispatch(actions.login(response.data))
          localStorage.setItem('user', JSON.stringify(response.data))
          localStorage.setItem('loggedIn', true)
          localStorage.setItem('loginExpires', moment().add(24, 'hours').toISOString())
          resolve(response.data)
        }
        reject(response)
      }, err => {
        reject(err)
      })
    })
  },
  dispatchAttemptRegister: (dispatch, userData) => {
    return new Promise((resolve, reject) => {
      axios.post(`${config.baseApiUrl}/register`, userData).then(response => {
        if (response.status === 201) {
          dispatch(actions.login(response.data))
          localStorage.setItem('user', JSON.stringify(response.data))
          localStorage.setItem('loggedIn', true)
          localStorage.setItem('loginExpires', moment().add(24, 'hours').toISOString())
          resolve(response.data)
        }
        reject(response)
      }, err => {
        reject(err)
      })
    })
  },
  dispatchLogout: dispatch => {
    return new Promise((resolve, reject) => {
      localStorage.removeItem('user')
      localStorage.removeItem('loggedIn')
      localStorage.removeItem('loginExpires')
      dispatch(actions.logout())
      resolve()
    })
  },
}

const reducer = (state = initialState, action) => {
  return mutations[action.type] ? mutations[action.type](state, action.payload) : state
}


export {
  reducer as default,
  dispatchers
}
