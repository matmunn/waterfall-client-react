import React, { Component } from 'react'
import { withRouter } from 'react-router-dom'
import Auth from 'Auth'

class LogoutRoute extends Component {
  componentDidMount() {
    Auth.logout().then(() => {
      this.props.history.push('/')
    })
  }

  render() {
    return (
      <div>
        You are now logged out.
      </div>
    )
  }
}

export default withRouter(LogoutRoute)
