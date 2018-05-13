import { createSelector } from 'reselect'
import { find, filter } from 'lodash'

export const usersSelector = state => state.users.users

export const categoryUsersSelector = categoryId => {
  return createSelector(
    usersSelector,
    users => filter(users, user => user.category_id === categoryId)
  )
}

export const userSelector = userId => {
  return createSelector(
    usersSelector,
    users => find(users, user => user.id === userId)
  )
}
