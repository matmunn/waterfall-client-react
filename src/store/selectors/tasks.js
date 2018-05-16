import { createSelector } from 'reselect'
import { find, filter, sortBy } from 'lodash'
import moment from 'moment'

export const tasksSelector = state => state.tasks.tasks

export const taskSelector = taskId => {
  return createSelector(
    tasksSelector,
    tasks => find(tasks, task => task.id === taskId)
  )
}

export const sortedTasksSelector = state => sortBy(state.tasks.tasks, ['completed', 'start_date'])

export const userTasksSelector = (userId, startDate, endDate) => {
  return createSelector(
    sortedTasksWithDateSelector(startDate, endDate),
    tasks => filter(tasks, task => task.user_id === userId)
  )
}

export const sortedTasksWithDateSelector = (startDate, endDate) => {
  return createSelector(
    sortedTasksSelector,
    tasks => filter(tasks, task => {
      const startTimeMatch = (moment(task.start_date) >= moment(startDate))
      const endTimeMatch = (moment(task.end_date) <= moment(endDate).hour(18).minute(0))
      return startTimeMatch && endTimeMatch
    })
  )
}
