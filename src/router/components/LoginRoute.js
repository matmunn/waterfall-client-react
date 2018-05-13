import React, { Component } from 'react'
import { Link, Redirect } from 'react-router-dom'
import classNames from 'classnames'
import makeCancelable from 'makecancelable'

import styles from './styles/LoginRoute.scss'
import logo from '@/assets/static/logo.svg'

import auth from 'Auth'
import { forEach } from 'lodash'
import swal from 'sweetalert2'

class LoginRoute extends Component {
  constructor(props) {
    super(props)

    this.state = {
      email: '',
      password: '',
      loading: false,
      errors: {}
    }
  }

  submitLogin (e) {
    e.preventDefault()

    this.setState({
      loading: true,
      errors: {}
    })
    this.cancelLoginAttempt = makeCancelable(
      auth.attemptLogin(this.state.email, this.state.password),
      () => {
        this.setState({
          loading: false,
          password: ''
        })

        if (!auth.isLoggedIn()) {
          swal({
            'title': 'Login Failed',
            'text': 'Your login failed. Are you sure your email address and password are correct?',
            'type': 'error'
          })
        }
      },
      err => {
        this.setState({
          loading: false,
          password: ''
        })

        if (err.response && err.response.status === 422) {
          let validationErrors = err.response.data
          forEach(validationErrors, (value, key) => {
            validationErrors[key] = value.join('<br />')
          })
          this.setState({
            errors: validationErrors
          })
        } else {
          swal({
            'title': 'Login Failed',
            'text': 'An unkown error occurred while logging in. Please try again.',
            'type': 'error'
          })
        }
      }
    )
  }

  componentWillUnmount() {
    if (this.cancelLoginAttempt) {
      this.cancelLoginAttempt()
    }
  }

  render() {
    if (auth.isLoggedIn()) {
      return (
        <Redirect to='/' />
      )
    }

    return (
      <div className={styles.loginComponent}>
        <div className={`${styles.designBackground} brand-header`}>
          <div dangerouslySetInnerHTML={{ __html: logo }} className={styles.logo} />
        </div>
        <div className={styles.greyBackground}>

        </div>
        <div className={`${styles.loginContainer} ${styles.flexCenter}`}>
          <p className="is-primary has-bold-text title is-4 has-text-centered">
            Login
          </p>
          <form onSubmit={e => this.submitLogin(e)}>
            <div className="field">
              <label htmlFor="email" className="label">
                Email Address
              </label>
              <p className="control">
                <input type="email" id="email" className={classNames('input', { 'is-danger': this.state.errors.email })} onChange={e => this.setState({ email: e.target.value })} required />
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
                <input type="password" className={classNames('input', { "is-danger": this.state.errors.password })} id="password" onChange={e => this.setState({ password: e.target.value })} required />
              </p>
              {
                this.state.errors.password ?
                (
                  <p className="help is-danger">
                    {this.state.errors.password}
                  </p>
                ) : ''
              }
            </div>
            <button type="submit" className={classNames('button', 'is-primary', 'is-pulled-right', { 'is-loading': this.state.loading })}>
              Log In
            </button>
          </form>
          <br />
          <p className="has-text-centered">
            <Link to="/register">
              Don't have an account? Register now.
            </Link>
          </p>
        </div>
      </div>
    )
  }
}

export default LoginRoute
