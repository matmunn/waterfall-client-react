import React, { Component } from 'react'
import { Provider } from 'react-redux'
import swal from 'sweetalert2'
import Echo from 'laravel-echo'
import Pusher from 'pusher-js'

import store from './store'
import config from 'Config'

import Router from './router'

import { actionAddTask, actionUpdateTask } from '@/store/reducers/tasks'

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
      // .listen('.TaskDeleted', data => {
      //   this.$store.commit(DELETE_TASK, data.taskId)
      // })
      .listen('.TaskEdited', data => {
        store.dispatch(actionUpdateTask(data.task))
      })
      // .listen('.NoteAdded', data => {
      //   this.$store.commit(ADD_NOTE, data.note)
      // })
      // .listen('.NoteEdited', data => {
      //   this.$store.commit(UPDATE_NOTE, data.note)
      // })
      // .listen('.NoteDeleted', data => {
      //   this.$store.commit(DELETE_NOTE, data.noteId)
      // })
      // .listen('.UserAdded', data => {
      //   this.$store.commit(ADD_USER, data.user)
      // })
      // .listen('.UserEdited', data => {
      //   this.$store.commit(UPDATE_USER, data.user)
      // })
      // .listen('.UserDeleted', data => {
      //   this.$store.commit(DELETE_USER, data.userId)
      // })
      // .listen('.CategoryAdded', data => {
      //   this.$store.commit(ADD_CATEGORY, data.category)
      // })
      // .listen('.CategoryEdited', data => {
      //   this.$store.commit(UPDATE_CATEGORY, data.category)
      // })
      // .listen('.CategoryDeleted', data => {
      //   this.$store.commit(DELETE_CATEGORY, data.categoryId)
      // })
      // .listen('.ClientAdded', data => {
      //   this.$store.commit(ADD_CLIENT, data.client)
      // })
      // .listen('.ClientEdited', data => {
      //   this.$store.commit(UPDATE_CLIENT, data.client)
      // })
      // .listen('.ClientDeleted', data => {
      //   this.$store.commit(DELETE_CLIENT, data.clientId)
      // })
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
