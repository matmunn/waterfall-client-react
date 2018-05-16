import React from 'react'
import { connect } from 'react-redux'
import { Route, Redirect } from 'react-router-dom'
import { func, bool } from 'prop-types'

const mapStateToProps = state => ({
  authenticated: state.auth.loginStatus,
})

const props = {
  component: func,
  authenticated: bool,
}

// PrivateRoute - These routes are only available if the user is logged in
// If the user is not logged in, they will redirect to the login page
const _PrivateRoute = ({ component: Component, authenticated, ...rest }) => (
  <Route {...rest} render={props =>
    authenticated ? (
      <Component {...props} />
    ) : (
      <Redirect to='/login' />
    )
  } />
)


// NonPrivateRoute - These routes are only available if the user is not logged in
// If the user is logged in, these will redirect to default/dashboard page
const _NonPrivateRoute = ({ component: Component, authenticated, ...rest }) => (
  <Route {...rest} render={props =>
    authenticated ? (
      <Redirect to='/' />
    ) : (
      <Component {...props} />
    )
  } />
)

_PrivateRoute.propTypes = props
_NonPrivateRoute.propTypes = props

export const PrivateRoute = connect(mapStateToProps)(_PrivateRoute)
export const NonPrivateRoute = connect(mapStateToProps)(_NonPrivateRoute)
