import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { connect } from 'react-redux'
import swal from 'sweetalert2'

import { categorySelector } from '@/store/selectors/categories'
import { dispatchDeleteUser } from '@/store/modules/users'

import styles from './styles/AdminUser.scss'

const mapStateToProps = state => ({
  getCategory: categoryId => categorySelector(categoryId)(state)
})

const mapDispatchToProps = dispatch => ({
  deleteUser: userId => dispatchDeleteUser(dispatch, userId)
})

class AdminUser extends Component {
  confirmDelete = e => {
    e.preventDefault()

    return swal({
      title: 'Delete User',
      html: 'Are you sure you want to <strong>permanently delete this user and all its tasks</strong>?',
      type: 'error',
      showCancelButton: true
    }).then(() => {
      this.props.deleteUser(this.props.user.id)
    }, swal.noop)
  }

  render() {
    const editLink = `/admin/users/${this.props.user.id}/edit`

    return (
      <tr className={styles.AdminUser}>
        <td>
          { this.props.user.name }
        </td>
        <td>
          { this.props.user.email }
        </td>
        <td>
          { this.props.getCategory(this.props.user.category_id).description }
        </td>
        <td>
          <Link to={editLink}>
            <i className="fa fa-edit" />
          </Link>
          <a onClick={e => this.confirmDelete(e)}>
            <i className="fa fa-trash-o" />
          </a>
        </td>
      </tr>
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(AdminUser)
