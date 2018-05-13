import { createSelector } from 'reselect'
import { find } from 'lodash'

export const clientsSelector = state => state.clients.clients

export const clientSelector = clientId => {
  return createSelector(
    clientsSelector,
    clients => find(clients, client => client.id === clientId)
  )
}
