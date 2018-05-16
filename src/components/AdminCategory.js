import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
import swal from 'sweetalert2'

import { dispatchDeleteCategory } from '@/store/reducers/categories'

import styles from './styles/AdminCategory.scss'

const mapDispatchToProps = dispatch => ({
  deleteCategory: categoryId => dispatchDeleteCategory(dispatch, categoryId)
})

class AdminCategory extends Component {
  confirmDelete = e => {
    e.preventDefault()

    return swal({
      title: 'Delete Category',
      html: `Are you sure you want to <strong>permanently delete this category, its users and its tasks</strong>?`,
      type: 'error',
      showCancelButton: true
    }).then(() => {
      this.props.deleteCategory(this.props.category.id)
    }, swal.noop)
  }

  render() {
    const editLink = `/admin/categories/${this.props.category.id}/edit`
    const fillSample = `background-color: #${this.props.category.hex_color}`

    return (
      <tr className={styles.AdminCategory}>
        <td>
          { this.props.category.description }
        </td>
        <td>
          { this.props.category.hex_color }
        </td>
        <td>
          <div className={styles.sample} style={fillSample} />
        </td>
        <td>
          <Link to={editLink}>
            <i className="fa fa-edit"></i>
          </Link>
          <a onClick={e => this.confirmDelete(e)} >
            <i className="fa fa-trash-o"></i>
          </a>
        </td>
      </tr>
    )
  }
}

export default connect(null, mapDispatchToProps)(AdminCategory)
