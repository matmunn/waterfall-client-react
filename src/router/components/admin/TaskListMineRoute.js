import React, { Component } from 'react'
import AdminTaskTable from '@/components/AdminTaskTable'

class TaskListMineRoute extends Component {
  render() {
    return (
      <div>
        <AdminTaskTable tasks={taskList} />
      </div>
    )
  }
}

export default TaskListMineRoute
