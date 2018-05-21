import React, { Component } from 'react'

import ClientForm from '@/components/ClientForm'

class ClientEditRoute extends Component {
  render() {
    return (
      <div>
        <div className="row">
          <div className="col-md-6 col-md-offset-3">
            <ClientForm client={parseInt(this.props.match.params.id, 10)} editing={true} />
          </div>
        </div>
      </div>
    )
  }
}

export default ClientEditRoute
