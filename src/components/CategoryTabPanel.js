import React, { Component } from 'react'
import { connect } from 'react-redux'
import { map } from 'lodash'
import moment from 'moment'

import { categoryUsersSelector } from '@/store/selectors/users'
import { userTasksSelector } from '@/store/selectors/tasks'

import UserTaskTable from './UserTaskTable'
import Tabs from './Tabs'
import Tab from './Tab'

import styles from './styles/CategoryTabPanel.scss'

const mapStateToProps = state => ({
  categoryUsers: categoryId => categoryUsersSelector(categoryId)(state),
  userTasks: (userId, startDate, endDate) => userTasksSelector(userId, startDate, endDate)(state)
})

class CategoryTabPanel extends Component {
  constructor(props) {
    super(props)

    this.state = {
      activeTab: 0,
      startDate: moment().day(1),
      endDate: moment().day(5)
    }
  }

  render() {
    const users = this.props.categoryUsers(this.props.category.id)

    if (!users.length) {
      return (
        <div className={styles.noTasks}>
          <h3>
            This category doesn't have any users.
          </h3>
        </div>
      )
    }

    return (
      <div>
        <div>
          <Tabs>
            {
              map(users, user => {
                const userTasks = this.props.userTasks(
                  user.id,
                  this.state.startDate.format('YYYY-MM-DD'),
                  this.state.endDate.format('YYYY-MM-DD')
                )

                return (
                  <Tab key={user.id} name={user.name}>
                    <UserTaskTable
                      key={user.id}
                      tasks={userTasks}
                      background={this.props.category.hex_color}
                      // startDate={this.state.startDate}
                    />
                  </Tab>
                )
              })
            }
          </Tabs>
        </div>
      </div>
    )
  }
}

export default connect(mapStateToProps)(CategoryTabPanel)
