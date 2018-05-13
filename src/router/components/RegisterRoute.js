import React, { Component } from 'react'
import { connect } from 'react-redux'
import classNames from 'classnames'
import { Link, withRouter } from 'react-router-dom'
import swal from 'sweetalert2'
import { forEach } from 'lodash'

import styles from './styles/RegisterRoute.scss'
import logo from '@/assets/static/logo.svg'

import auth from 'Auth'
import { dispatchers } from '@/store/reducers/auth'

const mapDispatchToProps = dispatch => ({
  attemptRegister: userData => dispatchers.dispatchAttemptRegister(dispatch, userData),
})

class RegisterRoute extends Component {
  constructor(props) {
    super(props)

    this.state = {
      name: '',
      email: '',
      password: '',
      loading: false,
      errors: {}
    }
  }

  submitRegistration(e) {
    e.preventDefault()

    this.setState({
      errors: {},
      loading: true
    })
    const data = {
      name: this.state.name,
      email: this.state.email,
      password: this.state.password
    }
    return this.props.attemptRegister(data).then(() => {
      this.setState({
        loading: false,
        password: ''
      })

      if (auth.isLoggedIn()) {
        this.props.history.replace('/')
      } else {
        swal({
          'title': 'Registration Failed',
          'text': 'Your registration failed. Are you sure your email address and password are correct?',
          'type': 'error'
        })
      }
    }, err => {
      this.setState({
        loading: false,
        password: ''
      })

      if (err.response.status === 422) {
        let validationErrors = err.response.data
        forEach(validationErrors, (value, key) => {
          validationErrors[key] = value.join('<br />')
        })
        this.setState({
          errors: validationErrors
        })
      } else {
        swal({
          'title': 'Registration Failed',
          'text': 'An unkown error occurred while registering your account. Please try again.',
          'type': 'error'
        })
      }
    })
  }

  render () {
    return (
      <div className={styles.loginComponent}>
        <div className={`${styles.designBackground} brand-header`}>
          <div dangerouslySetInnerHTML={{ __html: logo }} className={styles.logo} />
        </div>
        <div className={styles.greyBackground}>

        </div>
        <div className={classNames(styles.loginContainer, styles.flexCenter)}>
          <p className="is-primary has-bold-text title is-4 has-text-centered">
            Register
          </p>
          <form onSubmit={e => this.submitRegistration(e)}>
            <div className="field">
              <label htmlFor="name" className="label">Name</label>
              <p className="control">
                <input type="text" id="name" className={classNames('input', { 'is-danger': this.state.errors.name })} value={this.state.name} onChange={e => this.setState({ name: e.target.value })} required />
              </p>
              {
                this.state.errors.name ?
                (
                  <p className="help is-danger">
                    { this.state.errors.name }
                  </p>
                ) : ''
              }
            </div>
            <div className="field">
              <label htmlFor="email" className="label">Email Address</label>
              <p className="control">
                <input type="email" id="email" className={classNames('input', { 'is-danger': this.state.errors.email })} value={this.state.email} onChange={e => this.setState({ email: e.target.value })} required />
              </p>
              {
                this.state.errors.email ?
                (
                  <p className="help is-danger">
                    { this.state.errors.email }
                  </p>
                ) : ''
              }
            </div>
            <div className="field">
              <label htmlFor="password" className="label">
                Password
              </label>
              <p className="control">
                  <input type="password" className={classNames('input', { 'is-danger': this.state.errors.password })} id="password" value={this.state.password} onChange={e => this.setState({ password: e.target.value })} required />
              </p>
              {
                this.state.errors.password ?
                (
                  <p className="help is-danger">
                    { this.state.errors.password }
                  </p>
                ) : ''
              }
            </div>
            <button type="submit" className={classNames('button', 'is-primary', 'is-pulled-right', { 'is-loading': this.state.loading })}>
              Sign Up
            </button>
          </form>
          <br />
          <p className="has-text-centered">
            <Link to='/login'>
              Already have an account? Login.
            </Link>
          </p>
        </div>
      </div>
    )
  }
}

export default connect(null, mapDispatchToProps)(withRouter(RegisterRoute))
