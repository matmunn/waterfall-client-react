import { createSelector } from 'reselect'
import { filter } from 'lodash'

export const notesSelector = state => state.notes.notes

export const taskNotesSelector = taskId => {
  return createSelector(
    notesSelector,
    notes => filter(notes, note => note.task_id === taskId)
  )
}
