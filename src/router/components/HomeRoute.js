import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { connect } from 'react-redux'
import DatePicker from 'react-datepicker'
import moment from 'moment'
import toastr from 'toastr'
import EventBus from 'eventing-bus'

import { displayCategoriesSelector } from '@/store/selectors/categories'
import { dispatchGetAllCategories } from '@/store/reducers/categories'

import styles from './styles/HomeRoute.scss'
import logo from '@/assets/static/logo.svg'

import Tabs from '@/components/Tabs'

const mapStateToProps = state => ({
  displayCategories: displayCategoriesSelector(state),
})

const mapDispatchToProps = dispatch => ({
  getAllCategories: () => dispatchGetAllCategories(dispatch),
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
  }

  setDate = date => {
    this.setState({
      startDate: date.clone().day(1),
      endDate: date.clone().day(5),
    })
  }

  fetchTasksWithDates = () => {
    this.setState({
      loading: true
    })
    this.getTasksBetweenDates({ start: this.state.startDate.format('YYYY-MM-DD'), end: this.state.endDate.format('YYYY-MM-DD') }).then(tasks => {
      this.setState({
        loading: false
      })
      EventBus.publish('finished-loading-tasks')
    }, () => {
      toastr.error(`There was an error fetching tasks`, 'Error')
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
        <Tabs>
          {
            this.props.displayCategories.map(category => {
              return (
                <div key={category.id}>
                  { category.description }
                </div>
              )
            })
          }
        {/*  <Tab v-for='category in displayCategories' :key='category.id' :name='category.description'>
            <CategoryTabPanel :key='category.id' :category='category' :id='categorySafeName(category.description)'></CategoryTabPanel>
                </Tab> */}
        </Tabs>
      </div>
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(HomeRoute)
