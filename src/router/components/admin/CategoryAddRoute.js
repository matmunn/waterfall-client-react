import React, { Component } from 'react'

import CategoryForm from '@/components/CategoryForm'

class CategoryAddRoute extends Component {
  render() {
    return (
      <div>
        <div className="row">
          <div className="col-md-6 col-md-offset-3">
            <CategoryForm editing={false} />
          </div>
        </div>
      </div>
    )
  }
}

export default CategoryAddRoute
