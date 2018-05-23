import React, { Component } from 'react'
import classNames from 'classnames'
import { connect } from 'react-redux'
import { map, forEach } from 'lodash'
import makeCancelable from 'makecancelable'
import { withRouter } from 'react-router-dom'
import Select from 'react-select'
import moment from 'moment'

import { dispatchGetAllClients } from '@/store/modules/clients'
import { dispatchGetAllUsers } from '@/store/modules/users'
import { dispatchGetAllTasks, dispatchAddTask, dispatchEditTask } from '@/store/modules/tasks'
import { taskSelector } from '@/store/selectors/tasks'
import { usersSelector } from '@/store/selectors/users'
import { clientsSelector } from '@/store/selectors/clients'

import Auth from 'Auth'
import { toastr } from 'Helpers'

import DateRangePicker from '@/components/DateRangePicker'

const mapDispatchToProps = dispatch => ({
  getAllClients: () => dispatchGetAllClients(dispatch),
  getAllUsers: () => dispatchGetAllUsers(dispatch),
  getAllTasks: () => dispatchGetAllTasks(dispatch),
  addTask: taskData => dispatchAddTask(dispatch, taskData),
  editTask: taskData => dispatchEditTask(dispatch, taskData),
})

const mapStateToProps = state => ({
  getTask: taskId => taskSelector(taskId)(state),
  users: usersSelector(state),
  clients: clientsSelector(state),
})

class TaskForm extends Component {
  constructor(props) {
    super(props)

    const { editing } = props

    const editingTask = editing ? props.getTask(props.task.id) : {}

    const curTime = moment().minute(0)
    const time0900 = moment().hour(9).minute(0)
    const startTime = curTime < time0900 ? time0900 : curTime

    this.state = {
      editingTask,
      user: Auth.getUser().id,
      client: editing ? props.getClient(editingTask.client_id) : null,
      description: editing ? editingTask.description : '',
      completed: editing ? editingTask.completed : false,
      recurring: editing ? editingTask.is_recurring : false,
      recurrencePeriod: editing ? editingTask.recurrence_period : 0,
      recurrenceType: editing ? editingTask.recurrence_period : 'Weeks',
      loading: false,
      absence: editing ? editingTask.is_absence : false,
      timings: {
        start: editing ? moment(editingTask.start_date).format('YYYY-MM-DD HH:mm') : startTime.format('YYYY-MM-DD HH:mm'),
        end: editing ? moment(editingTask.end_date).format('YYYY-MM-DD HH:mm') : startTime.clone().add(2, 'hours').format('YYYY-MM-DD HH:mm'),
      },
      errors: {}
    }
  }

  componentDidMount() {
    this.props.getAllClients()
    this.props.getAllUsers()
    this.props.getAllTasks()
  }

  saveTask = e => {
    e.preventDefault()

    this.setState({
      loading: true
    })

    const taskData = {
      user: this.state.user,
      client: this.state.client ? this.state.client : null,
      description: this.state.description,
      startTime: this.state.timings.start,
      endTime: this.state.timings.end,
      completed: this.state.completed,
      recurring: this.state.recurring,
      recurrencePeriod: this.state.recurrencePeriod,
      recurrenceType: this.state.recurrenceType,
      absence: this.state.absence
    }

    let action = this.props.addTask
    if (this.props.editing) {
      taskData.id = this.state.editingTask.id
      action = this.props.editTask
    }

    this.cancelSaveTask = makeCancelable(
      action(taskData),
      () => {
        this.setState({
          loading: false
        })

        this.props.history.push('/admin/tasks')
      },
      err => {
        this.setState({ loading: false })
        if (err === 'time-error') {
          toastr.error(`The end time must be after the start time`, 'Error')
        } else if (err === 'client-not-found-error') {
          toastr.error(`The requested client couldn't be found`, 'Error')
        } else if (err === 'user-not-found-error') {
          toastr.error(`The requested user couldn't be found`, 'Error')
        } else {
          if (err.response && err.response.status === 422) {
            let validationErrors = err.response.data
            forEach(validationErrors, (value, key) => {
              validationErrors[key] = value.join('<br />')
            })
            this.setState({ errors: validationErrors })
          } else {
            toastr.error(`An error occurred while processing your request`, 'Error')
          }
        }
      }
    )
  }

  componentWillUnmount() {
    if (this.cancelSaveTask) {
      this.cancelSaveTask()
    }
  }

  render() {
    return (
      <form onSubmit={e => this.saveTask(e)} onKeyDown={e => { if (e.keyCode === 13) e.preventDefault() }}>
        <div className="field">
          <label className="label" htmlFor="user">
            Job is for
          </label>
          <div className="control">
            <div className="select">
              <select id="user" className="input" value={this.state.user} onChange={e => this.setState({ user: e.target.value })} required>
                <option disabled value="">Choose a user</option>
                {
                  map(this.props.users, user => (
                    <option value={user.id} key={user.id}>{ user.name }</option>
                  ))
                }
              </select>
            </div>
          </div>
        </div>
        <div className="field">
          <label className="label" htmlFor="client">
            Project
          </label>
          <div className="control">
            <div className="select">
              <Select
                options={this.props.clients}
                value={this.state.client}
                onChange={value => this.setState({ client: value.id })}
                searchable={true}
                labelKey='name'
                valueKey='id'
              />
            </div>
          </div>
          {
            this.state.errors.client ? (
              <p className="help is-danger">
                { this.state.errors.client }
              </p>
            ) : ''
          }
        </div>
        <div className="field">
          <label className="label" htmlFor="description">
            Task Description
          </label>
          <div className="control">
            <input id='description' type="text" value={this.state.description} onChange={e => this.setState({ description: e.target.value })} className={classNames('input', { "is-danger": this.state.errors.description })} required />
          </div>
          {
            this.state.errors.description ? (
              <p className="help is-danger">
                { this.state.errors.description }
              </p>
            ) : null
          }
        </div>
        <div className="field">
          <div className="field col-md-6">
            <label className="label" htmlFor="dateRange">
              Task Timings
            </label>
            <DateRangePicker id='dateRange' onChange={val => this.setState({ timings: val })} startTime={this.state.timings.start} endTime={this.state.timings.end} />{/*:*/}
          </div>
        </div>
        <div className="field">
          <p className="control">
            <label className="checkbox">
              <input type="checkbox" checked={this.state.absence} onChange={() => this.setState({ absence: !this.state.absence })} />
              &nbsp;Task is an absence?
            </label>
          </p>
        </div>
        {
          this.props.editing ? (
            <div className="field">
              <p className="control">
                <label className="checkbox">
                  <input type="checkbox" checked={this.state.completed} onChange={() => this.setState({ completed: !this.state.completed })} />
                    &nbsp;Task is completed?
                </label>
              </p>
            </div>
          ) : null
        }
        <div className="field">
          <p className="control">
            <label className="checkbox">
              <input type="checkbox" checked={this.state.recurring} onChange={() => this.setState({ recurring: !this.state.recurring })} />
                &nbsp;Task is recurring?
            </label>
          </p>
        </div>
        {
          this.state.recurring ? (
            <div>
              <div className="field">
                <label className="label">
                  Task recurs every:
                </label>
                <div className="row">
                  <div className="col-md-6">
                    <input type="number" className="input col-md-6" min="1" max="50" value={this.state.recurrencePeriod} onChange={e => this.setState({ recurrencePeriod: e.target.value })} />
                  </div>
                  <div className="col-md-6">
                    <select className="input" value={this.state.recurrenceType} onChange={e => this.setState({ recurrenceType: e.target.value })}>
                      <option value='Days'>Days</option>
                      <option value='Weeks'>Weeks</option>
                      <option value='Months'>Months</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
          ) : null
        }
        <div className="field">
          <button type="submit" className={classNames('button', 'is-primary', 'is-pulled-right', { 'is-loading': this.state.loading })}>
            Save Task
          </button>
        </div>
      </form>
    )
  }
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(TaskForm))
