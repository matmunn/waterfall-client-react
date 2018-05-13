import React, { Component } from 'react'
import { BrowserRouter, Switch } from 'react-router-dom'

import { PrivateRoute, NonPrivateRoute } from '@/utils/routing'

import HomeRoute from './components/HomeRoute'
import LoginRoute from './components/LoginRoute'
import LogoutRoute from './components/LogoutRoute'
import RegisterRoute from './components/RegisterRoute'

class Router extends Component {
  render () {
    return (
      <BrowserRouter>
        <Switch>
          <PrivateRoute exact path='/' component={HomeRoute} />
          <PrivateRoute path='/logout' component={LogoutRoute} />
          <NonPrivateRoute path='/login' component={LoginRoute} />
          <NonPrivateRoute path='/register' component={RegisterRoute} />
        </Switch>
      </BrowserRouter>
    )
  }
}

export default Router
