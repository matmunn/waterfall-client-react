import React, { Component } from 'react'
import { map } from 'lodash'
import classNames from 'classnames'
import makeCancelable from 'makecancelable'
import { connect } from 'react-redux'

import { dispatchGetAllUsers } from '@/store/reducers/users'
import { clientSelector } from '@/store/selectors/clients'
import { usersSelector } from '@/store/selectors/users'

import { toastr } from 'Helpers'

const mapStateToProps = state => ({
  users: () => usersSelector(state),
  getClient: clientId => clientSelector(clientId)(state),
})

const mapDispatchToProps = dispatch => ({
  getAllUsers: () => dispatchGetAllUsers(dispatch),
})

class ClientForm extends Component {
  constructor(props) {
    super(props)

    const editingClient = this.props.getClient(this.props.client.id)

    this.state = {
      clientName: this.props.editing ? editingClient.name : '',
      clientAccountManager : this.props.editing ? editingClient.account_manager_id : '',
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
      name: this.clientName,
      accountManager: this.clientAccountManager
    }

    let action = this.addClient
    if (this.editing) {
      clientData.id = this.editingClient.id
      action = this.editClient
    }

    return action(clientData).then(() => {
      this.loading = false

      this.$router.push('/admin/clients')
    }, () => {
      this.loading = false

      toastr.error(`An error occurred while processing your request`, 'Error')
    })
  }

  componentDidMount() {
    this.props.getAllUsers()
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
          <label className="label" for="account_manager">Account Manager</label>
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
