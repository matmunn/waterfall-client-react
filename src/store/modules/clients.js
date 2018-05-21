import axios from 'axios'
import { filter, findIndex } from 'lodash'

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
    const elmIndex = findIndex(state.clients, x => x.id === client.id)

    let data = Array.from(state.clients)
    data.splice(elmIndex, 1, client)

    return {
      ...state,
      clients: data,
    }
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

export const actionSetClients = clients => ({
  type: SET_CLIENTS,
  payload: clients
})

export const actionAddClient = client => ({
  type: ADD_CLIENT,
  payload: client
})

export const actionUpdateClient = client => ({
  type: UPDATE_CLIENT,
  payload: client
})

export const actionDeleteClient = clientId => ({
  type: DELETE_CLIENT,
  payload: clientId
})

const actions = {
  setClients: actionSetClients,
  addClient: actionAddClient,
  updateClient: actionUpdateClient,
  deleteClient: actionDeleteClient
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
