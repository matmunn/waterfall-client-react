import React, { Component } from 'react'
import { map } from 'lodash'
import { connect } from 'react-redux'

import { categoriesSelector } from '@/store/selectors/categories'
import { dispatchGetAllCategories } from '@/store/modules/categories'

import AdminCategory from '@/components/AdminCategory'

import styles from '../styles/CategoryListRoute.scss'

const mapStateToProps = state => ({
  categories: categoriesSelector(state)
})

const mapDispatchToProps = dispatch => ({
  getAllCategories: () => dispatchGetAllCategories(dispatch)
})

class CategoryListRoute extends Component {
  componentDidMount() {
    this.props.getAllCategories()
  }

  render() {
    return (
      <div>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>
                Category Description
              </th>
              <th colSpan="2">
                Hex Color
              </th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {
              map(this.props.categories, category => (
                <AdminCategory category={category} key={category.id} />
              ))
            }
          </tbody>
        </table>
      </div>
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(CategoryListRoute)
