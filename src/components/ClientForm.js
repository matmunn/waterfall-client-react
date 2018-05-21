import React, { Component } from 'react'
import { map } from 'lodash'
import classNames from 'classnames'
import makeCancelable from 'makecancelable'
import { connect } from 'react-redux'

import { dispatchGetAllUsers } from '@/store/modules/users'
import { dispatchAddClient, dispatchEditClient } from '@/store/modules/clients'
import { clientSelector } from '@/store/selectors/clients'
import { usersSelector } from '@/store/selectors/users'

import { toastr } from 'Helpers'

const mapStateToProps = state => ({
  users: usersSelector(state),
  getClient: clientId => clientSelector(clientId)(state),
})

const mapDispatchToProps = dispatch => ({
  getAllUsers: () => dispatchGetAllUsers(dispatch),
  addClient: data => dispatchAddClient(dispatch, data),
  editClient: data => dispatchEditClient(dispatch, data),
})

class ClientForm extends Component {
  constructor(props) {
    super(props)

    const { editing } = this.props

    const editingClient = editing ? this.props.getClient(this.props.client) : {}

    this.state = {
      clientName: editing ? editingClient.name : '',
      clientAccountManager: editing ? editingClient.account_manager_id : '',
      loading: false,
      editingClient
    }
  }

  saveClient = e => {
    e.preventDefault()

    this.setState({
      loading: true
    })

    const clientData = {
      name: this.state.clientName,
      accountManager: this.state.clientAccountManager
    }

    let action = this.props.addClient
    if (this.props.editing) {
      clientData.id = this.state.editingClient.id
      action = this.props.editClient
    }

    this.cancelSaveClient = makeCancelable(
      action(clientData),
      () => {
        this.setState({ loading: false })

        this.props.history.push('/admin/clients')
      },
      () => {
        this.setState({ loading: false })

        toastr.error(`An error occurred while processing your request`, 'Error')
      }
    )
  }

  componentDidMount() {
    this.props.getAllUsers()
  }

  componentWillUnmount() {
    if (this.cancelSaveClient) {
      this.cancelSaveClient()
    }
  }

  render() {
    return (
      <form onSubmit={e => this.saveClient(e)}>
        <div className="field">
          <label className="label" htmlFor="name">Client Name</label>
          <div className="control">
            <input id="name" type="text" value={this.state.clientName} onChange={e => this.setState({ clientName: e.target.value })} className="input" required />
          </div>
        </div>
        <div className="field">
          <label className="label" htmlFor="account_manager">Account Manager</label>
          <div className="select">
            <select id="account_manager" value={this.state.clientAccountManager} onChange={e => this.setState({ clientAccountManager: e.target.value })} required>
              <option disabled value="">Choose an account manager</option>
              {
                map(this.props.users, u => (
                  <option key={u.id} value={u.id}>{ u.name }</option>
                ))
              }
            </select>
          </div>
        </div>
        <div className="field">
          <button type="submit" className={classNames('button', 'is-primary', 'is-pulled-right', { 'is-loading': this.state.loading })}>
            Save Client
          </button>
        </div>
      </form>
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(ClientForm)
