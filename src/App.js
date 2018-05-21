import React, { Component } from 'react'
import { Provider } from 'react-redux'
import swal from 'sweetalert2'
import Echo from 'laravel-echo'
import Pusher from 'pusher-js'

import store from './store'
import config from 'Config'

import Router from './router'

import { actionAddTask, actionUpdateTask, actionDeleteTask } from '@/store/modules/tasks'
import { actionAddNote, actionUpdateNote, actionDeleteNote } from '@/store/modules/notes'
import { actionAddUser, actionUpdateUser, actionDeleteUser } from '@/store/modules/users'
import { actionAddCategory, actionUpdateCategory, actionDeleteCategory } from '@/store/modules/categories'
import { actionAddClient, actionUpdateClient, actionDeleteClient } from '@/store/modules/clients'

window.Pusher = Pusher

Component.prototype.$echo = new Echo({
  broadcaster: 'pusher',
  key: 'waterfall',
  authEndpoint: config.pusherAuthUrl,
  wsHost: config.pusherHost,
  wsPort: config.pusherPort,
  wssPort: config.pusherPort,
  enabledTransports: ['ws', 'flash']
})

class App extends Component {
  componentDidMount() {
    this.$echo.channel('waterfall')
      .listen('.UpdateAvailable', e => {
        swal({
          type: 'warning',
          title: 'Update Available',
          html: `A new version has been released.<br>
            You need to refresh to see the changes.<br>
            <strong>If you don't you might experience errors.</strong><br>
            Refresh now?`,
          showCancelButton: true,
          cancelButtonText: 'Not yet',
          confirmButtonText: 'Show me the goodness!'
        }).then(() => {
          window.location.reload()
        }, () => {
          window.ignoredReload = true
        })
      })
      .listen('.TaskAdded', data => {
        store.dispatch(actionAddTask(data.task))
      })
      .listen('.TaskDeleted', data => {
        store.dispatch(actionDeleteTask(data.taskId))
      })
      .listen('.TaskEdited', data => {
        store.dispatch(actionUpdateTask(data.task))
      })
      .listen('.NoteAdded', data => {
        store.dispatch(actionAddNote(data.note))
      })
      .listen('.NoteEdited', data => {
        store.dispatch(actionUpdateNote(data.note))
      })
      .listen('.NoteDeleted', data => {
        store.dispatch(actionDeleteNote(data.noteId))
      })
      .listen('.UserAdded', data => {
        store.dispatch(actionAddUser(data.user))
      })
      .listen('.UserEdited', data => {
        store.dispatch(actionUpdateUser(data.user))
      })
      .listen('.UserDeleted', data => {
        store.dispatch(actionDeleteUser(data.userId))
      })
      .listen('.CategoryAdded', data => {
        store.dispatch(actionAddCategory(data.category))
      })
      .listen('.CategoryEdited', data => {
        store.dispatch(actionUpdateCategory(data.category))
      })
      .listen('.CategoryDeleted', data => {
        store.dispatch(actionDeleteCategory(data.categoryId))
      })
      .listen('.ClientAdded', data => {
        store.dispatch(actionAddClient(data.client))
      })
      .listen('.ClientEdited', data => {
        store.dispatch(actionUpdateClient(data.client))
      })
      .listen('.ClientDeleted', data => {
        store.dispatch(actionDeleteClient(data.clientId))
      })
  }

  render() {
    return (
      <Provider store={store}>
        <Router />
      </Provider>
    )
  }
}

export default App
