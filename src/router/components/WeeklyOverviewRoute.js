import React, { Component } from 'react'
import DatePicker from 'react-datepicker'
import { Link } from 'react-router-dom'
import moment from 'moment'
import { connect } from 'react-redux'
import EventBus from 'eventing-bus'
import makeCancelable from 'makecancelable'
import { map } from 'lodash'

import { toastr } from 'Helpers'

import UserTaskTable from '@/components/UserTaskTable'

import { dispatchGetAllCategories } from '@/store/modules/categories'
import { dispatchGetAllUsers } from '@/store/modules/users'
import { dispatchGetAllClients } from '@/store/modules/clients'
import { dispatchGetAllNotes } from '@/store/modules/notes'
import { dispatchGetTasksBetweenDates } from '@/store/modules/tasks'

import { displayCategoriesSelector } from '@/store/selectors/categories'
import { categoryUsersSelector } from '@/store/selectors/users'
import { userTasksSelector } from '@/store/selectors/tasks'

import styles from './styles/WeeklyOverviewRoute.scss'
import logo from '@/assets/static/logo.svg'

const mapStateToProps = state => ({
  displayCategories: displayCategoriesSelector(state),
  categoryUsers: categoryId => categoryUsersSelector(categoryId)(state),
  userTasks: (userId, startDate, endDate) => userTasksSelector(userId, startDate, endDate)(state),
})

const mapDispatchToProps = dispatch => ({
  getAllCategories: () => dispatchGetAllCategories(dispatch),
  getAllUsers: () => dispatchGetAllUsers(dispatch),
  getAllClients: () => dispatchGetAllClients(dispatch),
  getAllNotes: () => dispatchGetAllNotes(dispatch),
  getTasksBetweenDates: dateRange => dispatchGetTasksBetweenDates(dispatch, dateRange),
})

class WeeklyOverviewRoute extends Component {
  constructor(props) {
    super(props)

    this.state = {
      dateFormat: 'YYYY-MM-DD',
      startDate: moment().day(1),
      endDate: moment().day(5),
      taskCount: 999
    }
  }

  setDate = date => {
    this.setState({
      startDate: date.clone().day(1),
      endDate: date.clone().day(5),
      taskCount: 999,
    }, () => {
      EventBus.publish('date-changed-event', {
        start: this.state.startDate.format('YYYY-MM-DD'),
        end: this.state.endDate.format('YYYY-MM-DD'),
      })

      this.fetchTasksWithDates()
    })
  }

  userTasks = userId => {
    return this.props.userTasks(userId, this.state.startDate.format('YYYY-MM-DD'), this.state.endDate.format('YYYY-MM-DD'))
  }

  fetchTasksWithDates = () => {
    this.setState({
      loading: true
    })
    EventBus.publish('started-loading-tasks')
    this.cancelFetchDates = makeCancelable(
      this.props.getTasksBetweenDates({ start: this.state.startDate.format('YYYY-MM-DD'), end: this.state.endDate.format('YYYY-MM-DD') }),
      tasks => {
        EventBus.publish('finished-loading-tasks')
        if (tasks > this.state.taskCount) {
          toastr.info('New tasks have been added', 'Notice')
          if (this.props.notificationPermission !== 'denied') {
            const n = new Notification('Waterfall', { body: 'New tasks have been added' })
            setTimeout(n.close.bind(n), 5000)
          }
        }
        this.setState({
          loading: false,
          taskCount: tasks
        })
      },
      () => {
        toastr.error(`There was an error fetching tasks`, 'Error')
      }
    )
  }

  componentDidMount() {
    this.props.getAllCategories()
    this.props.getAllUsers()
    this.props.getAllClients()
    this.props.getAllNotes()

    this.fetchTasksWithDates()
  }

  componentWillUnmount() {
    if (this.cancelFetchDates) {
      this.cancelFetchDates()
    }
  }

  render() {
    return (
      <div>
        <section className="hero is-primary is-bold">
          <div className="hero-head">
            <header className="navbar">
              <div className="container">
                <div className="navbar-start">
                  <Link to='/' className="navbar-item">
                    Home
                  </Link>
                </div>
                <div className="navbar-end">
                  <Link to='/admin' className="navbar-item">
                    Admin
                  </Link>
                  <Link to='/logout' className="navbar-item">
                    Logout
                  </Link>
                </div>
              </div>
            </header>
          </div>
          <div className="hero-body">
            <div className="container">
              <Link to="/">
                <div dangerouslySetInnerHTML={{ __html: logo }} className='logo' />
              </Link>
            </div>
          </div>
          <div className="hero-foot">
            <div className="container">
              <div className={styles.dateInputs}>
                <div className="field has-addons has-addons-centered">
                  <div className="control">
                    <DatePicker className='input' dateFormat={this.state.dateFormat} onChange={date => this.setDate(date)} selected={this.state.startDate} />
                  </div>
                  <p className="control">
                    <span className="button is-static">
                      to
                    </span>
                  </p>
                  <div className="control">
                    <DatePicker className='input' dateFormat={this.state.dateFormat} onChange={date => this.setDate(date)} selected={this.state.endDate} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        {
          map(this.props.displayCategories, category => (
            <section className="section" key={category.id}>
              <div className={styles.categoryHeader}>
                <h1 className="title">
                  { category.description }
                </h1>
              </div>
              {
                map(this.props.categoryUsers(category.id), user => (
                  <div className="user" key={user.id}>
                    <div className={styles.userHeader}>
                      <h2 className="subtitle is-4">
                        { user.name }
                      </h2>
                    </div>
                    <UserTaskTable tasks={this.userTasks(user.id)} background={category.hex_color} />
                  </div>
                ))
              }
            </section>
          ))
        }
      </div>
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(WeeklyOverviewRoute)
