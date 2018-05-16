import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
import swal from 'sweetalert2'

import { userSelector } from '@/store/selectors/users'
import { dispatchDeleteClient } from '@/store/reducers/clients'

import styles from './styles/AdminClient.scss'

const mapStateToProps = state => ({
  getUser: userId => userSelector(userId)(state),
})

const mapDispatchToProps = dispatch => ({
  deleteClient: clientId => dispatchDeleteClient(dispatch, clientId)
})

class AdminClient extends Component {
  confirmDelete() {
    return swal({
      title: 'Delete Client',
      html: `Are you sure you want to <strong>permanently delete this client and all its tasks</strong>?`,
      type: 'error',
      showCancelButton: true
    }).then(() => {
      this.props.deleteClient(this.props.client.id)
    }, swal.noop)
  }

  render() {
    const editLink = `/admin/clients/${this.props.client.id}/edit`

    return (
      <tr className={styles.AdminClient}>
        <td>
          { this.props.client.name }
        </td>
        <td>
          { this.props.getUser(this.props.client.account_manager_id).name }
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

export default connect(mapStateToProps, mapDispatchToProps)(AdminClient)
