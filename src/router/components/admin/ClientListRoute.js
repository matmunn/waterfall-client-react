import React, { Component } from 'react'
import { map } from 'lodash'
import { connect } from 'react-redux'

import AdminClient from '@/components/AdminClient'

import { dispatchGetAllClients } from '@/store/modules/clients'
import { dispatchGetAllUsers } from '@/store/modules/users'
import { clientsSelector } from '@/store/selectors/clients'

import styles from '../styles/ClientListRoute.scss'

const mapStateToProps = state => ({
  clients: clientsSelector(state),
})

const mapDispatchToProps = dispatch => ({
  getAllClients: () => dispatchGetAllClients(dispatch),
  getAllUsers: () => dispatchGetAllUsers(dispatch),
})

class ClientListRoute extends Component {
  componentDidMount() {
    this.props.getAllClients()
    this.props.getAllUsers()
  }

  render() {
    return (
      <div className={styles.ClientListRoute}>
        <table>
          <thead>
          <tr>
            <th>
              Client Name
            </th>
            <th>
              Account Manager
            </th>
            <th></th>
          </tr>
          </thead>
          <tbody>
            {
              map(this.props.clients, client => (
                <AdminClient client={client} key={client.id} />
              ))
            }
          </tbody>
        </table>
      </div>
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(ClientListRoute)
