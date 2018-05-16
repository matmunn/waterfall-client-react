import React, { Component } from 'react'
import { connect } from 'react-redux'
import { map, sortBy, filter } from 'lodash'
import makeCancelable from 'makecancelable'
import moment from 'moment'
import DatePicker from 'react-datepicker'

import Auth from 'Auth'
import AdminTask from './AdminTask'

import { dispatchGetAllUsers } from '@/store/reducers/users'
import { dispatchGetAllTasks } from '@/store/reducers/tasks'
import { dispatchGetAllClients } from '@/store/reducers/clients'

import { sortedTasksWithDateSelector } from '@/store/selectors/tasks'

const mapStateToProps = state => ({
  users: state.users.users,
  sortedTasksWithDate: (startDate, endDate) => sortedTasksWithDateSelector(startDate, endDate)(state)
})

const mapDispatchToProps = dispatch => ({
  getAllUsers: () => dispatchGetAllUsers(dispatch),
  getAllTasks: () => dispatchGetAllTasks(dispatch),
  getAllClients: () => dispatchGetAllClients(dispatch),
})

class TaskListRoute extends Component {
  state = {
    loading: false,
    selectedUser: {},
    dateFormat: 'YYYY-MM-DD',
    startDate: moment().day(1),
    endDate: moment().day(5),
  }

  componentWillMount() {
    this.setState({
      loading: true
    })

    this.cancelFetchData = makeCancelable(
      Promise.all([
        this.props.getAllUsers().then(() => {
          this.setState({
            selectedUser: Auth.getUser().id
          })
        }),
        this.props.getAllTasks(),
        this.props.getAllClients()
      ]),
      () => {
        this.setState({
          loading: false
        })
      }
    )
  }

  componentWillUnmount() {
    if (this.cancelFetchData) {
      this.cancelFetchData()
    }
  }

  render() {
    if (this.state.loading) {
      return (
        <div>
          Loading tasks...
        </div>
      )
    }

    const taskList = sortBy(filter(this.props.sortedTasksWithDate(this.state.startDate, this.state.endDate), task => task.user_id === this.state.selectedUser), ['completed', 'user_id', 'start_time'])

    return (
      <div>
        <div className="component-wrapper">
          <div className="space">
            <div className="field has-addons has-addons-centered">
              <div className="control">
                <div className="select">
                  <select className='select' v-model='selectedUser'>
                    {
                      map(this.props.users, user => (
                        <option value={user.id} key={user.id}>
                          { user.name }
                        </option>
                      ))
                    }
                  </select>
                </div>
              </div>
            </div>
            <div className="field has-addons has-addons-centered">
              <p className="control">
                <DatePicker className='input' dateFormat={this.state.dateFormat} onChange={date => this.setDate(date)} selected={this.state.startDate} />
                {/* <DatePicker : value='startDate' :input-className="datepickerInputClass" @selected='chooseDate2' :wrapper-className='datepickerWrapperClass'></DatePicker> */}
              </p>
              <p className="control">
                <span className="button is-static">
                  to
                </span>
              </p>
              <p className="control">
                {/* <DatePicker : value='endDate' :input-className="datepickerInputClass" @selected='chooseDate2' :wrapper-className='datepickerWrapperClass'></DatePicker> */}
              </p>
            </div>
          </div >
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
            {/* <AdminTask v-for="task in taskList" : task="task" :key="task.id" /> */}
            {
              map(taskList, task => (
                <AdminTask task={task} key={task.id} />
              ))
            }
          </table>
        </div>
      </div>
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(TaskListRoute)
