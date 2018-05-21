import React, { Component } from 'react'
import { BrowserRouter, Switch } from 'react-router-dom'

import { PrivateRoute, NonPrivateRoute } from '@/utils/routing'

import HomeRoute from './components/HomeRoute'
import AdminRoute from './components/AdminRoute'
import LoginRoute from './components/LoginRoute'
import LogoutRoute from './components/LogoutRoute'
import RegisterRoute from './components/RegisterRoute'
import WeeklyOverviewRoute from './components/WeeklyOverviewRoute'

import AdminTaskAddRoute from './components/admin/TaskAddRoute'
import AdminTaskEditRoute from './components/admin/TaskEditRoute'
import AdminTaskListRoute from './components/admin/TaskListRoute'

import AdminCategoryAddRoute from './components/admin/CategoryAddRoute'
import AdminCategoryEditRoute from './components/admin/CategoryEditRoute'
import AdminCategoryListRoute from './components/admin/CategoryListRoute'

import AdminClientAddRoute from './components/admin/ClientAddRoute'
import AdminClientEditRoute from './components/admin/ClientEditRoute'
import AdminClientListRoute from './components/admin/ClientListRoute'

import AdminUserAddRoute from './components/admin/UserAddRoute'
import AdminUserEditRoute from './components/admin/UserEditRoute'
import AdminUserListRoute from './components/admin/UserListRoute'

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
        {/* <PrivateRoute path={`${this.props.match.path}/tasks/mine`} component={AdminTaskListMineRoute} /> */}
        <PrivateRoute path={`${this.props.match.path}/tasks/:id/edit`} component={AdminTaskEditRoute} />
        <PrivateRoute path={`${this.props.match.path}/tasks/add`} component={AdminTaskAddRoute} />
        <PrivateRoute path={`${this.props.match.path}/tasks`} component={AdminTaskListRoute} />

        <PrivateRoute path={`${this.props.match.path}/categories/:id/edit`} component={AdminCategoryEditRoute} />
        <PrivateRoute path={`${this.props.match.path}/categories/add`} component={AdminCategoryAddRoute} />
        <PrivateRoute path={`${this.props.match.path}/categories`} component={AdminCategoryListRoute} />

        <PrivateRoute path={`${this.props.match.path}/clients/:id/edit`} component={AdminClientEditRoute} />
        <PrivateRoute path={`${this.props.match.path}/clients/add`} component={AdminClientAddRoute} />
        <PrivateRoute path={`${this.props.match.path}/clients`} component={AdminClientListRoute} />

        <PrivateRoute path={`${this.props.match.path}/users/:id/edit`} component={AdminUserEditRoute} />
        <PrivateRoute path={`${this.props.match.path}/users/add`} component={AdminUserAddRoute} />
        <PrivateRoute path={`${this.props.match.path}/users`} component={AdminUserListRoute} />
      </Switch>
    )
  }
}

export {
  Router as default,
  AdminRouter
}
