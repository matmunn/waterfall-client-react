import axios from 'axios'
import { filter, findIndex } from 'lodash'

import config from 'Config'

import { SET_USERS, ADD_USER, UPDATE_USER, DELETE_USER } from '../mutations'

const mutations = {
  [SET_USERS]: (state, users) => {
    return {
      ...state,
      users,
    }
  },
  [ADD_USER]: (state, user) => {
    return {
      ...state,
      users: [
        ...state.users,
        user
      ]
    }
  },
  [UPDATE_USER]: (state, user) => {
    const elmIndex = findIndex(state.users, x => x.id === user.id)

    let data = Array.from(state.users)
    data.splice(elmIndex, 1, user)

    return {
      ...state,
      users: data,
    }
  },
  [DELETE_USER]: (state, userId) => {
    return {
      ...state,
      users: filter(state.users, x => x.id !== userId)
    }
  },
}

const initialState = {
  users: []
}

export const actionSetUsers = users => ({
  type: SET_USERS,
  payload: users
})

export const actionAddUser = user => ({
  type: ADD_USER,
  payload: user
})

export const actionUpdateUser = user => ({
  type: UPDATE_USER,
  payload: user
})

export const actionDeleteUser = userId => ({
  type: DELETE_USER,
  payload: userId
})

const actions = {
  setUsers: actionSetUsers,
  addUser: actionAddUser,
  updateUser: actionUpdateUser,
  deleteUser: actionDeleteUser
}

export const dispatchGetAllUsers = dispatch => {
  return new Promise((resolve, reject) => {
    axios.get(`${config.baseApiUrl}/users`).then(response => {
      if (response.status === 200) {
        dispatch(actions.setUsers(response.data))
        resolve(true)
      }
      reject(`There was an error`)
    }, () => {
      reject(`There was an error`)
    })
  })
}

export const dispatchAddUser = (dispatch, userData) => {
  return new Promise((resolve, reject) => {
    axios.post(`${config.baseApiUrl}/user`, userData).then(response => {
      if (response.status === 201) {
        resolve(true)
      }
      reject(response)
    }, err => {
      reject(err.response.data)
    })
  })
}

export const dispatchEditUser = (dispatch, userData) => {
  return new Promise((resolve, reject) => {
    axios.patch(`${config.baseApiUrl}/user/${userData.id}`, userData).then(response => {
      if (response.status === 200) {
        resolve(true)
      }
      reject(response)
    }, err => {
      reject(err.response.data)
    })
  })
}

export const dispatchDeleteUser = (dispatch, userId) => {
  return new Promise((resolve, reject) => {
    axios.delete(`${config.baseApiUrl}/user/${userId}`).then(response => {
      if (response.status === 200) {
        resolve(true)
      }
      reject(`There was an error`)
    }, () => {
      reject(`There was an error`)
    })
  })
}

const dispatchers = {
  dispatchGetAllUsers,
  dispatchAddUser,
  dispatchEditUser,
  dispatchDeleteUser,
}

const reducer = (state = initialState, action) => {
  return mutations[action.type] ? mutations[action.type](state, action.payload) : state
}


export {
  reducer as default,
  dispatchers
}
