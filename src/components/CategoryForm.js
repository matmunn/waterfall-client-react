import React, { Component } from 'react'
import { connect } from 'react-redux'
import { toastr } from 'Helpers'
import classNames from 'classnames'
import makeCancelable from 'makecancelable'
import { withRouter } from 'react-router-dom'

import { dispatchAddCategory, dispatchEditCategory } from '@/store/modules/categories'
import { categorySelector } from '@/store/selectors/categories'

const mapStateToProps = state => ({
  getCategory: categoryId => categorySelector(categoryId)(state)
})

const mapDispatchToProps = dispatch => ({
  addCategory: data => dispatchAddCategory(dispatch, data),
  editCategory: data => dispatchEditCategory(dispatch, data),
})

class CategoryForm extends Component {
  constructor(props) {
    super(props)

    const { editing } = this.props

    const editingCategory = editing ? props.getCategory(props.category) : {}

    this.state = {
      editingCategory,
      description: editing ? editingCategory.description : '',
      color: editing ? editingCategory.hex_color: 'FF0000',
      visible: editing ? editingCategory.display_in_list : true,
      loading: false
    }
  }

  saveCategory = e => {
    e.preventDefault()

    this.setState({
      loading: true
    })

    const categoryData = {
      description: this.state.description,
      color: this.state.color,
      visible: this.state.visible
    }

    let action = this.props.addCategory
    if (this.props.editing) {
      categoryData.id = this.props.category
      action = this.props.editCategory
    }

    this.cancelSaveCategory = makeCancelable(
      action(categoryData),
      () => {
        this.setState({ loading: false })

        this.props.history.push('/admin/categories')
      },
      () => {
        this.setState({ loading: false })

        toastr.error(`An error occurred while processing your request`, 'Error')
      }
    )
  }

  componentWillUnmount() {
    if (this.cancelSaveCategory) {
      this.cancelSaveCategory()
    }
  }

  render() {
    return (
      <form onSubmit={e => this.saveCategory(e)}>
        <div className="field">
          <label className="label" htmlFor="name">Category Name</label>
          <input id="name" type="text" value={this.state.description} onChange={e => this.setState({ description: e.target.value })} className="input" required />
        </div>
        <div className="field">
          <label className="label" htmlFor="color">Hex Color</label>
          <input id="color" type="text" value={this.state.color} onChange={e => this.setState({ color: e.target.value })} className="input" required />
        </div>
        <div className="field">
          <p className="control">
            <label className="checkbox">
              <input type="checkbox" checked={this.state.visible} onChange={() => this.setState({ visible: !this.state.visible })} />
              &nbsp;Display in category list?
            </label>
          </p>
        </div>
        <div className="field">
          <button type="submit" className={classNames('button', 'is-primary', 'is-pulled-right', { 'is-loading': this.state.loading })}>
            Save Category
          </button>
        </div>
      </form>
    )
  }
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(CategoryForm))
