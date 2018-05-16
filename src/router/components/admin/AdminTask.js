import React, { Component } from 'react'
import { connect } from 'react-redux'
import moment from 'moment'
import classNames from 'classnames'
import swal from 'sweetalert2'

import { userSelector } from '@/store/selectors/users'
import { clientSelector } from '@/store/selectors/clients'

const mapStateToProps = state => ({
  user: userId => userSelector(userId)(state),
  client: clientId => clientSelector(clientId)(state),
})

class AdminTask extends Component {
  formattedTime (time) {
    return moment(time).format('YYYY-MM-DD HH:00')
  }

  confirmDelete = e => {
    e.preventDefault()

    return swal({
      title: `Delete Task`,
      html: `Are you sure you want to <strong>permanently delete this task</strong>?`,
      type: 'error',
      showCancelButton: true
    }).then(() => {
      this.deleteTask(this.task.id)
    }, swal.noop)
  }

  render() {
    return (
      <tr>
        <td>
          { this.props.user(this.props.task.user_id).name }
        </td>
        <td>
          { this.props.client(this.props.task.client_id).name }
        </td>
        <td>
          { this.props.task.description }
        </td>
        <td>
          { this.formattedTime(this.task.start_date) }
        </td>
        <td>
          { this.formattedTime(this.task.end_date) }
        </td>
        <td className="centered">
          { this.props.task.blocks.length }
        </td>
        <td className="centered">
          <i className={classNames('fa', this.props.task.completed ? 'fa-check' : 'fa-times')}></i>
        </td>
        <td>
          <router-link to='editLink'>
            <i className="fa fa-edit"></i>
          </router-link>
          <a href="#" onClick={e => this.confirmDelete(e)} >
            <i className="fa fa-trash-o"></i>
          </a >
        </td>
      </tr>
    )
  }
}

export default connect(mapStateToProps)(AdminTask)
