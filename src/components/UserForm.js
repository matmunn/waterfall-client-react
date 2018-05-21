import React, { Component } from 'react'
import { connect } from 'react-redux'
import classNames from 'classnames'
import { map } from 'lodash'
import { withRouter } from 'react-router-dom'
import makeCancelable from 'makecancelable'

import { toastr } from 'Helpers'

import { categoriesSelector } from '@/store/selectors/categories'
import { userSelector } from '@/store/selectors/users'
import { dispatchGetAllCategories } from '@/store/modules/categories'
import { dispatchEditUser, dispatchAddUser } from '@/store/modules/users'

const mapStateToProps = state => ({
  categories: categoriesSelector(state),
  getUser: userId => userSelector(userId)(state),
})

const mapDispatchToProps = dispatch => ({
  getAllCategories: () => dispatchGetAllCategories(dispatch),
  editUser: userData => dispatchEditUser(dispatch, userData),
  addUser: userData => dispatchAddUser(dispatch, userData),
})

class UserForm extends Component {
  constructor(props) {
    super(props)

    const { editing } = props

    const editingUser = editing ? props.getUser(this.user) : {}

    this.state = {
      editingUser,
      name: editing ? editingUser.name : '',
      email: editing ? editingUser.email : '',
      password: '',
      category: editing ? editingUser.category : '',
      loading: false,
    }
  }

  componentDidMount() {
    this.props.getAllCategories()
  }

  saveUser = e => {
    e.preventDefault()

    this.setState({ loading: true })

    const userData = {
      name: this.state.name,
      email: this.state.email,
      password: this.state.password,
      category: this.state.category
    }

    let action = this.props.addUser
    if (this.props.editing) {
      action = this.props.editUser
      userData.id = this.state.editingUser.id
    }

    this.cancelUpdateUser = makeCancelable(
      action(userData),
      () => {
        this.setState({ loading: false })

        this.props.history.push('/admin/users')
      },
      err => {
        this.setState({ loading: false })
        if (err === 'category-not-found-error') {
          toastr.error(`The selected category was not found`, 'Error')
        } else {
          toastr.error(`An error occurred while processing your request`, 'Error')
        }
      }
    )
  }

  componentWillUnmount() {
    if (this.cancelUpdateUser) {
      this.cancelUpdateUser()
    }
  }

  render() {
    return (
      <form onSubmit={e => this.saveUser(e)}>
        <div className="field">
          <label className="label" htmlFor="name">
            Name
          </label>
          <input id="name" type="text" value={this.state.name} onChange={e => this.setState({ name: e.target.value })} className="input" required />
        </div>
        <div className="field">
          <label className="label" htmlFor="email">
            Email
          </label>
          <input id="email" type="email" value={this.state.email} onChange={e => this.setState({ email: e.target.value })} className="input" required />
        </div>
        <div className="field">
          <label className="label" htmlFor="password">
            Password
          </label>
          <input id="password" type="password" value={this.state.password} onChange={e => this.setState({ password: e.target.value })} className="input" required={!this.props.editing} />
        </div>
        <div className="field">
          <label className="label" htmlFor="category">
            Category
          </label>
          <div className="select">
            <select value={this.state.category} onChange={e => this.setState({ category: e.target.value })} required>
              <option disabled value="">Choose a category</option>
              {
                map(this.props.categories, category => (
                  <option value={category.id} key={category.id}>{ category.description }</option>
                ))
              }
            </select>
          </div>
        </div>
        <div className="field">
          <button type="submit" className={classNames('button', 'is-primary', 'is-pulled-right', { 'is-loading': this.state.loading })}>
            Save User
          </button>
        </div>
      </form>
    )
  }
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(UserForm))
