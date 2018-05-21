import React, { Component } from 'react'

import UserForm from '@/components/UserForm'

class UserAddRoute extends Component {
  render() {
    return (
      <div>
        <div className="row">
          <div className="col-md-6 col-md-offset-3">
            <UserForm editing={false} />
          </div>
        </div>
      </div>
    )
  }
}

export default UserAddRoute
