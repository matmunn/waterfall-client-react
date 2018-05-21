import React, { Component } from 'react'

import TaskForm from '@/components/TaskForm'

class TaskEditRoute extends Component {
  render() {
    return (
      <div>
        <div className="row">
          <div className="col-md-6 col-md-offset-3">
            <TaskForm task={parseInt(this.match.params.id, 10)} editing={true} />
          </div>
        </div>
      </div>
    )
  }
}

export default TaskEditRoute
