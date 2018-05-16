import React, { Component } from 'react'
import { toastr } from 'Helpers'

class CategoryForm extends Component {
  constructor(props) {
    super(props)

    this.state = {
      description: '',
      color: 'FF0000',
      visible: true,
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

    let action = this.addCategory
    if (this.editing) {
      categoryData.id = this.category
      action = this.editCategory
    }

    return action(categoryData).then(() => {
      this.loading = false

      this.$router.push('/admin/categories')
    }, () => {
      this.loading = false

      helpers.toastr.error(`An error occurred while processing your request`, 'Error')
    })
  }

  render() {
    return (
      <form onSubmit={e => this.saveCategory(e)}>
        <div class="field">
          <label class="label" for="name">Category Name</label>
          <input id="name" type="text" v-model="description" class="input" required>
        </div>
        <div class="field">
          <label class="label" for="color">Hex Color</label>
          <input id="color" type="text" v-model="color" class="input" required>
        </div>
        <div class="field">
          <p class="control">
            <label class="checkbox">
              <input type="checkbox" v-model='visible'>
              &nbsp;Display in category list?
            </label>
          </p>
        </div>
        <div class="field">
          <button type="submit" class="button is-primary is-pulled-right" : class="{'is-loading': loading }">
            Save Category
          </button>
        </div>
      </form>
    )
  }
}

export default CategoryForm
