import React, { Component } from 'react'
import { connect } from 'react-redux'
import { map } from 'lodash'

import AdminUser from '@/components/AdminUser'

import { usersSelector } from '@/store/selectors/users'
import { dispatchGetAllCategories } from '@/store/modules/categories'
import { dispatchGetAllUsers } from '@/store/modules/users'

import styles from '../styles/UserListRoute.scss'

const mapStateToProps = state => ({
  users: usersSelector(state)
})

const mapDispatchToProps = dispatch => ({
  getAllCategories: () => dispatchGetAllCategories(dispatch),
  getAllUsers: () => dispatchGetAllUsers(dispatch),
})

class UserListRoute extends Component {
  componentDidMount() {
    this.props.getAllCategories()
    this.props.getAllUsers()
  }

  render() {
    return (
      <div className={styles.UserListRoute}>
        <table>
          <thead>
            <tr>
              <th>
                Name
              </th>
              <th>
                Email Address
              </th>
              <th>
                Category
              </th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {
              map(this.props.users, user => (
                <AdminUser user={user} key={user.id} />
              ))
            }
          </tbody>
        </table>
      </div>
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(UserListRoute)
