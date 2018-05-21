import React, { Component } from 'react'

import ClientForm from '@/components/ClientForm'

class ClientAddRoute extends Component {
  render() {
    return (
      <div>
        <div className="row">
          <div className="col-md-6 col-md-offset-3">
            <ClientForm editing={false} />
          </div>
        </div>
      </div>
    )
  }
}

export default ClientAddRoute
