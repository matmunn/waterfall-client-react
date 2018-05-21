import React, { Component } from 'react'
import { connect } from 'react-redux'
import classNames from 'classnames'
import { Link } from 'react-router-dom'
import moment from 'moment'
import swal from 'sweetalert2'

import { userSelector } from '@/store/selectors/users'
import { clientSelector } from '@/store/selectors/clients'
import { dispatchDeleteTask } from '@/store/modules/tasks'

import styles from './styles/AdminTask.scss'

const mapStateToProps = state => ({
  getUser: userId => userSelector(userId)(state),
  getClient: clientId => clientSelector(clientId)(state),
})

const mapDispatchToProps = dispatch => ({
  deleteTask: taskId => dispatchDeleteTask(dispatch, taskId)
})

class AdminTask extends Component {
  formattedTime(time) {
    return moment(time).format('YYYY-MM-DD HH:00')
  }

  confirmDelete = e => {
    return swal({
      title: `Delete Task`,
      html: `Are you sure you want to <strong>permanently delete this task</strong>?`,
      type: 'error',
      showCancelButton: true
    }).then(() => {
      this.props.deleteTask(this.props.task.id)
    }, swal.noop)
  }

  render() {
    const completedClass = this.props.task.completed ? 'fa-check' : 'fa-times'
    const editLink = `/admin/tasks/${this.props.task.id}/edit`

    return (
      <tr className={styles.AdminTask}>
        <td>
          { this.props.getUser(this.props.task.user_id).name }
        </td>
        <td>
          { this.props.getClient(this.task.client_id).name }
        </td>
        <td>
          { this.props.task.description }
        </td>
        <td>
          { this.formattedTime(this.props.task.start_date) }
        </td>
        <td>
          { this.formattedTime(this.props.task.end_date) }
        </td>
        <td className="centered">
          { this.props.task.blocks.length }
        </td>
        <td className="centered">
          <i className={classNames('fa', completedClass)}/>
        </td>
        <td>
          <Link to={editLink}>
            <i class="fa fa-edit" />
          </Link>
          <a onClick={e => this.confirmDelete(e)} >
            <i className="fa fa-trash-o" />
          </a>
        </td>
      </tr>
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(AdminTask)
