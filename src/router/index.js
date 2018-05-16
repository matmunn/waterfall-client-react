import React, { Component } from 'react'
import { BrowserRouter, Switch } from 'react-router-dom'

import { PrivateRoute, NonPrivateRoute } from '@/utils/routing'

import HomeRoute from './components/HomeRoute'
import AdminRoute from './components/AdminRoute'
import LoginRoute from './components/LoginRoute'
import LogoutRoute from './components/LogoutRoute'
import RegisterRoute from './components/RegisterRoute'
import WeeklyOverviewRoute from './components/WeeklyOverviewRoute'

import AdminTaskListRoute from './components/admin/TaskListRoute'

class Router extends Component {
  render () {
    return (
      <BrowserRouter>
        <Switch>
          <PrivateRoute exact path='/' component={HomeRoute} />
          <PrivateRoute path='/logout' component={LogoutRoute} />
          <PrivateRoute path='/overview' component={WeeklyOverviewRoute} />
          <PrivateRoute path='/admin' component={AdminRoute} />
          <NonPrivateRoute path='/login' component={LoginRoute} />
          <NonPrivateRoute path='/register' component={RegisterRoute} />
        </Switch>
      </BrowserRouter>
    )
  }
}

class AdminRouter extends Component {
  render () {
    return (
      <Switch>
        <PrivateRoute path={`${this.props.match.path}/tasks`} component={AdminTaskListRoute} />
      </Switch>
    )
  }
}

export {
  Router as default,
  AdminRouter
}
