import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { connect } from 'react-redux'
import moment from 'moment'
import toastr from 'toastr'
import EventBus from 'eventing-bus'
import { map } from 'lodash'
import makeCancelable from 'makecancelable'

import { displayCategoriesSelector } from '@/store/selectors/categories'
import { dispatchGetAllCategories } from '@/store/modules/categories'
import { dispatchGetAllUsers } from '@/store/modules/users'
import { dispatchGetAllClients } from '@/store/modules/clients'
import { dispatchGetAllNotes } from '@/store/modules/notes'
import { dispatchGetTasksBetweenDates } from '@/store/modules/tasks'

import styles from './styles/HomeRoute.scss'
import logo from '@/assets/static/logo.svg'

import Tabs from '@/components/Tabs'
import Tab from '@/components/Tab'
import DateRangeSelector from '@/components/DateRangeSelector'
import CategoryTabPanel from '@/components/CategoryTabPanel'

const mapStateToProps = state => ({
  displayCategories: displayCategoriesSelector(state),
})

const mapDispatchToProps = dispatch => ({
  getAllCategories: () => dispatchGetAllCategories(dispatch),
  getAllUsers: () => dispatchGetAllUsers(dispatch),
  getAllClients: () => dispatchGetAllClients(dispatch),
  getAllNotes: () => dispatchGetAllNotes(dispatch),
  getTasksBetweenDates: dateRange => dispatchGetTasksBetweenDates(dispatch, dateRange),
})

class HomeRoute extends Component {
  constructor(props) {
    super(props)

    this.state = {
      dateFormat: 'YYYY-MM-DD',
      startDate: moment().day(1),
      endDate: moment().day(5),
    }
  }

  componentDidMount() {
    this.props.getAllCategories()
    this.props.getAllUsers()
    this.props.getAllClients()
    this.props.getAllNotes()
    this.fetchTasksWithDates()
  }

  fetchTasksWithDates = () => {
    this.setState({
      loading: true
    })
    this.cancelFetchTasks = makeCancelable(
      this.props.getTasksBetweenDates({
        start: this.state.startDate.format('YYYY-MM-DD'),
        end: this.state.endDate.format('YYYY-MM-DD')
      }),
      tasks => {
        this.setState({
          loading: false
        })
        EventBus.publish('finished-loading-tasks')
      },
      () => {
        toastr.error(`There was an error fetching tasks`, 'Error')
      }
    )
  }

  componentWillUnmount() {
    if (this.cancelFetchTasks) {
      this.cancelFetchTasks()
    }
  }

  categorySafeName = catName => catName.toLowerCase().replace(' ', '_')

  setDates = dates => {
    this.setState({
      loading: true,
      startDate: dates.start,
      endDate: dates.end
    }, () => {
      this.fetchTasksWithDates()
    })
  }

  render() {
    return (
      <div className="waterfall-home">
        <section className="hero is-primary is-bold">
          <div className="hero-head">
            <header className="navbar">
              <div className="container">
                <div className="navbar-start">
                  <Link to='/overview' className='navbar-item'>
                    Weekly Overview
                  </Link>
                </div>
                <div className="navbar-end">
                  <Link to='/admin' className='navbar-item'>
                    Admin
                  </Link>
                  <Link to='/logout' className='navbar-item'>
                    Logout
                  </Link>
                </div>
              </div>
            </header>
          </div>
          <div className="hero-body">
            <div className="container">
              <div dangerouslySetInnerHTML={{ __html: logo }} className='logo' />
            </div>
          </div>
          <div className="hero-foot">
            <div className="container">
              <DateRangeSelector
                className={styles.dateInputs}
                dateFormat={this.state.dateFormat}
                startDate={this.state.startDate}
                endDate={this.state.endDate}
                onChange={dates => this.setDates(dates)}
              />
            </div>
          </div>
        </section>
        <Tabs>
          {
            map(this.props.displayCategories, category => {
              return (
                <Tab key={category.id} name={category.description}>
                  <CategoryTabPanel key={category.id} category={category} id={this.categorySafeName(category.description)} />
                </Tab>
              )
            })
          }
        </Tabs>
      </div>
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(HomeRoute)
