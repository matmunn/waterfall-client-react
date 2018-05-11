import axios from 'axios'

import config from 'Config'

import { SET_TASKS, ADD_TASK, UPDATE_TASK, DELETE_TASK,
         SET_TASK_COMPLETE_STATUS } from '../mutations'

// import { baseApiUrl } from '../../config'

const mutations = {
  [SET_TASKS]: (state, tasks) => {
    return {
      ...state,
      tasks: tasks,
    }
  },
  [ADD_TASK]: (state, task) => {
    return {
      ...state,
      tasks: [
        ...state.tasks,
        task
      ]
    }
  },
  [UPDATE_TASK]: (state, action) => {

  },
  [DELETE_TASK]: (state, taskId) => {
    return {
      ...state,
      tasks: state.tasks.filter(x => x.id !== taskId)
    }
  },
  [SET_TASK_COMPLETE_STATUS]: (state, { taskId, status }) => {

  }
}

const initialState = {
  tasks: []
}

const actions = { 
  setTasks: tasks => ({
    type: SET_TASKS,
    payload: tasks
  }),
}

const dispatchers = {
  dispatchGetAllTasks: dispatch => {
    return new Promise((resolve, reject) => {
      axios.get(`${config.apiHost}/api/tasks`).then(response => {
        if (response.status === 200) {
          dispatch(actions.setTasks(response.data))
          resolve(response.data.length)
        }
        reject(response)
      }, err => {
        reject(err)
      })
    })
  }
  // dispatchSetCurrentCity: (dispatch, city) => {
  //   dispatch(actions.setCurrentCity(city))
  // },
  // dispatchClearCitiesList: dispatch => {
  //   dispatch(actions.setCitiesList([]))
  // },
  // dispatchGetCitiesList: (dispatch, query) => {
  //   return axios.get(`${baseApiUrl}/cities/?search=${query}`)
  //     .then(response => {
  //       if (response.status === 200) {
  //         dispatch(actions.setCitiesList(response.data))
  //       }
  //     }, err => {
  //       console.log(err)
  //       dispatch(actions.setCitiesList([]))
  //     })
  // },
  // dispatchFetchCity: (dispatch, cityId) => {
  //   return axios.get(`${baseApiUrl}/cities/${cityId}/`).then(response => {
  //     if (response.status === 200) {
  //       dispatch(actions.setFetchedCity(response.data))
  //       return
  //     }
  //     console.log(response.data)
  //   }, err => {
  //     console.log(err)
  //     dispatch(actions.setFetchedCity({}))
  //   })
  // }
}

const reducer = (state = initialState, action) => {
  return mutations[action.type] ? mutations[action.type](state, action.payload) : state
}


export {
  reducer as default,
  dispatchers
}
