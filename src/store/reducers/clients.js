import axios from 'axios'
import { filter } from 'lodash'

import config from 'Config'

import { SET_CLIENTS, ADD_CLIENT, UPDATE_CLIENT, DELETE_CLIENT } from '../mutations'

const mutations = {
  [SET_CLIENTS]: (state, clients) => {
    return {
      ...state,
      clients,
    }
  },
  [ADD_CLIENT]: (state, client) => {
    return {
      ...state,
      clients: [
        ...state.clients,
        client
      ]
    }
  },
  [UPDATE_CLIENT]: (state, client) => {

  },
  [DELETE_CLIENT]: (state, clientId) => {
    return {
      ...state,
      clients: filter(state.clients, x => x.id !== clientId)
    }
  },
}

const initialState = {
  clients: []
}

const actions = {
  setClients: clients => ({
    type: SET_CLIENTS,
    payload: clients
  }),
}

export const dispatchGetAllClients = dispatch => {
  return new Promise((resolve, reject) => {
    axios.get(`${config.baseApiUrl}/clients`).then(response => {
      if (response.status === 200) {
        dispatch(actions.setClients(response.data))
        resolve(true)
      }
      reject(`There was an error`)
    }, () => {
      reject(`There was an error`)
    })
  })
}

export const dispatchAddClient = (dispatch, clientData) => {
  return new Promise((resolve, reject) => {
    axios.post(`${config.baseApiUrl}/client`, clientData).then(response => {
      if (response.status === 201) {
        resolve(true)
      }
      reject(`There was an error`)
    }, () => {
      reject(`There was an error`)
    })
  })
}

export const dispatchEditClient = (dispatch, clientData) => {
  return new Promise((resolve, reject) => {
    axios.patch(`${config.baseApiUrl}/client/${clientData.id}`, clientData).then(response => {
      if (response.status === 200) {
        resolve(true)
      }
      reject(`There was an error`)
    }, () => {
      reject(`There was an error`)
    })
  })
}

export const dispatchDeleteClient = (dispatch, clientId) => {
  return new Promise((resolve, reject) => {
    axios.delete(`${config.baseApiUrl}/client/${clientId}`).then(response => {
      if (response.status === 200) {
        resolve(true)
      }
      reject(`There was an error`)
    }, () => {
      reject(`There was an errro`)
    })
  })
}

const dispatchers = {
  dispatchGetAllClients,
  dispatchAddClient,
  dispatchEditClient,
  dispatchDeleteClient,
}

const reducer = (state = initialState, action) => {
  return mutations[action.type] ? mutations[action.type](state, action.payload) : state
}


export {
  reducer as default,
  dispatchers
}
