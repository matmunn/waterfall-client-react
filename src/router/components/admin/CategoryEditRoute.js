import React, { Component } from 'react'
import { withRouter } from 'react-router-dom'

import CategoryForm from '@/components/CategoryForm'

class CategoryEditRoute extends Component {
  render() {
    return (
      <div>
        <div className="row">
          <div className="col-md-6 col-md-offset-3">
            <CategoryForm category={parseInt(this.props.match.params.id, 10)} editing={true} />
          </div>
        </div>
      </div>
    )
  }
}

export default withRouter(CategoryEditRoute)
