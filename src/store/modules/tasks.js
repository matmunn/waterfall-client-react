import axios from 'axios'
import moment from 'moment'
import { filter, findIndex } from 'lodash'

import config from 'Config'

import { SET_TASKS, ADD_TASK, UPDATE_TASK, DELETE_TASK } from '../mutations'

const mutations = {
  [SET_TASKS]: (state, tasks) => {
    return {
      ...state,
      tasks,
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
  [UPDATE_TASK]: (state, task) => {
    const elmIndex = findIndex(state.tasks, x => x.id === task.id)

    let tasks = Array.from(state.tasks)
    tasks.splice(elmIndex, 1, task)

    return {
      ...state,
      tasks,
    }
  },
  [DELETE_TASK]: (state, taskId) => {
    return {
      ...state,
      tasks: filter(state.tasks, x => x.id !== taskId)
    }
  },
}

const initialState = {
  tasks: []
}

export const actionSetTasks = tasks => ({
  type: SET_TASKS,
  payload: tasks
})

export const actionAddTask = task => ({
  type: ADD_TASK,
  payload: task
})

export const actionUpdateTask = task => ({
  type: UPDATE_TASK,
  payload: task
})

export const actionDeleteTask = taskId => ({
  type: DELETE_TASK,
  payload: taskId
})

export const actions = {
  setTasks: actionSetTasks,
  addTask: actionAddTask,
  updateTask: actionUpdateTask,
  deleteTask: actionDeleteTask
}

export const dispatchGetAllTasks = dispatch => {
  return new Promise((resolve, reject) => {
    axios.get(`${config.baseApiUrl}/tasks`).then(response => {
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

export const dispatchGetTasksBetweenDates = (dispatch, dateRange = { start: moment().day(1).format('YYYY-MM-DD'), end: moment().day(5).format('YYYY-MM-DD') }) => {
  return new Promise((resolve, reject) => {
    axios.get(`${config.baseApiUrl}/tasks/${dateRange.start}/${dateRange.end}`).then(response => {
      if (response.status === 200) {
        dispatch(actions.setTasks(response.data))
        resolve(response.data.length)
      }
      reject('There was an error')
    }, () => {
      reject('There was an error')
    })
  })
}

export const dispatchMarkTaskComplete = (dispatch, taskId) => {
  return new Promise((resolve, reject) => {
    axios.patch(`${config.baseApiUrl}/task/${taskId}/complete`).then(response => {
      if (response.status === 200) {
        resolve(true)
      }
      reject(response)
    }, err => {
      reject(err.response.data)
    })
  })
}

export const dispatchMarkTaskIncomplete = (dispatch, taskId) => {
  return new Promise((resolve, reject) => {
    axios.patch(`${config.baseApiUrl}/task/${taskId}/incomplete`).then(response => {
      if (response.status === 200) {
        resolve(true)
      }
      reject('There was an error')
    }, () => {
      reject('There was an error')
    })
  })
}

export const dispatchAddTask = (dispatch, taskData) => {
  return new Promise((resolve, reject) => {
    axios.post(`${config.baseApiUrl}/task`, taskData).then(response => {
      if (response.status === 201) {
        resolve(true)
      }
      reject(response)
    }, err => {
      reject(err)
    })
  })
}

export const dispatchEditTask = (dispatch, taskData) => {
  return new Promise((resolve, reject) => {
    axios.patch(`${config.baseApiUrl}/task/${taskData.id}`, taskData).then(response => {
      if (response.status === 200) {
        resolve(true)
      }
      reject(response)
    }, err => {
      reject(err.response.data)
    })
  })
}

export const dispatchDeleteTask = (dispatch, taskId) => {
  return new Promise((resolve, reject) => {
    axios.delete(`${config.baseApiUrl}/task/${taskId}`).then(response => {
      if (response.status === 200) {
        resolve(true)
      }
      reject('There was an error')
    }, () => {
      reject('There was an error')
    })
  })
}

const dispatchers = {
  dispatchGetAllTasks,
  dispatchGetTasksBetweenDates,
  dispatchMarkTaskComplete,
  dispatchMarkTaskIncomplete,
  dispatchAddTask,
  dispatchEditTask,
  dispatchDeleteTask
}

const reducer = (state = initialState, action) => {
  return mutations[action.type] ? mutations[action.type](state, action.payload) : state
}


export {
  reducer as default,
  dispatchers
}
