import React, { Component } from 'react'
import { Link } from 'react-router-dom'

import Auth from 'Auth'
import logo from '@/assets/static/logo.svg'
import { AdminRouter } from '..';

class AdminRoute extends Component {
  render() {
    const userName = Auth.getUser().name

    return (
      <div>
        <section className='hero is-primary is-bold'>
          <div className='hero-head'>
            <header className='navbar'>
              <div className='container'>
                <div className='navbar-start'>
                  <div className='navbar-item'>
                    Welcome back, { userName }
                  </div>
                </div>
                <div className='navbar-end'>
                  <Link to='/' className='navbar-item'>
                    Back to week view
                  </Link>
                  <Link to='/logout' className='navbar-item'>
                    Logout
                  </Link>
                </div>
              </div>
            </header>
          </div>
          <div className='hero-body'>
            <div className='container'>
              <Link to='/admin'>
                <div dangerouslySetInnerHTML={{ __html: logo }} className='logo' />
              </Link>
            </div>
          </div>
        </section>
        <section>
          <div className='columns'>
            <div className='column is-3'>
              <aside className='menu nav-menu'>
                <p className='menu-label'>
                  Tasks
                </p>
                <ul className='menu-list'>
                  <li>
                    <Link to='/admin/tasks'>
                      My Tasks
                    </Link>
                  </li>
                  <li>
                    <Link to='/admin/tasks/mine'>
                      Tasks I've Added
                    </Link>
                  </li>
                  <li>
                    <Link to='/admin/tasks/add'>
                      Add Task
                    </Link>
                  </li>
                </ul>
                <p className='menu-label'>
                  Users
                </p>
                <ul className='menu-list'>
                  <li>
                    <Link to='/admin/users'>
                      Users List
                    </Link>
                  </li>
                  <li>
                    <Link to='/admin/users/add'>
                      Add User
                    </Link>
                  </li>
                </ul>
                <p className='menu-label'>
                  Categories
                </p>
                <ul className='menu-list'>
                  <li>
                    <Link to='/admin/categories'>
                      Categories List
                    </Link>
                  </li>
                  <li>
                    <Link to='/admin/categories/add'>
                      Add Category
                    </Link>
                  </li>
                </ul>
                <p className='menu-label'>
                  Clients
                </p>
                <ul className='menu-list'>
                  <li>
                    <Link to='/admin/clients'>
                      Clients List
                    </Link>
                  </li>
                  <li>
                    <Link to='/admin/clients/add'>
                      Add Client
                    </Link>
                  </li>
                </ul>
              </aside>
            </div>
            <div className='column'>
              <AdminRouter {...this.props} />
            </div>
          </div>
        </section>
      </div>
    )
  }
}

export default AdminRoute
