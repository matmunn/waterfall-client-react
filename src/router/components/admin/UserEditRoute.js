import React, { Component } from 'react'

import UserForm from '@/components/UserForm'

class UserEditRoute extends Component {
  render() {
    return (
      <div>
        <div class="row">
          <div class="col-md-6 col-md-offset-3">
            <UserForm user={parseInt(this.props.match.params.id, 10)} editing={true} />
          </div>
        </div>
      </div>
    )
  }
}

export default UserEditRoute
