import React, { Component } from 'react'
import { connect } from 'react-redux'
import { map, sortBy, filter } from 'lodash'
import moment from 'moment'
import DatePicker from 'react-datepicker'

import Auth from 'Auth'

import AdminTask from './AdminTask'

import { sortedTasksWithDateSelector } from '@/store/selectors/tasks'
import { dispatchGetAllTasks } from '@/store/reducers/tasks'
import { dispatchGetAllUsers } from '@/store/reducers/users'
import { dispatchGetAllClients } from '@/store/reducers/clients'

const mapStateToProps = state => ({
  sortedTasksWithDate: (startDate, endDate) => sortedTasksWithDateSelector(startDate, endDate)(state),
})

const mapDispatchToProps = dispatch => ({
  getAllClients: () => dispatchGetAllClients(dispatch),
  getAllUsers: () => dispatchGetAllUsers(dispatch),
  getAllTasks: () => dispatchGetAllTasks(dispatch),
})

class AdminTaskTable extends Component {
  constructor(props) {
    super(props)

    this.state = {
      dateFormat: 'YYYY-MM-DD',
      startDate: moment().day(1),
      endDate: moment().day(5),
    }
  }

  componentWillMount() {
    this.props.getAllUsers()
    this.props.getAllTasks()
    this.props.getAllClients()
  }

  setDate = date => {
    this.setState({
      startDate: date.clone().day(1),
      endDate: date.clone().day(5),
    })
  }

  render() {
    const taskList = sortBy(filter(this.props.sortedTasksWithDate(this.state.startDate, this.state.endDate), task => task.created_by === Auth.getUser().id), ['completed', 'user_id', 'start_time'])

    return (
      <div>
        <div className="text-center space">
          <div className="field has-addons has-addons-centered">
            <p className="control">
              <DatePicker className='input' dateFormat={this.state.dateFormat} onChange={date => this.setDate(date)} selected={this.state.startDate} />
            </p>
            <p className="control">
              <span className="button is-static">
                to
              </span>
            </p>
            <p className="control">
              <DatePicker className='input' dateFormat={this.state.dateFormat} onChange={date => this.setDate(date)} selected={this.state.endDate} />
            </p>
          </div>
        </div>
        <table>
          <tr>
            <th>
              User
            </th>
            <th>
              Client
            </th>
            <th>
              Task Description
            </th>
            <th>
              Start Time
            </th>
            <th>
              End Time
            </th>
            <th>
              Hours Allotted
            </th>
            <th>
              Task Completed
            </th>
            <th></th>
          </tr>
          {
            map(taskList, task => (
              <AdminTask task={task} key={task.id} />
            ))
          }
        </table>
      </div >
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(AdminTaskTable)
