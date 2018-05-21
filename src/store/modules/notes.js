import axios from 'axios'
import { filter, findIndex } from 'lodash'

import config from 'Config'

import { SET_NOTES, ADD_NOTE, UPDATE_NOTE, DELETE_NOTE } from '../mutations'

const mutations = {
  [SET_NOTES]: (state, notes) => {
    return {
      ...state,
      notes,
    }
  },
  [ADD_NOTE]: (state, note) => {
    return {
      ...state,
      notes: [
        ...state.notes,
        note
      ]
    }
  },
  [UPDATE_NOTE]: (state, note) => {
    const elmIndex = findIndex(state.notes, x => x.id === note.id)

    let data = Array.from(state.notes)
    data.splice(elmIndex, 1, note)

    return {
      ...state,
      notes: data,
    }
  },
  [DELETE_NOTE]: (state, noteId) => {
    return {
      ...state,
      notes: filter(state.notes, x => x.id !== noteId)
    }
  },
}

const initialState = {
  notes: []
}

export const actionSetNotes = notes => ({
  type: SET_NOTES,
  payload: notes
})

export const actionAddNote = note => ({
  type: ADD_NOTE,
  payload: note
})

export const actionUpdateNote = note => ({
  type: UPDATE_NOTE,
  payload: note
})

export const actionDeleteNote = noteId => ({
  type: DELETE_NOTE,
  payload: noteId
})

const actions = {
  setNotes: actionSetNotes,
  addNote: actionAddNote,
  updateNote: actionUpdateNote,
  deleteNote: actionDeleteNote,
}

export const dispatchGetAllNotes = dispatch => {
  return new Promise((resolve, reject) => {
    axios.get(`${config.baseApiUrl}/notes`).then(response => {
      if (response.status === 200) {
        dispatch(actions.setNotes(response.data))
        resolve(response.data.length)
      }
      reject(`There was an error`)
    }, () => {
      reject(`There was an error`)
    })
  })
}

export const dispatchAddNote = (dispatch, noteData) => {
  return new Promise((resolve, reject) => {
    axios.post(`${config.baseApiUrl}/notes`, noteData).then(response => {
      if (response.status === 201) {
        resolve(true)
      }
      reject(`There was an error`)
    }, () => {
      reject(`There was an error`)
    })
  })
}

export const dispatchEditNote = (dispatch, noteData) => {
  return new Promise((resolve, reject) => {
    axios.patch(`${config.baseApiUrl}/notes/${noteData.id}`, noteData).then(response => {
      if (response.status === 200) {
        resolve(true)
      }
      reject(`There was an error`)
    }, () => {
      reject(`There was an error`)
    })
  })
}

export const dispatchDeleteNote = (dispatch, noteId) => {
  return new Promise((resolve, reject) => {
    axios.delete(`${config.baseApiUrl}/notes/${noteId}`).then(response => {
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
  dispatchGetAllNotes,
  dispatchAddNote,
  dispatchEditNote,
  dispatchDeleteNote,
}

const reducer = (state = initialState, action) => {
  return mutations[action.type] ? mutations[action.type](state, action.payload) : state
}


export {
  reducer as default,
  dispatchers
}
