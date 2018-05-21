import React, { Component } from 'react'

import TaskForm from '@/components/TaskForm'

class TaskAddRoute extends Component {
  render() {
    return (
      <div>
        <div className="row">
          <div className="col-md-6 col-md-offset-3">
            <TaskForm editing={false} />
        </div>
        </div>
      </div>
    )
  }
}

export default TaskAddRoute
